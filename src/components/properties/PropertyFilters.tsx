'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface PropertyFiltersProps {
  filters: {
    priceRange: [number, number];
    propertyTypes: string[];
    bedrooms: number;
    bathrooms: number;
    country: string;
  };
  onFilterChange: (filters: any) => void;
}

export function PropertyFilters({
  filters,
  onFilterChange,
}: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const countries = [
    { value: 'Uganda', label: 'Uganda' },
    { value: 'Kenya', label: 'Kenya' },
    { value: 'Tanzania', label: 'Tanzania' },
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Ghana', label: 'Ghana' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'Egypt', label: 'Egypt' },
    { value: 'Morocco', label: 'Morocco' },
  ];

  const handlePropertyTypeChange = (type: string) => {
    const updatedTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type];

    onFilterChange({ propertyTypes: updatedTypes });
  };

  const handlePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = parseInt(event.target.value) || 0;
    const newRange = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    onFilterChange({ priceRange: newRange });
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search properties by location, name, etc."
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Country Select */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Country</label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange({ country: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bedrooms</label>
          <select
            value={filters.bedrooms}
            onChange={(e) => onFilterChange({ bedrooms: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="0">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bathrooms</label>
          <select
            value={filters.bathrooms}
            onChange={(e) => onFilterChange({ bathrooms: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="0">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price Range</label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  placeholder="Min Price"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex items-center">to</div>
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  placeholder="Max Price"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Property Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {propertyTypeOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handlePropertyTypeChange(option.value)}
                  className={`px-4 py-2 border rounded-lg text-center cursor-pointer transition-colors ${
                    filters.propertyTypes.includes(option.value)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
