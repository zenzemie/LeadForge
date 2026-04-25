const Sentry = require('@sentry/node');
const config = require('../../config');

module.exports = (err, req, res, next) => {
  const logger = req.container ? req.container.resolve('logger') : console;
  
  logger.error(err);

  if (config.sentryDsn) {
    Sentry.captureException(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      status,
      stack: config.env === 'development' ? err.stack : undefined,
    },
  });
};
