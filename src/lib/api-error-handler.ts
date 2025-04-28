import { NextResponse } from 'next/server';
import { handleVercelError, isVercelError } from './vercel-error-handler';

/**
 * Utility function for consistent API error handling
 * Handles common Vercel deployment errors and provides appropriate responses
 */
export function handleApiError(error: any, context: string = 'API'): NextResponse {
  console.error(`Error in ${context}:`, error);
  
  // Handle specific error types
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return NextResponse.json(
      { error: 'Request timed out', code: 'FUNCTION_INVOCATION_TIMEOUT' },
      { status: 504 }
    );
  }
  
  if (error.message?.includes('payload too large')) {
    return NextResponse.json(
      { error: 'Request payload too large', code: 'FUNCTION_PAYLOAD_TOO_LARGE' },
      { status: 413 }
    );
  }
  
  if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
    return NextResponse.json(
      { error: 'Too many requests', code: 'FUNCTION_THROTTLED' },
      { status: 429 }
    );
  }
  
  // Handle Supabase connection errors
  if (error.message?.includes('Supabase') || error.message?.includes('database')) {
    return NextResponse.json(
      { error: 'Database connection error', code: 'DATABASE_CONNECTION_ERROR' },
      { status: 503 }
    );
  }
  
  // Handle authentication errors
  if (error.message?.includes('auth') || error.message?.includes('unauthorized')) {
    return NextResponse.json(
      { error: 'Authentication error', code: 'AUTHENTICATION_ERROR' },
      { status: 401 }
    );
  }
  
  // Default error response
  return NextResponse.json(
    { error: 'Internal server error', code: 'FUNCTION_INVOCATION_FAILED' },
    { status: 500 }
  );
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'API_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Not authorized', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, 429, 'RATE_LIMIT_ERROR', details);
    this.name = 'RateLimitError';
  }
}

export function handleAPIError(error: unknown): APIError {
  // If it's already an APIError, return it
  if (error instanceof APIError) {
    return error;
  }

  // If it's a Vercel error, convert it to an APIError
  if (isVercelError(error)) {
    return new APIError(
      error.message,
      error.statusCode || 500,
      error.code,
      error.details
    );
  }

  // If it's a standard Error, wrap it
  if (error instanceof Error) {
    return new APIError(error.message);
  }

  // If it's something else, create a generic error
  return new APIError('An unexpected error occurred');
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

export function getAPIErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function getAPIErrorStatusCode(error: unknown): number {
  if (error instanceof APIError) {
    return error.statusCode;
  }
  if (isVercelError(error)) {
    return error.statusCode || 500;
  }
  return 500;
}

export function getAPIErrorDetails(error: unknown): any {
  if (error instanceof APIError) {
    return error.details;
  }
  if (isVercelError(error)) {
    return error.details;
  }
  return undefined;
} 