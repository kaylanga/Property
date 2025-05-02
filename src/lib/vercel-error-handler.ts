/**
 * Vercel Error Handler
 * 
 * This module provides utilities for handling Vercel-specific errors in a Next.js application.
 * It includes type definitions, error code mappings, and helper functions for consistent error handling.
 * 
 * @module vercel-error-handler
 */

import { NextResponse } from 'next/server';

/**
 * Type definition for Vercel error codes
 * These codes are used to identify specific types of errors that can occur in a Vercel deployment
 */
export type VercelErrorCode = string;

/**
 * Interface representing a Vercel error
 * @interface VercelError
 * @property {VercelErrorCode} code - The error code identifying the type of error
 * @property {string} message - Human-readable error message
 * @property {any} [details] - Optional additional error details
 * @property {number} [statusCode] - Optional HTTP status code
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
 * Maps Vercel error codes to their corresponding HTTP status codes
 * This mapping ensures consistent error responses across the application
 */
const errorStatusCodes: Record<string, number> = {
  FUNCTION_INVOCATION_FAILED: 500,
  FUNCTION_INVOCATION_TIMEOUT: 504,
  FUNCTION_PAYLOAD_TOO_LARGE: 413,
  DATABASE_CONNECTION_ERROR: 503,
  AUTHENTICATION_ERROR: 401,
  AUTHORIZATION_ERROR: 403,
  VALIDATION_ERROR: 400,
  NOT_FOUND_ERROR: 404
};

function getErrorMessage(code: string): string {
  return errorMessages[code] || 'An unknown error occurred';
}

export function handleVercelError(error: VercelError): NextResponse {
  const statusCode = error.statusCode || errorStatusCodes[error.code] || 500;
  const timestamp = error.timestamp || new Date().toISOString();
  const requestId = error.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return NextResponse.json(
    { 
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp,
        requestId,
        source: error.source || 'vercel',
      }
    },
    { 
      status: statusCode,
      headers: {
        'X-Error-Code': error.code,
        'X-Request-ID': requestId,
        'X-Error-Time': timestamp
      }
    }
  );
}

function isVercelError(error: unknown): error is VercelError {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}

export function categorizeError(error: unknown): VercelError {
  if (isVercelError(error)) {
    return {
      ...error,
      timestamp: error.timestamp || new Date().toISOString(),
      requestId: error.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: error.source || 'vercel'
    };
  }

  if (error instanceof Error) {
    return {
      code: 'INTERNAL_UNEXPECTED_ERROR',
      message: error.message,
      details: {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      statusCode: 500,
      timestamp: new Date().toISOString(),
      source: 'application'
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    source: 'system'
  };
}