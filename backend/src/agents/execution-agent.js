const BaseAgent = require('./base-agent');
const OpenAI = require('openai');

class ExecutionAgent extends BaseAgent {
    constructor(natsClient, logger) {
        super('execution', natsClient, logger);
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async setupSubscriptions() {
        await this.nats.subscribe('nexus.tasks.outreach', async (data, msg) => {
            await this.executeOutreach(data);
            msg.ack();
        }, { durable_name: 'execution_durable' });
    }

    async executeOutreach(task) {
        this.logger.info({ agentId: this.id, leadName: task.lead.name }, `Execution ${this.id} performing outreach`);

        const { strategy, lead } = task;

        try {
            // 1. Generate content using the selected strategy
            const content = await this.generateContent(strategy, lead);

            // 2. Perform actual outreach (mocked)
            this.logger.info({ 
                agentId: this.id, 
                model: strategy.model, 
                template: strategy.template 
            }, `Sending message`);

            // 3. Log success
            await this.logEvent('executed', {
                taskId: task.eventId,
                strategyId: strategy.id,
                status: 'sent',
                channel: 'email'
            });

        } catch (err) {
            this.logger.error({ err, agentId: this.id }, `Execution failed`);
            await this.logEvent('failed', {
                taskId: task.eventId,
                error: err.message
            });
        }
    }

    async generateContent(strategy, lead) {
        const response = await this.openai.chat.completions.create({
            model: strategy.model === 'gpt-4o' ? 'gpt-4o' : 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `You are an AI sales expert using the ${strategy.template} strategy.` },
                { role: 'user', content: `Create a personalized outreach message for ${lead.name} in the ${lead.industry} industry.` }
            ]
        });

        return response.choices[0].message.content;
    }
}

module.exports = ExecutionAgent;
