const pino = require('pino');
const config = require('../config');

const logger = pino({
  level: config.logLevel,
  transport: config.env === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  } : undefined,
});

module.exports = logger;
