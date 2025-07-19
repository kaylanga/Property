'use client';

import React from 'react';
import { ProtectedRoute } from '../../components/auth/protected-route';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Here's what's happening with your account.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Properties Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg quick-action-card">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-[#FF6A00] quick-action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Properties
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Manage your property listings
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/properties"
                    className="quick-action-btn-primary"
                  >
                    <span className="quick-action-emoji">📤</span>
                    List Property
                  </Link>
                  <Link
                    href="/properties/manage"
                    className="quick-action-btn-secondary"
                  >
                    <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    View All
                  </Link>
                </div>
              </div>
            </div>

            {/* Messages Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg quick-action-card">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-[#FF6A00] quick-action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Messages
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Connect with potential buyers
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/messages/compose"
                    className="quick-action-btn-primary"
                  >
                    <span className="quick-action-emoji">✉️</span>
                    Compose
                  </Link>
                  <Link
                    href="/messages"
                    className="quick-action-btn-secondary"
                  >
                    <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Inbox
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg quick-action-card">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-[#FF6A00] quick-action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Profile
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Manage account settings
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/profile/edit"
                    className="quick-action-btn-primary"
                  >
                    <span className="quick-action-emoji">⚙️</span>
                    Edit Profile
                  </Link>
                  <Link
                    href="/profile"
                    className="quick-action-btn-secondary"
                  >
                    <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
