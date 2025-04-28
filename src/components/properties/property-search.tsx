'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import type { Property } from '../../types';

interface SearchFilters {
  location?: string;
  priceRange?: [number, number];
  propertyType?: string[];
  features?: string[];
  aiRecommendations?: boolean;
}

export function PropertySearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    aiRecommendations: true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: properties, isLoading } = useQuery(
    ['properties', filters],
    async () => {
      let query = supabase.from('properties').select('*');
      
      if (filters.location) {
        query = query.ilike('location->city', `%${filters.location}%`);
      }
      
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }
      
      if (filters.propertyType?.length) {
        query = query.in('type', filters.propertyType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Property[];
    }
  );

  const [aiRecommendations, setAiRecommendations] = useState<Property[]>([]);

  useEffect(() => {
    if (filters.aiRecommendations && properties) {
      // Simulate AI recommendations based on user preferences and property features
      const recommendedProperties = properties
        .sort((a, b) => {
          // Simple scoring system based on property features
          const scoreA = calculatePropertyScore(a);
          const scoreB = calculatePropertyScore(b);
          return scoreB - scoreA;
        })
        .slice(0, 5);
      
      setAiRecommendations(recommendedProperties);
    }
  }, [filters.aiRecommendations, properties]);

  const calculatePropertyScore = (property: Property) => {
    let score = 0;
    
    // Example scoring criteria
    if (property.features.bedrooms && property.features.bedrooms >= 3) score += 2;
    if (property.features.bathrooms && property.features.bathrooms >= 2) score += 2;
    if (property.features.parking && property.features.parking >= 1) score += 1;
    if (property.features.furnished) score += 1;
    
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search properties by location, features, or description..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => {
            // Implement AI-powered search
            // This could use OpenAI's API to understand natural language queries
          }}
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="">Select Location</option>
          <option value="kampala">Kampala</option>
          <option value="entebbe">Entebbe</option>
          <option value="jinja">Jinja</option>
          <option value="mbarara">Mbarara</option>
          <option value="gulu">Gulu</option>
          <option value="mbale">Mbale</option>
          <option value="kasese">Kasese</option>
          <option value="arua">Arua</option>
          <option value="soroti">Soroti</option>
          <option value="masaka">Masaka</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onChange={(e) => setFilters({ ...filters, propertyType: [e.target.value] })}
        >
          <option value="">Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="land">Land</option>
          <option value="unfinished">Unfinished Property</option>
        </select>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="aiRecommendations"
            checked={filters.aiRecommendations}
            onChange={(e) => setFilters({ ...filters, aiRecommendations: e.target.checked })}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="aiRecommendations">AI Recommendations</label>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {filters.aiRecommendations && aiRecommendations.length > 0 && (
              <div className="col-span-full">
                <h3 className="text-xl font-semibold mb-4">AI Recommended Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiRecommendations.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="col-span-full">
              <h3 className="text-xl font-semibold mb-4">All Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties?.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img
        src={property.images[0]}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{property.location.address}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold">${property.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500">
            {property.features.bedrooms} beds • {property.features.bathrooms} baths
          </span>
        </div>
      </div>
    </div>
  );
} 