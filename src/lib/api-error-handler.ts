import { NextResponse } from 'next/server';

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