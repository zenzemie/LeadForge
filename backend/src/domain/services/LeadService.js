class LeadService {
  constructor({ leadRepository, auditService, logger }) {
    this.leadRepository = leadRepository;
    this.auditService = auditService;
    this.logger = logger;
  }

  async forgetLead(email) {
    this.logger.info({ email }, 'GDPR Right to be Forgotten request received');

    const leads = await this.leadRepository.findAll({ where: { email } });
    
    if (leads.length === 0) {
      this.logger.warn({ email }, 'No leads found for forget request');
      return { count: 0 };
    }

    // Delete all leads associated with this email
    for (const lead of leads) {
      await this.leadRepository.delete(lead.id);
    }

    await this.auditService.log({
      action: 'GDPR_FORGET_LEAD',
      entity: 'Lead',
      entityId: email,
      metadata: { email, count: leads.length },
    });

    return { count: leads.length };
  }
}

module.exports = LeadService;
