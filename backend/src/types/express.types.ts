import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateUserRequest {
  login: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  isRegistering?: boolean;
}

export interface LeadRequest {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  message: string;
  userId?: number;
}

export interface OdooProduct {
  id: number;
  name: string;
  description_sale?: string;
  description?: string;
  list_price?: number;
  categ_id?: [number, string] | string;
  image_1920?: string;
  has3D?: boolean;
}

export interface ProcessedProduct extends Omit<OdooProduct, 'image_1920'> {
  image_1920: string | null;
}
