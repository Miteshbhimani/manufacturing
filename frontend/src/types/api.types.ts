// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  industry: string;
  heroImage: string;
  has3D: boolean;
  price: number | null;
  specs: string[];
}

export interface LeadData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  isRegistering?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
  requiresVerification?: boolean;
  message?: string;
}

export interface OdooSession {
  uid: number;
  session_id: string;
  username: string;
  context: Record<string, any>;
}

export interface DynamicPage {
  success: boolean;
  content?: string;
  title?: string;
  error?: any;
}
