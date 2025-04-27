'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { FaLock } from 'react-icons/fa';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const supabase = createClientComponentClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
      toast.success('Password reset instructions sent!');
    } catch (error) {
      toast.error('Error sending reset instructions');
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
        <FaLock className="h-5 w-5 text-green-500 mb-2" />
        <p className="text-green-700 text-center">
          Password reset instructions have been sent to your email.
          Please check your inbox and follow the link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
      <div className="flex items-center mb-2">
        <FaLock className="h-5 w-5 text-yellow-500 mr-2" />
        <span className="text-yellow-700">Reset Password</span>
      </div>
      <form onSubmit={handleResetPassword} className="w-full max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send reset instructions'}
        </button>
      </form>
    </div>
  );
} 