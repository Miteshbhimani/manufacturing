// CRM Types matching the backend schema
export interface Lead {
  id: number;
  uuid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  title?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'archived';
  source?: string;
  source_details?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assigned_to?: number;
  created_by: number;
  converted_at?: string;
  lost_at?: string;
  lost_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: number;
  lead_id: number;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject?: string;
  description?: string;
  duration_minutes?: number;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduled_at?: string;
  completed_at?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  status?: Lead['status'];
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
}

export interface UpdateLeadRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  status?: Lead['status'];
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
}

export interface LeadActivityRequest {
  leadId: number;
  type: LeadActivity['type'];
  subject?: string;
  description?: string;
  durationMinutes?: number;
  location?: string;
  status?: LeadActivity['status'];
  scheduledAt?: string;
  createdBy?: number;
}

export interface CRMStats {
  totalLeads: number;
  leadsByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
  upcomingActivities: number;
  recentActivities: LeadActivity[];
}

export interface CRMDashboard {
  stats: CRMStats;
  myLeads: Lead[];
  upcomingActivities: LeadActivity[];
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'member' | 'sales' | 'crm';
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}
