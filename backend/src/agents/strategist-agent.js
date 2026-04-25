const BaseAgent = require('./base-agent');

class StrategistAgent extends BaseAgent {
    constructor(natsClient, polygonalRouter, pinotClient) {
        super('strategist', natsClient);
        this.polygonalRouter = polygonalRouter;
        this.pinotClient = pinotClient;
    }

    async setupSubscriptions() {
        // Listen for new raw events
        await this.nats.subscribe('nexus.events.ingested', async (data, msg) => {
            await this.planStrategy(data);
            msg.ack();
        }, { durable_name: 'strategist_durable' });
    }

    async planStrategy(eventData) {
        console.log(`Strategist ${this.id} planning for event: ${eventData.id || 'unknown'}`);

        // 1. Query Pinot for similar past events
        const similarEvents = await this.pinotClient.findSimilar(eventData.context_vector);
        
        // 2. Consult Polygonal Router for optimal model/strategy
        const strategy = await this.polygonalRouter.selectStrategy(eventData.context_vector);

        // 3. Create execution task
        const task = {
            eventId: eventData.id,
            lead: {
                name: eventData.name,
                industry: eventData.industry
            },
            strategy: strategy,
            context: {
                similarPerformance: similarEvents.length > 0 ? 'high' : 'unknown'
            }
        };

        await this.nats.publish('nexus.tasks.outreach', task);
        console.log(`Strategist ${this.id} published task with strategy ${strategy.id}`);
    }
}

module.exports = StrategistAgent;
