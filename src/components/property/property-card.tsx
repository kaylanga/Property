import React from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-sm rounded">
            {property.listingType}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600">{property.title}</h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {property.location.address}, {property.location.city}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold">
            {property.currency} {property.price.toLocaleString()}
          </span>
          <div className="text-sm text-gray-500 space-x-2">
            {property.features.bedrooms && (
              <span>{property.features.bedrooms} beds</span>
            )}
            {property.features.bathrooms && (
              <span>• {property.features.bathrooms} baths</span>
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded"
            >
              {amenity}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {property.propertyCondition.replace('_', ' ')}
          </span>
          <span className={`${property.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}`}>
            {property.status}
          </span>
        </div>
      </div>
    </div>
  );
}; 