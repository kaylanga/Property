'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyType } from '@/types/property';

interface PropertySearchProps {
  className?: string;
}

interface SearchFilters {
  location: string;
  propertyType: PropertyType | '';
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

export function PropertySearch({ className }: PropertySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    propertyType: (searchParams.get('propertyType') as PropertyType) || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });
    
    router.push(`/properties?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Enter city, district or region"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Property Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
            <option value="LAND">Land</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Min Price (UGX)
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Minimum price"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Max Price (UGX)
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Maximum price"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Bathrooms
          </label>
          <select
            id="bathrooms"
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search Properties
        </button>
      </div>
    </form>
  );
} 