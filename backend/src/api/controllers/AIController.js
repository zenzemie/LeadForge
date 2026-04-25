class AIController {
  constructor({ aiService, nexus }) {
    this.aiService = aiService;
    this.nexus = nexus;
  }

  generate = async (req, res, next) => {
    const { name, industry, template } = req.body;

    if (!name && !industry && !template) {
      return res.status(400).json({ error: 'At least one parameter (name, industry, or template) is required' });
    }

    try {
      const message = this.aiService.generateMessage(name, industry, template);
      res.json({ message });
    } catch (error) {
      next(error);
    }
  };

  triggerNexus = async (req, res, next) => {
    try {
      await this.nexus.triggerScout(req.body);
      res.json({ status: 'Accepted', message: 'Nexus swarm has been triggered' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AIController;
