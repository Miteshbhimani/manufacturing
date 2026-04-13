import { Request, Response, NextFunction } from 'express';
import { userModel } from '../modules/auth/models/user.model';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

export interface AuthenticatedRequest extends Request {
  user?: any;
  currentCompany?: number; // company_id
}

/**
 * JWT authentication middleware
 * - Verifies token
 * - Loads user
 * - Attaches currentCompany to request
 */
export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; companyId?: number };
    
    // Load user
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user and company to request
    req.user = user;
    req.currentCompany = decoded.companyId || user.company_id || 1;
    
    next();
  } catch (error) {
    console.error('JWT auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};