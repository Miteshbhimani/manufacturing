import { BaseRepository } from '../../shared/database/database.service';
import { database } from '../../shared/database/database.service';
import { Company } from '../../shared/types/common.types';

export class CompanyModel extends BaseRepository<Company> {
  constructor() {
    super('companies');
  }

  async create(companyData: Partial<Company>): Promise<Company> {
    const query = `
      INSERT INTO companies (name, currency, address, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const result = await database.query(query, [
      companyData.name,
      companyData.currency,
      companyData.address,
    ]);
    return result.rows[0];
  }

  async update(id: number, companyData: Partial<Company>): Promise<Company | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (companyData.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(companyData.name);
    }
    if (companyData.currency !== undefined) {
      fields.push(`currency = $${idx++}`);
      values.push(companyData.currency);
    }
    if (companyData.address !== undefined) {
      fields.push(`address = $${idx++}`);
      values.push(companyData.address);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE companies
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;
    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async findByName(name: string): Promise<Company | null> {
    const query = 'SELECT * FROM companies WHERE name = $1';
    const result = await database.query(query, [name]);
    return result.rows[0] || null;
  }
}

export const companyModel = new CompanyModel();