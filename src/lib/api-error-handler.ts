import { NextResponse } from 'next/server';
import { handleVercelError, isVercelError } from './vercel-error-handler';

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

const errorMessages: Record<string, string> = {
  FUNCTION_TIMEOUT: 'The function execution timed out',
  FUNCTION_MEMORY_LIMIT: 'The function exceeded its memory limit',
  DEPLOYMENT_ERROR: 'The deployment failed',
  BUILD_ERROR: 'The build process failed',
  DEPLOYMENT_TIMEOUT: 'The deployment timed out',
  DNS_ERROR: 'A DNS error occurred',
  DNS_TIMEOUT: 'The DNS operation timed out',
  EDGE_NETWORK_ERROR: 'An error occurred in the edge network',
  EDGE_TIMEOUT: 'The edge network operation timed out',
  UNKNOWN_ERROR: 'An unexpected error occurred',
};

function getErrorMessage(error: any): string {
  return errorMessages[error.code] || error.message || 'An unexpected error occurred';
}

function getVercelErrorStatus(code: string): number {
  switch (code) {
    case 'FUNCTION_TIMEOUT':
    case 'FUNCTION_MEMORY_LIMIT':
    case 'DEPLOYMENT_ERROR':
    case 'BUILD_ERROR':
    case 'DEPLOYMENT_TIMEOUT':
    case 'DNS_ERROR':
    case 'DNS_TIMEOUT':
    case 'EDGE_NETWORK_ERROR':
    case 'EDGE_TIMEOUT':
      return 500;
    default:
      return 500;
  }
}

/**
 * Handles API errors and returns a standardized error response.
 */
export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // APIError (custom error)
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Vercel errors
  if (isVercelError(error)) {
    const statusCode = getVercelErrorStatus(error.code);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: getErrorMessage(error),
          code: error.code,
          statusCode,
          details: error.details,
        },
      },
      { status: statusCode }
    );
  }

  // Generic Error with a name
  if (error instanceof Error) {
    switch (error.name) {
      case 'ValidationError':
        return NextResponse.json(
          {
            success: false,
            error: {
              message: error.message,
              code: 'VALIDATION_ERROR',
              statusCode: 400,
            },
          },
          { status: 400 }
        );

      case 'AuthenticationError':
        return NextResponse.json(
          {
            success: false,
            error: {
              message: error.message,
              code: 'UNAUTHORIZED',
              statusCode: 401,
            },
          },
          { status: 401 }
        );

      case 'AuthorizationError':
        return NextResponse.json(
          {
            success: false,
            error: {
              message: error.message,
              code: 'FORBIDDEN',
              statusCode: 403,
            },
          },
          { status: 403 }
        );

      case 'NotFoundError':
        return NextResponse.json(
          {
            success: false,
            error: {
              message: error.message,
              code: 'NOT_FOUND',
              statusCode: 404,
            },
          },
          { status: 404 }
        );
    }
  }

  // Fallback
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    },
    { status: 500 }
  );
}
