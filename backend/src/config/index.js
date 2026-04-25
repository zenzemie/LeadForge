require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  natsUrl: process.env.NATS_URL || 'nats://localhost:4222',
  sentryDsn: process.env.SENTRY_DSN,
  logLevel: process.env.LOG_LEVEL || 'info',
};
