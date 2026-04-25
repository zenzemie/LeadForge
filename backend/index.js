require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { scopePerRequest } = require('awilix-express');
const Sentry = require('@sentry/node');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const config = require('./src/config');
const container = require('./src/config/container');
const errorMiddleware = require('./src/api/middlewares/errorMiddleware');
const loggingMiddleware = require('./src/api/middlewares/loggingMiddleware');
const rateLimiter = require('./src/api/middlewares/rateLimiter');
const { inject } = require('awilix-express');

if (config.sentryDsn) {
  Sentry.init({ dsn: config.sentryDsn });
}

const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
app.use(express.json({ limit: '50mb' }));

// DI Container
app.use(scopePerRequest(container));

// Logging
app.use(inject(loggingMiddleware));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialize Nexus Swarm
const nexus = container.resolve('nexus');
nexus.init().catch(err => {
  const logger = container.resolve('logger');
  logger.error({ err }, 'Failed to init Nexus');
});

// Health check
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Metrics
app.get('/metrics', async (req, res) => {
  const metricsService = container.resolve('metricsService');
  res.set('Content-Type', metricsService.getContentType());
  res.end(await metricsService.getMetrics());
});

// Routes
const aiRouter = express.Router();
require('./src/api/routes/ai')(aiRouter);
app.use('/ai', aiRouter);

const campaignRouter = express.Router();
require('./src/api/routes/campaigns')(campaignRouter);
app.use('/campaigns', campaignRouter);

const leadRouter = express.Router();
require('./src/api/routes/leads')(leadRouter);
app.use('/leads', leadRouter);

// Error handling
app.use(errorMiddleware);

function startServer() {
  const server = app.listen(config.port, () => {
    const logger = container.resolve('logger');
    logger.info(`Server running on port ${config.port} [${config.env}]`);
  });

  const gracefulShutdown = (signal) => {
    const logger = container.resolve('logger');
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      logger.info('HTTP server closed');
      const prisma = container.resolve('prisma');
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

if (require.main === module) {
  startServer();
}

module.exports = app;
