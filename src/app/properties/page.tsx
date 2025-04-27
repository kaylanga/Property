'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertySearch } from '@/components/properties/PropertySearch';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Property } from '@/types/property';
import { supabase } from '@/lib/supabase';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'AVAILABLE');

        // Apply filters based on search params
        if (searchParams.get('location')) {
          query = query.ilike('location->city', `%${searchParams.get('location')}%`);
        }

        if (searchParams.get('propertyType')) {
          query = query.eq('type', searchParams.get('propertyType'));
        }

        if (searchParams.get('minPrice')) {
          query = query.gte('price', searchParams.get('minPrice'));
        }

        if (searchParams.get('maxPrice')) {
          query = query.lte('price', searchParams.get('maxPrice'));
        }

        if (searchParams.get('bedrooms')) {
          query = query.gte('features->bedrooms', searchParams.get('bedrooms'));
        }

        if (searchParams.get('bathrooms')) {
          query = query.gte('features->bathrooms', searchParams.get('bathrooms'));
        }

        const { data, error } = await query;

        if (error) throw error;

        setProperties(data as Property[]);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to fetch properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [searchParams]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Property</h1>
      
      <PropertySearch className="mb-8" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
} 