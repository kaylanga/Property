import { NextResponse } from 'next/server';

/**
 * Type definition for Vercel error codes
 */
export type VercelErrorCode = string;

/**
 * Interface representing a Vercel error
 */
export interface VercelError {
  code: VercelErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
  timestamp?: string;
  requestId?: string;
  source?: string;
}

/**
 * Maps Vercel error codes to HTTP status codes
 */
const errorStatusCodes: Record<string, number> = {
  FUNCTION_INVOCATION_FAILED: 500,
  FUNCTION_INVOCATION_TIMEOUT: 504,
  FUNCTION_PAYLOAD_TOO_LARGE: 413,
  DATABASE_CONNECTION_ERROR: 503,
  AUTHENTICATION_ERROR: 401,
  AUTHORIZATION_ERROR: 403,
  VALIDATION_ERROR: 400,
  NOT_FOUND_ERROR: 404,
};

/**
 * Handle Vercel-formatted errors and return a JSON response
 */
export function handleVercelError(error: VercelError): NextResponse {
  const statusCode = error.statusCode || errorStatusCodes[error.code] || 500;
  const timestamp = error.timestamp || new Date().toISOString();
  const requestId =
    error.requestId ||
    `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return NextResponse.json(
    {
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp,
        requestId,
        source: error.source || 'vercel',
      },
    },
    {
      status: statusCode,
      headers: {
        'X-Error-Code': error.code,
        'X-Request-ID': requestId,
        'X-Error-Time': timestamp,
      },
    }
  );
}

/**
 * Type guard to check if an error is a VercelError
 */
export function isVercelError(error: unknown): error is VercelError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Categorize unknown errors into a VercelError shape
 */
export function categorizeError(error: unknown): VercelError {
  if (isVercelError(error)) {
    return {
      ...error,
      timestamp: error.timestamp || new Date().toISOString(),
      requestId:
        error.requestId ||
        `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      source: error.source || 'vercel',
    };
  }

  if (error instanceof Error) {
    return {
      code: 'INTERNAL_UNEXPECTED_ERROR',
      message: error.message,
      details: {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      statusCode: 500,
      timestamp: new Date().toISOString(),
      source: 'application',
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    source: 'system',
  };
}
