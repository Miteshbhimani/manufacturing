import { api } from './api';
import { 
  Lead, 
  LeadActivity, 
  CreateLeadRequest, 
  UpdateLeadRequest, 
  LeadActivityRequest, 
  CRMDashboard 
} from '../types/crm.types';

class CRMService {
  // Lead Management
  async getLeads(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    assignedTo?: string;
    search?: string;
  }): Promise<{ data: Lead[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/api/crm/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    return response.data;
  }

  async getLead(id: number): Promise<Lead> {
    const response = await api.get(`/api/crm/leads/${id}`);
    return response.data.data;
  }

  async createLead(leadData: CreateLeadRequest): Promise<Lead> {
    const response = await api.post('/api/crm/leads', leadData);
    return response.data.data;
  }

  async updateLead(id: number, leadData: UpdateLeadRequest): Promise<Lead> {
    const response = await api.put(`/api/crm/leads/${id}`, leadData);
    return response.data.data;
  }

  async deleteLead(id: number): Promise<void> {
    await api.delete(`/api/crm/leads/${id}`);
  }

  async assignLead(id: number, assignedTo: number): Promise<Lead> {
    const response = await api.post(`/api/crm/leads/${id}/assign`, { assignedTo });
    return response.data.data;
  }

  // Lead Activities
  async getLeadActivities(leadId: number): Promise<LeadActivity[]> {
    const response = await api.get(`/api/crm/leads/${leadId}/activities`);
    return response.data.data;
  }

  async createLeadActivity(activityData: LeadActivityRequest): Promise<LeadActivity> {
    const response = await api.post('/api/crm/activities', activityData);
    return response.data.data;
  }

  async getUpcomingActivities(days: number = 7): Promise<LeadActivity[]> {
    const response = await api.get(`/api/crm/activities/upcoming?days=${days}`);
    return response.data.data;
  }

  // Dashboard and Statistics
  async getCRMStats(): Promise<CRMDashboard['stats']> {
    const response = await api.get('/api/crm/stats');
    return response.data.data;
  }

  async getCRMDashboard(): Promise<CRMDashboard> {
    const response = await api.get('/api/crm/dashboard');
    return response.data.data;
  }
}

export const crmService = new CRMService();
