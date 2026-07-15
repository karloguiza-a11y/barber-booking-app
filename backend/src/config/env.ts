const requiredEnvs = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing environment variable: ${env}`);
  }
});

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expire: process.env.JWT_EXPIRE || '7d',
  },
  gmail: {
    user: process.env.GMAIL_USER!,
    appPassword: process.env.GMAIL_APP_PASSWORD!,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};
