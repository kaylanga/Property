'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
        toast.error('All fields are required');
        return;
      }
      // Password validation
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }
      // Password confirmation validation
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      await signUp(formData.email, formData.password, formData.fullName);
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes('email')) {
          toast.error('This email is already registered');
        } else if (error.message.includes('password')) {
          toast.error('Password is too weak. Please use a stronger password');
      } else {
-- Add virtual tour support to properties table
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
-- Create property_alerts table
CREATE TABLE property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
-- Create property_alerts table
CREATE TABLE property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
interface AlertCriteria {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
}
export function PropertyAlerts() {
  const { user } = useAuth();
  const [criteria, setCriteria] = useState<AlertCriteria>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create property alerts');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          criteria,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create alert');
      }
      toast.success('Property alert created successfully');
      setCriteria({});
    } catch (error) {
      toast.error('Failed to create property alert');
      console.error('Error creating alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Property Alerts</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={criteria.location || ''}
            onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter location"
          />
        </div>
        
        {/* Add more form fields for other criteria */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Alert...' : 'Create Alert'}
        </button>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { Property } from '../../types/property';
import { CurrencyConverter } from '../common/currency-converter';
interface PropertyComparisonProps {
  properties: Property[];
}
export function PropertyComparison({ properties }: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const addToComparison = (property: Property) => {
    if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };
  const removeFromComparison = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Property Comparison</h2>
      
      {selectedProperties.length === 0 ? (
        <p className="text-gray-500">
          Select up to 3 properties to compare
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left">
                  Features
                </th>
                {selectedProperties.map(property => (
                  <th key={property.id} className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col items-center">
                      <img
                        src={property.media.images[0].url}
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded-lg mb-2"
                      />
                      <span className="text-sm font-medium">{property.title}</span>
                      <button
                        onClick={() => removeFromComparison(property.id)}
                        className="text-red-500 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4">Price</td>
                {selectedProperties.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center">
                    <CurrencyConverter
                      amount={property.pricing.listPrice}
                      fromCurrency={property.pricing.currency}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4">Location</td>
                {selectedProperties.map(property => (
                  <td key={property.id} className="px-6 py-4 text-center">
                    {property.location.address}
                  </td>
                ))}
              </tr>
              {/* Add more comparison rows for other features */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Property } from '../../types/property';
interface VirtualTourProps {
  property: Property;
}
export function VirtualTour({ property }: VirtualTourProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tourUrl, setTourUrl] = useState<string | null>(null);
  useEffect(() => {
    if (property.media.virtualTour?.url) {
      setTourUrl(property.media.virtualTour.url);
      setIsLoading(false);
    }
  }, [property]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!tourUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          Virtual tour not available for this property
        </p>
      </div>
    );
  }
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={tourUrl}
        className="w-full h-full rounded-lg"
        allowFullScreen
      />
    </div>
  );
}
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PropertyType, Currency } from '../../types/property';
interface AlertCriteria {
  propertyType: PropertyType[];
  minPrice: number;
  maxPrice: number;
  currency: Currency;
  location: string;
  minBedrooms: number;
  frequency: 'daily' | 'weekly' | 'monthly';
}
export function PropertyAlerts() {
  const [criteria, setCriteria] = useState<AlertCriteria>({
    propertyType: [],
    minPrice: 0,
    maxPrice: 0,
    currency: Currency.UGX,
    location: '',
    minBedrooms: 0,
    frequency: 'weekly'
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });
      if (response.ok) {
        toast.success('Property alert created successfully!');
      } else {
        throw new Error('Failed to create alert');
      }
    } catch (error) {
      toast.error('Failed to create property alert');
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Property Alert</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Property Type</label>
          <select
            multiple
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value as PropertyType);
              setCriteria({ ...criteria, propertyType: selected });
            }}
          >
            {Object.values(PropertyType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Price</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={criteria.minPrice}
              onChange={(e) => setCriteria({ ...criteria, minPrice: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Price</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={criteria.maxPrice}
              onChange={(e) => setCriteria({ ...criteria, maxPrice: Number(e.target.value) })}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { Property } from '../../types/property';
import { CurrencyConverter } from '../common/currency-converter';
interface PropertyComparisonProps {
  properties: Property[];
}
export function PropertyComparison({ properties }: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const addToComparison = (property: Property) => {
    if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };
  const removeFromComparison = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Compare Properties</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selectedProperties.map(property => (
          <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <img
              src={property.media.images[0].url}
              alt={property.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
            
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Price: </span>
                <CurrencyConverter 
                  amount={property.pricing.listPrice} 
                  fromCurrency={property.pricing.currency}
                />
              </p>
              <p>
                <span className="font-medium">Location: </span>
                {property.location.address}
              </p>
              <p>
                <span className="font-medium">Size: </span>
                {property.features.squareFootage} sq ft
              </p>
              <p>
                <span className="font-medium">Bedrooms: </span>
                {property.features.bedrooms}
              </p>
              <p>
                <span className="font-medium">Bathrooms: </span>
                {property.features.bathrooms}
              </p>
            </div>
            
            <button
              onClick={() => removeFromComparison(property.id)}
              className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Remove from Comparison
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Property } from '../../types/property';
interface VirtualTourProps {
  property: Property;
}
export function VirtualTour({ property }: VirtualTourProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tourUrl, setTourUrl] = useState<string>('');
  useEffect(() => {
    if (property.media?.virtualTour?.url) {
      setTourUrl(property.media.virtualTour.url);
      setIsLoading(false);
    }
  }, [property]);
  if (!property.media?.virtualTour) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p>Virtual tour not available for this property</p>
      </div>
    );
  }
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <iframe
        src={tourUrl}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Property } from '../../types/property';
interface VirtualTourProps {
  property: Property;
}
export function VirtualTour({ property }: VirtualTourProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tourUrl, setTourUrl] = useState<string>('');
  useEffect(() => {
    if (property.media?.virtualTour?.url) {
      setTourUrl(property.media.virtualTour.url);
      setIsLoading(false);
    }
  }, [property]);
  if (!property.media?.virtualTour) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p>Virtual tour not available for this property</p>
      </div>
    );
  }
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <iframe
        src={tourUrl}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
    }
    }
  };
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="full-name" className="sr-only">
                Full Name
              </label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 