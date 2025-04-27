'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
}

interface PropertyValuationProps {
  propertyId?: string;
  initialData?: {
    location: string;
    propertyType: string;
    size: number;
    bedrooms: number;
    bathrooms: number;
    yearBuilt: number;
    condition: string;
  };
}

export const PropertyValuation: React.FC<PropertyValuationProps> = ({
  propertyId,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    location: initialData?.location || '',
    propertyType: initialData?.propertyType || 'apartment',
    size: initialData?.size || 0,
    bedrooms: initialData?.bedrooms || 0,
    bathrooms: initialData?.bathrooms || 0,
    yearBuilt: initialData?.yearBuilt || new Date().getFullYear(),
    condition: initialData?.condition || 'good',
  });
  
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedValuations, setSavedValuations] = useState<any[]>([]);

  // Fetch property data if propertyId is provided
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            location: data.location?.address || '',
            propertyType: data.type || 'apartment',
            size: data.size || 0,
            bedrooms: data.bedrooms || 0,
            bathrooms: data.bathrooms || 0,
            yearBuilt: data.yearBuilt || new Date().getFullYear(),
            condition: data.condition || 'good',
          });
        }
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Failed to load property data');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  // Fetch saved valuations
  useEffect(() => {
    const fetchSavedValuations = async () => {
      if (!propertyId) return;
      
      try {
        const { data, error } = await supabase
          .from('property_valuations')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSavedValuations(data || []);
      } catch (err) {
        console.error('Error fetching saved valuations:', err);
      }
    };

    fetchSavedValuations();
  }, [propertyId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'size' || name === 'bedrooms' || name === 'bathrooms' || name === 'yearBuilt'
        ? Number(value)
        : value,
    }));
  };

  const calculateValuation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the valuation API
      const response = await fetch('/api/valuation/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate valuation');
      }
      
      const result = await response.json();
      setValuationResult(result);
      
      // Save valuation if propertyId is provided
      if (propertyId) {
        await supabase
          .from('property_valuations')
          .insert({
            property_id: propertyId,
            estimated_value: result.estimatedValue,
            confidence_score: result.confidenceScore,
            factors: result.factors,
            input_data: formData,
          });
        
        // Refresh saved valuations
        const { data, error } = await supabase
          .from('property_valuations')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSavedValuations(data || []);
      }
    } catch (err) {
      console.error('Error calculating valuation:', err);
      setError('Failed to calculate property valuation');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFactorImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-600';
    if (impact < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Property Valuation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4">Property Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter property location"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condominium</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (sq ft)
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                min="1800"
                max={new Date().getFullYear()}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            
            <button
              onClick={calculateValuation}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Calculating...' : 'Calculate Valuation'}
            </button>
          </div>
        </div>
        
        <div>
          {valuationResult ? (
            <div>
              <h3 className="font-semibold mb-4">Valuation Result</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Estimated Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  UGX {valuationResult.estimatedValue.toLocaleString()}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Confidence Score</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${valuationResult.confidenceScore}%` }}
                      ></div>
                    </div>
                    <span className={`ml-2 text-sm font-medium ${getConfidenceColor(valuationResult.confidenceScore)}`}>
                      {valuationResult.confidenceScore}%
                    </span>
                  </div>
                </div>
              </div>
              
              <h4 className="font-medium mb-2">Valuation Factors</h4>
              <div className="space-y-2">
                {valuationResult.factors.map((factor, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{factor.name}</span>
                      <span className={`font-medium ${getFactorImpactColor(factor.impact)}`}>
                        {factor.impact > 0 ? '+' : ''}{factor.impact}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Enter property details and click "Calculate Valuation" to see the estimated value.</p>
            </div>
          )}
        </div>
      </div>
      
      {savedValuations.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Valuation History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimated Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedValuations.map((valuation) => (
                  <tr key={valuation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(valuation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      UGX {valuation.estimated_value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        valuation.confidence_score >= 80 
                          ? 'bg-green-100 text-green-800' 
                          : valuation.confidence_score >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {valuation.confidence_score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}; 