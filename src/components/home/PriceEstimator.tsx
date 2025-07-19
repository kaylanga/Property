'use client';

import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { AdjustmentsHorizontalIcon as Settings2, MapPinIcon as MapPin, SquaresPlusIcon as Square, HomeIcon as Bed, TvIcon as Bath, ArrowRightIcon as ArrowRight, ShareIcon as Share2, CheckCircleIcon as CheckCircle } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface FieldErrors {
  location?: string;
  squareFeet?: string;
  bedrooms?: string;
  bathrooms?: string;
}

interface MarketComparison {
  average: number;
  trend: 'above' | 'below' | 'similar to';
}

export default function PriceEstimator() {
  const [location, setLocation] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [marketComparison, setMarketComparison] = useState<MarketComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const validateFields = () => {
    const errors: FieldErrors = {};
    
    if (!location.trim()) {
      errors.location = 'Location is required';
    }
    if (!squareFeet || parseFloat(squareFeet) <= 0) {
      errors.squareFeet = 'Please enter valid square feet';
    }
    if (!bedrooms || parseInt(bedrooms) < 0) {
      errors.bedrooms = 'Please enter valid number of bedrooms';
    }
    if (!bathrooms || parseFloat(bathrooms) <= 0) {
      errors.bathrooms = 'Please enter valid number of bathrooms';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FieldErrors, value: string) => {
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Update the field value
    switch (field) {
      case 'location':
        setLocation(value);
        break;
      case 'squareFeet':
        setSquareFeet(value);
        break;
      case 'bedrooms':
        setBedrooms(value);
        break;
      case 'bathrooms':
        setBathrooms(value);
        break;
    }

    // Advance step if field is valid
    if (value.trim() && !fieldErrors[field]) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const handleEstimate = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setCurrentStep(3);
    
    // Simulate API call or calculation
    setTimeout(() => {
      const basePrice = parseInt(squareFeet) * 200; // $200 per sq ft
      const bedroomBonus = parseInt(bedrooms) * 5000;
      const bathroomBonus = parseFloat(bathrooms) * 3000;
      const price = basePrice + bedroomBonus + bathroomBonus;
      
      setEstimatedPrice(price);
      
      // Mock market comparison data
      const marketAvg = price * (0.9 + Math.random() * 0.2);
      const trend = price > marketAvg ? 'above' : price < marketAvg * 0.95 ? 'below' : 'similar to';
      setMarketComparison({
        average: marketAvg,
        trend
      });
      
      setLoading(false);
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.share && estimatedPrice) {
      navigator.share({
        title: 'Property Price Estimate',
        text: `My property in ${location} is estimated at ${formatCurrency(estimatedPrice)}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      const shareText = `My property in ${location} is estimated at ${formatCurrency(estimatedPrice || 0)}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Estimate copied to clipboard!');
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Icon size="xl" className="opacity-80">
              <Settings2 />
            </Icon>
            <h2 className="text-3xl font-extrabold text-gray-900">AI Price Estimator</h2>
          </div>
          <p className="text-lg font-medium text-gray-700">
            Get an instant property value estimate using our advanced AI
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8" aria-live="polite">
          {/* Step Progress */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
            </div>
            <span className="text-sm font-medium text-blue-700">
              {currentStep === 1 && 'Enter property details'}
              {currentStep === 2 && 'Review information'}
              {currentStep === 3 && 'Get your estimate'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-bold text-gray-800">
                <div className="flex items-center gap-1">
                  <Icon size="sm" className="text-blue-600">
                    <MapPin />
                  </Icon>
                  Location
                </div>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Lagos, Nairobi, Cape Town"
                className={cn(
                  'w-full p-3 border rounded-xl focus:ring-2 text-sm font-medium transition-colors',
                  fieldErrors.location 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                aria-describedby={fieldErrors.location ? 'location-error' : undefined}
              />
              {fieldErrors.location && (
                <p id="location-error" className="text-red-500 text-xs mt-1" role="alert">
                  {fieldErrors.location}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="squareFeet" className="block text-sm font-bold text-gray-800">
                <div className="flex items-center gap-1">
                  <Icon size="sm" className="text-blue-600">
                    <Square />
                  </Icon>
                  Square Feet
                </div>
              </label>
              <input
                id="squareFeet"
                type="number"
                min="1"
                value={squareFeet}
                onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                placeholder="1000"
                className={cn(
                  'w-full p-3 border rounded-xl focus:ring-2 text-sm font-medium transition-colors',
                  fieldErrors.squareFeet 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                aria-describedby={fieldErrors.squareFeet ? 'squareFeet-error' : undefined}
              />
              {fieldErrors.squareFeet && (
                <p id="squareFeet-error" className="text-red-500 text-xs mt-1" role="alert">
                  {fieldErrors.squareFeet}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="bedrooms" className="block text-sm font-bold text-gray-800">
                <div className="flex items-center gap-1">
                  <Icon size="sm" className="text-blue-600">
                    <Bed />
                  </Icon>
                  Bedrooms
                </div>
              </label>
              <input
                id="bedrooms"
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="3"
                className={cn(
                  'w-full p-3 border rounded-xl focus:ring-2 text-sm font-medium transition-colors',
                  fieldErrors.bedrooms 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                aria-describedby={fieldErrors.bedrooms ? 'bedrooms-error' : undefined}
              />
              {fieldErrors.bedrooms && (
                <p id="bedrooms-error" className="text-red-500 text-xs mt-1" role="alert">
                  {fieldErrors.bedrooms}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="bathrooms" className="block text-sm font-bold text-gray-800">
                <div className="flex items-center gap-1">
                  <Icon size="sm" className="text-blue-600">
                    <Bath />
                  </Icon>
                  Bathrooms
                </div>
              </label>
              <input
                id="bathrooms"
                type="number"
                min="0.5"
                step="0.5"
                value={bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="2"
                className={cn(
                  'w-full p-3 border rounded-xl focus:ring-2 text-sm font-medium transition-colors',
                  fieldErrors.bathrooms 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                aria-describedby={fieldErrors.bathrooms ? 'bathrooms-error' : undefined}
              />
              {fieldErrors.bathrooms && (
                <p id="bathrooms-error" className="text-red-500 text-xs mt-1" role="alert">
                  {fieldErrors.bathrooms}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEstimate}
              disabled={loading}
              className="group flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span>Calculating your estimate</span>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Get Estimate</span>
                    <Icon size="md" className="group-hover:translate-x-0.5 transition-transform duration-200">
                      <ArrowRight />
                    </Icon>
                  </>
                )}
              </div>
            </button>

            {estimatedPrice !== null && (
              <button
                onClick={handleShare}
                className="bg-gray-100 text-gray-800 px-6 py-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-bold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Icon size="md">
                  <Share2 />
                </Icon>
                Share
              </button>
            )}
          </div>

          {/* Results Card */}
          {estimatedPrice !== null && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Icon size="md" className="text-green-600">
                  <CheckCircle />
                </Icon>
                <h3 className="text-xl font-bold text-green-800">Estimated Property Value</h3>
              </div>
              
              <p className="text-4xl font-extrabold text-green-600 mb-4">
                {formatCurrency(estimatedPrice)}
              </p>
              
              {marketComparison && (
                <div className="bg-white bg-opacity-60 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Market Comparison:</strong> This estimate is{' '}
                    <span className={`font-semibold ${
                      marketComparison.trend === 'above' ? 'text-green-600' :
                      marketComparison.trend === 'below' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {marketComparison.trend}
                    </span>{' '}
                    the current market average of {formatCurrency(marketComparison.average)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
