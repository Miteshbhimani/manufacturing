export interface Company {
  id: number;
  name: string;
  currency: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  company_id?: number;
  login_attempts: number;
  locked_until?: Date;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: number;
  user_id: number;
  phone?: string;
  company?: string;
  jobTitle?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  linkedin?: string;
  avatarUrl?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Lead {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  company?: string;
  title?: string;
  source: string;
  status: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assigned_to?: number;
  created_by?: number;
  company_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface LeadActivity {
  id: number;
  lead_id: number;
  type: string;
  subject: string;
  description?: string;
  duration_minutes?: number;
  location?: string;
  status: string;
  scheduled_at?: Date;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLeadRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  title?: string;
  source: string;
  status?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
  createdBy?: number;
}

export interface UpdateLeadRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  status?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
}

export interface LeadActivityRequest {
  leadId: number;
  type: string;
  subject: string;
  description?: string;
  durationMinutes?: number;
  location?: string;
  status?: string;
  scheduledAt?: Date;
  createdBy: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  companyId?: number;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  companyId?: number;
}