'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { FaUser, FaLock, FaShieldAlt, FaBell, FaSignOutAlt } from 'react-icons/fa';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
  });
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          setProfile(profile);
          setFormData({
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            phoneNumber: profile.phone_number || '',
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            twoFactorEnabled: profile.two_factor_enabled || false,
            emailNotifications: profile.email_notifications || true,
            smsNotifications: profile.sms_notifications || false,
          });
        }
      } catch (error) {
        toast.error('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          email_notifications: formData.emailNotifications,
          sms_notifications: formData.smsNotifications,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error('Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setLoading(true);

    try {
      if (!formData.twoFactorEnabled) {
        // Generate 2FA secret
        const { data, error } = await supabase.rpc('generate_two_factor_secret');
        
        if (error) throw error;
        
        // Show QR code for user to scan
        toast.success('Please scan the QR code with your authenticator app');
        // In a real app, you would display the QR code here
      } else {
        // Disable 2FA
        const { error } = await supabase.rpc('disable_two_factor');
        
        if (error) throw error;
        
        toast.success('Two-factor authentication disabled');
      }

      setFormData(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled,
      }));
    } catch (error) {
      toast.error('Error updating two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/login';
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
          </div>
          <div className="border-t border-gray-200">
            <div className="flex">
              <div className="w-64 bg-gray-50 border-r border-gray-200">
                <nav className="mt-5 px-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <FaUser className="mr-3 h-6 w-6" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      activeTab === 'security'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <FaLock className="mr-3 h-6 w-6" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('twoFactor')}
                    className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      activeTab === 'twoFactor'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <FaShieldAlt className="mr-3 h-6 w-6" />
                    Two-Factor Auth
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      activeTab === 'notifications'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <FaBell className="mr-3 h-6 w-6" />
                    Notifications
                  </button>
                </nav>
              </div>
              <div className="flex-1 p-6">
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          disabled
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordChange}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'twoFactor' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                      </div>
                      <button
                        onClick={handleTwoFactorToggle}
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                          formData.twoFactorEnabled
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {loading ? 'Processing...' : formData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      </button>
                    </div>
                    {formData.twoFactorEnabled && (
                      <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Two-factor authentication is enabled</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>
                                Your account is now protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(e); }}>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Receive notifications about your account via email.
                          </p>
                        </div>
                        <div className="flex items-center h-6">
                          <input
                            id="emailNotifications"
                            name="emailNotifications"
                            type="checkbox"
                            checked={formData.emailNotifications}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Receive notifications about your account via SMS.
                          </p>
                        </div>
                        <div className="flex items-center h-6">
                          <input
                            id="smsNotifications"
                            name="smsNotifications"
                            type="checkbox"
                            checked={formData.smsNotifications}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 