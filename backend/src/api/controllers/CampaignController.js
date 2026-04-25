/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management
 */
class CampaignController {
  constructor({ campaignService, outreachService }) {
    this.campaignService = campaignService;
    this.outreachService = outreachService;
  }

  /**
   * @swagger
   * /campaigns:
   *   post:
   *     summary: Create a new campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, industry]
   *             properties:
   *               name:
   *                 type: string
   *               industry:
   *                 type: string
   *               messageTemplate:
   *                 type: string
   *     responses:
   *       201:
   *         description: Campaign created
   */
  create = async (req, res, next) => {
    try {
      const { name, industry, messageTemplate } = req.body;
      const campaign = await this.campaignService.createCampaign({ name, industry, messageTemplate });
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /campaigns:
   *   get:
   *     summary: List campaigns
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: skip
   *         schema:
   *           type: integer
   *       - in: query
   *         name: take
   *         schema:
   *           type: integer
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of campaigns
   */
  list = async (req, res, next) => {
    try {
      const { skip = 0, take = 20, status } = req.query;
      const campaigns = await this.campaignService.listCampaigns({
        skip: parseInt(skip, 10),
        take: parseInt(take, 10),
        status,
      });
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /campaigns/{id}:
   *   get:
   *     summary: Get campaign details
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Campaign details
   */
  get = async (req, res, next) => {
    try {
      const campaign = await this.campaignService.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /campaigns/{id}/start:
   *   post:
   *     summary: Start a campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Campaign started
   */
  start = async (req, res, next) => {
    try {
      const result = await this.campaignService.startCampaign(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /campaigns/{id}/pause:
   *   post:
   *     summary: Pause a campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Campaign paused
   */
  pause = async (req, res, next) => {
    try {
      const result = await this.campaignService.pauseCampaign(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /campaigns/{id}/cancel:
   *   post:
   *     summary: Cancel a campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Campaign cancelled
   */
  cancel = async (req, res, next) => {
    try {
      const result = await this.campaignService.cancelCampaign(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /campaigns/{id}/stats:
   *   get:
   *     summary: Get campaign statistics
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Campaign statistics
   */
  stats = async (req, res, next) => {
    try {
      const stats = await this.outreachService.getCampaignStats(req.params.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CampaignController;
