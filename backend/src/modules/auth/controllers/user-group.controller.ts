import { Request, Response } from 'express';
import { userGroupService } from '../services/user-group.service';
import { ApiResponse } from '../../shared/types/common.types';
import logger, { logError, logAudit } from '../../shared/utils/logger';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware';

export class UserGroupController {
  /**
   * Create a new user group
   */
  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, companyId, permissionIds, memberIds } = req.body;

      if (!name || !companyId) {
        res.status(400).json({
          success: false,
          error: 'Name and companyId are required'
        } as ApiResponse);
        return;
      }

      const group = await userGroupService.createGroup({
        name,
        description,
        companyId,
        permissionIds,
        memberIds
      });

      logAudit((req as AuthenticatedRequest).user?.id || 0, 'user_group_created', { name, companyId, groupId: group.id });

      res.status(201).json({
        success: true,
        data: group
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error creating user group');
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create group'
      } as ApiResponse);
    }
  }

  /**
   * Update a user group
   */
  async updateGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.id as string);
      const { name, description, isActive, permissionIds, memberIds } = req.body;

      if (isNaN(groupId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid group ID'
        } as ApiResponse);
        return;
      }

      const updatedGroup = await userGroupService.updateGroup(groupId, {
        name,
        description,
        isActive,
        permissionIds,
        memberIds
      });

      if (!updatedGroup) {
        res.status(404).json({
          success: false,
          error: 'Group not found'
        } as ApiResponse);
        return;
      }

      logAudit((req as AuthenticatedRequest).user?.id || 0, 'user_group_updated', { name, description, isActive, groupId });

      res.json({
        success: true,
        data: updatedGroup
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error updating user group');
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update group'
      } as ApiResponse);
    }
  }

  /**
   * Delete a user group
   */
  async deleteGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.id as string);

      if (isNaN(groupId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid group ID'
        } as ApiResponse);
        return;
      }

      await userGroupService.deleteGroup(groupId);

      logAudit((req as AuthenticatedRequest).user?.id || 0, 'user_group_deleted', { groupId });

      res.json({
        success: true,
        message: 'Group deleted successfully'
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error deleting user group');
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete group'
      } as ApiResponse);
    }
  }

  /**
   * Get all groups for a company
   */
  async getCompanyGroups(req: Request, res: Response): Promise<void> {
    try {
      const companyId = parseInt(req.params.companyId as string);

      if (isNaN(companyId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid company ID'
        } as ApiResponse);
        return;
      }

      const groups = await userGroupService.getCompanyGroups(companyId);

      res.json({
        success: true,
        data: groups
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error getting company groups');
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve groups'
      } as ApiResponse);
    }
  }

  /**
   * Get group details with permissions and members
   */
  async getGroupDetails(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.id as string);

      if (isNaN(groupId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid group ID'
        } as ApiResponse);
        return;
      }

      const groupDetails = await userGroupService.getGroupDetails(groupId);

      res.json({
        success: true,
        data: groupDetails
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error getting group details');
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve group details'
      } as ApiResponse);
    }
  }

  /**
   * Add user to group
   */
  async addUserToGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.groupId as string);
      const { userId } = req.body;

      if (isNaN(groupId) || !userId) {
        res.status(400).json({
          success: false,
          error: 'Valid groupId and userId are required'
        } as ApiResponse);
        return;
      }

      await userGroupService.addUserToGroup(groupId, userId);

      logAudit((req as AuthenticatedRequest).user?.id || 0, 'user_added_to_group', { groupId, userId });

      res.json({
        success: true,
        message: 'User added to group successfully'
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error adding user to group');
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add user to group'
      } as ApiResponse);
    }
  }

  /**
   * Remove user from group
   */
  async removeUserFromGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupId = parseInt(req.params.groupId as string);
      const userId = parseInt(req.params.userId as string);

      if (isNaN(groupId) || isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: 'Valid groupId and userId are required'
        } as ApiResponse);
        return;
      }

      await userGroupService.removeUserFromGroup(groupId, userId);

      logAudit((req as AuthenticatedRequest).user?.id || 0, 'user_removed_from_group', { groupId, userId });

      res.json({
        success: true,
        message: 'User removed from group successfully'
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error removing user from group');
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove user from group'
      } as ApiResponse);
    }
  }

  /**
   * Get user's groups
   */
  async getUserGroups(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId as string);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        } as ApiResponse);
        return;
      }

      const groups = await userGroupService.getUserGroups(userId);

      res.json({
        success: true,
        data: groups
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error getting user groups');
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user groups'
      } as ApiResponse);
    }
  }

  /**
   * Get all available permissions
   */
  async getAllPermissions(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await userGroupService.getAllPermissions();

      res.json({
        success: true,
        data: permissions
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error getting permissions');
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve permissions'
      } as ApiResponse);
    }
  }

  /**
   * Get permissions by module
   */
  async getPermissionsByModule(req: Request, res: Response): Promise<void> {
    try {
      const module = req.params.module as string;

      if (!module) {
        res.status(400).json({
          success: false,
          error: 'Module parameter is required'
        } as ApiResponse);
        return;
      }

      const permissions = await userGroupService.getPermissionsByModule(module);

      res.json({
        success: true,
        data: permissions
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error getting module permissions');
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve module permissions'
      } as ApiResponse);
    }
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId as string);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        } as ApiResponse);
        return;
      }

      const permissions = await userGroupService.getUserPermissions(userId);

      res.json({
        success: true,
        data: permissions
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error getting user permissions');
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user permissions'
      } as ApiResponse);
    }
  }

  /**
   * Check if user has specific permission
   */
  async checkUserPermission(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId as string);
      const { permission } = req.body;

      if (isNaN(userId) || !permission) {
        res.status(400).json({
          success: false,
          error: 'Valid userId and permission are required'
        } as ApiResponse);
        return;
      }

      const hasPermission = await userGroupService.hasUserPermission(userId, permission);

      res.json({
        success: true,
        data: { hasPermission }
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error checking user permission');
      res.status(500).json({
        success: false,
        error: 'Failed to check user permission'
      } as ApiResponse);
    }
  }

  /**
   * Get permission matrix for a company
   */
  async getPermissionMatrix(req: Request, res: Response): Promise<void> {
    try {
      const companyId = parseInt(req.params.companyId as string);

      if (isNaN(companyId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid company ID'
        } as ApiResponse);
        return;
      }

      const matrix = await userGroupService.getPermissionMatrix(companyId);

      res.json({
        success: true,
        data: matrix
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error getting permission matrix');
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve permission matrix'
      } as ApiResponse);
    }
  }

  /**
   * Bulk update group permissions
   */
  async bulkUpdatePermissions(req: Request, res: Response): Promise<void> {
    try {
      const { assignments } = req.body;

      if (!Array.isArray(assignments)) {
        res.status(400).json({
          success: false,
          error: 'Assignments must be an array'
        } as ApiResponse);
        return;
      }

      await userGroupService.bulkUpdatePermissions(assignments);

      logAudit((req as AuthenticatedRequest).user?.id || 0, 'bulk_permissions_updated', { count: assignments.length });

      res.json({
        success: true,
        message: 'Permissions updated successfully'
      } as ApiResponse);

    } catch (error) {
      logError(error as Error, 'Error bulk updating permissions');
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update permissions'
      } as ApiResponse);
    }
  }
}

export const userGroupController = new UserGroupController();
