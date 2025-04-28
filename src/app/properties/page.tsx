'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertySearch } from '@/components/properties/PropertySearch';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Property } from '@/types/property';
import { supabase } from '@/lib/supabase';

function PropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

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
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [searchParams]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertySearch />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
} 