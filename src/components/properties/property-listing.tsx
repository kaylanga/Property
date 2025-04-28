'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface PropertyListingProps {
  initialFilters?: {
    location?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
}

export const PropertyListing: React.FC<PropertyListingProps> = ({ initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'AVAILABLE');

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.propertyType) {
        query = query.eq('type', filters.propertyType);
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }

      if (filters.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProperties = properties?.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center p-8">Loading properties...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading properties</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search properties..."
          className="w-full p-3 border rounded-lg mb-4"
          value={searchQuery}
          onChange={handleSearch}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select
            className="p-2 border rounded"
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            className="p-2 border rounded"
            onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="p-2 border rounded"
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Bedrooms"
            className="p-2 border rounded"
            onChange={(e) => handleFilterChange('bedrooms', Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Bathrooms"
            className="p-2 border rounded"
            onChange={(e) => handleFilterChange('bathrooms', Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="Location"
            className="p-2 border rounded"
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties?.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-2">{property.location.address}, {property.location.city}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">
                  {property.currency} {property.price.toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  {property.features.bedrooms && (
                    <span>{property.features.bedrooms} beds</span>
                  )}
                  {property.features.bathrooms && (
                    <span>{property.features.bathrooms} baths</span>
                  )}
                  <span>{property.features.area} m²</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">{property.description}</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 