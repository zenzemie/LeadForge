const BaseRepository = require('./BaseRepository');

class CampaignRepository extends BaseRepository {
  constructor({ prisma }) {
    super({ prisma, modelName: 'campaign' });
  }
}

module.exports = CampaignRepository;
