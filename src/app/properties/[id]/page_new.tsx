'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { VirtualTourViewer } from '../../../components/virtual-tour/VirtualTourViewer';
import { supabase } from '../../../lib/supabase';
import { CurrencyConverter } from '../../../components/common/currency-converter';
import { Property } from '../../../types/property';
import Link from 'next/link';
import Image from 'next/image';
import {
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  HomeIcon,
  ArrowsRightLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeImage, setActiveImage] = useState(0);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch property data
  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Property;
    },
    enabled: !!id,
  });

  // Check if property is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('property_id', id)
          .maybeSingle();

        setIsFavorite(!!data);
      }
    };

    checkFavorite();
  }, [id]);

  const toggleFavorite = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login
      window.location.href = `/login?redirectTo=/properties/${id}`;
      return;
    }

    setIsFavorite(!isFavorite);

    try {
      if (!isFavorite) {
        // Add to favorites
        await supabase.from('favorites').insert({
          user_id: session.user.id,
          property_id: id,
          created_at: new Date().toISOString(),
        });
      } else {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('property_id', id);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      setIsFavorite(!isFavorite); // Revert on error
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>

              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Property
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find the property you're looking for. It may have been
          removed or there might be a temporary issue.
        </p>
        <Link
          href="/properties"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li>
            <Link
              href="/properties"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Properties
            </Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li className="text-gray-800 dark:text-gray-200">{property.title}</li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>
              {property.location.address}, {property.location.city},{' '}
              {property.location.country}
            </span>
          </div>
        </div>

        <div className="flex space-x-4 mt-4 sm:mt-0">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full border ${
              isFavorite
                ? 'bg-red-100 border-red-400 text-red-500 dark:bg-red-900 dark:border-red-700'
                : 'border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            {isFavorite ? (
              <HeartIconSolid className="h-5 w-5" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>

          <button className="p-2 rounded-full border border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400">
            <ShareIcon className="h-5 w-5" />
          </button>

          <button className="p-2 rounded-full border border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400">
            <ArrowsRightLeftIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-12">
        {showVirtualTour && property.media?.virtualTour ? (
          <div className="mb-4">
            <VirtualTourViewer property={property} />
            <button
              onClick={() => setShowVirtualTour(false)}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              View Photos
            </button>
          </div>
        ) : property.media?.images?.length ? (
          <div>
            <div className="relative h-[450px] rounded-lg overflow-hidden mb-4">
              <Image
                src={property.media.images[activeImage].url}
                alt={`${property.title} - Image ${activeImage + 1}`}
                fill
                className="w-full h-full object-cover"
              />

              {property.media?.virtualTour && (
                <button
                  onClick={() => setShowVirtualTour(true)}
                  className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Virtual Tour
                </button>
              )}

              <div className="absolute bottom-4 left-4 flex space-x-2">
                {property.media.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === activeImage
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {property.media.images.slice(0, 6).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    index === activeImage
                      ? 'border-blue-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${property.title} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[450px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No images available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Property Features
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <HomeIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  {property.type}
                </span>
              </div>
              {property.bedrooms && (
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    {property.bedrooms} Bedrooms
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    {property.bathrooms} Bathrooms
                  </span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    {property.area} sq ft
                  </span>
                </div>
              )}
            </div>
          </div>

          {property.features && property.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Additional Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              <CurrencyConverter
                amount={property.price}
                fromCurrency={property.currency}
              />
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              {property.priceType}
            </div>

            <div className="space-y-4 mb-6">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">
                Contact Agent
              </button>
              <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium">
                Schedule Viewing
              </button>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Listed on {new Date(property.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Property Agent
            </h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {property.agent?.name || 'Agent Name'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.agent?.company || 'Real Estate Company'}
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div>Phone: {property.agent?.phone || '+1 (555) 123-4567'}</div>
              <div>Email: {property.agent?.email || 'agent@company.com'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
