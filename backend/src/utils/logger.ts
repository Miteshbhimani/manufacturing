import { Request, Response } from 'express';

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
}

// Logger class
export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogSize: number = 1000;

  private constructor() {
    this.logLevel = this.getLogLevelFromEnv();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    switch (level) {
      case 'ERROR': return LogLevel.ERROR;
      case 'WARN': return LogLevel.WARN;
      case 'INFO': return LogLevel.INFO;
      case 'DEBUG': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: this.generateRequestId()
    };
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private formatLog(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
    const metaStr = entry.requestId ? ` | ReqID: ${entry.requestId}` : '';
    
    return `[${entry.timestamp}] ${levelName}: ${entry.message}${contextStr}${metaStr}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

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

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // TODO: Implement external logging service integration
    // Examples: Sentry, LogRocket, DataDog, etc.
    try {
      // await sendToSentry(entry);
      // await sendToLogstash(entry);
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  public error(message: string, context?: any): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context);
    this.log(entry);
  }

  public warn(message: string, context?: any): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.log(entry);
  }

  public info(message: string, context?: any): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.log(entry);
  }

  public debug(message: string, context?: any): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.log(entry);
  }

  // Request logging
  public logRequest(req: Request, res: Response, startTime: number): void {
    const duration = Date.now() - startTime;
    const entry: LogEntry = {
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
  public logError(error: Error, req?: Request, context?: any): void {
    const entry: LogEntry = {
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
  public getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Get logs by level
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Clear logs
  public clearLogs(): void {
    this.logs = [];
  }

  // Get log statistics
  public getLogStats(): { total: number; byLevel: Record<string, number> } {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>
    };

    for (const log of this.logs) {
      const levelName = LogLevel[log.level];
      stats.byLevel[levelName] = (stats.byLevel[levelName] || 0) + 1;
    }

    return stats;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Middleware for request logging
export const requestLoggerMiddleware = (req: Request, res: Response, next: any) => {
  const startTime = Date.now();
  
  // Log request start
  logger.info(`Request started: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(this: any, chunk?: any, encoding?: any, cb?: any) {
    logger.logRequest(req, res, startTime);
    originalEnd.call(this, chunk, encoding, cb);
    return res;
  } as any;

  next();
};
