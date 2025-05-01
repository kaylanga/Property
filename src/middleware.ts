import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { handleVercelError } from './lib/vercel-error-handler'
import { handleAPIError, RateLimitError } from './lib/api-error-handler'
// Configuration types and defaults
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}
const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per windowMs
};
// Rate limiting storage
const ipRequests = new Map<string, { count: number; resetTime: number }>();
export async function middleware(request: NextRequest) {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    // Apply rate limiting
    const rateLimitResult = await rateLimit(defaultConfig)(request);
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult;
    }
    // Create response to modify
    const response = NextResponse.next();
    // Add security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    // Create Supabase client
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              response.cookies.set({
                name,
                value,
                ...options,
              });
            },
            remove(name: string, options: CookieOptions) {
        response.cookies.delete(name);
      },
    },
  }
);
    // Get user session with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Session check timeout')), 5000);
              });
    const { data: { session } } = await Promise.race([
      supabase.auth.getSession(),
      timeoutPromise
    ]) as {: any } };
    // Protected routes
      const protectedRoutes = ['/dashboard', '/profile', '/settings', '/properties/create'];
      const authRoutes = ['/login', '/register', '/forgot-password'];
      const isProtectedRoute = protectedRoutes.some(route => 
        request.nextUrl.pathname.startsWith(route)
      );
      const isAuthRoute = authRoutes.some(route => 
        request.nextUrl.pathname.startsWith(route)
      );
      // Handle authentication checks
      if (isProtectedRoute && !session) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
      if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    // Add session information to response headers
    response.headers.set('X-User-Authenticated', session ? 'true' : 'false');
      return response;
    } catch (error) {
    if (error instanceof RateLimitError) {
      return handleAPIError(error);
    }
    if (isVercelError(error)) {
      return handleVercelError(error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};