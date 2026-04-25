class OutreachService {
  constructor({ leadRepository, campaignRepository, outreachLogRepository, aiService, prisma, logger }) {
    this.leadRepository = leadRepository;
    this.campaignRepository = campaignRepository;
    this.outreachLogRepository = outreachLogRepository;
    this.aiService = aiService;
    this.prisma = prisma;
    this.logger = logger;
  }

  async sendOutreach(leadId, campaignId) {
    const lead = await this.leadRepository.findWithCampaign(leadId);

    if (!lead || !lead.campaign) {
      throw new Error('Lead or campaign not found');
    }

    if (lead.status === 'SENT' || lead.status === 'BOUNCED') {
      return { status: lead.status, message: 'Already processed' };
    }

    await this.leadRepository.updateStatus(leadId, 'PROCESSING');

    try {
      const message = this.aiService.generatePersonalizedMessage(lead, lead.campaign);
      
      await this.simulateEmailSend(lead.email, message);

      await this.prisma.$transaction([
        this.prisma.lead.update({
          where: { id: leadId },
          data: { status: 'SENT' },
        }),
        this.prisma.outreachLog.create({
          data: {
            leadId,
            status: 'SENT',
            message,
          },
        }),
      ]);

      return { status: 'SENT', message };
    } catch (error) {
      this.logger.error({ err: error, leadId }, 'Failed to send outreach');
      await this.prisma.$transaction([
        this.prisma.lead.update({
          where: { id: leadId },
          data: { status: 'FAILED' },
        }),
        this.prisma.outreachLog.create({
          data: {
            leadId,
            status: 'FAILED',
            error: error.message,
          },
        }),
      ]);

      throw error;
    }
  }

  async simulateEmailSend(email, message) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { email, message, sentAt: new Date() };
  }

  async getCampaignStats(campaignId) {
    const [total, pending, processing, sent, failed, bounced] = await Promise.all([
      this.leadRepository.count({ campaignId }),
      this.leadRepository.count({ campaignId, status: 'PENDING' }),
      this.leadRepository.count({ campaignId, status: 'PROCESSING' }),
      this.leadRepository.count({ campaignId, status: 'SENT' }),
      this.leadRepository.count({ campaignId, status: 'FAILED' }),
      this.leadRepository.count({ campaignId, status: 'BOUNCED' }),
    ]);

    return {
      total,
      pending,
      processing,
      sent,
      failed,
      bounced,
      completionRate: total > 0 ? ((sent + failed + bounced) / total) * 100 : 0,
    };
  }
}

module.exports = OutreachService;
