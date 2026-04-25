const { v4: uuidv4 } = require('uuid');

class BaseAgent {
    constructor(type, natsClient, logger) {
        this.id = `${type}-${uuidv4()}`;
        this.type = type;
        this.nats = natsClient;
        this.logger = logger;
    }

    async start() {
        this.logger.info({ agentId: this.id }, `Starting agent: ${this.id}`);
        this.startHeartbeat();
        await this.setupSubscriptions();
    }

    startHeartbeat() {
        setInterval(async () => {
            try {
                await this.nats.publish(`nexus.system.heartbeat.${this.id}`, {
                    id: this.id,
                    type: this.type,
                    timestamp: new Date().toISOString(),
                    status: 'UP'
                });
            } catch (err) {
                this.logger.error({ err, agentId: this.id }, `Heartbeat failed for ${this.id}`);
            }
        }, 5000);
    }

    async setupSubscriptions() {
        // To be implemented by subclasses
    }

    async logEvent(subSubject, data) {
        return await this.nats.publish(`nexus.events.${subSubject}`, {
            ...data,
            agentId: this.id,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = BaseAgent;
