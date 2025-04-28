import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates incoming requests to prevent common Vercel errors
 */
export function validateRequest(request: NextRequest): NextResponse | null {
  // Check for invalid HTTP methods
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed', code: 'INVALID_REQUEST_METHOD' },
      { status: 405 }
    );
  }

  // Check for URL length
  const url = request.url;
  if (url.length > 2048) {
    return NextResponse.json(
      { error: 'URL too long', code: 'URL_TOO_LONG' },
      { status: 414 }
    );
  }

  // Check for large headers
  const headers = request.headers;
  let totalHeaderSize = 0;
  headers.forEach((value, key) => {
    totalHeaderSize += key.length + value.length;
  });

  // Vercel has a limit of 8KB for headers
  if (totalHeaderSize > 8192) {
    return NextResponse.json(
      { error: 'Request header too large', code: 'REQUEST_HEADER_TOO_LARGE' },
      { status: 431 }
    );
  }

  // Check for malformed headers
  try {
    headers.forEach((value, key) => {
      // Basic validation for header format
      if (!/^[A-Za-z0-9\-_]+$/.test(key)) {
        throw new Error('Invalid header name');
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Malformed request header', code: 'MALFORMED_REQUEST_HEADER' },
      { status: 400 }
    );
  }

  // If all validations pass, return null
  return null;
} 