import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Check your .env.local file.');
}

export const createSupabaseServerClient = () => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies,
  });
};

// Get currently authenticated user (server-side)
export const getCurrentUser = async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Get user failed:', error.message);
    return null;
  }

  return user;
};
