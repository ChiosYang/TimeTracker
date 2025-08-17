/**
 * 统一日志服务
 * 支持不同环境下的日志级别控制和格式化输出
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  [key: string]: unknown;
  timestamp?: string;
  userId?: string;
  requestId?: string;
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel;

  private constructor() {
    // 生产环境只记录警告和错误
    this.minLevel = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    
    return `[${timestamp}] ${levelName}: ${message}${contextStr}`;
  }

  private getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  public debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const consoleMethod = this.getConsoleMethod(LogLevel.DEBUG);
      consoleMethod(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  public info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const consoleMethod = this.getConsoleMethod(LogLevel.INFO);
      consoleMethod(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const consoleMethod = this.getConsoleMethod(LogLevel.WARN);
      consoleMethod(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  public error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const consoleMethod = this.getConsoleMethod(LogLevel.ERROR);
      const errorContext = {
        ...context,
        ...(error instanceof Error && {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack,
        }),
        ...(error && typeof error === 'object' && error !== null ? {
          errorDetails: error,
        } : {}),
      };
      
      consoleMethod(this.formatMessage(LogLevel.ERROR, message, errorContext));
    }
  }

  // 便捷方法：记录API请求
  public apiRequest(method: string, url: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${url}`, context);
  }

  // 便捷方法：记录API响应
  public apiResponse(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
    const message = `API Response: ${method} ${url} - ${status}`;
    const responseContext = {
      ...context,
      ...(duration && { duration: `${duration}ms` }),
    };

    if (status >= 400) {
      this.error(message, undefined, responseContext);
    } else {
      this.info(message, responseContext);
    }
  }

  // 便捷方法：记录数据库操作
  public dbOperation(operation: string, table?: string, context?: LogContext): void {
    this.debug(`DB Operation: ${operation}${table ? ` on ${table}` : ''}`, context);
  }

  // 便捷方法：记录用户操作
  public userAction(action: string, userId?: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, { ...context, userId });
  }
}

// 导出单例实例
export const logger = Logger.getInstance();

// 导出便捷函数
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) => logger.error(message, error, context),
  
  // 专用日志方法
  api: {
    request: (method: string, url: string, context?: LogContext) => logger.apiRequest(method, url, context),
    response: (method: string, url: string, status: number, duration?: number, context?: LogContext) => 
      logger.apiResponse(method, url, status, duration, context),
  },
  
  db: (operation: string, table?: string, context?: LogContext) => logger.dbOperation(operation, table, context),
  
  user: (action: string, userId?: string, context?: LogContext) => logger.userAction(action, userId, context),
};