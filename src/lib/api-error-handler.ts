/**
 * API Error Handler
 * 
 * This module provides centralized error handling for the API routes.
 * It includes type definitions for API errors and a handler function
 * that standardizes error responses.
 */

import { NextResponse } from 'next/server';
import type { VercelError } from './vercel-error-handler';

/**
 * Base API Error class for custom error handling.
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR',
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Response interface for API errors
 */
export interface APIErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
import { NextResponse } from 'next/server';
import { RateLimitError } from '../lib/api-error-handler';
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}
const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per windowMs
};
const ipRequests = new Map<string, { count: number; resetTime: number }>();
export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const { windowMs, maxRequests } = { ...defaultConfig, ...config };
  return async function rateLimitMiddleware(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    const requestInfo = ipRequests.get(ip) || { count: 0, resetTime: now + windowMs };
    
    // Reset count if window has expired
    if (now > requestInfo.resetTime) {
      requestInfo.count = 0;
      requestInfo.resetTime = now + windowMs;
    }
    requestInfo.count++;
    ipRequests.set(ip, requestInfo);
    if (requestInfo.count > maxRequests) {
      throw new RateLimitError('Too many requests, please try again later', {
        retryAfter: Math.ceil((requestInfo.resetTime - now) / 1000)
      });
    }
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - requestInfo.count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(requestInfo.resetTime / 1000).toString());
    
    return response;
  };
}
  };
}

/**
 * Validation Error class for handling input validation errors.
 */
export class ValidationError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error class for handling authentication failures.
 */
export class AuthenticationError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 401, 'UNAUTHORIZED', details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error class for handling permission issues.
 */
export class AuthorizationError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 403, 'FORBIDDEN', details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error class for handling missing resources.
 */
export class NotFoundError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error class for handling resource conflicts.
 */
export class ConflictError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 409, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

/**
 * Rate Limit Error class for handling rate limiting.
 */
export class RateLimitError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', details);
    this.name = 'RateLimitError';
  }
}

/**
 * Database Error class for handling database-related errors.
 */
export class DatabaseError extends APIError {
  constructor(message: string, code?: string) {
    super(message, 503, code || 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

/**
 * Type guard to check if an error is a Vercel error.
 */
function isVercelError(error: unknown): error is VercelError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'statusCode' in error
  );
}

/**
 * Gets the HTTP status code for a Vercel error code
 */
function getVercelErrorStatus(code: string): number {
  const statusMap: Record<string, number> = {
    // Function Errors
    'FUNCTION_INVOCATION_ERROR': 500,
    'FUNCTION_EXECUTION_ERROR': 500,
    'FUNCTION_TIMEOUT': 504,
    'FUNCTION_MEMORY_LIMIT': 507,
    
    // Deployment Errors
    'DEPLOYMENT_ERROR': 500,
    'BUILD_ERROR': 500,
    'DEPLOYMENT_TIMEOUT': 504,
    
    // DNS Errors
    'DNS_ERROR': 502,
    'DNS_TIMEOUT': 504,
    
    // Edge Network Errors
    'EDGE_NETWORK_ERROR': 502,
    'EDGE_TIMEOUT': 504,
    
    // Default error
    'UNKNOWN_ERROR': 500
  };
  
  return statusMap[code] || 500;
}

/**
 * Gets a user-friendly error message for a Vercel error
 */
function getErrorMessage(error: VercelError): string {
  const messageMap: Record<string, string> = {
    'FUNCTION_INVOCATION_ERROR': 'The function failed to execute',
    'FUNCTION_EXECUTION_ERROR': 'An error occurred during function execution',
    'FUNCTION_TIMEOUT': 'The function execution timed out',
    'FUNCTION_MEMORY_LIMIT': 'The function exceeded its memory limit',
    'DEPLOYMENT_ERROR': 'The deployment failed',
    'BUILD_ERROR': 'The build process failed',
    'DEPLOYMENT_TIMEOUT': 'The deployment timed out',
    'DNS_ERROR': 'A DNS error occurred',
    'DNS_TIMEOUT': 'The DNS operation timed out',
    'EDGE_NETWORK_ERROR': 'An error occurred in the edge network',
    'EDGE_TIMEOUT': 'The edge network operation timed out',
    'UNKNOWN_ERROR': 'An unexpected error occurred'
  };
  
  return messageMap[error.code] || error.message || 'An unexpected error occurred';
}

/**
 * Handles API errors and returns a standardized error response.
 */
export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle APIError instances
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          details: error.details
        }
      },
      { status: error.statusCode }
    );
  }

  // Handle Vercel errors
  if (isVercelError(error)) {
    const statusCode = getVercelErrorStatus(error.code);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: getErrorMessage(error),
          code: error.code,
          statusCode,
          details: error.details
        }
      },
      { status: statusCode }
    );
  }

  // Handle specific error types
  if (error instanceof Error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: 'VALIDATION_ERROR',
            statusCode: 400,
          }
        },
        { status: 400 }
      );
    }

    // Handle authentication errors
    if (error.name === 'AuthenticationError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: 'UNAUTHORIZED',
            statusCode: 401,
          }
        },
        { status: 401 }
      );
    }

    // Handle authorization errors
    if (error.name === 'AuthorizationError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: 'FORBIDDEN',
            statusCode: 403,
          }
        },
        { status: 403 }
      );
    }

    // Handle not found errors
    if (error.name === 'NotFoundError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: 'NOT_FOUND',
            statusCode: 404,
          }
        },
        { status: 404 }
      );
    }
  }

  // Default error response
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      }
    },
    { status: 500 }
  );
} 