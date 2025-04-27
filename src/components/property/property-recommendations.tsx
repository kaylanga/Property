'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { supabase } from '@/lib/supabase';
import { PropertyCard } from './property-card';

interface PropertyRecommendationsProps {
  userId?: string;
  currentPropertyId?: string;
  limit?: number;
}

export const PropertyRecommendations: React.FC<PropertyRecommendationsProps> = ({
  userId,
  currentPropertyId,
  limit = 4,
}) => {
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // If we have a user ID, fetch personalized recommendations
        if (userId) {
          const { data, error } = await supabase.rpc('get_property_recommendations', {
            user_id: userId,
            current_property_id: currentPropertyId,
            recommendation_limit: limit
          });
          
          if (error) throw error;
          setRecommendations(data || []);
        } else {
          // Otherwise, fetch general recommendations
          const { data, error } = await supabase.rpc('get_general_recommendations', {
            current_property_id: currentPropertyId,
            recommendation_limit: limit
          });
          
          if (error) throw error;
          setRecommendations(data || []);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load property recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, currentPropertyId, limit]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Recommended Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Recommended Properties</h2>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Recommended Properties</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">No recommendations available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}; 