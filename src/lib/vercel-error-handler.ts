import { NextResponse } from 'next/server';

export type VercelErrorCode = string;

export interface VercelError {
  code: VercelErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
}

// Map error codes to their corresponding HTTP status codes
const errorStatusCodes: Record<string, number> = {
  // Function Errors
  BODY_NOT_A_STRING_FROM_FUNCTION: 502,
  MIDDLEWARE_INVOCATION_FAILED: 500,
  MIDDLEWARE_INVOCATION_TIMEOUT: 504,
  EDGE_FUNCTION_INVOCATION_FAILED: 500,
  EDGE_FUNCTION_INVOCATION_TIMEOUT: 504,
  FUNCTION_INVOCATION_FAILED: 500,
  FUNCTION_INVOCATION_TIMEOUT: 504,
  FUNCTION_PAYLOAD_TOO_LARGE: 413,
  FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE: 500,
  FUNCTION_THROTTLED: 503,
  NO_RESPONSE_FROM_FUNCTION: 502,
  
  // Deployment Errors
  DEPLOYMENT_BLOCKED: 403,
  DEPLOYMENT_PAUSED: 503,
  DEPLOYMENT_DISABLED: 402,
  DEPLOYMENT_NOT_FOUND: 404,
  DEPLOYMENT_DELETED: 410,
  DEPLOYMENT_NOT_READY_REDIRECTING: 303,
  
  // DNS Errors
  DNS_HOSTNAME_EMPTY: 502,
  DNS_HOSTNAME_NOT_FOUND: 502,
  DNS_HOSTNAME_RESOLVE_FAILED: 502,
  DNS_HOSTNAME_RESOLVED_PRIVATE: 404,
  DNS_HOSTNAME_SERVER_ERROR: 502,
  
  // Routing Errors
  TOO_MANY_FORKS: 502,
  TOO_MANY_FILESYSTEM_CHECKS: 502,
  ROUTER_CANNOT_MATCH: 502,
  ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR: 502,
  ROUTER_EXTERNAL_TARGET_ERROR: 502,
  ROUTER_TOO_MANY_HAS_SELECTIONS: 502,
  ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR: 502,
  
  // Request Errors
  INVALID_REQUEST_METHOD: 405,
  MALFORMED_REQUEST_HEADER: 400,
  REQUEST_HEADER_TOO_LARGE: 431,
  RESOURCE_NOT_FOUND: 404,
  URL_TOO_LONG: 414,
  
  // Range Errors
  RANGE_END_NOT_VALID: 416,
  RANGE_GROUP_NOT_VALID: 416,
  RANGE_MISSING_UNIT: 416,
  RANGE_START_NOT_VALID: 416,
  RANGE_UNIT_NOT_SUPPORTED: 416,
  TOO_MANY_RANGES: 416,
  
  // Image Errors
  INVALID_IMAGE_OPTIMIZE_REQUEST: 400,
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED: 502,
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID: 502,
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED: 502,
  OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS: 502,
  
  // Cache Errors
  FALLBACK_BODY_TOO_LARGE: 502,
  
  // Internal Platform Errors
  INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED: 500,
  INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT: 500,
  INTERNAL_FUNCTION_INVOCATION_FAILED: 500,
  INTERNAL_FUNCTION_INVOCATION_TIMEOUT: 500,
  INTERNAL_FUNCTION_NOT_FOUND: 500,
  INTERNAL_FUNCTION_NOT_READY: 500,
  INTERNAL_DEPLOYMENT_FETCH_FAILED: 500,
  INTERNAL_UNARCHIVE_FAILED: 500,
  INTERNAL_UNEXPECTED_ERROR: 500,
  INTERNAL_ROUTER_CANNOT_PARSE_PATH: 500,
  INTERNAL_STATIC_REQUEST_FAILED: 500,
  INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED: 500,
  INTERNAL_CACHE_ERROR: 500,
  INTERNAL_CACHE_KEY_TOO_LONG: 500,
  INTERNAL_CACHE_LOCK_FULL: 500,
  INTERNAL_CACHE_LOCK_TIMEOUT: 500,
  INTERNAL_MISSING_RESPONSE_FROM_CACHE: 500,
  INTERNAL_FUNCTION_SERVICE_UNAVAILABLE: 500,
  INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR: 500,
  INTERNAL_MICROFRONTENDS_BUILD_ERROR: 500,
  INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR: 500
};

export function handleVercelError(error: VercelError): NextResponse {
  const statusCode = error.statusCode || errorStatusCodes[error.code] || 500;

  return NextResponse.json(
    { 
      error: error.message,
      code: error.code,
      details: error.details
    },
    { status: statusCode }
  );
}

export function isVercelError(error: unknown): error is VercelError {
  if (!error || typeof error !== 'object') return false;
  const err = error as any;
  return (
    typeof err.code === 'string' &&
    typeof err.message === 'string'
  );
}

export function getErrorMessage(code: VercelErrorCode): string {
  const errorMessages: Record<string, string> = {
    // Function Errors
    BODY_NOT_A_STRING_FROM_FUNCTION: 'Function returned invalid response type',
    MIDDLEWARE_INVOCATION_FAILED: 'Middleware execution failed',
    MIDDLEWARE_INVOCATION_TIMEOUT: 'Middleware execution timed out',
    EDGE_FUNCTION_INVOCATION_FAILED: 'Edge function execution failed',
    EDGE_FUNCTION_INVOCATION_TIMEOUT: 'Edge function execution timed out',
    FUNCTION_INVOCATION_FAILED: 'Function execution failed',
    FUNCTION_INVOCATION_TIMEOUT: 'Function execution timed out',
    FUNCTION_PAYLOAD_TOO_LARGE: 'Function payload too large',
    FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE: 'Function response payload too large',
    FUNCTION_THROTTLED: 'Function throttled due to excessive load',
    NO_RESPONSE_FROM_FUNCTION: 'No response received from function',
    
    // Deployment Errors
    DEPLOYMENT_BLOCKED: 'Deployment blocked',
    DEPLOYMENT_PAUSED: 'Deployment paused',
    DEPLOYMENT_DISABLED: 'Deployment disabled',
    DEPLOYMENT_NOT_FOUND: 'Deployment not found',
    DEPLOYMENT_DELETED: 'Deployment has been deleted',
    DEPLOYMENT_NOT_READY_REDIRECTING: 'Deployment not ready, redirecting',
    
    // DNS Errors
    DNS_HOSTNAME_EMPTY: 'DNS hostname is empty',
    DNS_HOSTNAME_NOT_FOUND: 'DNS hostname not found',
    DNS_HOSTNAME_RESOLVE_FAILED: 'Failed to resolve DNS hostname',
    DNS_HOSTNAME_RESOLVED_PRIVATE: 'DNS hostname resolved to private IP',
    DNS_HOSTNAME_SERVER_ERROR: 'DNS server error',
    
    // Routing Errors
    TOO_MANY_FORKS: 'Too many routing forks',
    TOO_MANY_FILESYSTEM_CHECKS: 'Too many filesystem checks',
    ROUTER_CANNOT_MATCH: 'Router cannot match path',
    ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR: 'Failed to connect to external target',
    ROUTER_EXTERNAL_TARGET_ERROR: 'External target error',
    ROUTER_TOO_MANY_HAS_SELECTIONS: 'Too many route selections',
    ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR: 'External target handshake failed',
    
    // Request Errors
    INVALID_REQUEST_METHOD: 'Invalid request method',
    MALFORMED_REQUEST_HEADER: 'Malformed request header',
    REQUEST_HEADER_TOO_LARGE: 'Request header too large',
    RESOURCE_NOT_FOUND: 'Resource not found',
    URL_TOO_LONG: 'URL too long',
    
    // Range Errors
    RANGE_END_NOT_VALID: 'Invalid range end',
    RANGE_GROUP_NOT_VALID: 'Invalid range group',
    RANGE_MISSING_UNIT: 'Missing range unit',
    RANGE_START_NOT_VALID: 'Invalid range start',
    RANGE_UNIT_NOT_SUPPORTED: 'Range unit not supported',
    TOO_MANY_RANGES: 'Too many ranges requested',
    
    // Image Errors
    INVALID_IMAGE_OPTIMIZE_REQUEST: 'Invalid image optimization request',
    OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED: 'External image optimization failed',
    OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID: 'Invalid external image request',
    OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED: 'Unauthorized external image request',
    OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS: 'Too many redirects for external image',
    
    // Cache Errors
    FALLBACK_BODY_TOO_LARGE: 'Fallback response body too large',
    
    // Internal Platform Errors
    INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED: 'Internal edge function error',
    INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT: 'Internal edge function timeout',
    INTERNAL_FUNCTION_INVOCATION_FAILED: 'Internal function error',
    INTERNAL_FUNCTION_INVOCATION_TIMEOUT: 'Internal function timeout',
    INTERNAL_FUNCTION_NOT_FOUND: 'Internal function not found',
    INTERNAL_FUNCTION_NOT_READY: 'Internal function not ready',
    INTERNAL_DEPLOYMENT_FETCH_FAILED: 'Internal deployment fetch failed',
    INTERNAL_UNARCHIVE_FAILED: 'Internal unarchive failed',
    INTERNAL_UNEXPECTED_ERROR: 'Internal server error',
    INTERNAL_ROUTER_CANNOT_PARSE_PATH: 'Internal router path parsing error',
    INTERNAL_STATIC_REQUEST_FAILED: 'Internal static request failed',
    INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED: 'Internal image optimization failed',
    INTERNAL_CACHE_ERROR: 'Internal cache error',
    INTERNAL_CACHE_KEY_TOO_LONG: 'Internal cache key too long',
    INTERNAL_CACHE_LOCK_FULL: 'Internal cache lock full',
    INTERNAL_CACHE_LOCK_TIMEOUT: 'Internal cache lock timeout',
    INTERNAL_MISSING_RESPONSE_FROM_CACHE: 'Internal cache response missing',
    INTERNAL_FUNCTION_SERVICE_UNAVAILABLE: 'Internal function service unavailable',
    INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR: 'Invalid microfrontends configuration',
    INTERNAL_MICROFRONTENDS_BUILD_ERROR: 'Microfrontends build error',
    INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR: 'Unexpected microfrontends error'
  };

  return errorMessages[code] || 'An unknown error occurred';
} 