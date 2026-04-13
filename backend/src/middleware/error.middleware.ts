import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/express.types';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  
  // Log error with structured logger
  logger.logError(error, req, {
    statusCode,
    isOperational: error.isOperational,
    isDevelopment
  });

  // Don't leak error details in production
  if (!isDevelopment && statusCode === 500) {
    message = 'Internal Server Error';
  }

  const response: ApiResponse = {
    success: false,
    error: message
  };

  // Add error details in development
  if (isDevelopment) {
    response.data = {
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    };
  }

  // Add request ID for tracking
  if (req.headers['x-request-id']) {
    response.data = {
      ...response.data,
      requestId: req.headers['x-request-id']
    };
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: `Route ${req.originalUrl} not found`
  };
  
  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
