import { BaseRepository } from '../../shared/database/database.service';
import { Lead, LeadActivity, CreateLeadRequest, UpdateLeadRequest, LeadActivityRequest } from '../../shared/types/common.types';
import { database } from '../../shared/database/database.service';

export class LeadModel extends BaseRepository<Lead> {
  constructor() {
    super('leads');
  }

  async create(leadData: CreateLeadRequest): Promise<Lead> {
    const query = `
      INSERT INTO leads (
        uuid, email, first_name, last_name, phone, 
        company, title, source, status, budget, currency,
        requirements, notes, assigned_to, created_by
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING *
    `;
    
    const result = await database.query(query, [
      leadData.email,
      leadData.firstName,
      leadData.lastName,
      leadData.phone,
      leadData.company,
      leadData.title,
      leadData.source,
      leadData.status || 'new',
      leadData.budget,
      leadData.currency || 'USD',
      leadData.requirements,
      leadData.notes,
      leadData.assignedTo,
      leadData.createdBy
    ]);
    
    return result.rows[0];
  }

  async update(id: number, leadData: UpdateLeadRequest): Promise<Lead | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (leadData.firstName !== undefined) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(leadData.firstName);
    }
    if (leadData.lastName !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(leadData.lastName);
    }
    if (leadData.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(leadData.email);
    }
    if (leadData.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(leadData.phone);
    }
    if (leadData.company !== undefined) {
      fields.push(`company = $${paramIndex++}`);
      values.push(leadData.company);
    }
    if (leadData.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(leadData.title);
    }
    if (leadData.source !== undefined) {
      fields.push(`source = $${paramIndex++}`);
      values.push(leadData.source);
    }
    if (leadData.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(leadData.status);
    }
    if (leadData.budget !== undefined) {
      fields.push(`budget = $${paramIndex++}`);
      values.push(leadData.budget);
    }
    if (leadData.currency !== undefined) {
      fields.push(`currency = $${paramIndex++}`);
      values.push(leadData.currency);
    }
    if (leadData.requirements !== undefined) {
      fields.push(`requirements = $${paramIndex++}`);
      values.push(leadData.requirements);
    }
    if (leadData.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      values.push(leadData.notes);
    }
    if (leadData.assignedTo !== undefined) {
      fields.push(`assigned_to = $${paramIndex++}`);
      values.push(leadData.assignedTo);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE leads 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async findByStatus(status: string): Promise<Lead[]> {
    const query = 'SELECT * FROM leads WHERE status = $1 ORDER BY created_at DESC';
    const result = await database.query(query, [status]);
    return result.rows;
  }

  async findByAssignedUser(userId: number): Promise<Lead[]> {
    const query = 'SELECT * FROM leads WHERE assigned_to = $1 ORDER BY created_at DESC';
    const result = await database.query(query, [userId]);
    return result.rows;
  }

  async search(searchTerm: string): Promise<Lead[]> {
    const query = `
      SELECT * FROM leads 
      WHERE company ILIKE $1 
         OR first_name ILIKE $1 
         OR last_name ILIKE $1 
         OR email ILIKE $1
      ORDER BY created_at DESC
    `;
    const result = await database.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
  }> {
    const totalQuery = 'SELECT COUNT(*) as count FROM leads';
    const totalResult = await database.query(totalQuery);
    const total = parseInt(totalResult.rows[0].count);

    const statusQuery = `
      SELECT status, COUNT(*) as count 
      FROM leads 
      GROUP BY status
    `;
    const statusResult = await database.query(statusQuery);
    const byStatus = statusResult.rows.reduce((acc: Record<string, number>, row: any) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {});

    const sourceQuery = `
      SELECT source, COUNT(*) as count 
      FROM leads 
      GROUP BY source
    `;
    const sourceResult = await database.query(sourceQuery);
    const bySource = sourceResult.rows.reduce((acc: Record<string, number>, row: any) => {
      acc[row.source] = parseInt(row.count);
      return acc;
    }, {});

    return {
      total,
      byStatus,
      bySource
    };
  }
}

export class LeadActivityModel extends BaseRepository<LeadActivity> {
  constructor() {
    super('lead_activities');
  }

  async create(activityData: LeadActivityRequest): Promise<LeadActivity> {
    const query = `
      INSERT INTO lead_activities (
        lead_id, type, subject, description, duration_minutes,
        location, status, scheduled_at, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
      RETURNING *
    `;
    
    const result = await database.query(query, [
      activityData.leadId,
      activityData.type,
      activityData.subject,
      activityData.description,
      activityData.durationMinutes,
      activityData.location,
      activityData.status || 'scheduled',
      activityData.scheduledAt,
      activityData.createdBy
    ]);
    
    return result.rows[0];
  }

  async findByLeadId(leadId: number): Promise<LeadActivity[]> {
    const query = 'SELECT * FROM lead_activities WHERE lead_id = $1 ORDER BY created_at DESC';
    const result = await database.query(query, [leadId]);
    return result.rows;
  }

  async findByActivityType(activityType: string): Promise<LeadActivity[]> {
    const query = 'SELECT * FROM lead_activities WHERE type = $1 ORDER BY created_at DESC';
    const result = await database.query(query, [activityType]);
    return result.rows;
  }

  async findByCreatedBy(userId: number): Promise<LeadActivity[]> {
    const query = 'SELECT * FROM lead_activities WHERE created_by = $1 ORDER BY created_at DESC';
    const result = await database.query(query, [userId]);
    return result.rows;
  }

  async getUpcomingActivities(days: number = 7): Promise<LeadActivity[]> {
    const query = `
      SELECT la.*, l.company, l.first_name, l.last_name 
      FROM lead_activities la
      JOIN leads l ON la.lead_id = l.id
      WHERE la.scheduled_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
      AND la.status = 'scheduled'
      ORDER BY la.scheduled_at ASC
    `;
    const result = await database.query(query);
    return result.rows;
  }
}

export const leadModel = new LeadModel();
export const leadActivityModel = new LeadActivityModel();
