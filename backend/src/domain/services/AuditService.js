class AuditService {
  constructor({ prisma, logger }) {
    this.prisma = prisma;
    this.logger = logger;
  }

  /**
   * Log an action for auditing purposes
   * @param {Object} params
   * @param {string} params.action - The action being performed (e.g., 'CAMPAIGN_CREATE')
   * @param {string} [params.userId] - The user performing the action
   * @param {string} [params.entity] - The type of entity being acted upon
   * @param {string} [params.entityId] - The ID of the entity
   * @param {Object} [params.metadata] - Additional context
   */
  async log({ action, userId, entity, entityId, metadata = {} }) {
    this.logger.info({ userId, action, entity, entityId, metadata }, 'Audit Log Entry');
    
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: userId || null,
          action,
          resourceType: entity || null,
          resourceId: entityId || null,
          metadata: metadata || {},
        }
      });
    } catch (err) {
      this.logger.error({ err }, 'Failed to write audit log to database');
    }
  }

  // Backwards compatibility for logAction if needed, but we'll use log()
  async logAction(userId, action, resourceType, resourceId, metadata = {}) {
    return this.log({ userId, action, entity: resourceType, entityId: resourceId, metadata });
  }
}

module.exports = AuditService;
