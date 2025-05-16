'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import { FilterControls } from './filter-controls';

interface SearchFilters {
  location?: string;
  priceRange: [number, number];
  propertyType: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  maxArea: number;
  sortBy: 'price' | 'created_at';
  sortOrder: 'asc' | 'desc';
  assistantProperties: boolean;
}

export function PropertySearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    priceRange: [0, 1_000_000],
    propertyType: [],
    amenities: [],
    bedrooms: 0,
    bathrooms: 0,
    minArea: 0,
    maxArea: 0,
    sortBy: 'price',
    sortOrder: 'asc',
    assistantProperties: false,
  });

  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useQuery<Property[], Error>({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .gte('pricing->>listPrice', filters.priceRange[0])
        .lte('pricing->>listPrice', filters.priceRange[1])
        .gte('features->>bedrooms', filters.bedrooms)
        .gte('features->>bathrooms', filters.bathrooms);

      if (filters.location) {
        query = query.ilike('location->>city', `%${filters.location}%`);
      }

      if (filters.minArea > 0) {
        query = query.gte('features->>totalArea', filters.minArea);
      }

      if (filters.maxArea > 0) {
        query = query.lte('features->>totalArea', filters.maxArea);
      }

      if (filters.propertyType.length > 0) {
        query = query.in('type', filters.propertyType);
      }

      if (filters.amenities.length > 0) {
        query = query.contains('features->amenities', filters.amenities);
      }

      query = query.order(filters.sortBy, {
        ascending: filters.sortOrder === 'asc',
      });

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Property[];
    },
    retry: 1,
    staleTime: 60_000,
  });

  const assistantRecommendedProperties = useMemo(() => {
    return properties.filter((p) => p.aiScore && p.aiScore >= 8);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return filters.assistantProperties 
      ? assistantRecommendedProperties 
      : properties;
  }, [filters.assistantProperties, properties, assistantRecommendedProperties]);

  const toggleAssistantFilter = () => {
    setFilters((prev) => ({
      ...prev,
      assistantProperties: !prev.assistantProperties,
    }));
  };

  return (
    <div className="space-y-6">
      <FilterControls filters={filters} setFilters={setFilters} />

      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={toggleAssistantFilter}
          aria-pressed={filters.assistantProperties}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filters.assistantProperties
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {filters.assistantProperties ? '★ ' : ''}
          AI Recommended Properties
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }, (_, i) => (
            <div 
              key={i} 
              className="animate-pulse bg-gray-100 h-64 rounded-lg"
              aria-label="Loading properties..."
            />
          ))
        ) : isError ? (
          <div className="col-span-full text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">
              Error loading properties:{" "}
              {(error as Error)?.message || 'Unknown error occurred'}
            </p>
          </div>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              isRecommended={filters.assistantProperties}
            />
          ))
        ) : (
          <div className="col-span-full text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No properties found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}