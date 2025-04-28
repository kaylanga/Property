import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Mask the anon key for security
  const maskedAnonKey = supabaseAnonKey 
    ? `${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 10)}` 
    : '';
  
  return NextResponse.json({
    supabaseUrl,
    supabaseAnonKey: maskedAnonKey,
    isConfigured: !!supabaseUrl && !!supabaseAnonKey,
    environment: process.env.NODE_ENV,
  });
} 