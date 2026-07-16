import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Barber Booking API',
      version: '1.0.0',
      description: 'API para sistema de reserva de citas para barberías',
      contact: {
        name: 'Karlo Guiza',
        email: 'support@barberbooking.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.barberbooking.com',
        description: 'Servidor de producción',
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
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            error: {
              type: 'string',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['CLIENT', 'BARBER', 'ADMIN'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            price: {
              type: 'number',
            },
            duration: {
              type: 'integer',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Barber: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            avatar: {
              type: 'string',
            },
            specialty: {
              type: 'string',
            },
            rating: {
              type: 'number',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            clientId: {
              type: 'string',
              format: 'uuid',
            },
            barberId: {
              type: 'string',
              format: 'uuid',
            },
            serviceId: {
              type: 'string',
              format: 'uuid',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
            },
            notes: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            reservationId: {
              type: 'string',
              format: 'uuid',
            },
            amount: {
              type: 'number',
              description: 'Amount in cents (100 = $1.00)',
            },
            currency: {
              type: 'string',
              enum: ['USD', 'EUR', 'GBP', 'CAD', 'MXN'],
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
            },
            provider: {
              type: 'string',
              enum: ['stripe', 'paypal'],
            },
            stripePaymentIntentId: {
              type: 'string',
            },
            paypalOrderId: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.routes.ts'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
