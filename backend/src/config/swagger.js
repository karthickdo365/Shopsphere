const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopSphere API',
      version: '1.0.0',
      description: 'Ecommerce backend API for ShopSphere (Admin + User panels)',
    },
    servers: [{ url: '/api/v1', description: 'API v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // JSDoc comments in route files generate the interactive docs
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
