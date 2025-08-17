/**
 * API响应格式化工具
 * 提供统一的API响应格式和工具函数
 */

import { NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, AppError, ErrorCode } from './error-handler';
import { log } from './logger';

// 通用API响应创建器
export class ApiResponseBuilder {
  /**
   * 创建成功响应
   */
  static success<T>(data: T, status: number = 200): NextResponse {
    const response = createSuccessResponse(data);
    return NextResponse.json(response, { status });
  }

  /**
   * 创建错误响应
   */
  static error(error: Error | AppError, customStatus?: number): NextResponse {
    const response = createErrorResponse(error);
    const status = customStatus || (error instanceof AppError ? error.statusCode : 500);

    return NextResponse.json(response, { status });
  }

  /**
   * 创建验证错误响应
   */
  static validationError(message: string, details?: Record<string, unknown>): NextResponse {
    const error = new AppError(message, ErrorCode.VALIDATION_ERROR, 400, true, details);
    return this.error(error);
  }

  /**
   * 创建未授权响应
   */
  static unauthorized(message: string = '未授权访问'): NextResponse {
    const error = new AppError(message, ErrorCode.UNAUTHORIZED, 401);
    return this.error(error);
  }

  /**
   * 创建禁止访问响应
   */
  static forbidden(message: string = '禁止访问'): NextResponse {
    const error = new AppError(message, ErrorCode.FORBIDDEN, 403);
    return this.error(error);
  }

  /**
   * 创建资源不存在响应
   */
  static notFound(resource: string = '资源'): NextResponse {
    const error = new AppError(`${resource}不存在`, ErrorCode.NOT_FOUND, 404);
    return this.error(error);
  }

  /**
   * 创建服务器错误响应
   */
  static serverError(message: string = '服务器内部错误'): NextResponse {
    const error = new AppError(message, ErrorCode.UNKNOWN_ERROR, 500);
    return this.error(error);
  }

  /**
   * 创建服务不可用响应
   */
  static serviceUnavailable(message: string = '服务暂时不可用'): NextResponse {
    const error = new AppError(message, ErrorCode.RAG_SERVICE_UNAVAILABLE, 503);
    return this.error(error);
  }
}

// 便捷导出
export const apiResponse = ApiResponseBuilder;

// API请求验证装饰器
export function validateRequestMethod(allowedMethods: string[]) {
  return function (target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (request: Request, ...args: unknown[]) {
      if (!allowedMethods.includes(request.method)) {
        log.warn(`Method ${request.method} not allowed for ${propertyName}`, {
          allowedMethods,
          requestedMethod: request.method,
        });
        
        return apiResponse.error(
          new AppError(
            `方法 ${request.method} 不被允许`,
            ErrorCode.VALIDATION_ERROR,
            405
          )
        );
      }

      return method.call(this, request, ...args);
    };
  };
}

// 请求日志记录装饰器
export function logApiRequest(target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (request: Request, ...args: unknown[]) {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    log.api.request(request.method, url.pathname);

    try {
      const result = await method.call(this, request, ...args);
      const duration = Date.now() - startTime;
      
      log.api.response(
        request.method, 
        url.pathname, 
        result.status, 
        duration
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      log.api.response(
        request.method, 
        url.pathname, 
        500, 
        duration,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );

      throw error;
    }
  };
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * 创建分页响应
 */
export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}