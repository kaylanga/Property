'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PropertySearch } from '../properties/property-search';
import { AfricaMap } from './AfricaMap';

export function Hero() {
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/africa-pattern.svg"
          alt="African Pattern"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Dream Property in{' '}
            <span className="text-yellow-400">Africa</span>
          </h1>
          <p className="text-xl mb-8 max-w-lg">
            From luxurious urban apartments to serene rural retreats, find the
            perfect property across Africa's vibrant landscapes.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <PropertySearch />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCountry('Uganda')}
                className={`px-3 py-1 rounded-full text-sm ${activeCountry === 'Uganda' ? 'bg-yellow-500 text-blue-900' : 'bg-white/20'}`}
              >
                Uganda
              </button>
              <button
                onClick={() => setActiveCountry('Kenya')}
                className={`px-3 py-1 rounded-full text-sm ${activeCountry === 'Kenya' ? 'bg-yellow-500 text-blue-900' : 'bg-white/20'}`}
              >
                Kenya
              </button>
              <button
                onClick={() => setActiveCountry('Tanzania')}
                className={`px-3 py-1 rounded-full text-sm ${activeCountry === 'Tanzania' ? 'bg-yellow-500 text-blue-900' : 'bg-white/20'}`}
              >
                Tanzania
              </button>
              <button
                onClick={() => setActiveCountry('Nigeria')}
                className={`px-3 py-1 rounded-full text-sm ${activeCountry === 'Nigeria' ? 'bg-yellow-500 text-blue-900' : 'bg-white/20'}`}
              >
                Nigeria
              </button>
              <button
                onClick={() => setActiveCountry('Ghana')}
                className={`px-3 py-1 rounded-full text-sm ${activeCountry === 'Ghana' ? 'bg-yellow-500 text-blue-900' : 'bg-white/20'}`}
              >
                Ghana
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <AfricaMap
              activeCountry={activeCountry}
              onSelectCountry={setActiveCountry}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold text-yellow-400">5000+</p>
              <p className="text-sm">Properties</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-yellow-400">15+</p>
              <p className="text-sm">Countries</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-yellow-400">3000+</p>
              <p className="text-sm">Happy Clients</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-yellow-400">98%</p>
              <p className="text-sm">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
