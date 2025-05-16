'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase'; // Adjust this path if your `types` folder differs

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Fetch a user's profile from the 'profiles' table.
 * Client-side safe function.
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
