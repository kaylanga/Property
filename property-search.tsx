'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import type { Property } from '../../types';
// Add AI service import
import { getAIRecommendations } from '../../lib/ai-service';

export function PropertySearch() {
  const [aiRecommendations, setAIRecommendations] = useState<Property[]>([]);
  // ... rest of your existing state

  // Add AI recommendations fetch
  useEffect(() => {
    if (filters.aiRecommendations && searchQuery) {
      getAIRecommendations(searchQuery)
        .then(data => setAIRecommendations(data))
        .catch(console.error);
    }
  }, [searchQuery, filters.aiRecommendations]);

  // ... rest of your existing code

  return (
    <div>
      {/* Search section */}
      <div className="space-y-6">
        {/* ... your search input */}
      </div>

      {/* Filters section */}
      <div>
        {/* ... your filter controls */}
      </div>

      {/* Results section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {filters.aiRecommendations && aiRecommendations.length > 0 && (
              <div className="col-span-full">
                <h3 className="text-xl font-semibold mb-4">AI Recommended Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiRecommendations.map((property: Property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="col-span-full">
              <h3 className="text-xl font-semibold mb-4">All Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties?.map((property: Property) => (
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

// Keep your existing PropertyCard component