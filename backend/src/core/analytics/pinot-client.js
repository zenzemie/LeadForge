const axios = require('axios');

class PinotClient {
    constructor({ config, logger }) {
        this.controllerUrl = config?.pinotControllerUrl || process.env.PINOT_CONTROLLER_URL || 'http://localhost:9000';
        this.brokerUrl = config?.pinotBrokerUrl || process.env.PINOT_BROKER_URL || 'http://localhost:8099';
        this.logger = logger || console;
    }

    async query(sql) {
        try {
            const response = await axios.post(`${this.brokerUrl}/query/sql`, { sql });
            return response.data;
        } catch (err) {
            this.logger.error(`Pinot query error: ${err.message}`);
            // Mock response for demo/development if real Pinot is not available
            if (process.env.NODE_ENV !== 'production') {
                return { resultTable: { rows: [] } };
            }
            throw err;
        }
    }

    async findSimilar(vector, limit = 5) {
        const vectorStr = `[${vector.join(',')}]`;
        const sql = `SELECT *, cosine_similarity(context_vector, ${vectorStr}) as score FROM nexus_events ORDER BY score DESC LIMIT ${limit}`;
        return this.query(sql);
    }

    async ingestEvent(event) {
        try {
            await axios.post(`${this.controllerUrl}/ingest`, event);
        } catch (err) {
            // Assume stream-based ingestion
        }
    }
}

module.exports = PinotClient;
