/**
 * 错误处理标准化
 * 提供统一的错误类型定义和处理机制
 */

import { log } from './logger';

// 自定义错误类型
export enum ErrorCode {
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // 认证相关
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // 数据相关
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // 外部服务
  STEAM_API_ERROR = 'STEAM_API_ERROR',
  OPENROUTER_API_ERROR = 'OPENROUTER_API_ERROR',
  GOOGLE_AI_ERROR = 'GOOGLE_AI_ERROR',
  
  // 业务逻辑
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  SYNC_IN_PROGRESS = 'SYNC_IN_PROGRESS',
  RAG_SERVICE_UNAVAILABLE = 'RAG_SERVICE_UNAVAILABLE',
}

// 自定义应用错误类
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // 确保错误堆栈正确
    Error.captureStackTrace(this, this.constructor);
  }
}

// 预定义的错误创建函数
export const createError = {
  validation: (message: string, context?: Record<string, unknown>) =>
    new AppError(message, ErrorCode.VALIDATION_ERROR, 400, true, context),

  unauthorized: (message: string = '未授权访问') =>
    new AppError(message, ErrorCode.UNAUTHORIZED, 401),

  forbidden: (message: string = '禁止访问') =>
    new AppError(message, ErrorCode.FORBIDDEN, 403),

  notFound: (resource: string = '资源') =>
    new AppError(`${resource}不存在`, ErrorCode.NOT_FOUND, 404),

  database: (message: string, context?: Record<string, unknown>) =>
    new AppError(message, ErrorCode.DATABASE_ERROR, 500, true, context),

  steamApi: (message: string, context?: Record<string, unknown>) =>
    new AppError(`Steam API错误: ${message}`, ErrorCode.STEAM_API_ERROR, 502, true, context),

  openrouterApi: (message: string, context?: Record<string, unknown>) =>
    new AppError(`OpenRouter API错误: ${message}`, ErrorCode.OPENROUTER_API_ERROR, 502, true, context),

  googleAi: (message: string, context?: Record<string, unknown>) =>
    new AppError(`Google AI API错误: ${message}`, ErrorCode.GOOGLE_AI_ERROR, 502, true, context),

  insufficientData: (message: string) =>
    new AppError(message, ErrorCode.INSUFFICIENT_DATA, 400),

  syncInProgress: () =>
    new AppError('同步正在进行中，请稍后再试', ErrorCode.SYNC_IN_PROGRESS, 409),

  ragUnavailable: (message: string = 'RAG推荐服务暂时不可用') =>
    new AppError(message, ErrorCode.RAG_SERVICE_UNAVAILABLE, 503),
};

// API响应格式化
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(error: Error | AppError): ApiResponse {
  if (error instanceof AppError) {
    log.error('App Error', error, {
      code: error.code,
      statusCode: error.statusCode,
      context: error.context,
    });

    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.context,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 处理未知错误
  log.error('Unknown Error', error);

  return {
    success: false,
    error: {
      code: ErrorCode.UNKNOWN_ERROR,
      message: process.env.NODE_ENV === 'production' 
        ? '服务器内部错误' 
        : error.message,
    },
    timestamp: new Date().toISOString(),
  };
}

// Next.js API路由错误处理中间件
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      const errorResponse = createErrorResponse(error as Error);
      const statusCode = error instanceof AppError ? error.statusCode : 500;

      return new Response(JSON.stringify(errorResponse), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

// 类型守卫
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isOperationalError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
}