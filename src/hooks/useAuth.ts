'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string, email: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    setUser({
      id: userId,
      email,
      fullName: profile.full_name,
      role: profile.role,
      isVerified: profile.is_verified,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
    });
  };

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
        setLoading(false);
        return;
      }

      if (session?.user && isMounted) {
        try {
          await fetchUserProfile(session.user.id, session.user.email!);
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }

      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && isMounted) {
        fetchUserProfile(session.user.id, session.user.email!).catch(console.error);
      } else {
        setUser(null);
      }
    });

    getSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
    router.push('/dashboard');
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }

    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: fullName,
          role: 'client',
          is_verified: false,
        },
      ]);
      if (profileError) {
        console.error('Error creating profile:', profileError.message);
        throw profileError;
      }
    }

    router.push('/verify-email');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
    setUser(null);
    router.push('/');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('Error resetting password:', error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
