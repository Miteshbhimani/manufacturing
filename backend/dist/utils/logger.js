"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = exports.logger = exports.Logger = exports.LogLevel = void 0;
// Log levels
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// Logger class
class Logger {
    static instance;
    logLevel;
    logs = [];
    maxLogSize = 1000;
    constructor() {
        this.logLevel = this.getLogLevelFromEnv();
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    getLogLevelFromEnv() {
        const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
        switch (level) {
            case 'ERROR': return LogLevel.ERROR;
            case 'WARN': return LogLevel.WARN;
            case 'INFO': return LogLevel.INFO;
            case 'DEBUG': return LogLevel.DEBUG;
            default: return LogLevel.INFO;
        }
    }
    shouldLog(level) {
        return level <= this.logLevel;
    }
    createLogEntry(level, message, context) {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            requestId: this.generateRequestId()
        };
    }
    generateRequestId() {
        return Math.random().toString(36).substring(2, 15);
    }
    formatLog(entry) {
        const levelName = LogLevel[entry.level];
        const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
        const metaStr = entry.requestId ? ` | ReqID: ${entry.requestId}` : '';
        return `[${entry.timestamp}] ${levelName}: ${entry.message}${contextStr}${metaStr}`;
    }
    log(entry) {
        if (!this.shouldLog(entry.level))
            return;
        const formattedLog = this.formatLog(entry);
        // Add to in-memory logs
        this.logs.push(entry);
        // Keep only the latest logs
        if (this.logs.length > this.maxLogSize) {
            this.logs = this.logs.slice(-this.maxLogSize);
        }
        // Output to console
        switch (entry.level) {
            case LogLevel.ERROR:
                console.error(formattedLog);
                break;
            case LogLevel.WARN:
                console.warn(formattedLog);
                break;
            case LogLevel.INFO:
                console.info(formattedLog);
                break;
            case LogLevel.DEBUG:
                console.debug(formattedLog);
                break;
        }
        // In production, send to external logging service
        if (process.env.NODE_ENV === 'production') {
            this.sendToExternalService(entry);
        }
    }
    async sendToExternalService(entry) {
        // TODO: Implement external logging service integration
        // Examples: Sentry, LogRocket, DataDog, etc.
        try {
            // await sendToSentry(entry);
            // await sendToLogstash(entry);
        }
        catch (error) {
            console.error('Failed to send log to external service:', error);
        }
    }
    error(message, context) {
        const entry = this.createLogEntry(LogLevel.ERROR, message, context);
        this.log(entry);
    }
    warn(message, context) {
        const entry = this.createLogEntry(LogLevel.WARN, message, context);
        this.log(entry);
    }
    info(message, context) {
        const entry = this.createLogEntry(LogLevel.INFO, message, context);
        this.log(entry);
    }
    debug(message, context) {
        const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
        this.log(entry);
    }
    // Request logging
    logRequest(req, res, startTime) {
        const duration = Date.now() - startTime;
        const entry = {
            timestamp: new Date().toISOString(),
            level: LogLevel.INFO,
            message: `${req.method} ${req.originalUrl}`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration
        };
        this.log(entry);
    }
    // Error logging with context
    logError(error, req, context) {
        const entry = {
            timestamp: new Date().toISOString(),
            level: LogLevel.ERROR,
            message: error.message,
            context: {
                ...context,
                stack: error.stack,
                name: error.name
            },
            ip: req?.ip,
            userAgent: req?.get('User-Agent'),
            method: req?.method,
            url: req?.originalUrl
        };
        this.log(entry);
    }
    // Get recent logs
    getRecentLogs(count = 100) {
        return this.logs.slice(-count);
    }
    // Get logs by level
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }
    // Clear logs
    clearLogs() {
        this.logs = [];
    }
    // Get log statistics
    getLogStats() {
        const stats = {
            total: this.logs.length,
            byLevel: {}
        };
        for (const log of this.logs) {
            const levelName = LogLevel[log.level];
            stats.byLevel[levelName] = (stats.byLevel[levelName] || 0) + 1;
        }
        return stats;
    }
}
exports.Logger = Logger;
// Export singleton instance
exports.logger = Logger.getInstance();
// Middleware for request logging
const requestLoggerMiddleware = (req, res, next) => {
    const startTime = Date.now();
    // Log request start
    exports.logger.info(`Request started: ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        exports.logger.logRequest(req, res, startTime);
        originalEnd.call(this, chunk, encoding);
    };
    next();
};
exports.requestLoggerMiddleware = requestLoggerMiddleware;
