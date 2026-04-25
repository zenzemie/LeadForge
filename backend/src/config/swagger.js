const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Outreach Backend API',
      version: '1.0.0',
      description: 'Production-hardened Enterprise API for AI-powered sales outreach',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/api/controllers/*.js', './index.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
