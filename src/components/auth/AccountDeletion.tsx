'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

export default function AccountDeletion() {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState('');
  const supabase = createClientComponentClient();

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First, verify the user's password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password,
      });

      if (signInError) {
        throw new Error('Invalid password');
      }

      // Delete the user's profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      // Delete the user's auth account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (deleteError) throw deleteError;

      toast.success('Account deleted successfully');
      window.location.href = '/';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error deleting account');
    } finally {
      setLoading(false);
    }
  };

  if (!showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
        <div className="flex items-center mb-2">
          <FaTrash className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">Delete Account</span>
        </div>
        <p className="text-red-600 text-center mb-4">
          Warning: This action cannot be undone. All your data will be permanently deleted.
        </p>
        <button
          onClick={() => setShowConfirmation(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          I understand, delete my account
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
      <div className="flex items-center mb-2">
        <FaTrash className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">Confirm Account Deletion</span>
      </div>
      <form onSubmit={handleDeleteAccount} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-red-700 mb-1">
            Enter your password to confirm
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </button>
      </form>
    </div>
  );
} 