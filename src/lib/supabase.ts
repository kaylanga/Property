import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Check your .env.local file.');
}

// Client-side Supabase client
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client factory
export const createSupabaseServerClient = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
};

// ───────────────────────────────
// 🔐 Auth-related Functions
// ───────────────────────────────

export const getCurrentUser = async () => {
  const supabaseServer = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser();

  if (error) {
    console.error('Get user failed:', error.message);
    return null;
  }

  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Sign out failed: ${error.message}`);
};

// ───────────────────────────────
// 👤 Profile Functions
// ───────────────────────────────

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(`Fetching profile failed: ${error.message}`);
  return data;
};

export const updateUserProfile = async (userId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(`Updating profile failed: ${error.message}`);
  return data;
};

// ───────────────────────────────
// 🏠 Property Functions
// ───────────────────────────────

export const getProperties = async (filters?: Record<string, any>) => {
  let query = supabase.from('properties').select('*');

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query;
  if (error) throw new Error(`Fetching properties failed: ${error.message}`);
  return data;
};

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Fetching property by ID failed: ${error.message}`);
  return data;
};

// ───────────────────────────────
// 💳 Transaction Functions
// ───────────────────────────────

export const createTransaction = async (transaction: Record<string, any>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw new Error(`Creating transaction failed: ${error.message}`);
  return data;
};

// ───────────────────────────────
// 💬 Message Functions
// ───────────────────────────────

export const getMessages = async (userId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetching messages failed: ${error.message}`);
  return data;
};

export const sendMessage = async (message: Record<string, any>) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) throw new Error(`Sending message failed: ${error.message}`);
  return data;
};

export const updateMessage = async (messageId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from('messages')
    .update(updates)
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw new Error(`Updating message failed: ${error.message}`);
  return data;
};
