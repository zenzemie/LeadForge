const BATCH_SIZE = parseInt(process.env.QUEUE_BATCH_SIZE, 10) || 1000;

class CampaignService {
  constructor({ campaignRepository, leadRepository, outreachQueue, dispatcherQueue, logger, prisma }) {
    this.campaignRepository = campaignRepository;
    this.leadRepository = leadRepository;
    this.outreachQueue = outreachQueue;
    this.dispatcherQueue = dispatcherQueue;
    this.logger = logger;
    this.prisma = prisma;
  }

  async createCampaign(data) {
    return this.campaignRepository.create({
      name: data.name,
      industry: data.industry,
      messageTemplate: data.messageTemplate,
      status: 'DRAFT',
    });
  }

  async getCampaign(id) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: { leads: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
  }

  async listCampaigns(options = {}) {
    const { skip = 0, take = 20, status } = options;
    return this.campaignRepository.findAll({
      skip,
      take,
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async importLeads(campaignId, leads) {
    const leadData = leads.map((lead) => ({
      email: lead.email,
      name: lead.name || null,
      metadata: lead.metadata || null,
      campaignId,
      status: 'PENDING',
    }));

    const result = await this.prisma.lead.createMany({
      data: leadData,
      skipDuplicates: true,
    });

    return result;
  }

  async startCampaign(campaignId) {
    const campaign = await this.campaignRepository.findById(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'DRAFT' && campaign.status !== 'PAUSED') {
      throw new Error('Campaign cannot be started from current status');
    }

    await this.campaignRepository.update(campaignId, { status: 'RUNNING' });

    await this.dispatcherQueue.add(
      'dispatch',
      { campaignId },
      {
        jobId: `dispatch-${campaignId}`,
        removeOnComplete: true,
        removeOnFail: 100,
      }
    );

    return { message: 'Campaign started', campaignId };
  }

  async pauseCampaign(campaignId) {
    await this.campaignRepository.update(campaignId, { status: 'PAUSED' });
    return { message: 'Campaign paused', campaignId };
  }

  async cancelCampaign(campaignId) {
    await this.campaignRepository.update(campaignId, { status: 'CANCELLED' });
    return { message: 'Campaign cancelled', campaignId };
  }

  async dispatchLeadsInBatches(campaignId) {
    let processed = 0;
    let hasMore = true;

    while (hasMore) {
      const campaign = await this.campaignRepository.findById(campaignId);

      if (campaign.status === 'CANCELLED') {
        this.logger.info(`Campaign ${campaignId} cancelled, stopping dispatch`);
        break;
      }

      const leads = await this.leadRepository.findAll({
        where: { campaignId, status: 'PENDING' },
        take: BATCH_SIZE,
        orderBy: { createdAt: 'asc' },
      });

      if (leads.length === 0) {
        hasMore = false;
        break;
      }

      const jobs = leads.map((lead) => ({
        name: `outreach-${lead.id}`,
        data: { leadId: lead.id, campaignId },
        opts: {
          jobId: `outreach-${lead.id}`,
          removeOnComplete: true,
          removeOnFail: 50,
        },
      }));

      await this.outreachQueue.addBulk(jobs);
      processed += leads.length;

      this.logger.info(`Dispatched batch of ${leads.length} leads for campaign ${campaignId}`);

      if (leads.length < BATCH_SIZE) {
        hasMore = false;
      }
    }

    await this.campaignRepository.update(campaignId, { status: 'COMPLETED' });

    return { message: 'Dispatch completed', processed };
  }
}

module.exports = CampaignService;
