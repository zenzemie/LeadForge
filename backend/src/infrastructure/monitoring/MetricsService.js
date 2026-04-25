const client = require('prom-client');

class MetricsService {
  constructor() {
    this.register = client.register;
    client.collectDefaultMetrics();

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.outreachSentCounter = new client.Counter({
      name: 'outreach_sent_total',
      help: 'Total number of outreach messages sent',
    });
  }

  getMetrics() {
    return this.register.metrics();
  }

  getContentType() {
    return this.register.contentType;
  }
}

module.exports = MetricsService;
