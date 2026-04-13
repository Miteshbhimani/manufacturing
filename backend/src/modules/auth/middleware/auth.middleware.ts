import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService } from '../services/auth.service';
import { ApiResponse, JwtPayload } from '../../shared/types/common.types';
import { logError } from '../../shared/utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is required'
      } as ApiResponse);
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Verify user still exists and is active
    const user = await authService.getCurrentUser(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      } as ApiResponse);
      return;
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error: any) {
    logError(error, { context: 'authenticateToken' });
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'Token has expired'
      } as ApiResponse);
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        error: 'Authentication failed'
      } as ApiResponse);
    }
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      } as ApiResponse);
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireSalesOrAdmin = requireRole(['sales', 'admin']);
export const requireCrmOrAdmin = requireRole(['crm', 'admin']);
export const requireMemberOrAdmin = requireRole(['member', 'admin']);

export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      const user = await authService.getCurrentUser(decoded.userId);
      if (user) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
      }
    }

    next();
  } catch (error) {
    // Optional auth means we don't throw errors, just continue without user
    next();
  }
};

export const requireEmailVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    } as ApiResponse);
    return;
  }

  // This would require checking user's email verification status
  // For now, we'll assume all users are verified or implement this check
  next();
};

export const rateLimitByUser = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.user?.userId;
    const identifier = userId ? userId.toString() : (req.ip || 'unknown');
    const now = Date.now();
    const userRequests = requests.get(identifier);

    if (!userRequests || now > userRequests.resetTime) {
      requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }

    if (userRequests.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later'
      } as ApiResponse);
      return;
    }

    userRequests.count++;
    next();
  };
};

export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const email = req.body.email;
  
  if (!email) {
    res.status(400).json({
      success: false,
      error: 'Email is required'
    } as ApiResponse);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      error: 'Invalid email format'
    } as ApiResponse);
    return;
  }

  next();
};

export const validatePassword = (req: Request, res: Response, next: NextFunction): void => {
  const password = req.body.password;
  
  if (!password) {
    res.status(400).json({
      success: false,
      error: 'Password is required'
    } as ApiResponse);
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters long'
    } as ApiResponse);
    return;
  }

  // Check for at least one uppercase, one lowercase, one number, and one special character
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    res.status(400).json({
      success: false,
      error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    } as ApiResponse);
    return;
  }

  next();
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Sanitize string inputs to prevent XSS
  const sanitizeString = (str: string): string => {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};
