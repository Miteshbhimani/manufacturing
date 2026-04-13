import { Request, Response } from 'express';
import { crmService } from '../services/crm.service';
import { CreateLeadRequest, UpdateLeadRequest, LeadActivityRequest } from '../../shared/types/common.types';
import logger, { logError } from '../../shared/utils/logger';

export class CRMController {
  // Lead Management
  async createLead(req: Request, res: Response): Promise<void> {
    try {
      const leadData: CreateLeadRequest = req.body;
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
        return;
      }

      const lead = await crmService.createLead(leadData, userId);
      
      res.status(201).json({
        success: true,
        data: lead,
        message: 'Lead created successfully'
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.createLead', body: req.body });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create lead'
      });
    }
  }

  async getLeads(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const status = req.query.status as string;
      const assignedTo = req.query.assignedTo as string;
      const search = req.query.search as string;

      let leads;

      if (status) {
        leads = await crmService.getLeadsByStatus(status);
      } else if (assignedTo) {
        leads = await crmService.getLeadsByAssignedUser(parseInt(assignedTo));
      } else if (search) {
        leads = await crmService.searchLeads(search);
      } else {
        leads = await crmService.getAllLeads(limit, offset);
      }

      res.json({
        success: true,
        data: leads,
        total: leads.length
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.getLeads' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leads'
      });
    }
  }

  async getLead(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid lead ID'
        });
        return;
      }

      const lead = await crmService.getLead(id);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          error: 'Lead not found'
        });
        return;
      }

      res.json({
        success: true,
        data: lead
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.getLead', leadId: req.params.id });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lead'
      });
    }
  }

  async updateLead(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const updateData: UpdateLeadRequest = req.body;
      const userId = (req as any).user?.userId;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid lead ID'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
        return;
      }

      const lead = await crmService.updateLead(id, updateData, userId);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          error: 'Lead not found'
        });
        return;
      }

      res.json({
        success: true,
        data: lead,
        message: 'Lead updated successfully'
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.updateLead', leadId: req.params.id });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update lead'
      });
    }
  }

  async deleteLead(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const userId = (req as any).user?.userId;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid lead ID'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
        return;
      }

      const success = await crmService.deleteLead(id, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Lead not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.deleteLead', leadId: req.params.id });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete lead'
      });
    }
  }

  async assignLead(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      const { assignedTo } = req.body;
      const currentUserId = (req as any).user?.userId;

      if (isNaN(id) || !assignedTo) {
        res.status(400).json({
          success: false,
          error: 'Invalid lead ID or assigned user ID'
        });
        return;
      }

      if (!currentUserId) {
        res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
        return;
      }

      const lead = await crmService.assignLead(id, assignedTo, currentUserId);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          error: 'Lead not found'
        });
        return;
      }

      res.json({
        success: true,
        data: lead,
        message: 'Lead assigned successfully'
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.assignLead', leadId: req.params.id });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign lead'
      });
    }
  }

  // Lead Activities
  async createLeadActivity(req: Request, res: Response): Promise<void> {
    try {
      const activityData: LeadActivityRequest = req.body;
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
        return;
      }

      const activity = await crmService.createLeadActivity(activityData, userId);
      
      res.status(201).json({
        success: true,
        data: activity,
        message: 'Activity created successfully'
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.createLeadActivity' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create activity'
      });
    }
  }

  async getLeadActivities(req: Request, res: Response): Promise<void> {
    try {
      const leadId = parseInt(req.params.leadId as string);
      
      if (isNaN(leadId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid lead ID'
        });
        return;
      }

      const activities = await crmService.getLeadActivities(leadId);
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.getLeadActivities', leadId: req.params.leadId });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch activities'
      });
    }
  }

  async getUpcomingActivities(req: Request, res: Response): Promise<void> {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const activities = await crmService.getUpcomingActivities(days);
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.getUpcomingActivities' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch upcoming activities'
      });
    }
  }

  // Dashboard and Statistics
  async getCRMStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await crmService.getCRMStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.getCRMStats' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch CRM statistics'
      });
    }
  }

  async getCRMDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
        return;
      }

      const stats = await crmService.getCRMStats();
      const myLeads = await crmService.getLeadsByAssignedUser(userId);
      const upcomingActivities = await crmService.getUpcomingActivities(7);

      res.json({
        success: true,
        data: {
          stats,
          myLeads: myLeads.slice(0, 5), // Recent 5 leads
          upcomingActivities: upcomingActivities.slice(0, 10) // Recent 10 activities
        }
      });
    } catch (error) {
      logError(error as Error, { context: 'CRMController.getCRMDashboard' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch CRM dashboard'
      });
    }
  }
}

export const crmController = new CRMController();
