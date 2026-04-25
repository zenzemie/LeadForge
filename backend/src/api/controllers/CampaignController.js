class CampaignController {
  constructor({ campaignService, outreachService }) {
    this.campaignService = campaignService;
    this.outreachService = outreachService;
  }

  create = async (req, res, next) => {
    try {
      const { name, industry, messageTemplate } = req.body;
      if (!name || !industry) {
        return res.status(400).json({ error: 'name and industry are required' });
      }
      const campaign = await this.campaignService.createCampaign({ name, industry, messageTemplate });
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  };

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

  start = async (req, res, next) => {
    try {
      const result = await this.campaignService.startCampaign(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  pause = async (req, res, next) => {
    try {
      const result = await this.campaignService.pauseCampaign(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req, res, next) => {
    try {
      const result = await this.campaignService.cancelCampaign(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

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
