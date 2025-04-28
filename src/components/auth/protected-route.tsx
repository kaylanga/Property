/**
 * Protected Route Component
 * 
 * A higher-order component that provides route protection based on:
 * - Authentication status
 * - User roles
 * - Loading states
 * 
 * Features:
 * - Automatic redirection for unauthenticated users
 * - Role-based access control
 * - Loading state handling with spinner
 * - Clean fallback rendering
 * 
 * @module protected-route
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

/**
 * Props for the ProtectedRoute component
 * @interface ProtectedRouteProps
 * @property {React.ReactNode} children - Child components to be protected
 * @property {'client' | 'landlord' | 'broker' | 'admin'} [requiredRole] - Required user role for access
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'landlord' | 'broker' | 'admin';
}

/**
 * ProtectedRoute Component
 * 
 * Wraps child components with authentication and role-based access control.
 * Automatically redirects users based on their authentication status and role.
 * 
 * Behavior:
 * - Unauthenticated users are redirected to /login
 * - Users without required role are redirected to /dashboard
 * - Shows loading spinner while checking authentication
 * - Renders children only when all checks pass
 * 
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element | null} Protected content or null if access denied
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  /**
   * Handle authentication and role-based access control
   * Redirects users based on their status and required role
   */
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user && requiredRole && user.role !== requiredRole) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router, requiredRole]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Return null if user is not authenticated
  if (!user) {
    return null;
  }

  // Return null if user doesn't have required role
  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
} 