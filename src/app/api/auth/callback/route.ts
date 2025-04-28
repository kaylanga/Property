import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { handleAPIError, APIError, AuthenticationError } from '@/lib/api-error-handler'
import { handleVercelError, isVercelError } from '@/lib/vercel-error-handler'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (!code) {
      throw new AuthenticationError('No authorization code provided')
    }

    const response = NextResponse.redirect(`${origin}${next}`)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
  } catch (error) {
    console.error('Auth callback error:', error)
    
    if (isVercelError(error)) {
      return handleVercelError(error)
    }
    
    const apiError = handleAPIError(error)
    return NextResponse.json(
      { error: apiError.message, code: apiError.code, details: apiError.details },
      { status: apiError.statusCode }
    )
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-error`)
} 