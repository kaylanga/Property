import { NextResponse } from 'next/server';

export enum VercelErrorCode {
  // Build Errors
  BUILD_ERROR = 'BUILD_ERROR',
  DEPLOYMENT_ERROR = 'DEPLOYMENT_ERROR',
  
  // Runtime Errors
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  FUNCTION_ERROR = 'FUNCTION_ERROR',
  
  // API Errors
  API_ERROR = 'API_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // Environment Errors
  ENV_ERROR = 'ENV_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  
  // Resource Errors
  MEMORY_LIMIT_ERROR = 'MEMORY_LIMIT_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  DNS_ERROR = 'DNS_ERROR',
  
  // Authentication Errors
  AUTH_ERROR = 'AUTH_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  
  // Database Errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  
  // Request Errors
  URL_TOO_LONG = 'URL_TOO_LONG',
  REQUEST_HEADER_TOO_LARGE = 'REQUEST_HEADER_TOO_LARGE',
  INVALID_REQUEST_METHOD = 'INVALID_REQUEST_METHOD',
  FUNCTION_PAYLOAD_TOO_LARGE = 'FUNCTION_PAYLOAD_TOO_LARGE',
  
  // Unknown Error
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

interface VercelError extends Error {
  code: VercelErrorCode;
  statusCode?: number;
  details?: any;
}

export function handleVercelError(error: any): VercelError {
  // Default error
  const vercelError: VercelError = {
    name: 'VercelError',
    message: 'An unexpected error occurred',
    code: VercelErrorCode.UNKNOWN_ERROR,
    statusCode: 500
  };

  // Handle different types of errors
  if (error instanceof Error) {
    vercelError.message = error.message;
    
    // Check for specific error types
    if (error.message.includes('build')) {
      vercelError.code = VercelErrorCode.BUILD_ERROR;
      vercelError.statusCode = 500;
    } else if (error.message.includes('deploy')) {
      vercelError.code = VercelErrorCode.DEPLOYMENT_ERROR;
      vercelError.statusCode = 500;
    } else if (error.message.includes('rate limit')) {
      vercelError.code = VercelErrorCode.RATE_LIMIT_ERROR;
      vercelError.statusCode = 429;
    } else if (error.message.includes('timeout')) {
      vercelError.code = VercelErrorCode.TIMEOUT_ERROR;
      vercelError.statusCode = 504;
    } else if (error.message.includes('memory')) {
      vercelError.code = VercelErrorCode.MEMORY_LIMIT_ERROR;
      vercelError.statusCode = 500;
    } else if (error.message.includes('database')) {
      vercelError.code = VercelErrorCode.DATABASE_ERROR;
      vercelError.statusCode = 500;
    } else if (error.message.includes('auth')) {
      vercelError.code = VercelErrorCode.AUTH_ERROR;
      vercelError.statusCode = 401;
    } else if (error.message.includes('permission')) {
      vercelError.code = VercelErrorCode.PERMISSION_ERROR;
      vercelError.statusCode = 403;
    }
  }

  // Add any additional details
  if (error.details) {
    vercelError.details = error.details;
  }

  return vercelError;
}

export function isVercelError(error: any): error is VercelError {
  return error && 'code' in error && Object.values(VercelErrorCode).includes(error.code);
}

export function getErrorMessage(error: VercelError): string {
  const errorMessages: Record<VercelErrorCode, string> = {
    [VercelErrorCode.BUILD_ERROR]: 'Failed to build the application',
    [VercelErrorCode.DEPLOYMENT_ERROR]: 'Failed to deploy the application',
    [VercelErrorCode.RUNTIME_ERROR]: 'A runtime error occurred',
    [VercelErrorCode.FUNCTION_ERROR]: 'A serverless function error occurred',
    [VercelErrorCode.API_ERROR]: 'An API error occurred',
    [VercelErrorCode.RATE_LIMIT_ERROR]: 'Rate limit exceeded',
    [VercelErrorCode.ENV_ERROR]: 'Environment configuration error',
    [VercelErrorCode.CONFIG_ERROR]: 'Application configuration error',
    [VercelErrorCode.MEMORY_LIMIT_ERROR]: 'Memory limit exceeded',
    [VercelErrorCode.TIMEOUT_ERROR]: 'Request timeout',
    [VercelErrorCode.NETWORK_ERROR]: 'Network error occurred',
    [VercelErrorCode.DNS_ERROR]: 'DNS resolution error',
    [VercelErrorCode.AUTH_ERROR]: 'Authentication error',
    [VercelErrorCode.PERMISSION_ERROR]: 'Permission denied',
    [VercelErrorCode.DATABASE_ERROR]: 'Database error occurred',
    [VercelErrorCode.CONNECTION_ERROR]: 'Connection error occurred',
    [VercelErrorCode.URL_TOO_LONG]: 'URL too long',
    [VercelErrorCode.REQUEST_HEADER_TOO_LARGE]: 'Request header too large',
    [VercelErrorCode.INVALID_REQUEST_METHOD]: 'Invalid request method',
    [VercelErrorCode.FUNCTION_PAYLOAD_TOO_LARGE]: 'Function payload too large',
    [VercelErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred'
  };

  return errorMessages[error.code] || error.message;
} 