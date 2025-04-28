import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { handleVercelError, type VercelError, isVercelError } from './lib/vercel-error-handler'
import { handleAPIError, APIError } from './lib/api-error-handler'

// Maximum request size (10MB)
const MAX_REQUEST_SIZE = 10 * 1024 * 1024

// Maximum URL length (2048 characters)
const MAX_URL_LENGTH = 2048

// Maximum header size (8KB)
const MAX_HEADER_SIZE = 8 * 1024

import { ValidationError } from './api-error-handler';
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}
interface ValidationSchema {
  [key: string]: ValidationRule;
}
export function validateForm(data: any, schema: ValidationSchema) {
  const errors: { [key: string]: string } = {};
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    // Required check
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    if (value) {
      // String length checks
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors[field] = `${field} must be at least ${rules.minLength} characters`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors[field] = `${field} must not exceed ${rules.maxLength} characters`;
        }
      }
      // Pattern check
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
      }
      // Custom validation
      if (rules.custom) {
        const result = rules.custom(value);
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : `${field} is invalid`;
        }
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  return true;
}
// Common validation schemas
export const validationSchemas = {
  registration: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 255
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 100,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    },
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/
    }
  },
  propertyCreation: {
    title: {
      required: true,
      minLength: 10,
      maxLength: 200
    },
    description: {
      required: true,
      minLength: 50,
      maxLength: 2000
    },
    price: {
      required: true,
      custom: (value: number) => value > 0 || 'Price must be greater than 0'
    },
    location: {
      required: true,
      custom: (value: any) => 
        value.city && value.country || 'Location must include city and country'
    }
  }
};
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}
interface ValidationSchema {
  [key: string]: ValidationRule;
}
export function validateForm(data: any, schema: ValidationSchema) {
  const errors: { [key: string]: string } = {};
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    // Required check
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    if (value) {
      // String length checks
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors[field] = `${field} must be at least ${rules.minLength} characters`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors[field] = `${field} must not exceed ${rules.maxLength} characters`;
        }
      }
      // Pattern check
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
      }
      // Custom validation
      if (rules.custom) {
        const result = rules.custom(value);
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : `${field} is invalid`;
        }
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  return true;
}
// Common validation schemas
export const validationSchemas = {
  registration: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 255
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 100,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    },
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/
    }
  },
  propertyCreation: {
    title: {
      required: true,
      minLength: 10,
      maxLength: 200
    },
    description: {
      required: true,
      minLength: 50,
      maxLength: 2000
    },
    price: {
      required: true,
      custom: (value: number) => value > 0 || 'Price must be greater than 0'
    },
    location: {
      required: true,
      custom: (value: any) => 
        value.city && value.country || 'Location must include city and country'
    }
  }
};
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per windowMs
});
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5 // limit each IP to 5 login attempts per hour
});
    // Check request headers size
    const headersSize = Object.entries(request.headers).reduce(
      (size, [key, value]) => size + key.length + (value?.length || 0),
      0
    )
    if (headersSize > MAX_HEADER_SIZE) {
      return handleVercelError({
        code: 'REQUEST_HEADER_TOO_LARGE',
        message: 'Request header size exceeds maximum allowed size',
        statusCode: 431
      })
    }

    // Check request method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    if (!allowedMethods.includes(request.method)) {
      return handleVercelError({
        code: 'INVALID_REQUEST_METHOD',
        message: 'Invalid request method',
        statusCode: 405
      })
    }

    // Check request body size for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
        return handleVercelError({
          code: 'FUNCTION_PAYLOAD_TOO_LARGE',
          message: 'Request payload too large',
          statusCode: 413
        })
      }
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      // Return a more graceful response instead of failing
      return response
    }

    try {
      // Set a timeout for the Supabase operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Middleware timeout')), 5000)
      })

      const supabasePromise = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      ).auth.getSession()

      // Race between the timeout and the actual operation
      const { data: { session } } = await Promise.race([
        supabasePromise,
        timeoutPromise
      ]) as { data: { session: any } }

      // Protected routes
      const protectedRoutes = ['/dashboard', '/profile', '/settings']
      const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

      // Auth routes
      const authRoutes = ['/login', '/signup', '/forgot-password']
      const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

      if (isProtectedRoute && !session) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      return response
    } catch (error) {
      console.error('Error in middleware:', error)
      // Return a graceful response instead of failing
      return response
    }
  } catch (error) {
    console.error('Middleware error:', error)
    
    if (isVercelError(error)) {
      return handleVercelError({
        code: error.code,
        message: error.message,
        details: error.details,
        statusCode: error.statusCode
      })
    }
    
    const apiError = handleAPIError(error)
    return NextResponse.json(
      { error: apiError.message, code: apiError.code, details: apiError.details },
      { status: apiError.statusCode }
    )
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 