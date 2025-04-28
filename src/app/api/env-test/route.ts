import { NextResponse } from 'next/server';
import { handleAPIError, APIError } from '@/lib/api-error-handler';
import { handleVercelError, isVercelError } from '@/lib/vercel-error-handler';

export async function GET() {
  try {
    // Get the environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Log the values (these will appear in your terminal)
    console.log('Environment Variables Test:');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Has Anon Key:', hasAnonKey);
    
    // Return the values (masked for security)
    return NextResponse.json({
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : 'not set',
      hasAnonKey,
      isConfigured: !!supabaseUrl && hasAnonKey,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Environment test error:', error);
    
    if (isVercelError(error)) {
      return handleVercelError(error);
    }
    
    const apiError = handleAPIError(error);
    return NextResponse.json(
      { error: apiError.message, code: apiError.code, details: apiError.details },
      { status: apiError.statusCode }
    );
  }
} 