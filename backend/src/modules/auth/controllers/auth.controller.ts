import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from '../../shared/types/common.types';
import logger, { logError } from '../../shared/utils/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: RegisterRequest = req.body;
      
      // Validate input
      if (!userData.email || !userData.password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        } as ApiResponse);
        return;
      }

      if (userData.password.length < 8) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long'
        } as ApiResponse);
        return;
      }

      const result = await authService.register(userData);
      
      res.status(201).json({
        success: true,
        data: result.user,
        message: result.message
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.register' });
      
      res.status(400).json({
        success: false,
        error: error.message || 'Registration failed'
      } as ApiResponse);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
      
      // Validate input
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        } as ApiResponse);
        return;
      }

      const result = await authService.login(loginData);
      
      res.status(200).json({
        success: true,
        data: result
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.login' });
      
      res.status(401).json({
        success: false,
        error: error.message || 'Login failed'
      } as ApiResponse);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        } as ApiResponse);
        return;
      }

      const result = await authService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        data: result
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.refreshToken' });
      
      res.status(401).json({
        success: false,
        error: error.message || 'Token refresh failed'
      } as ApiResponse);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestData: ForgotPasswordRequest = req.body;
      
      if (!requestData.email) {
        res.status(400).json({
          success: false,
          error: 'Email is required'
        } as ApiResponse);
        return;
      }

      const result = await authService.forgotPassword(requestData);
      
      res.status(200).json({
        success: true,
        data: result
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.forgotPassword' });
      
      res.status(500).json({
        success: false,
        error: error.message || 'Password reset request failed'
      } as ApiResponse);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestData: ResetPasswordRequest = req.body;
      
      if (!requestData.token || !requestData.password) {
        res.status(400).json({
          success: false,
          error: 'Token and password are required'
        } as ApiResponse);
        return;
      }

      if (requestData.password.length < 8) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long'
        } as ApiResponse);
        return;
      }

      const result = await authService.resetPassword(requestData);
      
      res.status(200).json({
        success: true,
        data: result
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.resetPassword' });
      
      res.status(400).json({
        success: false,
        error: error.message || 'Password reset failed'
      } as ApiResponse);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestData: VerifyEmailRequest = req.body;
      
      if (!requestData.token) {
        res.status(400).json({
          success: false,
          error: 'Verification token is required'
        } as ApiResponse);
        return;
      }

      const result = await authService.verifyEmail(requestData);
      
      res.status(200).json({
        success: true,
        data: result
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.verifyEmail' });
      
      res.status(400).json({
        success: false,
        error: error.message || 'Email verification failed'
      } as ApiResponse);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const result = await authService.logout(userId);
      
      res.status(200).json({
        success: true,
        data: result
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.logout' });
      
      res.status(500).json({
        success: false,
        error: error.message || 'Logout failed'
      } as ApiResponse);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      const user = await authService.getCurrentUser(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.getCurrentUser' });
      
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get user data'
      } as ApiResponse);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        } as ApiResponse);
        return;
      }

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Current password and new password are required'
        } as ApiResponse);
        return;
      }

      if (newPassword.length < 8) {
        res.status(400).json({
          success: false,
          error: 'New password must be at least 8 characters long'
        } as ApiResponse);
        return;
      }

      const result = await authService.changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        data: result
      } as ApiResponse);
    } catch (error: any) {
      logError(error, { context: 'AuthController.changePassword' });
      
      res.status(400).json({
        success: false,
        error: error.message || 'Password change failed'
      } as ApiResponse);
    }
  }
}

export const authController = new AuthController();
