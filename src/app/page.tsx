"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Hero } from "../components/home/Hero";
import { PropertyGrid } from "../components/properties/PropertyGrid";
import { AuthPopup } from "../components/auth/auth-popup";
import { supabase } from "../lib/supabase";
import { AppPromotionBanner } from "../components/mobile-app/AppPromotionBanner";

export default function Home() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      // Show auth popup for non-authenticated users
      if (!session) {
        // Wait a bit before showing the popup for better UX
        setTimeout(() => setShowAuthPopup(true), 10000);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Interactive Map */}
      <Hero />

      {/* Featured Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Properties
            </h2>
            <a
              href="/properties"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              View all properties
              <svg
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>

          <PropertyGrid featured={true} limit={6} showFilters={false} />
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Explore Popular Locations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Kampala, Uganda",
                image: "/images/kampala.jpg",
                count: 150,
              },
              {
                name: "Nairobi, Kenya",
                image: "/images/nairobi.jpg",
                count: 123,
              },
              { name: "Lagos, Nigeria", image: "/images/lagos.jpg", count: 98 },
              { name: "Accra, Ghana", image: "/images/accra.jpg", count: 67 },
              {
                name: "Dar es Salaam, Tanzania",
                image: "/images/dar-es-salaam.jpg",
                count: 45,
              },
              {
                name: "Cape Town, South Africa",
                image: "/images/cape-town.jpg",
                count: 87,
              },
            ].map((location, index) => (
              <div
                key={index}
                className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${location.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{location.name}</h3>
                  <p className="text-sm">{location.count} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            What Our Clients Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "David Oyelowo",
                position: "Homeowner",
                testimonial:
                  "I found my dream home in Lagos through PropertyAfrica. The platform was easy to navigate and the virtual tours helped me narrow down my choices before visiting in person.",
                image: "/images/testimonial-1.jpg",
              },
              {
                name: "Amara Kenyatta",
                position: "Real Estate Investor",
                testimonial:
                  "As an investor managing properties across multiple African countries, this platform has been invaluable. The detailed analytics and comparison tools have helped me make smarter investment decisions.",
                image: "/images/testimonial-2.jpg",
              },
              {
                name: "Ibrahim Toure",
                position: "First-time Buyer",
                testimonial:
                  "The mobile alerts feature notified me immediately when a property matching my criteria was listed. I was able to make an offer the same day and beat other buyers to my first home!",
                image: "/images/testimonial-3.jpg",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={
                        testimonial.image ||
                        `/images/testimonials/${index + 1}.jpg`
                      }
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.testimonial}"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Promotion */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Take Property Africa With You
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Our mobile app makes it easier than ever to find your dream
                property on the go.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Get instant alerts for new properties",
                  "Access virtual tours from anywhere",
                  "Contact agents with one tap",
                  "Save and compare properties easily",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex space-x-4">
                <a
                  href="/app/ios"
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900"
                >
                  <svg
                    className="h-8 w-8 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>

                <a
                  href="/app/android"
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900"
                >
                  <svg
                    className="h-8 w-8 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.61 5.73l-1.35-2.45c-.09-.17-.03-.38.13-.49.17-.1.39-.05.49.13l1.4 2.5c1.17-.51 2.48-.8 3.89-.8 1.41 0 2.72.29 3.89.8l1.4-2.5c.1-.18.32-.23.49-.13.17.11.22.32.13.49l-1.35 2.45c2.01 1.22 3.37 3.39 3.37 5.89H13.23c0-2.5 1.37-4.67 3.38-5.89M7.01 9.5c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1m10 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1M5 12h14v7c0 .55-.45 1-1 1h-1v3H7v-3H6c-.55 0-1-.45-1-1v-7z" />
                  </svg>
                  <div>
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 -left-10 h-64 w-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="absolute bottom-0 -right-10 h-72 w-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="relative">
                <img
                  src="/images/app-mockup.png"
                  alt="Property Africa Mobile App"
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Popup */}
      {showAuthPopup && !isAuthenticated && (
        <AuthPopup onClose={() => setShowAuthPopup(false)} />
      )}

      {/* Mobile App Banner */}
      <AppPromotionBanner />
    </div>
  );
}
