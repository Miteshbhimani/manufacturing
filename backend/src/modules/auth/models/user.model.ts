import { User, UserProfile, CreateUserDto, UpdateUserDto } from '../../shared/types/common.types';
import { BaseRepository } from '../../shared/database/database.service';
import { database } from '../../shared/database/database.service';
import bcrypt from 'bcryptjs';

export class UserModel extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await database.query(query, [email]);
    return result.rows[0] || null;
  }

  async findByEmailWithInactive(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await database.query(query, [email]);
    return result.rows[0] || null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE email_verification_token = $1 
      AND email_verification_expires > CURRENT_TIMESTAMP 
      AND is_active = true
    `;
    const result = await database.query(query, [token]);
    return result.rows[0] || null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE password_reset_token = $1 
      AND password_reset_expires > CURRENT_TIMESTAMP 
      AND is_active = true
    `;
    const result = await database.query(query, [token]);
    return result.rows[0] || null;
  }

  
  
  async findByCompany(companyId: number): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE company_id = $1 AND is_active = true';
    const result = await database.query(query, [companyId]);
    return result.rows;
  }

  // Missing methods needed by auth service
  async setVerificationToken(userId: number, token: string): Promise<void> {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const query = `
      UPDATE users 
      SET email_verification_token = $1, email_verification_expires = $2
      WHERE id = $3
    `;
    await database.query(query, [token, expires, userId]);
  }

  async setPasswordResetToken(userId: number, token: string): Promise<void> {
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const query = `
      UPDATE users 
      SET password_reset_token = $1, password_reset_expires = $2
      WHERE id = $3
    `;
    await database.query(query, [token, expires, userId]);
  }

  async verifyEmail(userId: number): Promise<void> {
    const query = `
      UPDATE users 
      SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL
      WHERE id = $1
    `;
    await database.query(query, [userId]);
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const query = `
      UPDATE users 
      SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    await database.query(query, [hashedPassword, userId]);
  }

  async incrementLoginAttempts(userId: number): Promise<void> {
    const query = `
      UPDATE users 
      SET login_attempts = login_attempts + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await database.query(query, [userId]);
  }

  async resetLoginAttempts(userId: number): Promise<void> {
    const query = `
      UPDATE users 
      SET login_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await database.query(query, [userId]);
  }

  async isAccountLocked(user: User): Promise<boolean> {
    if (!user.locked_until) return false;
    return new Date(user.locked_until) > new Date();
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // CRUD methods for user management
  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await database.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await database.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role, company_id, is_active, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const result = await database.query(query, [
      userData.email,
      hashedPassword,
      userData.firstName || null,
      userData.lastName || null,
      userData.role || 'member',
      userData.companyId || 1,
      true,
      false
    ]);
    return result.rows[0];
  }

  async update(id: number, userData: UpdateUserDto): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (userData.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(userData.email);
    }
    if (userData.firstName !== undefined) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(userData.firstName);
    }
    if (userData.lastName !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(userData.lastName);
    }
    if (userData.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(userData.role);
    }
    if (userData.companyId !== undefined) {
      fields.push(`company_id = $${paramIndex++}`);
      values.push(userData.companyId);
    }
    if (userData.isActive !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(userData.isActive);
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      fields.push(`password_hash = $${paramIndex++}`);
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await database.query(query, [id]);
    return result.rowCount > 0;
  }
}

export const userModel = new UserModel();