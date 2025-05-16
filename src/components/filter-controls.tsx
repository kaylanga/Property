'use client';

import React, { useState, useEffect } from 'react';

export interface Filters {
  location: string;
  priceRange: [number, number];
  propertyType: string[];
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  maxArea: number;
  amenities: string[];
}

interface FilterControlsProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  propertyTypes?: string[];
  availableAmenities?: string[];
}

export function FilterControls({
  filters,
  onChange,
  propertyTypes = ['apartment', 'house', 'villa', 'land', 'commercial', 'office', 'warehouse', 'hotel'],
  availableAmenities = ['swimming pool', 'gym', 'parking', 'garden', 'security'],
}: FilterControlsProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key: keyof Filters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter((a) => a !== amenity)
      : [...localFilters.amenities, amenity];
    handleChange('amenities', updated);
  };

  const applyFilters = () => {
    onChange(localFilters);
  };

  const resetFilters = () => {
    const reset: Filters = {
      location: '',
      priceRange: [0, 1000000],
      propertyType: [],
      bedrooms: 0,
      bathrooms: 0,
      minArea: 0,
      maxArea: 0,
      amenities: [],
    };
    onChange(reset);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
      {/* Location */}
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          value={localFilters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Enter city or area"
        />
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Min Price</label>
          <input
            type="number"
            value={localFilters.priceRange[0]}
            onChange={(e) =>
              handleChange('priceRange', [Number(e.target.value), localFilters.priceRange[1]])
            }
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Price</label>
          <input
            type="number"
            value={localFilters.priceRange[1]}
            onChange={(e) =>
              handleChange('priceRange', [localFilters.priceRange[0], Number(e.target.value)])
            }
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium">Property Type</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                const selected = localFilters.propertyType.includes(type)
                  ? localFilters.propertyType.filter((t) => t !== type)
                  : [...localFilters.propertyType, type];
                handleChange('propertyType', selected);
              }}
              className={`px-3 py-1 rounded-full text-sm border ${
                localFilters.propertyType.includes(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms and Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Bedrooms (min)</label>
          <input
            type="number"
            value={localFilters.bedrooms}
            onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Bathrooms (min)</label>
          <input
            type="number"
            value={localFilters.bathrooms}
            onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Area Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Min Area (sq ft)</label>
          <input
            type="number"
            value={localFilters.minArea}
            onChange={(e) => handleChange('minArea', Number(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Area (sq ft)</label>
          <input
            type="number"
            value={localFilters.maxArea}
            onChange={(e) => handleChange('maxArea', Number(e.target.value))}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium">Amenities</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableAmenities.map((amenity) => (
            <button
              key={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              className={`px-3 py-1 rounded-full text-sm border ${
                localFilters.amenities.includes(amenity)
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300"
        >
          Reset
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
