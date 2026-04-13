import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/express.types';

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
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

// Input sanitization middleware - temporarily disabled due to read-only property issue
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Input sanitization will be handled at controller level
  next();
};

// Request size limiter
export const requestSizeLimiter = (maxSize: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    
    if (contentLength > maxSize) {
      const response: ApiResponse = {
        success: false,
        error: `Request too large. Maximum size is ${maxSize / 1024 / 1024}MB`
      };
      res.status(413).json(response);
      return;
    }
    
    next();
  };
};

// IP whitelist middleware (optional)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP as string)) {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied from this IP address'
      };
      res.status(403).json(response);
      return;
    }
    
    next();
  };
};

// API key validation middleware (optional)
export const validateApiKey = (validKeys: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey || !validKeys.includes(apiKey)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid or missing API key'
      };
      res.status(401).json(response);
      return;
    }
    
    next();
  };
};

// Rate limiting middleware (simple implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const simpleRateLimit = (windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const key = clientIP as string;
    
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
      const response: ApiResponse = {
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

// CORS enhancement
export const enhancedCORS = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];
  
  if (allowedOrigins.includes(origin as string)) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, x-user-id');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
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
