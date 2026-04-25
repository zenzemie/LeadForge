const BaseAgent = require('./base-agent');

class GuardianAgent extends BaseAgent {
    constructor(natsClient, logger) {
        super('guardian', natsClient, logger);
        this.activeAgents = new Map();
    }

    async setupSubscriptions() {
        // Monitor heartbeats
        await this.nats.subscribe('nexus.system.heartbeat.*', (data, msg) => {
            this.activeAgents.set(data.id, {
                ...data,
                lastSeen: new Date()
            });
        });

        // Periodically check for dead agents
        setInterval(() => this.checkHealth(), 10000);
    }

    checkHealth() {
        const now = new Date();
        for (const [id, info] of this.activeAgents.entries()) {
            if (now - info.lastSeen > 15000) {
                this.logger.error({ agentId: this.id, deadAgentId: id }, `Guardian detected failure in agent`);
                this.handleFailure(id, info);
                this.activeAgents.delete(id);
            }
        }
    }

    handleFailure(id, info) {
        this.logger.info({ agentId: this.id, deadAgentId: id, deadAgentType: info.type }, `Triggering recovery`);
        // In a real environment, this would call Kubernetes API or Docker API to restart containers
        this.nats.publish('nexus.system.recovery', {
            targetAgentId: id,
            targetAgentType: info.type,
            action: 'RESTART_REQUIRED'
        });
    }
}

module.exports = GuardianAgent;
