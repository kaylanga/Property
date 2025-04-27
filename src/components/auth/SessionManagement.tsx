'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { FaDesktop, FaMobile, FaTablet, FaSignOutAlt } from 'react-icons/fa';

interface Session {
  id: string;
  created_at: string;
  user_agent: string;
  ip_address: string;
  is_current: boolean;
}

export default function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      // Since we can only get the current session, we'll create a sessions array with just that
      if (session) {
        setSessions([{
          id: session.access_token,
          created_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'N/A', // IP address is not available client-side
          is_current: true
        }]);
      }
    } catch (error) {
      toast.error('Error fetching sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      setSessions([]);
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes('mobile')) {
      return <FaMobile className="h-5 w-5" />;
    } else if (userAgent.toLowerCase().includes('tablet')) {
      return <FaTablet className="h-5 w-5" />;
    }
    return <FaDesktop className="h-5 w-5" />;
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              {getDeviceIcon(session.user_agent)}
              <div>
                <p className="font-medium">
                  {session.user_agent}
                  {session.is_current && (
                    <span className="ml-2 text-sm text-green-500">(Current)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  IP: {session.ip_address}
                </p>
                <p className="text-sm text-gray-500">
                  Last active: {new Date(session.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 text-red-600 hover:text-red-700"
            >
              <FaSignOutAlt className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 