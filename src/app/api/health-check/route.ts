import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Basic system status
    const systemStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      api: {
        status: 'ok',
      },
      database: {
        status: 'pending',
        message: '',
      },
    };

    // Check database connectivity if Supabase credentials are set
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // Run a simple query to test connectivity
        const { data, error } = await supabase
          .from('properties')
          .select('id')
          .limit(1);

        if (error) {
          systemStatus.database.status = 'error';
          systemStatus.database.message = error.message;
        } else {
          systemStatus.database.status = 'ok';
          systemStatus.database.message = 'Connected successfully';
        }
      } catch (dbError: any) {
        systemStatus.database.status = 'error';
        systemStatus.database.message =
          dbError.message || 'Database connection failed';
      }
    } else {
      systemStatus.database.status = 'not_configured';
      systemStatus.database.message = 'Database credentials not configured';
    }

    return NextResponse.json(systemStatus);
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
