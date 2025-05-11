import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LocationMarkerIcon } from "@heroicons/react/outline";

export default function PropertyCard({
  property,
  currency = "UGX",
  showMatchScore = false,
}) {
  // Use the Image component with remote domains
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
      <div className="relative h-56">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.featured && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            Featured
          </div>
        )}
        {showMatchScore && property.matchScore && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            {property.matchScore}% Match
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <LocationMarkerIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span>{property.location}</span>
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-4">
          {currency === "UGX" && <span>UGX {property.price.UGX}</span>}
          {currency === "USD" && <span>${property.price.USD}</span>}
          {currency === "EUR" && <span>€{property.price.EUR}</span>}
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-gray-600">{property.bedrooms} bd</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011-1h8a1 1 0 011 1v1h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h1V2a1 1 0 011-1zm11 1H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600">{property.bathrooms} ba</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600">{property.area}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Link
          href={`/properties/${property.id}`}
          className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
