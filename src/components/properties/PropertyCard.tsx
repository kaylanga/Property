'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
        {property.images[0] && (
          <div className="relative h-48">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
            />
            {property.verified && (
              <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                Verified
              </span>
            )}
          </div>
        )}
        
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{property.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {property.location.city}, {property.location.district}
          </p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {property.currency} {property.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            {property.features.bedrooms && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.features.bedrooms} beds
              </span>
            )}
            {property.features.bathrooms && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {property.features.bathrooms} baths
              </span>
            )}
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.features.area} m²
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 