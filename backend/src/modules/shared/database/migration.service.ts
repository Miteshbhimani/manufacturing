import { database } from './database.service';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface Migration {
  id: string;
  name: string;
  sql: string;
  dependencies?: string[];
  rollback?: string;
}

export class MigrationService {
  private static instance: MigrationService;
  private migrationsPath: string;

  private constructor() {
    this.migrationsPath = join(__dirname, '../../../migrations');
  }

  public static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  /**
   * Initialize migrations table
   */
  public async initialize(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS migration_lock (
        id SERIAL PRIMARY KEY,
        locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        locked_by VARCHAR(255),
        lock_key VARCHAR(255) DEFAULT 'default' UNIQUE
      );
    `;
    
    await database.query(sql);
  }

  /**
   * Acquire migration lock to prevent concurrent migrations
   */
  public async acquireLock(lockKey: string = 'default'): Promise<boolean> {
    try {
      await database.query(`
        INSERT INTO migration_lock (lock_key, locked_by) 
        VALUES ($1, $2)
        ON CONFLICT (lock_key) DO NOTHING
      `, [lockKey, process.pid.toString()]);
      
      return true;
    } catch (error) {
      console.error('Failed to acquire migration lock:', error);
      return false;
    }
  }

  /**
   * Release migration lock
   */
  public async releaseLock(lockKey: string = 'default'): Promise<void> {
    await database.query('DELETE FROM migration_lock WHERE lock_key = $1', [lockKey]);
  }

  /**
   * Run a single migration
   */
  public async runMigration(migration: Migration): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Check if migration already exists
      const existing = await database.query(
        'SELECT * FROM migrations WHERE name = $1',
        [migration.name]
      );
      
      if (existing.rows.length > 0) {
        console.log(`Migration ${migration.name} already executed`);
        return;
      }

      // Start transaction
      await database.query('BEGIN');
      
      try {
        // Execute migration SQL
        await database.query(migration.sql);
        
        // Record migration
        await database.query(`
          INSERT INTO migrations (name, executed_at)
          VALUES ($1, CURRENT_TIMESTAMP)
        `, [
          migration.name
        ]);
        
        await database.query('COMMIT');
        console.log(`Migration ${migration.name} executed successfully`);
        
      } catch (error) {
        await database.query('ROLLBACK');
        throw error;
      }
      
    } catch (error) {
      console.error(`Error running migration ${migration.name}:`, error);
      throw error;
    }
  }

  /**
   * Run all pending migrations
   */
  public async runMigrations(): Promise<void> {
    await this.initialize();
    
    const lockAcquired = await this.acquireLock();
    if (!lockAcquired) {
      throw new Error('Could not acquire migration lock - another migration may be running');
    }

    try {
      const migrations = await this.loadMigrations();
      const executedMigrations = await this.getExecutedMigrations();
      
      for (const migration of migrations) {
        if (!executedMigrations.includes(migration.name)) {
          await this.runMigration(migration);
        }
      }
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Load migration files from the migrations directory
   */
  private async loadMigrations(): Promise<Migration[]> {
    const migrations: Migration[] = [];
    
    try {
      const files = readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ensure deterministic order
      
      for (const file of files) {
        const filePath = join(this.migrationsPath, file);
        const content = readFileSync(filePath, 'utf8');
        
        // Parse migration file
        const migration = this.parseMigrationFile(file, content);
        migrations.push(migration);
      }
    } catch (error) {
      console.error('Error loading migration files:', error);
    }
    
    return migrations;
  }

  /**
   * Parse migration file content
   */
  private parseMigrationFile(filename: string, content: string): Migration {
    const lines = content.split('\n');
    let name = filename.replace('.sql', '');
    let version = '1.0.0';
    let dependencies: string[] = [];
    
    // Parse metadata from comments
    for (const line of lines) {
      if (line.startsWith('-- @name:')) {
        name = line.replace('-- @name:', '').trim();
      } else if (line.startsWith('-- @version:')) {
        version = line.replace('-- @version:', '').trim();
      } else if (line.startsWith('-- @depends:')) {
        dependencies = line.replace('-- @depends:', '').trim().split(',').map(d => d.trim());
      }
    }
    
    // Extract SQL (remove comments)
    const sql = content
      .split('\n')
      .filter(line => !line.startsWith('-- @'))
      .join('\n');
    
    return {
      id: version,
      name,
      sql,
      dependencies
    };
  }

  /**
   * Get list of executed migrations
   */
  public async getExecutedMigrations(): Promise<string[]> {
    const result = await database.query('SELECT name FROM migrations ORDER BY executed_at');
    return result.rows.map((row: any) => row.name);
  }

  /**
   * Calculate checksum for migration SQL
   */
  private calculateChecksum(sql: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(sql).digest('hex');
  }

  /**
   * Get migration status
   */
  public async getMigrationStatus(): Promise<{
    total: number;
    executed: number;
    pending: string[];
    lastExecution?: Date;
  }> {
    const allMigrations = await this.loadMigrations();
    const executedMigrations = await this.getExecutedMigrations();
    const pendingMigrations = allMigrations
      .filter(m => !executedMigrations.includes(m.name))
      .map(m => m.name);
    
    const lastExecutionResult = await database.query(
      'SELECT executed_at FROM migrations ORDER BY executed_at DESC LIMIT 1'
    );
    
    return {
      total: allMigrations.length,
      executed: executedMigrations.length,
      pending: pendingMigrations,
      lastExecution: lastExecutionResult.rows[0]?.executed_at
    };
  }

  /**
   * Validate migration dependencies
   */
  public async validateDependencies(): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const migrations = await this.loadMigrations();
    const executedMigrations = await this.getExecutedMigrations();
    const errors: string[] = [];
    
    for (const migration of migrations) {
      if (migration.dependencies) {
        for (const dependency of migration.dependencies) {
          if (!executedMigrations.includes(dependency)) {
            errors.push(`Migration ${migration.name} depends on ${dependency} which is not executed`);
          }
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const migrationService = MigrationService.getInstance();
