class LeadController {
  constructor({ campaignService }) {
    this.campaignService = campaignService;
  }

  import = async (req, res, next) => {
    try {
      const { campaignId, leads } = req.body;

      if (!campaignId) {
        return res.status(400).json({ error: 'campaignId is required' });
      }

      if (!Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({ error: 'leads array is required and must not be empty' });
      }

      const invalidLeads = leads.filter((lead) => !lead.email);
      if (invalidLeads.length > 0) {
        return res.status(400).json({
          error: 'All leads must have an email address',
          invalidCount: invalidLeads.length,
        });
      }

      const result = await this.campaignService.importLeads(campaignId, leads);

      res.status(201).json({
        message: 'Leads imported successfully',
        count: result.count,
        skipped: leads.length - result.count,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = LeadController;
