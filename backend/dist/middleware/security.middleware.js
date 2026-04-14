"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.enhancedCORS = exports.simpleRateLimit = exports.validateApiKey = exports.ipWhitelist = exports.requestSizeLimiter = exports.sanitizeInput = exports.securityHeaders = void 0;
// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    // Content Security Policy
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' http://localhost:8069",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; ');
    res.setHeader('Content-Security-Policy', csp);
    next();
};
exports.securityHeaders = securityHeaders;
// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    const sanitizeString = (str) => {
        return str
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .substring(0, 10000); // Limit length
    };
    const sanitizeObject = (obj) => {
        if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        else if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        else if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitizeObject(value);
            }
            return sanitized;
        }
        return obj;
    };
    // Sanitize request body
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    // Sanitize query parameters
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    // Sanitize URL parameters
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
// Request size limiter
const requestSizeLimiter = (maxSize = 10 * 1024 * 1024) => {
    return (req, res, next) => {
        const contentLength = parseInt(req.headers['content-length'] || '0');
        if (contentLength > maxSize) {
            const response = {
                success: false,
                error: `Request too large. Maximum size is ${maxSize / 1024 / 1024}MB`
            };
            res.status(413).json(response);
            return;
        }
        next();
    };
};
exports.requestSizeLimiter = requestSizeLimiter;
// IP whitelist middleware (optional)
const ipWhitelist = (allowedIPs) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
            const response = {
                success: false,
                error: 'Access denied from this IP address'
            };
            res.status(403).json(response);
            return;
        }
        next();
    };
};
exports.ipWhitelist = ipWhitelist;
// API key validation middleware (optional)
const validateApiKey = (validKeys) => {
    return (req, res, next) => {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || !validKeys.includes(apiKey)) {
            const response = {
                success: false,
                error: 'Invalid or missing API key'
            };
            res.status(401).json(response);
            return;
        }
        next();
    };
};
exports.validateApiKey = validateApiKey;
// Rate limiting middleware (simple implementation)
const rateLimitStore = new Map();
const simpleRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const key = clientIP;
        // Get or create rate limit record
        let record = rateLimitStore.get(key);
        if (!record || now > record.resetTime) {
            // Create new record
            record = {
                count: 1,
                resetTime: now + windowMs
            };
            rateLimitStore.set(key, record);
            next();
            return;
        }
        // Check if limit exceeded
        if (record.count >= maxRequests) {
            const response = {
                success: false,
                error: 'Too many requests. Please try again later.'
            };
            res.status(429).json(response);
            return;
        }
        // Increment count
        record.count++;
        rateLimitStore.set(key, record);
        next();
    };
};
exports.simpleRateLimit = simpleRateLimit;
// CORS enhancement
const enhancedCORS = (req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000'
    ];
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
};
exports.enhancedCORS = enhancedCORS;
// Request logger middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    // Log request
    console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${ip} - UA: ${userAgent}`);
    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        console.log(`[${new Date().toISOString()}] ${method} ${url} - ${statusCode} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
