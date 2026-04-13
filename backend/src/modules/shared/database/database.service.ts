import { Pool, PoolClient, PoolConfig } from 'pg';
import { DatabaseConnection } from '../types/common.types';
import { databaseConfig } from '../../../config/database';

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    const config: PoolConfig = {
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: databaseConfig.database,
      user: databaseConfig.user,
      password: databaseConfig.password,
      max: databaseConfig.max,
      idleTimeoutMillis: databaseConfig.idleTimeoutMillis,
      connectionTimeoutMillis: databaseConfig.connectionTimeoutMillis,
      ssl: databaseConfig.ssl,
    };

    this.pool = new Pool(config);
    
    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query (${duration}ms): ${text}`);
      }
      
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  public async getPoolStats(): Promise<any> {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Export singleton instance
export const database = DatabaseService.getInstance();

// Helper functions for common database operations
export class BaseRepository<T> {
  protected tableName: string;
  protected db: DatabaseService;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = database;
  }

  public async findById(id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  protected async findByUuid(uuid: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE uuid = $1`;
    const result = await this.db.query(query, [uuid]);
    return result.rows[0] || null;
  }

  protected async findAll(limit: number = 50, offset: number = 0): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    const result = await this.db.query(query, [limit, offset]);
    return result.rows;
  }

  protected async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  protected async update(id: number, data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const query = `UPDATE ${this.tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  protected async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  protected async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const result = await this.db.query(query);
    return parseInt(result.rows[0].count);
  }

  protected async search(searchTerm: string, searchFields: string[], limit: number = 50): Promise<T[]> {
    const whereClause = searchFields.map((field, index) => `${field} ILIKE $${index + 2}`).join(' OR ');
    const query = `SELECT * FROM ${this.tableName} WHERE ${whereClause} ORDER BY created_at DESC LIMIT $1`;
    const values = [limit, ...searchFields.map(() => `%${searchTerm}%`)];
    const result = await this.db.query(query, values);
    return result.rows;
  }

  protected async paginate(page: number = 1, limit: number = 50, orderBy: string = 'created_at', orderDirection: 'ASC' | 'DESC' = 'DESC'): Promise<{ data: T[]; pagination: any }> {
    const offset = (page - 1) * limit;
    const countQuery = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const dataQuery = `SELECT * FROM ${this.tableName} ORDER BY ${orderBy} ${orderDirection} LIMIT $1 OFFSET $2`;
    
    const [countResult, dataResult] = await Promise.all([
      this.db.query(countQuery),
      this.db.query(dataQuery, [limit, offset])
    ]);
    
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}

