import { BaseRepository } from '../../shared/database/database.service';
import { database } from '../../shared/database/database.service';

export interface UserGroup {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  companyId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserGroupDto {
  name: string;
  description?: string;
  companyId: number;
}

export interface UpdateUserGroupDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface Permission {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  module: string;
  action: string;
  createdAt: Date;
}

export interface GroupPermission {
  groupId: number;
  permissionId: number;
  createdAt: Date;
}

export class UserGroupModel extends BaseRepository<UserGroup> {
  constructor() {
    super('user_groups');
  }

  async create(groupData: CreateUserGroupDto): Promise<UserGroup> {
    const query = `
      INSERT INTO user_groups (name, description, company_id, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING *
    `;
    
    const result = await database.query(query, [
      groupData.name,
      groupData.description,
      groupData.companyId
    ]);
    
    return result.rows[0];
  }

  async update(id: number, groupData: UpdateUserGroupDto): Promise<UserGroup | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (groupData.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(groupData.name);
    }
    if (groupData.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(groupData.description);
    }
    if (groupData.isActive !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(groupData.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE user_groups 
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;
    
    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async findByCompany(companyId: number): Promise<UserGroup[]> {
    const query = 'SELECT * FROM user_groups WHERE company_id = $1 ORDER BY name';
    const result = await database.query(query, [companyId]);
    return result.rows;
  }

  async findByName(name: string, companyId: number): Promise<UserGroup | null> {
    const query = 'SELECT * FROM user_groups WHERE name = $1 AND company_id = $2';
    const result = await database.query(query, [name, companyId]);
    return result.rows[0] || null;
  }

  async findActiveByCompany(companyId: number): Promise<UserGroup[]> {
    const query = 'SELECT * FROM user_groups WHERE company_id = $1 AND is_active = true ORDER BY name';
    const result = await database.query(query, [companyId]);
    return result.rows;
  }

  async addMember(groupId: number, userId: number): Promise<void> {
    const query = `
      INSERT INTO user_group_memberships (user_id, group_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
    await database.query(query, [userId, groupId]);
  }

  async removeMember(groupId: number, userId: number): Promise<void> {
    const query = 'DELETE FROM user_group_memberships WHERE user_id = $1 AND group_id = $2';
    await database.query(query, [userId, groupId]);
  }

  async getMembers(groupId: number): Promise<any[]> {
    const query = `
      SELECT u.*, ugm.created_at as joined_at
      FROM users u
      JOIN user_group_memberships ugm ON u.id = ugm.user_id
      WHERE ugm.group_id = $1 AND u.is_active = true
      ORDER BY u.first_name, u.last_name
    `;
    const result = await database.query(query, [groupId]);
    return result.rows;
  }

  async getUserGroups(userId: number): Promise<UserGroup[]> {
    const query = `
      SELECT ug.*
      FROM user_groups ug
      JOIN user_group_memberships ugm ON ug.id = ugm.group_id
      WHERE ugm.user_id = $1 AND ug.is_active = true
      ORDER BY ug.name
    `;
    const result = await database.query(query, [userId]);
    return result.rows;
  }

  async isUserInGroup(userId: number, groupId: number): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM user_group_memberships ugm
      JOIN user_groups ug ON ugm.group_id = ug.id
      WHERE ugm.user_id = $1 AND ugm.group_id = $2 AND ug.is_active = true
    `;
    const result = await database.query(query, [userId, groupId]);
    return parseInt(result.rows[0].count) > 0;
  }
}

export class PermissionModel extends BaseRepository<Permission> {
  constructor() {
    super('permissions');
  }

  async findByName(name: string): Promise<Permission | null> {
    const query = 'SELECT * FROM permissions WHERE name = $1';
    const result = await database.query(query, [name]);
    return result.rows[0] || null;
  }

  async findByModule(module: string): Promise<Permission[]> {
    const query = 'SELECT * FROM permissions WHERE module = $1 ORDER BY name';
    const result = await database.query(query, [module]);
    return result.rows;
  }

  async findByAction(action: string): Promise<Permission[]> {
    const query = 'SELECT * FROM permissions WHERE action = $1 ORDER BY module, name';
    const result = await database.query(query, [action]);
    return result.rows;
  }

  async findByModuleAndAction(module: string, action: string): Promise<Permission[]> {
    const query = 'SELECT * FROM permissions WHERE module = $1 AND action = $2 ORDER BY name';
    const result = await database.query(query, [module, action]);
    return result.rows;
  }
}

export class GroupPermissionModel extends BaseRepository<GroupPermission> {
  constructor() {
    super('group_permissions');
  }

  async addPermission(groupId: number, permissionId: number): Promise<void> {
    const query = `
      INSERT INTO group_permissions (group_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
    await database.query(query, [groupId, permissionId]);
  }

  async removePermission(groupId: number, permissionId: number): Promise<void> {
    const query = 'DELETE FROM group_permissions WHERE group_id = $1 AND permission_id = $2';
    await database.query(query, [groupId, permissionId]);
  }

  async getGroupPermissions(groupId: number): Promise<Permission[]> {
    const query = `
      SELECT p.*
      FROM permissions p
      JOIN group_permissions gp ON p.id = gp.permission_id
      WHERE gp.group_id = $1
      ORDER BY p.module, p.name
    `;
    const result = await database.query(query, [groupId]);
    return result.rows;
  }

  async getUserPermissions(userId: number): Promise<Permission[]> {
    const query = `
      SELECT DISTINCT p.*
      FROM permissions p
      JOIN group_permissions gp ON p.id = gp.permission_id
      JOIN user_group_memberships ugm ON gp.group_id = ugm.group_id
      JOIN user_groups ug ON ugm.group_id = ug.id
      WHERE ugm.user_id = $1 AND ug.is_active = true
      ORDER BY p.module, p.name
    `;
    const result = await database.query(query, [userId]);
    return result.rows;
  }

  async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM permissions p
      JOIN group_permissions gp ON p.id = gp.permission_id
      JOIN user_group_memberships ugm ON gp.group_id = ugm.group_id
      JOIN user_groups ug ON ugm.group_id = ug.id
      WHERE ugm.user_id = $1 AND p.name = $2 AND ug.is_active = true
    `;
    const result = await database.query(query, [userId, permissionName]);
    return parseInt(result.rows[0].count) > 0;
  }

  async hasModulePermission(userId: number, module: string, action: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM permissions p
      JOIN group_permissions gp ON p.id = gp.permission_id
      JOIN user_group_memberships ugm ON gp.group_id = ugm.group_id
      JOIN user_groups ug ON ugm.group_id = ug.id
      WHERE ugm.user_id = $1 AND p.module = $2 AND p.action = $3 AND ug.is_active = true
    `;
    const result = await database.query(query, [userId, module, action]);
    return parseInt(result.rows[0].count) > 0;
  }

  async setGroupPermissions(groupId: number, permissionIds: number[]): Promise<void> {
    await database.query('BEGIN');
    
    try {
      // Remove existing permissions
      await database.query('DELETE FROM group_permissions WHERE group_id = $1', [groupId]);
      
      // Add new permissions
      if (permissionIds.length > 0) {
        const values = permissionIds.map((id, index) => `($1, $${index + 2})`).join(', ');
        const query = `
          INSERT INTO group_permissions (group_id, permission_id)
          VALUES ${values}
        `;
        await database.query(query, [groupId, ...permissionIds]);
      }
      
      await database.query('COMMIT');
    } catch (error) {
      await database.query('ROLLBACK');
      throw error;
    }
  }
}

export const userGroupModel = new UserGroupModel();
export const permissionModel = new PermissionModel();
export const groupPermissionModel = new GroupPermissionModel();
