"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const page_routes_1 = __importDefault(require("./routes/page.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const security_middleware_1 = require("./middleware/security.middleware");
const cache_middleware_1 = require("./middleware/cache.middleware");
const swagger_1 = require("./utils/swagger");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ['ODOO_URL', 'ODOO_DB', 'ODOO_USERNAME', 'ODOO_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Configure CORS for production
const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = isDevelopment
    ? ['http://localhost:5173', 'http://localhost:3000']
    : (process.env.ALLOWED_ORIGINS?.split(',') || []);
// Security middleware
app.use(security_middleware_1.securityHeaders);
app.use(security_middleware_1.enhancedCORS);
app.use(security_middleware_1.requestLogger);
app.use((0, security_middleware_1.requestSizeLimiter)(10 * 1024 * 1024)); // 10MB limit
// Rate limiting (stricter for sensitive endpoints)
app.use('/api/auth', (0, security_middleware_1.simpleRateLimit)(15 * 60 * 1000, 10)); // 10 requests per 15 minutes for auth
app.use('/api/leads', (0, security_middleware_1.simpleRateLimit)(15 * 60 * 1000, 20)); // 20 requests per 15 minutes for leads
app.use('/api', (0, security_middleware_1.simpleRateLimit)(15 * 60 * 1000, 100)); // 100 requests per 15 minutes for general API
// Input sanitization
app.use(security_middleware_1.sanitizeInput);
// Body parsing with size limits
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public'), {
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
app.use('/api/products', (0, cache_middleware_1.cacheMiddleware)(10 * 60 * 1000), cache_middleware_1.optimizeImages, product_routes_1.default); // Cache for 10 minutes
app.use('/api/pages', (0, cache_middleware_1.cacheMiddleware)(30 * 60 * 1000), page_routes_1.default); // Cache for 30 minutes
app.use('/api/leads', lead_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.get('/api/health', (0, cache_middleware_1.cacheControlHeaders)(60), (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Cache management endpoints
app.get('/api/cache/stats', (req, res) => {
    const stats = (0, cache_middleware_1.getCacheStats)();
    res.json({ success: true, data: stats });
});
app.post('/api/cache/clear', cache_middleware_1.clearCache);
// Setup Swagger documentation
(0, swagger_1.setupSwagger)(app);
// Cleanup expired cache entries every 5 minutes
setInterval(() => {
    (0, cache_middleware_1.cacheCleanup)()({}, {}, () => { });
}, 5 * 60 * 1000);
// Error handling middleware (must be last)
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
// Start server with logging
app.listen(port, () => {
    logger_1.logger.info(`Backend API server started`, {
        port,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
    console.log(`Backend API running on http://localhost:${port}`);
    console.log(`API Documentation: http://localhost:${port}/api-docs`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.logError(error, undefined, { type: 'uncaughtException' });
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection', { reason, promise });
    process.exit(1);
});
