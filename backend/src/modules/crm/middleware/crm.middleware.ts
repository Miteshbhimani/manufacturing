import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { database } from '../../shared/database/database.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Verify user exists and is active
    const query = 'SELECT id, email, role, is_active FROM users WHERE id = $1 AND is_active = true';
    const result = await database.query(query, [decoded.userId]);

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Invalid token or user not found'
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
    return;
  }
  next();
};

export const requireCRM = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !['admin', 'crm', 'sales'].includes(req.user.role)) {
    res.status(403).json({
      success: false,
      error: 'CRM access required'
    });
    return;
  }
  next();
};
