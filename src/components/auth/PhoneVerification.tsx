'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { FaPhone, FaCheckCircle } from 'react-icons/fa';

export default function PhoneVerification() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verified, setVerified] = useState(false);
  const supabase = createClientComponentClient();

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) throw error;
      setShowVerificationInput(true);
      toast.success('Verification code sent!');
    } catch (error) {
      toast.error('Error sending verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: verificationCode,
        type: 'sms',
      });
      if (error) throw error;
      setVerified(true);
      toast.success('Phone number verified!');
    } catch (error) {
      toast.error('Error verifying code');
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
        <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <span className="text-green-700">Phone number verified</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
      <div className="flex items-center mb-2">
        <FaPhone className="h-5 w-5 text-yellow-500 mr-2" />
        <span className="text-yellow-700">Phone number not verified</span>
      </div>
      {!showVerificationInput ? (
        <form onSubmit={handleSendVerification} className="w-full max-w-sm">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send verification code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="w-full max-w-sm">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify code'}
          </button>
        </form>
      )}
    </div>
  );
} 