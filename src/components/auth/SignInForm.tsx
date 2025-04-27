'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaGoogle, FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaApple } from 'react-icons/fa';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorId, setTwoFactorId] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  // Check if user has 2FA enabled
  useEffect(() => {
    const checkTwoFactor = async () => {
      if (email) {
        const { data, error } = await supabase
          .from('profiles')
          .select('two_factor_enabled')
          .eq('email', email)
          .single();
        
        if (data?.two_factor_enabled) {
          setShowTwoFactor(true);
          // Generate a 2FA challenge
          const { data: challengeData, error: challengeError } = await supabase
            .rpc('generate_two_factor_challenge', { user_email: email });
          
          if (challengeData) {
            setTwoFactorId(challengeData.id);
            toast('Please enter your 2FA code');
          }
        }
      }
    };

    if (email) {
      checkTwoFactor();
    }
  }, [email, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If 2FA is enabled and code is provided, verify it
      if (showTwoFactor && twoFactorCode) {
        const { data: verifyData, error: verifyError } = await supabase
          .rpc('verify_two_factor_code', { 
            challenge_id: twoFactorId, 
            code: twoFactorCode 
          });

        if (verifyError || !verifyData.valid) {
          throw new Error('Invalid 2FA code');
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Log successful login
      await supabase.from('security_audit_logs').insert({
        event_type: 'LOGIN_SUCCESS',
        details: { 
          ip_address: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip),
          user_agent: navigator.userAgent
        }
      });

      const redirectTo = searchParams.get('redirectedFrom') || '/dashboard';
      router.push(redirectTo);
      toast.success('Successfully signed in!');
    } catch (error) {
      // Log failed login attempt
      await supabase.from('security_audit_logs').insert({
        event_type: 'LOGIN_FAILURE',
        details: { 
          email,
          error: error.message,
          ip_address: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip),
          user_agent: navigator.userAgent
        }
      });
      
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook' | 'twitter' | 'linkedin' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'google' 
            ? 'email profile https://www.googleapis.com/auth/calendar.readonly'
            : provider === 'github'
            ? 'read:user user:email'
            : undefined,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {showTwoFactor && (
              <div>
                <label htmlFor="two-factor-code" className="sr-only">
                  Two-Factor Authentication Code
                </label>
                <input
                  id="two-factor-code"
                  name="two-factor-code"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 2FA code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                />
              </div>
            )}
            {!showTwoFactor && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span className="sr-only">Sign in with Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaGithub className="h-5 w-5 text-gray-900" />
              <span className="sr-only">Sign in with GitHub</span>
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
              <span className="sr-only">Sign in with Facebook</span>
            </button>
            <button
              onClick={() => handleSocialLogin('twitter')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaTwitter className="h-5 w-5 text-blue-400" />
              <span className="sr-only">Sign in with Twitter</span>
            </button>
            <button
              onClick={() => handleSocialLogin('linkedin')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaLinkedin className="h-5 w-5 text-blue-700" />
              <span className="sr-only">Sign in with LinkedIn</span>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaApple className="h-5 w-5 text-gray-900" />
              <span className="sr-only">Sign in with Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 