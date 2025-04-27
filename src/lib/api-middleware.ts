import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export type ApiHandlerOptions = {
  requireAuth?: boolean;
  requiredRole?: 'ADMIN' | 'AGENT' | 'USER';
};

export async function withApiAuth(
  handler: (req: NextRequest, context: { user: any; supabase: any }) => Promise<NextResponse>,
  options: ApiHandlerOptions = {}
) {
  return async function (req: NextRequest) {
    try {
      const res = NextResponse.next();
      const supabase = createMiddlewareClient({ req, res });
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error('Error getting session');
      }

      // Check if authentication is required
      if (options.requireAuth && !session) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // If role check is required
      if (options.requiredRole && session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          return new NextResponse(
            JSON.stringify({ error: 'Error fetching user role' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (profile.role !== options.requiredRole && profile.role !== 'ADMIN') {
          return new NextResponse(
            JSON.stringify({ error: 'Insufficient permissions' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      // Rate limiting
      const clientIp = req.ip || 'unknown';
      const rateLimitKey = `rate_limit:${clientIp}:${req.method}:${req.nextUrl.pathname}`;
      
      const { data: rateLimit } = await supabase
        .from('rate_limits')
        .select('count, timestamp')
        .eq('key', rateLimitKey)
        .single();

      const now = Date.now();
      const windowMs = 60000; // 1 minute
      const maxRequests = 60; // 60 requests per minute

      if (rateLimit) {
        if (now - new Date(rateLimit.timestamp).getTime() < windowMs) {
          if (rateLimit.count >= maxRequests) {
            return new NextResponse(
              JSON.stringify({ error: 'Too many requests' }),
              { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
          }

          await supabase
            .from('rate_limits')
            .update({ count: rateLimit.count + 1 })
            .eq('key', rateLimitKey);
        } else {
          await supabase
            .from('rate_limits')
            .update({ count: 1, timestamp: new Date().toISOString() })
            .eq('key', rateLimitKey);
        }
      } else {
        await supabase
          .from('rate_limits')
          .insert({
            key: rateLimitKey,
            count: 1,
            timestamp: new Date().toISOString()
          });
      }

      // CSRF Protection
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const csrfToken = req.headers.get('X-CSRF-Token');
        const expectedToken = session?.user?.id; // Use user ID as CSRF token

        if (!csrfToken || csrfToken !== expectedToken) {
          return new NextResponse(
            JSON.stringify({ error: 'Invalid CSRF token' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      // Add security headers
      const headers = new Headers(res.headers);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-XSS-Protection', '1; mode=block');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      headers.set('Content-Security-Policy', "default-src 'self'");

      // Call the handler with the authenticated context
      return handler(req, { user: session?.user, supabase });
    } catch (error) {
      console.error('API Middleware Error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
} 