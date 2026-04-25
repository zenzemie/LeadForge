const ScoutAgent = require('./agents/scout-agent');
const StrategistAgent = require('./agents/strategist-agent');
const ExecutionAgent = require('./agents/execution-agent');
const AnalystAgent = require('./agents/analyst-agent');
const GuardianAgent = require('./agents/guardian-agent');

class NexusSwarm {
    constructor({ natsClient, logger, polygonalRouter, pinotClient }) {
        this.natsClient = natsClient;
        this.logger = logger;
        this.polygonalRouter = polygonalRouter;
        this.pinotClient = pinotClient;
        this.scout = new ScoutAgent(this.natsClient);
        this.strategist = new StrategistAgent(this.natsClient, this.polygonalRouter, this.pinotClient);
        this.execution = new ExecutionAgent(this.natsClient);
        this.analyst = new AnalystAgent(this.natsClient, this.polygonalRouter);
        this.guardian = new GuardianAgent(this.natsClient);
    }

    async init() {
        this.logger.info('Initializing Singularity Outreach Nexus Swarm...');
        await this.natsClient.init();
        await this.guardian.start();
        await this.analyst.start();
        await this.execution.start();
        await this.strategist.start();
        await this.scout.start();
        this.logger.info('Nexus Swarm is fully operational.');
    }

    async triggerScout(data) {
        return await this.scout.processIngestedData(data);
    }
}

module.exports = NexusSwarm;
