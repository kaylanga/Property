'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PropertySearch } from '../components/properties/property-search';
import { AuthPopup } from '../components/auth/auth-popup';
import { supabase } from '../lib/supabase-client';
import PropertiesGrid from '../components/PropertiesGrid';

export default function Home() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (!session) {
        setTimeout(() => setShowAuthPopup(true), 10000);
      }
    };

    checkAuth();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
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
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <PropertiesGrid />
      </section>

      {/* About Us */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Property Africa</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Property Africa is the leading real estate platform in East Africa,
              connecting buyers, sellers, and renters with the perfect properties.
              Our mission is to make property transactions seamless and accessible
              to everyone.
            </p>
            <Link
              href="/about"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Why Choose Property Africa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Extensive Listings',
              description: 'Thousands of verified properties across Uganda and East Africa',
              iconClass: 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900',
              svgPath:
                'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z',
            },
            {
              title: 'Verified Properties',
              description: 'All listings are verified to ensure quality and accuracy',
              iconClass: 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900',
              svgPath:
                'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
            },
            {
              title: 'Expert Support',
              description: 'Our team of real estate experts is always ready to help you',
              iconClass: 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900',
              svgPath:
                'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
            },
          ].map(({ title, description, iconClass, svgPath }, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full ${iconClass}`}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d={svgPath} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their perfect
            home with Property Africa
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/properties"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100"
            >
              Browse Properties
            </Link>
            <Link
              href="/register"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 border border-blue-500"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Popup */}
      {showAuthPopup && !isAuthenticated && (
        <AuthPopup onClose={() => setShowAuthPopup(false)} />
      )}
    </main>
  );
}
