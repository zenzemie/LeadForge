const { createContainer, asClass, asValue, InjectionMode } = require('awilix');
const prisma = require('../lib/prisma');
const logger = require('../infrastructure/logger');
const config = require('./index');
const { outreachQueue, dispatcherQueue } = require('../queues/outreachQueue');
const NexusSwarm = require('../nexus');
const NatsClient = require('../core/mesh/nats-client');
const PolygonalRouter = require('../core/router/polygonal-router');
const PinotClient = require('../core/analytics/pinot-client');

// Repositories
const LeadRepository = require('../infrastructure/repositories/LeadRepository');
const CampaignRepository = require('../infrastructure/repositories/CampaignRepository');
const OutreachLogRepository = require('../infrastructure/repositories/OutreachLogRepository');

// Services
const AIService = require('../domain/services/AIService');
const OutreachService = require('../domain/services/OutreachService');
const CampaignService = require('../domain/services/CampaignService');
const SecurityService = require('../domain/services/SecurityService');
const MetricsService = require('../infrastructure/monitoring/MetricsService');
const AuditService = require('../domain/services/AuditService');

// Controllers
const AIController = require('../api/controllers/AIController');
const CampaignController = require('../api/controllers/CampaignController');
const LeadController = require('../api/controllers/LeadController');

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  // Infrastructure
  prisma: asValue(prisma),
  logger: asValue(logger),
  config: asValue(config),
  outreachQueue: asValue(outreachQueue),
  dispatcherQueue: asValue(dispatcherQueue),
  nexus: asClass(NexusSwarm).singleton(),
  natsClient: asClass(NatsClient).singleton(),
  polygonalRouter: asClass(PolygonalRouter).singleton(),
  pinotClient: asClass(PinotClient).singleton(),
  
  // Repositories
  leadRepository: asClass(LeadRepository).singleton(),
  campaignRepository: asClass(CampaignRepository).singleton(),
  outreachLogRepository: asClass(OutreachLogRepository).singleton(),

  // Services
  aiService: asClass(AIService).singleton(),
  outreachService: asClass(OutreachService).singleton(),
  campaignService: asClass(CampaignService).singleton(),
  securityService: asClass(SecurityService).singleton(),
  metricsService: asClass(MetricsService).singleton(),
  auditService: asClass(AuditService).singleton(),

  // Controllers
  aiController: asClass(AIController).singleton(),
  campaignController: asClass(CampaignController).singleton(),
  leadController: asClass(LeadController).singleton(),
});

module.exports = container;
