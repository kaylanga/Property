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
export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (isVercelError(error)) {
    return handleVercelError(error);
  }
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
  if (error instanceof Error) {
  return NextResponse.json(
    {
      success: false,
      error: {
          message: error.message,
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500
}
    },
    { status: 500 }
  );
}
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        statusCode: 500
      }
    },
    { status: 500 }
  );
}
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