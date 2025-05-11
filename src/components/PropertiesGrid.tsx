"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase-client";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image_url: string;
  created_at: string;
}

export default function PropertiesGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setProperties(data || []);
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        setError(error.message || "Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="flex justify-between mt-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
          Error loading properties
        </h3>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          This could be because:
          <ul className="list-disc pl-5 mt-2">
            <li>The database connection failed</li>
            <li>The 'properties' table doesn't exist</li>
            <li>You haven't added any properties yet</li>
          </ul>
        </p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          No properties found
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          Your database connection is working, but there are no properties in
          your database yet.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Let's add some sample properties to display!
        </p>
        <button
          onClick={async () => {
            try {
              const sampleProperties = [
                {
                  title: "Modern Apartment in Kampala",
                  description:
                    "A beautiful modern apartment with stunning views of the city.",
                  price: 350000,
                  location: "Kampala, Uganda",
                  bedrooms: 3,
                  bathrooms: 2,
                  image_url:
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                },
                {
                  title: "Luxury Villa in Entebbe",
                  description:
                    "Spacious luxury villa with private garden and pool.",
                  price: 750000,
                  location: "Entebbe, Uganda",
                  bedrooms: 5,
                  bathrooms: 4,
                  image_url:
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                },
                {
                  title: "Cozy Family Home",
                  description:
                    "Perfect family home in a quiet neighborhood with schools nearby.",
                  price: 280000,
                  location: "Jinja, Uganda",
                  bedrooms: 4,
                  bathrooms: 3,
                  image_url:
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                },
              ];

              // Insert sample properties
              const { data, error } = await supabase
                .from("properties")
                .insert(sampleProperties)
                .select();

              if (error) throw error;

              // Update the state with the new properties
              setProperties(data || []);
            } catch (error: any) {
              console.error("Error adding sample properties:", error);
              setError(error.message || "Failed to add sample properties");
            }
          }}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Sample Properties
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="h-48 overflow-hidden">
            <img
              src={
                property.image_url ||
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {property.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
              {property.description}
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              ${property.price.toLocaleString()}
            </p>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>{property.bedrooms} bd</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011-1h8a1 1 0 011 1v1h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h1V2a1 1 0 011-1zm11 1H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{property.bathrooms} ba</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{property.location}</span>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Link
              href={`/properties/${property.id}`}
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-md"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
