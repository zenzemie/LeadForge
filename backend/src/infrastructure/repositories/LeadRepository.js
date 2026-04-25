const BaseRepository = require('./BaseRepository');

class LeadRepository extends BaseRepository {
  constructor({ prisma }) {
    super({ prisma, modelName: 'lead' });
  }

  async findWithCampaign(id) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: { campaign: true },
    });
  }

  async updateStatus(id, status) {
    return this.prisma.lead.update({
      where: { id },
      data: { status },
    });
  }
}

module.exports = LeadRepository;
