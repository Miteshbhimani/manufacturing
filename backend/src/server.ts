import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productRoutes from './routes/product.routes';
import leadRoutes from './routes/lead.routes';
import pageRoutes from './routes/page.routes';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import {
  securityHeaders,
  sanitizeInput,
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
import { logger } from './utils/logger';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['ODOO_URL', 'ODOO_DB', 'ODOO_USERNAME', 'ODOO_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = express();
const port = parseInt(process.env.PORT || '3001', 10);

// Configure CORS for production
const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = isDevelopment 
  ? ['http://localhost:5173', 'http://localhost:3000']
  : (process.env.ALLOWED_ORIGINS?.split(',') || []);

// Security middleware
app.use(securityHeaders);
app.use(enhancedCORS);
app.use(requestLogger);
app.use(requestSizeLimiter(10 * 1024 * 1024)); // 10MB limit

// Rate limiting (disabled for development)
// app.use('/api/auth', simpleRateLimit(15 * 60 * 1000, 10)); // 10 requests per 15 minutes for auth
// app.use('/api/leads', simpleRateLimit(15 * 60 * 1000, 20)); // 20 requests per 15 minutes for leads
// app.use('/api', simpleRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes for general API

// Input sanitization
app.use(sanitizeInput);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true,
  lastModified: true
}));

// Rate limiting middleware (temporarily disabled for development)
// const rateLimit = require('express-rate-limit');
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: { success: false, error: 'Too many requests from this IP, please try again later.' }
// });
// app.use('/api', limiter);

// API Routes with caching
app.use('/api/products', cacheMiddleware(1 * 60 * 1000), optimizeImages, productRoutes); // Cache for 1 minute (development)
app.use('/api/pages', cacheMiddleware(30 * 60 * 1000), pageRoutes); // Cache for 30 minutes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);

app.get('/api/health', cacheControlHeaders(60), (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cache management endpoints
app.get('/api/cache/stats', (req, res) => {
  const stats = getCacheStats();
  res.json({ success: true, data: stats });
});

app.post('/api/cache/clear', clearCache);
app.post('/api/cache/products/clear', clearCache); // Additional endpoint for product-specific cache clearing

// Setup Swagger documentation
setupSwagger(app);

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  cacheCleanup()({} as Request, {} as Response, () => {});
}, 5 * 60 * 1000);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server with logging
app.listen(port, '0.0.0.0', () => {
  logger.info(`Backend API server started`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
  
  console.log(`Backend API running on http://localhost:${port}`);
  console.log(`Backend API accessible on network: http://192.168.1.68:${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.logError(error, undefined, { type: 'uncaughtException' });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});
