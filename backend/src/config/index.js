import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  database: {
    url: process.env.DATABASE_URL,
    stagingUrl: process.env.DATABASE_URL_STAGING,
    testUrl: process.env.DATABASE_URL_TEST,
    devUrl: process.env.DATABASE_URL_DEV
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
};

// Validate required configuration
if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is required');
}

if (!config.database.url && !config.database.devUrl) {
  throw new Error('DATABASE_URL or DATABASE_URL_DEV is required');
}

export default config;