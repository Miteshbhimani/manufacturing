import { Request, Response } from 'express';
import { userModel } from '../modules/auth/models/user.model';
import { logError, logAudit } from '../modules/shared/utils/logger';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userModel.findAll();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch users');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await userModel.findById(parseInt(id));
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch user');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await userModel.create(userData);
      
      logAudit(user.id, 'User created', { email: user.email });
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      logError(error as Error, 'Failed to create user');
      res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const userData = req.body;
      
      const user = await userModel.update(parseInt(id), userData);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      logAudit(user.id, 'User updated', { email: user.email });
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logError(error as Error, 'Failed to update user');
      res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const success = await userModel.delete(parseInt(id));
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      logAudit(parseInt(id), 'User deleted', {});
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logError(error as Error, 'Failed to delete user');
      res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }
  }
}

export const userController = new UserController();
