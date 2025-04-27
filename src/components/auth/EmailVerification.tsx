'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';

export default function EmailVerification() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setVerified(true);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('No email found');
      }
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      if (error) throw error;
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Error sending verification email');
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
        <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <span className="text-green-700">Email verified</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
      <div className="flex items-center mb-2">
        <FaEnvelope className="h-5 w-5 text-yellow-500 mr-2" />
        <span className="text-yellow-700">Email not verified</span>
      </div>
      <button
        onClick={handleResendVerification}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Resend verification email'}
      </button>
    </div>
  );
} 