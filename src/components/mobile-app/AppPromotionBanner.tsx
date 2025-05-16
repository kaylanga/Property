'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

export function AppPromotionBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if the banner was previously dismissed
    const bannerDismissed = localStorage.getItem('appBannerDismissed');

    if (!bannerDismissed) {
      // Only show after 5 seconds on the site
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('appBannerDismissed', 'true');

    // Remove from local storage after 7 days to show again
    setTimeout(
      () => {
        localStorage.removeItem('appBannerDismissed');
      },
      7 * 24 * 60 * 60 * 1000
    );
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <Image
              src="/images/app-icon.png"
              alt="Property Africa App"
              width={60}
              height={60}
              className="rounded-xl"
            />
          </div>

          <div>
            <h4 className="font-bold text-lg">Get the Property Africa App</h4>
            <p className="text-sm text-blue-100">
              Search properties on the go, get instant alerts, and more!
            </p>

            <div className="flex space-x-3 mt-2">
              <Link
                href="/app/ios"
                className="flex items-center bg-black rounded-md px-3 py-1 hover:bg-gray-900"
              >
                <svg
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-xs">App Store</span>
              </Link>

              <Link
                href="/app/android"
                className="flex items-center bg-black rounded-md px-3 py-1 hover:bg-gray-900"
              >
                <svg
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.61 5.73l-1.35-2.45c-.09-.17-.03-.38.13-.49.17-.1.39-.05.49.13l1.4 2.5c1.17-.51 2.48-.8 3.89-.8 1.41 0 2.72.29 3.89.8l1.4-2.5c.1-.18.32-.23.49-.13.17.11.22.32.13.49l-1.35 2.45c2.01 1.22 3.37 3.39 3.37 5.89H13.23c0-2.5 1.37-4.67 3.38-5.89M7.01 9.5c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1m10 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1M5 12h14v7c0 .55-.45 1-1 1h-1v3H7v-3H6c-.55 0-1-.45-1-1v-7z" />
                </svg>
                <span className="text-xs">Google Play</span>
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white hover:text-blue-200 focus:outline-none"
          aria-label="Dismiss banner"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
