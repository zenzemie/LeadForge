class AIController {
  constructor({ aiService, nexus }) {
    this.aiService = aiService;
    this.nexus = nexus;
  }

  /**
   * @swagger
   * /ai/generate:
   *   post:
   *     summary: Generate an outreach message
   *     tags: [AI]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               industry:
   *                 type: string
   *               template:
   *                 type: string
   *     responses:
   *       200:
   *         description: Generated message
   *       400:
   *         description: Invalid request
   *       401:
   *         description: Unauthorized
   */
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

  /**
   * @swagger
   * /ai/nexus/trigger:
   *   post:
   *     summary: Trigger the Nexus swarm
   *     tags: [AI]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Nexus swarm triggered
   *       401:
   *         description: Unauthorized
   */
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
