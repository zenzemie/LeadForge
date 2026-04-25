class BaseRepository {
  constructor({ prisma, modelName }) {
    this.prisma = prisma;
    this.model = prisma[modelName];
  }

  async findAll(params = {}) {
    return this.model.findMany(params);
  }

  async findById(id) {
    return this.model.findUnique({ where: { id } });
  }

  async create(data) {
    return this.model.create({ data });
  }

  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }

  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  async count(where = {}) {
    return this.model.count({ where });
  }
}

module.exports = BaseRepository;
