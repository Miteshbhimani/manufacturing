import { LeadModel, LeadActivityModel } from '../models/lead.model';
import { Lead, LeadActivity, CreateLeadRequest, UpdateLeadRequest, LeadActivityRequest } from '../../shared/types/common.types';
import logger, { logError, logAudit } from '../../shared/utils/logger';
import { database } from '../../shared/database/database.service';

export class CRMService {
  private leadModel: LeadModel;
  private activityModel: LeadActivityModel;

  constructor() {
    this.leadModel = new LeadModel();
    this.activityModel = new LeadActivityModel();
  }

  // Lead Management
  async createLead(leadData: CreateLeadRequest, userId: number): Promise<Lead> {
    try {
      const lead = await this.leadModel.create({
        ...leadData,
        createdBy: userId
      });

      // Log the lead creation
      logAudit(lead.id, 'lead_created', {
        email: lead.email,
        firstName: lead.first_name,
        lastName: lead.last_name,
        company: lead.company,
        assignedTo: lead.assigned_to
      });

      // Create initial activity
      await this.activityModel.create({
        leadId: lead.id,
        type: 'note',
        subject: 'Lead Created',
        description: `New lead "${lead.company || lead.email}" was created`,
        createdBy: userId
      });

      logger.info('Lead created successfully', { leadId: lead.id, company: lead.company });
      return lead;
    } catch (error) {
      logError(error as Error, { context: 'CRMService.createLead', leadData });
      throw error;
    }
  }

  async updateLead(id: number, leadData: UpdateLeadRequest, userId: number): Promise<Lead | null> {
    try {
      const existingLead = await this.leadModel.findById(id);
      if (!existingLead) {
        throw new Error('Lead not found');
      }

      const updatedLead = await this.leadModel.update(id, leadData);
      
      if (updatedLead) {
        // Log the update
        logAudit(id, 'lead_updated', {
          changes: leadData,
          updatedBy: userId
        });

        // Create activity for status change
        if (leadData.status && leadData.status !== existingLead.status) {
          await this.activityModel.create({
            leadId: id,
            type: 'note',
            subject: 'Status Changed',
            description: `Status changed from "${existingLead.status}" to "${leadData.status}"`,
            createdBy: userId
          });
        }

        logger.info('Lead updated successfully', { leadId: id, changes: Object.keys(leadData) });
      }

      return updatedLead;
    } catch (error) {
      logError(error as Error, { context: 'CRMService.updateLead', leadId: id });
      throw error;
    }
  }

  async getLead(id: number): Promise<Lead | null> {
    try {
      return await this.leadModel.findById(id);
    } catch (error) {
      logError(error as Error, { context: 'CRMService.getLead', leadId: id });
      throw error;
    }
  }

  async getAllLeads(limit: number = 50, offset: number = 0): Promise<Lead[]> {
    try {
      const query = `
        SELECT l.*, u.first_name, u.last_name, u.email as assigned_user_email
        FROM leads l
        LEFT JOIN users u ON l.assigned_to = u.id
        ORDER BY l.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await database.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      logError(error as Error, { context: 'CRMService.getAllLeads' });
      throw error;
    }
  }

  async deleteLead(id: number, userId: number): Promise<boolean> {
    try {
      const lead = await this.leadModel.findById(id);
      if (!lead) {
        throw new Error('Lead not found');
      }

      // Soft delete by updating status
      const result = await this.leadModel.update(id, { status: 'archived' });
      
      if (result) {
        logAudit(id, 'lead_deleted', {
          company: lead.company,
          deletedBy: userId
        });

        // Create activity
        await this.activityModel.create({
          leadId: id,
          type: 'note',
          subject: 'Lead Deleted',
          description: `Lead "${lead.company || lead.email}" was deleted`,
          createdBy: userId
        });

        logger.info('Lead deleted successfully', { leadId: id, company: lead.company });
        return true;
      }

      return false;
    } catch (error) {
      logError(error as Error, { context: 'CRMService.deleteLead', leadId: id });
      throw error;
    }
  }

  // Lead Filtering and Search
  async getLeadsByStatus(status: string): Promise<Lead[]> {
    try {
      return await this.leadModel.findByStatus(status);
    } catch (error) {
      logError(error as Error, { context: 'CRMService.getLeadsByStatus', status });
      throw error;
    }
  }

  async getLeadsByAssignedUser(userId: number): Promise<Lead[]> {
    try {
      return await this.leadModel.findByAssignedUser(userId);
    } catch (error) {
      logError(error as Error, { context: 'CRMService.getLeadsByAssignedUser', userId });
      throw error;
    }
  }

  
  async searchLeads(searchTerm: string): Promise<Lead[]> {
    try {
      return await this.leadModel.search(searchTerm);
    } catch (error) {
      logError(error as Error, { context: 'CRMService.searchLeads', searchTerm });
      throw error;
    }
  }

  // Lead Activities
  async createLeadActivity(activityData: LeadActivityRequest, userId: number): Promise<LeadActivity> {
    try {
      const activity = await this.activityModel.create({
        ...activityData,
        createdBy: userId
      });

      logAudit(activity.lead_id, 'lead_activity_created', {
        activityType: activity.type,
        subject: activity.subject,
        createdBy: userId
      });

      logger.info('Lead activity created', { 
        activityId: activity.id, 
        leadId: activity.lead_id,
        type: activity.type 
      });

      return activity;
    } catch (error) {
      logError(error as Error, { context: 'CRMService.createLeadActivity', activityData });
      throw error;
    }
  }

  async getLeadActivities(leadId: number): Promise<LeadActivity[]> {
    try {
      return await this.activityModel.findByLeadId(leadId);
    } catch (error) {
      logError(error as Error, { context: 'CRMService.getLeadActivities', leadId });
      throw error;
    }
  }

  async getUpcomingActivities(days: number = 7): Promise<LeadActivity[]> {
    try {
      return await this.activityModel.getUpcomingActivities(days);
    } catch (error) {
      logError(error as Error, { context: 'CRMService.getUpcomingActivities', days });
      throw error;
    }
  }

  // Dashboard and Statistics
  async getCRMStats(): Promise<{
    totalLeads: number;
    leadsByStatus: Record<string, number>;
    leadsBySource: Record<string, number>;
    upcomingActivities: number;
    recentActivities: LeadActivity[];
  }> {
    try {
      const stats = await this.leadModel.getStats();
      const upcomingActivities = await this.getUpcomingActivities();
      
      // Get recent activities
      const recentActivitiesQuery = `
        SELECT la.*, l.company, l.first_name, l.last_name
        FROM lead_activities la
        JOIN leads l ON la.lead_id = l.id
        ORDER BY la.created_at DESC
        LIMIT 10
      `;
      const recentActivityResult = await database.query(recentActivitiesQuery);
      const recentActivities = recentActivityResult.rows;

      return {
        totalLeads: stats.total,
        leadsByStatus: stats.byStatus,
        leadsBySource: stats.bySource,
        upcomingActivities: upcomingActivities.length,
        recentActivities
      };
    } catch (error) {
      logError(error as Error, { context: 'CRMService.getCRMStats' });
      throw error;
    }
  }

  // Lead Assignment
  async assignLead(leadId: number, assignedUserId: number, currentUserId: number): Promise<Lead | null> {
    try {
      const lead = await this.leadModel.findById(leadId);
      if (!lead) {
        throw new Error('Lead not found');
      }

      const updatedLead = await this.leadModel.update(leadId, { 
        assignedTo: assignedUserId 
      });

      if (updatedLead) {
        logAudit(leadId, 'lead_assigned', {
          assignedTo: assignedUserId,
          assignedBy: currentUserId,
          previousAssignment: lead.assigned_to
        });

        // Create activity
        await this.activityModel.create({
          leadId,
          type: 'note',
          subject: 'Lead Assigned',
          description: `Lead was assigned to user ${assignedUserId}`,
          createdBy: currentUserId
        });

        logger.info('Lead assigned successfully', { 
          leadId, 
          assignedTo: assignedUserId,
          assignedBy: currentUserId 
        });
      }

      return updatedLead;
    } catch (error) {
      logError(error as Error, { context: 'CRMService.assignLead', leadId, assignedUserId });
      throw error;
    }
  }
}

export const crmService = new CRMService();
