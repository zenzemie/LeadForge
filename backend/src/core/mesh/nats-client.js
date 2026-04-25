const { connect, JSONCodec } = require('nats');

class NatsClient {
    constructor({ logger, config }) {
        this.nc = null;
        this.js = null;
        this.jc = JSONCodec();
        this.logger = logger || console;
        this.natsUrl = config?.natsUrl || process.env.NATS_URL || 'nats://localhost:4222';
    }

    async init() {
        try {
            this.nc = await connect({ servers: this.natsUrl });
            this.js = this.nc.jetstream();
            this.logger.info(`Connected to NATS at ${this.natsUrl}`);
            await this.setupStreams();
        } catch (err) {
            this.logger.error(`Error connecting to NATS: ${err.message}`);
            throw err;
        }
    }

    async setupStreams() {
        const jsm = await this.nc.jetstreamManager();
        const streams = [
            { name: 'NEXUS_RAW_EVENTS', subjects: ['nexus.events.*'] },
            { name: 'NEXUS_TASKS', subjects: ['nexus.tasks.*'] },
            { name: 'NEXUS_ROI', subjects: ['nexus.roi.*'] },
            { name: 'NEXUS_SYSTEM', subjects: ['nexus.system.*'] }
        ];

        for (const stream of streams) {
            try {
                await jsm.streams.add({ name: stream.name, subjects: stream.subjects });
                this.logger.info(`Stream ${stream.name} created/verified`);
            } catch (err) {
                if (!err.message.includes('stream name already in use')) {
                    this.logger.error(`Error creating stream ${stream.name}: ${err.message}`);
                }
            }
        }
    }

    async publish(subject, data) {
        if (!this.js) throw new Error('NATS JetStream not initialized');
        return await this.js.publish(subject, this.jc.encode(data));
    }

    async subscribe(subject, callback, options = {}) {
        if (!this.js) throw new Error('NATS JetStream not initialized');
        const sub = await this.js.subscribe(subject, options);
        (async () => {
            for await (const m of sub) {
                try {
                    const data = this.jc.decode(m.data);
                    await callback(data, m);
                } catch (err) {
                    this.logger.error(`Error processing message on ${subject}: ${err.message}`);
                    m.nak();
                }
            }
        })();
        return sub;
    }
}

module.exports = NatsClient;
