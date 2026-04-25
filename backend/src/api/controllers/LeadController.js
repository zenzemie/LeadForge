/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management
 */
class LeadController {
  constructor({ campaignService, leadService }) {
    this.campaignService = campaignService;
    this.leadService = leadService;
  }

  /**
   * @swagger
   * /leads/import:
   *   post:
   *     summary: Import leads into a campaign
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [campaignId, leads]
   *             properties:
   *               campaignId:
   *                 type: string
   *               leads:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required: [email]
   *                   properties:
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *                     metadata:
   *                       type: object
   *     responses:
   *       201:
   *         description: Leads imported
   */
  import = async (req, res, next) => {
    try {
      const { campaignId, leads } = req.body;
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

  /**
   * @swagger
   * /leads/forget:
   *   post:
   *     summary: GDPR Right to be Forgotten - Delete lead by email
   *     tags: [Leads]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lead forgotten
   */
  forget = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await this.leadService.forgetLead(email);
      res.json({ message: 'Lead forgotten successfully', count: result.count });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = LeadController;
