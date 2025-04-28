import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { handleVercelError, VercelErrorCode, isVercelError } from './lib/vercel-error-handler'
import { handleAPIError, APIError } from './lib/api-error-handler'

// Maximum request size (10MB)
const MAX_REQUEST_SIZE = 10 * 1024 * 1024

// Maximum URL length (2048 characters)
const MAX_URL_LENGTH = 2048

// Maximum header size (8KB)
const MAX_HEADER_SIZE = 8 * 1024

export async function middleware(request: NextRequest) {
  try {
    // Check URL length
    if (request.url.length > MAX_URL_LENGTH) {
      return handleVercelError(VercelErrorCode.URL_TOO_LONG)
    }

    // Check request headers size
    const headersSize = Object.entries(request.headers).reduce(
      (size, [key, value]) => size + key.length + (value?.length || 0),
      0
    )
    if (headersSize > MAX_HEADER_SIZE) {
      return handleVercelError(VercelErrorCode.REQUEST_HEADER_TOO_LARGE)
    }

    // Check request method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    if (!allowedMethods.includes(request.method)) {
      return handleVercelError(VercelErrorCode.INVALID_REQUEST_METHOD)
    }

    // Check request body size for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
        return handleVercelError(VercelErrorCode.FUNCTION_PAYLOAD_TOO_LARGE)
      }
    }

    // Add security headers
    const response = NextResponse.next()
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

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
      return handleVercelError(error)
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