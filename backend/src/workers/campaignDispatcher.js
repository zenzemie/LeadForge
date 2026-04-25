const { Worker } = require('bullmq');
const { redis } = require('../lib/redis');
const { DISPATCHER_QUEUE_NAME } = require('../queues/outreachQueue');
const container = require('../config/container');

const campaignService = container.resolve('campaignService');
const logger = container.resolve('logger');

const dispatcherWorker = new Worker(
  DISPATCHER_QUEUE_NAME,
  async (job) => {
    const { campaignId } = job.data;
    logger.info(`Starting dispatch for campaign ${campaignId}`);

    return campaignService.dispatchLeadsInBatches(campaignId);
  },
  {
    connection: redis,
    concurrency: 1,
    removeOnComplete: true,
    removeOnFail: false,
  }
);

dispatcherWorker.on('completed', (job, result) => {
  logger.info(`Dispatcher job ${job.id} completed: ${result.message}`);
});

dispatcherWorker.on('failed', (job, err) => {
  logger.error({ err, jobId: job?.id }, `Dispatcher job failed: ${err.message}`);
});

dispatcherWorker.on('error', (err) => {
  logger.error({ err }, 'Dispatcher worker error');
});

process.on('SIGINT', () => {
  dispatcherWorker.close().then(() => {
    logger.info('Dispatcher worker closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  dispatcherWorker.close().then(() => {
    logger.info('Dispatcher worker closed');
    process.exit(0);
  });
});

module.exports = dispatcherWorker;
