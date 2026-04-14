"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.CustomError = void 0;
const logger_1 = require("../utils/logger");
class CustomError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const errorHandler = (error, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    // Log error with structured logger
    logger_1.logger.logError(error, req, {
        statusCode,
        isOperational: error.isOperational,
        isDevelopment
    });
    // Don't leak error details in production
    if (!isDevelopment && statusCode === 500) {
        message = 'Internal Server Error';
    }
    const response = {
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
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        error: `Route ${req.originalUrl} not found`
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
