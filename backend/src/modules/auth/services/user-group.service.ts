import { userGroupModel, permissionModel, groupPermissionModel, UserGroup, Permission } from '../models/user-group.model';
import { userModel } from '../models/user.model';
import { database } from '../../shared/database/database.service';

export interface CreateUserGroupRequest {
  name: string;
  description?: string;
  companyId: number;
  permissionIds?: number[];
  memberIds?: number[];
}

export interface UpdateUserGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: number[];
  memberIds?: number[];
}

export class UserGroupService {
  /**
   * Create a new user group with optional permissions and members
   */
  async createGroup(groupData: CreateUserGroupRequest): Promise<UserGroup> {
    // Check if group name already exists for this company
    const existingGroup = await userGroupModel.findByName(groupData.name, groupData.companyId);
    if (existingGroup) {
      throw new Error('Group name already exists for this company');
    }

    // Create the group
    const group = await userGroupModel.create(groupData);

    // Add permissions if provided
    if (groupData.permissionIds && groupData.permissionIds.length > 0) {
      await groupPermissionModel.setGroupPermissions(group.id, groupData.permissionIds);
    }

    // Add members if provided
    if (groupData.memberIds && groupData.memberIds.length > 0) {
      for (const memberId of groupData.memberIds) {
        await userGroupModel.addMember(group.id, memberId);
      }
    }

    return group;
  }

  /**
   * Update a user group
   */
  async updateGroup(groupId: number, groupData: UpdateUserGroupRequest): Promise<UserGroup | null> {
    // Check if group exists
    const existingGroup = await userGroupModel.findById(groupId);
    if (!existingGroup) {
      throw new Error('Group not found');
    }

    // Update group details
    const updatedGroup = await userGroupModel.update(groupId, groupData);

    // Update permissions if provided
    if (groupData.permissionIds !== undefined) {
      await groupPermissionModel.setGroupPermissions(groupId, groupData.permissionIds);
    }

    // Update members if provided
    if (groupData.memberIds !== undefined) {
      // Remove all existing members
      await database.query('DELETE FROM user_group_memberships WHERE group_id = $1', [groupId]);
      
      // Add new members
      for (const memberId of groupData.memberIds) {
        await userGroupModel.addMember(groupId, memberId);
      }
    }

    return updatedGroup;
  }

  /**
   * Delete a user group
   */
  async deleteGroup(groupId: number): Promise<void> {
    const group = await userGroupModel.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    await database.query('BEGIN');
    
    try {
      // Remove all permissions
      await database.query('DELETE FROM group_permissions WHERE group_id = $1', [groupId]);
      
      // Remove all members
      await database.query('DELETE FROM user_group_memberships WHERE group_id = $1', [groupId]);
      
      // Delete the group
      await database.query('DELETE FROM user_groups WHERE id = $1', [groupId]);
      
      await database.query('COMMIT');
    } catch (error) {
      await database.query('ROLLBACK');
      throw error;
    }
  }

  /**
   * Get all groups for a company
   */
  async getCompanyGroups(companyId: number): Promise<UserGroup[]> {
    return await userGroupModel.findByCompany(companyId);
  }

  /**
   * Get group details with permissions and members
   */
  async getGroupDetails(groupId: number): Promise<any> {
    const group = await userGroupModel.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const [permissions, members] = await Promise.all([
      groupPermissionModel.getGroupPermissions(groupId),
      userGroupModel.getMembers(groupId)
    ]);

    return {
      ...group,
      permissions,
      members
    };
  }

  /**
   * Add user to group
   */
  async addUserToGroup(groupId: number, userId: number): Promise<void> {
    // Check if group exists
    const group = await userGroupModel.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is in the same company
    if (user.company_id !== group.companyId) {
      throw new Error('User must belong to the same company as the group');
    }

    await userGroupModel.addMember(groupId, userId);
  }

  /**
   * Remove user from group
   */
  async removeUserFromGroup(groupId: number, userId: number): Promise<void> {
    await userGroupModel.removeMember(groupId, userId);
  }

  /**
   * Get user's groups
   */
  async getUserGroups(userId: number): Promise<UserGroup[]> {
    return await userGroupModel.getUserGroups(userId);
  }

  /**
   * Get all available permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    const query = 'SELECT * FROM permissions ORDER BY module, name';
    const result = await database.query(query);
    return result.rows;
  }

  /**
   * Get permissions by module
   */
  async getPermissionsByModule(module: string): Promise<Permission[]> {
    return await permissionModel.findByModule(module);
  }

  /**
   * Check if user has specific permission
   */
  async hasUserPermission(userId: number, permissionName: string): Promise<boolean> {
    return await groupPermissionModel.hasPermission(userId, permissionName);
  }

  /**
   * Check if user has module permission
   */
  async hasUserModulePermission(userId: number, module: string, action: string): Promise<boolean> {
    return await groupPermissionModel.hasModulePermission(userId, module, action);
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(userId: number): Promise<Permission[]> {
    return await groupPermissionModel.getUserPermissions(userId);
  }

  /**
   * Create default groups for a new company
   */
  async createDefaultGroups(companyId: number): Promise<void> {
    const defaultGroups = [
      {
        name: 'Administrators',
        description: 'Full system access',
        permissions: ['*'] // Will be handled specially
      },
      {
        name: 'Sales Team',
        description: 'Sales department users',
        permissions: [
          'crm.leads.view', 'crm.leads.create', 'crm.leads.edit',
          'crm.opportunities.view', 'crm.opportunities.create', 'crm.opportunities.edit',
          'sales.quotes.view', 'sales.quotes.create', 'sales.quotes.edit',
          'sales.orders.view', 'sales.orders.create'
        ]
      },
      {
        name: 'CRM Team',
        description: 'CRM department users',
        permissions: [
          'crm.leads.view', 'crm.leads.create', 'crm.leads.edit', 'crm.leads.delete',
          'crm.opportunities.view', 'crm.opportunities.create', 'crm.opportunities.edit',
          'contacts.view', 'contacts.create', 'contacts.edit'
        ]
      },
      {
        name: 'Members',
        description: 'Basic member access',
        permissions: [
          'crm.leads.view',
          'contacts.view'
        ]
      }
    ];

    for (const groupData of defaultGroups) {
      try {
        // Create group
        const group = await userGroupModel.create({
          name: groupData.name,
          description: groupData.description,
          companyId
        });

        // Handle permissions
        if (groupData.permissions.includes('*')) {
          // For administrators, add all permissions
          const allPermissions = await this.getAllPermissions();
          const permissionIds = allPermissions.map(p => p.id);
          await groupPermissionModel.setGroupPermissions(group.id, permissionIds);
        } else {
          // Get permission IDs for specific permissions
          const permissionRecords = await Promise.all(
            groupData.permissions.map(name => permissionModel.findByName(name))
          );
          const validPermissions = permissionRecords.filter(p => p !== null);
          const permissionIds = validPermissions.map(p => p!.id);
          
          if (permissionIds.length > 0) {
            await groupPermissionModel.setGroupPermissions(group.id, permissionIds);
          }
        }
      } catch (error) {
        console.error(`Error creating default group ${groupData.name}:`, error);
        // Continue with other groups even if one fails
      }
    }
  }

  /**
   * Get permission matrix for a company
   */
  async getPermissionMatrix(companyId: number): Promise<any> {
    const groups = await userGroupModel.findActiveByCompany(companyId);
    const permissions = await this.getAllPermissions();
    
    const matrix = {
      groups: groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description
      })),
      permissions: permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        module: permission.module,
        action: permission.action
      })),
      assignments: [] as Array<{groupId: number, permissionId: number}>
    };

    // Get all group permissions
    for (const group of groups) {
      const groupPermissions = await groupPermissionModel.getGroupPermissions(group.id);
      for (const permission of groupPermissions) {
        matrix.assignments.push({
          groupId: group.id,
          permissionId: permission.id
        });
      }
    }

    return matrix;
  }

  /**
   * Bulk update group permissions
   */
  async bulkUpdatePermissions(assignments: { groupId: number; permissionId: number }[]): Promise<void> {
    await database.query('BEGIN');
    
    try {
      // Clear all existing permissions for affected groups
      const groupIds = [...new Set(assignments.map(a => a.groupId))];
      for (const groupId of groupIds) {
        await database.query('DELETE FROM group_permissions WHERE group_id = $1', [groupId]);
      }

      // Add new assignments
      for (const assignment of assignments) {
        await groupPermissionModel.addPermission(assignment.groupId, assignment.permissionId);
      }
      
      await database.query('COMMIT');
    } catch (error) {
      await database.query('ROLLBACK');
      throw error;
    }
  }
}

export const userGroupService = new UserGroupService();
