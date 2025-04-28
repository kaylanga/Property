import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase-test';
import { handleAPIError, APIError } from '@/lib/api-error-handler';
import { handleVercelError, isVercelError } from '@/lib/vercel-error-handler';

export async function GET() {
  try {
    const isConnected = await testSupabaseConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Successfully connected to Supabase',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to connect to Supabase' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Supabase test error:', error);
    
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