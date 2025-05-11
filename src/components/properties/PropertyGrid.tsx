"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { PropertyCard } from "./PropertyCard";
import { PropertyFilters } from "./PropertyFilters";

export interface PropertyGridProps {
  featured?: boolean;
  limit?: number;
  country?: string;
  showFilters?: boolean;
}

export function PropertyGrid({
  featured = false,
  limit = 6,
  country,
  showFilters = true,
}: PropertyGridProps) {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    propertyTypes: [] as string[],
    bedrooms: 0,
    bathrooms: 0,
    country: country || "",
  });

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties", featured, filters],
    queryFn: async () => {
      let query = supabase.from("properties").select("*");

      if (featured) {
        query = query.eq("is_featured", true);
      }

      if (filters.country) {
        query = query.eq("location->country", filters.country);
      }

      if (filters.propertyTypes.length > 0) {
        query = query.in("type", filters.propertyTypes);
      }

      if (filters.bedrooms > 0) {
        query = query.gte("features->bedrooms", filters.bedrooms);
      }

      if (filters.bathrooms > 0) {
        query = query.gte("features->bathrooms", filters.bathrooms);
      }

      query = query
        .gte("pricing->listPrice", filters.priceRange[0])
        .lte("pricing->listPrice", filters.priceRange[1])
        .limit(limit);

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">
          Error loading properties. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(limit)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-96 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-6"></div>
            </div>
          ))}
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-4">
            No properties match your criteria
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() =>
              setFilters({
                priceRange: [0, 1000000],
                propertyTypes: [],
                bedrooms: 0,
                bathrooms: 0,
                country: country || "",
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
