import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser, getUserProfile } from '../lib/supabase';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const profile = await getUserProfile(session.user.id);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              fullName: profile.full_name,
              role: profile.role,
              isVerified: profile.is_verified,
              createdAt: new Date(profile.created_at),
              updatedAt: new Date(profile.updated_at),
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Initial session check
    getCurrentUser()
      .then(async (session) => {
        if (session) {
          try {
            const profile = await getUserProfile(session.id);
            setUser({
              id: session.id,
              email: session.email!,
              fullName: profile.full_name,
              role: profile.role,
              isVerified: profile.is_verified,
              createdAt: new Date(profile.created_at),
              updatedAt: new Date(profile.updated_at),
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error checking auth state:', error);
        setLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      if (user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: fullName,
              role: 'client',
              is_verified: false,
            },
          ]);
        if (profileError) throw profileError;
      }

      router.push('/verify-email');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
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