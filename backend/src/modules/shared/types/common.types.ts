// Common type definitions used across all modules

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DatabaseConnection {
  query: (text: string, params?: any[]) => Promise<any>;
  getClient: () => Promise<any>;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  variables: Record<string, any>;
  category: string;
  isActive: boolean;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'member' | 'sales' | 'crm';
  is_active: boolean;
  email_verified: boolean;
  company_id: number;
  email_verification_token?: string;
  email_verification_expires?: Date;
  password_reset_token?: string;
  password_reset_expires?: Date;
  login_attempts: number;
  locked_until?: Date;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

// CRM Types
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
  converted_at?: Date;
  lost_at?: Date;
  lost_reason?: string;
  created_at: Date;
  updated_at: Date;
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
  scheduled_at?: Date;
  completed_at?: Date;
  created_by: number;
  created_at: Date;
  updated_at: Date;
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
  scheduledAt?: Date;
  createdBy?: number;
}

export interface UserProfile {
  id: number;
  userId: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: number;
  uuid: string;
  name: string;
  legalName?: string;
  taxId?: string;
  currency?: string;
  fiscalYearStart?: Date;
  fiscalYearEnd?: Date;
  parentCompanyId?: number;
  isActive: boolean;
  settings?: Record<string, any>;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Opportunity {
  id: number;
  uuid: string;
  leadId?: number;
  name: string;
  description?: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value?: number;
  currency?: string;
  probability: number;
  expectedClosingDate?: Date;
  actualClosingDate?: Date;
  assignedTo?: number;
  createdBy: number;
  wonReason?: string;
  lostReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: number;
  uuid: string;
  opportunityId?: number;
  quoteNumber: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil?: Date;
  termsConditions?: string;
  notes?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  createdBy: number;
  acceptedBy?: number;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  id: number;
  quoteId: number;
  productId?: number;
  productSku?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  lineTotal: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  cost?: number;
  weight?: number;
  dimensions?: string;
  images?: string[];
  specifications?: Record<string, any>;
  features?: string[];
  technicalSpecs?: Record<string, any>;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  minStockLevel: number;
  reorderPoint: number;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadActivitySchedule {
  id: number;
  leadId: number;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject?: string;
  description?: string;
  durationMinutes?: number;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  completedAt?: Date;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: number;
  userId?: number;
  action: string;
  tableName?: string;
  recordId?: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  category?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response DTOs
export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'member' | 'sales' | 'crm';
  companyId?: number;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'member' | 'sales' | 'crm';
  isActive?: boolean;
  companyId?: number;
  password?: string;
}

export interface CreateLeadDto {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  sourceDetails?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
}

export interface UpdateLeadDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  title?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'archived';
  source?: string;
  sourceDetails?: string;
  budget?: number;
  currency?: string;
  requirements?: string;
  notes?: string;
  assignedTo?: number;
  lostReason?: string;
}

export interface CreateOpportunityDto {
  leadId?: number;
  name: string;
  description?: string;
  value?: number;
  currency?: string;
  expectedClosingDate?: Date;
  assignedTo?: number;
}

export interface UpdateOpportunityDto {
  name?: string;
  description?: string;
  stage?: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value?: number;
  currency?: string;
  probability?: number;
  expectedClosingDate?: Date;
  actualClosingDate?: Date;
  assignedTo?: number;
  wonReason?: string;
  lostReason?: string;
}

export interface CreateQuoteDto {
  opportunityId?: number;
  validUntil?: Date;
  termsConditions?: string;
  notes?: string;
  taxRate?: number;
  discountAmount?: number;
  items: CreateQuoteItemDto[];
}

export interface CreateQuoteItemDto {
  productId?: number;
  productSku?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
}

export interface UpdateQuoteDto {
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil?: Date;
  termsConditions?: string;
  notes?: string;
  taxRate?: number;
  discountAmount?: number;
  rejectionReason?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  cost?: number;
  weight?: number;
  dimensions?: string;
  images?: string[];
  specifications?: Record<string, any>;
  features?: string[];
  technicalSpecs?: Record<string, any>;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  minStockLevel?: number;
  reorderPoint?: number;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  cost?: number;
  weight?: number;
  dimensions?: string;
  images?: string[];
  specifications?: Record<string, any>;
  features?: string[];
  technicalSpecs?: Record<string, any>;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  minStockLevel?: number;
  reorderPoint?: number;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface CreateLeadActivityDto {
  leadId: number;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject?: string;
  description?: string;
  durationMinutes?: number;
  location?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: Date;
}

export interface UpdateLeadActivityDto {
  type?: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject?: string;
  description?: string;
  durationMinutes?: number;
  location?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  completedAt?: Date;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: ValidationError[];
}

// Search and filter types
export interface SearchQuery {
  q?: string;
  status?: string;
  category?: string;
  assignedTo?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FilterOptions {
  status?: string[];
  category?: string[];
  assignedTo?: number[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Dashboard types
export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  totalOpportunities: number;
  openOpportunities: number;
  wonOpportunities: number;
  totalQuotes: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  totalValue: number;
  pipelineValue: number;
  conversionRate: number;
}

export interface RecentActivity {
  id: number;
  type: 'lead' | 'opportunity' | 'quote' | 'activity';
  action: string;
  description: string;
  user: string;
  timestamp: Date;
}

// Export type guards
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidRole = (role: string): role is User['role'] => {
  return ['admin', 'member', 'sales', 'crm'].includes(role);
};

export const isValidLeadStatus = (status: string): status is Lead['status'] => {
  return ['new', 'contacted', 'qualified', 'converted', 'lost', 'archived'].includes(status);
};

export const isValidOpportunityStage = (stage: string): stage is Opportunity['stage'] => {
  return ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].includes(stage);
};

export const isValidQuoteStatus = (status: string): status is Quote['status'] => {
  return ['draft', 'sent', 'accepted', 'rejected', 'expired'].includes(status);
};
