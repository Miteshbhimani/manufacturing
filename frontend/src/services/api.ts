import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API methods
export const apiClient = {
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.get(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.post(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.put(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.patch(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.delete(url, config);
  },
};

export { api };
export default api;
