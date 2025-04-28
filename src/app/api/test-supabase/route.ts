import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase-test';

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
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'An error occurred while testing Supabase connection' 
    }, { status: 500 });
  }
} 