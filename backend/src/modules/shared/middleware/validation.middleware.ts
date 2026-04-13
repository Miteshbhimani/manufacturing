import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiResponse } from '../types/common.types';

/**
 * Middleware to validate request using express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    } as ApiResponse);
    return;
  }

  next();
};

/**
 * Middleware to validate request using express-validator (async version)
 */
export const validateRequestAsync = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorMessages
    } as ApiResponse);
    return;
  }

  next();
};

/**
 * Custom validation for UUID
 */
export const isValidUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Custom validation for email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Custom validation for strong password
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Custom validation for phone number
 */
export const isValidPhone = (phone: string): boolean => {
  // Basic phone validation - adjust based on your requirements
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Custom validation for decimal numbers
 */
export const isValidDecimal = (value: string, decimals: number = 2): boolean => {
  const decimalRegex = new RegExp(`^-?\\d+(\\.\\d{1,${decimals}})?$`);
  return decimalRegex.test(value);
};

/**
 * Custom validation for positive numbers
 */
export const isPositiveNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Custom validation for non-negative numbers
 */
export const isNonNegativeNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Custom validation for date range
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  
  return start <= end;
};

/**
 * Custom validation for future date
 */
export const isFutureDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const now = new Date();
  
  if (isNaN(inputDate.getTime())) {
    return false;
  }
  
  return inputDate > now;
};

/**
 * Custom validation for past date
 */
export const isPastDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const now = new Date();
  
  if (isNaN(inputDate.getTime())) {
    return false;
  }
  
  return inputDate < now;
};

/**
 * Custom validation for enum values
 */
export const isValidEnum = (value: string, allowedValues: string[]): boolean => {
  return allowedValues.includes(value);
};

/**
 * Custom validation for array of enums
 */
export const isValidEnumArray = (values: any[], allowedValues: string[]): boolean => {
  if (!Array.isArray(values)) {
    return false;
  }
  
  return values.every(value => allowedValues.includes(value));
};

/**
 * Custom validation for JSON objects
 */
export const isValidJSON = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Custom validation for URLs
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Custom validation for alphanumeric strings
 */
export const isAlphanumeric = (value: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(value);
};

/**
 * Custom validation for slug strings
 */
export const isValidSlug = (value: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(value);
};

/**
 * Custom validation for currency codes
 */
export const isValidCurrencyCode = (value: string): boolean => {
  const currencyRegex = /^[A-Z]{3}$/;
  return currencyRegex.test(value);
};

/**
 * Custom validation for tax IDs (basic format)
 */
export const isValidTaxId = (value: string): boolean => {
  // Basic validation - adjust based on your country's requirements
  const taxIdRegex = /^[A-Z0-9]{8,20}$/;
  return taxIdRegex.test(value);
};

/**
 * Custom validation for percentage values
 */
export const isValidPercentage = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 0 && num <= 100;
};

/**
 * Custom validation for file size (in bytes)
 */
export const isValidFileSize = (size: number, maxSize: number): boolean => {
  return size > 0 && size <= maxSize;
};

/**
 * Custom validation for file types
 */
export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

/**
 * Sanitization helper for XSS prevention
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Basic XSS prevention - replace common dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Middleware to sanitize request body
 */
export const sanitizeRequestBody = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  next();
};

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        obj[key] = sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitizeObject(value);
      }
    }
  }
}

/**
 * Rate limiting validation helper
 */
export const checkRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
  // This would typically use Redis or an in-memory store
  // For now, return true (no rate limiting)
  // Implement with Redis or similar for production
  return true;
};

/**
 * Request size validation
 */
export const validateRequestSize = (maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      res.status(413).json({
        success: false,
        error: 'Request entity too large'
      } as ApiResponse);
      return;
    }
    
    next();
  };
};

/**
 * CORS validation
 */
export const validateOrigin = (allowedOrigins: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      res.status(403).json({
        success: false,
        error: 'Origin not allowed'
      } as ApiResponse);
      return;
    }
    
    next();
  };
};
