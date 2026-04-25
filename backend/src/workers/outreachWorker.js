const { Worker } = require('bullmq');
const { redis } = require('../lib/redis');
const { OUTREACH_QUEUE_NAME } = require('../queues/outreachQueue');
const container = require('../config/container');
const rateLimiter = require('../lib/rateLimiter');

const outreachService = container.resolve('outreachService');
const logger = container.resolve('logger');

const CONCURRENCY = parseInt(process.env.QUEUE_CONCURRENCY, 10) || 5;

const outreachWorker = new Worker(
  OUTREACH_QUEUE_NAME,
  async (job) => {
    const { leadId, campaignId } = job.data;

    await rateLimiter.consume(leadId);

    return outreachService.sendOutreach(leadId, campaignId);
  },
  {
    connection: redis,
    concurrency: CONCURRENCY,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
    limiter: {
      max: 100,
      duration: 1000,
    },
    settings: {
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  }
);

outreachWorker.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed for lead ${job.data.leadId}: ${result.status}`);
});

outreachWorker.on('failed', (job, err) => {
  logger.error({ err, jobId: job?.id }, `Job failed: ${err.message}`);
});

outreachWorker.on('error', (err) => {
  logger.error({ err }, 'Outreach worker error');
});

process.on('SIGINT', () => {
  outreachWorker.close().then(() => {
    logger.info('Outreach worker closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  outreachWorker.close().then(() => {
    logger.info('Outreach worker closed');
    process.exit(0);
  });
});

module.exports = outreachWorker;
