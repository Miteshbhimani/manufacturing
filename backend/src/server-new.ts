import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authRoutes, crmRoutes } from './modules/setup';
import usersRoutes from './routes/users.routes';
import contactsRoutes from './routes/contacts.routes';
import quotesRoutes from './routes/quotes.routes';
import companiesRoutes from './routes/companies.routes';
import dashboardRoutes from './routes/dashboard.routes';
import productsRoutes from './routes/products.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import {
  securityHeaders,
  requestSizeLimiter,
  simpleRateLimit,
  enhancedCORS,
  requestLogger
} from './middleware/security.middleware';
import {
  cacheMiddleware,
  optimizeImages,
  cacheCleanup,
  clearCache,
  cacheControlHeaders,
  getCacheStats
} from './middleware/cache.middleware';
import { setupSwagger } from './utils/swagger';
import logger, { logError } from './modules/shared/utils/logger';
import { database } from './modules/shared/database/database.service';
import { migrationService } from './modules/shared/database/migration.service';
import { databaseConfig, appConfig, rateLimitConfig } from './config/database';

dotenv.config();

const app = express();
const port = appConfig.port;

// Configure CORS for production
const isDevelopment = appConfig.nodeEnv !== 'production';
const allowedOrigins = isDevelopment 
  ? ['http://localhost:5173', 'http://localhost:3000']
  : appConfig.allowedOrigins;

// Security middleware
app.use(securityHeaders);
app.use(enhancedCORS);
app.use(requestLogger);
app.use(requestSizeLimiter(10 * 1024 * 1024)); // 10MB limit

// Rate limiting - temporarily disabled for testing
// app.use('/api/auth', simpleRateLimit(rateLimitConfig.auth.windowMs, rateLimitConfig.auth.max));
// app.use('/api', simpleRateLimit(rateLimitConfig.general.windowMs, rateLimitConfig.general.max));

// Input sanitization will be handled at route level

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productsRoutes);

// Health check
app.get('/api/health', cacheControlHeaders(60), async (req, res) => {
  try {
    const dbHealth = await database.healthCheck();
    const status = dbHealth ? 'ok' : 'error';
    
    res.json({ 
      status,
      timestamp: new Date().toISOString(),
      database: dbHealth ? 'connected' : 'disconnected',
      environment: appConfig.nodeEnv
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Cache management endpoints
app.get('/api/cache/stats', (req, res) => {
  const stats = getCacheStats();
  res.json({ success: true, data: stats });
});

app.post('/api/cache/clear', clearCache);

// Setup Swagger documentation
setupSwagger(app);

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  cacheCleanup()({} as any, {} as any, () => {});
}, 5 * 60 * 1000);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await database.healthCheck();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    // Run migrations using the proper migration runner
    logger.info('Running database migrations...');
    await migrationService.runMigrations();

    logger.info('Database migrations completed');

    // Start server
    app.listen(port, () => {
      logger.info(`Backend API server started`, {
        port,
        environment: appConfig.nodeEnv,
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      });
      
      console.log(`Backend API running on http://localhost:${port}`);
      console.log(`API Documentation: http://localhost:${port}/api-docs`);
      console.log(`Environment: ${appConfig.nodeEnv}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  database.close().then(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  database.close().then(() => {
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logError(error, { type: 'uncaughtException' });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Start the server
startServer();

export default app;
