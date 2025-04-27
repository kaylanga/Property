'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getPropertyById } from '@/lib/supabase';
import { Property } from '@/types/property';
import { CurrencyConverter } from '@/components/common/currency-converter';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SubscriptionPlans } from '@/components/subscription/subscription-plans';

export default function PropertyDetails() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const { hasActiveSubscription } = useSubscription();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId),
  });

  if (isLoading) return <div className="flex justify-center p-8">Loading property details...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading property details</div>;
  if (!property) return <div className="text-red-500 p-8">Property not found</div>;

  const handleContactClick = () => {
    if (!hasActiveSubscription) {
      router.push('/subscription');
      return;
    }
    // Handle contact action (e.g., open chat or contact form)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Property Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative h-96">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(1, 5).map((image: string, index: number) => (
            <div key={index} className="relative h-44">
              <img
                src={image}
                alt={`${property.title} ${index + 2}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Property Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <p className="text-gray-600 mb-4">{property.location}</p>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-2xl font-bold">
              <CurrencyConverter amount={property.price} from={property.currency} />
            </div>
            <div className="flex space-x-4 text-gray-600">
              <span>{property.bedrooms} beds</span>
              <span>{property.bathrooms} baths</span>
              <span>{property.size} sq ft</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(property.amenities as Record<string, boolean>).map(([key, value]) => (
                value && (
                  <div key={key} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {property.virtualTour && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Virtual Tour</h2>
              <iframe
                src={property.virtualTour}
                className="w-full h-96 rounded-lg"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="space-y-4">
              <div>
                <span className="text-gray-600">Property Type</span>
                <p className="font-semibold capitalize">{property.propertyType}</p>
              </div>
              <div>
                <span className="text-gray-600">Condition</span>
                <p className="font-semibold capitalize">{property.propertyCondition}</p>
              </div>
              {property.yearBuilt && (
                <div>
                  <span className="text-gray-600">Year Built</span>
                  <p className="font-semibold">{property.yearBuilt}</p>
                </div>
              )}
              <div>
                <span className="text-gray-600">Property Tax</span>
                <p className="font-semibold">
                  <CurrencyConverter amount={property.propertyTax} from={property.currency} />
                </p>
              </div>
              {property.maintenanceFee && (
                <div>
                  <span className="text-gray-600">Maintenance Fee</span>
                  <p className="font-semibold">
                    <CurrencyConverter amount={property.maintenanceFee} from={property.currency} />
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Viewing Availability</h2>
            <div className="space-y-2">
              <p className="font-semibold">Available Days:</p>
              <div className="flex flex-wrap gap-2">
                {property.viewingAvailability.days.map((day: string) => (
                  <span key={day} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {day}
                  </span>
                ))}
              </div>
              <p className="font-semibold mt-4">Available Hours:</p>
              <p>{property.viewingAvailability.hours}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleContactClick}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              {hasActiveSubscription ? 'Contact Owner' : 'Subscribe to Contact'}
            </button>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
              Schedule Viewing
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Plans Modal */}
      {!hasActiveSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <SubscriptionPlans />
          </div>
        </div>
      )}
    </div>
  );
} 