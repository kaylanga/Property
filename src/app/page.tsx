'use client';
import React, { useState, useEffect } from 'react';
import { PropertySearch } from '../components/properties/property-search';
import { AuthPopup } from '../components/auth/auth-popup';
import { supabase } from '../lib/supabase';
export default function Home() {
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        // Show auth popup for non-authenticated users
        if (!session) {
          setShowAuthPopup(true);
        }
      };
  
      checkAuth();
    }, []);
  
    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream Property in East Africa
          </h1>
          <p className="text-xl mb-8">
            Discover the best properties in Uganda and surrounding regions
          </p>
          <div className="max-w-3xl">
            <PropertySearch />
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured properties will be rendered here */}
        </div>
      </div>

      {/* Auth Popup */}
      {showAuthPopup && (
        <AuthPopup onClose={() => setShowAuthPopup(false)} />
      )}
    );
  };
  
  export default Page;
  );
