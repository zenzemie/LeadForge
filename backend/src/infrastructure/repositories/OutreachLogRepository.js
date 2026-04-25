const BaseRepository = require('./BaseRepository');

class OutreachLogRepository extends BaseRepository {
  constructor({ prisma }) {
    super({ prisma, modelName: 'outreachLog' });
  }
}

module.exports = OutreachLogRepository;
