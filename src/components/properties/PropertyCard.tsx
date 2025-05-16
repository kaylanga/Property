'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  HeartIcon as HeartOutlineIcon,
  ArrowsRightLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../hooks/useAuth';
import type { Property } from '../../types';
import { CurrencyConverter } from '../common/currency-converter';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();

  // Initialize favorite state if you want to sync with user data later
  const [isFavorite, setIsFavorite] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleToggleFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // You might want to add a user-friendly notification here
      console.warn('User must be logged in to favorite a property.');
      return;
    }

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    try {
      if (newFavoriteState) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId: property.id }),
        });
      } else {
        await fetch(`/api/favorites/${property.id}`, { method: 'DELETE' });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      setIsFavorite(!newFavoriteState); // revert on error
    }
  };

  const handleToggleCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsComparing((prev) => !prev);
  };

  const handleShare = (
    e: React.MouseEvent<HTMLButtonElement>,
    platform?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/properties/${property.id}`;

    if (platform) {
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent('Check out this property!');

      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'email':
          window.open(
            `mailto:?subject=${encodedText}&body=${encodedUrl}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        default:
          break;
      }

      setShowShareOptions(false);
    } else {
      setShowShareOptions((prev) => !prev);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {property.is_featured && (
        <div
          className="absolute top-4 left-4 z-10 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md"
          aria-label="Featured property"
        >
          Featured
        </div>
      )}

      {property.assistantRecommended && (
        <div
          className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
          aria-label="AI recommended property"
        >
          AI Recommended
        </div>
      )}

      <Link href={`/properties/${property.id}`} className="block" passHref>
        <div className="relative h-60 overflow-hidden rounded-t-xl cursor-pointer">
          <Image
            src={property.media.images[0]?.url || '/placeholder.png'}
            alt={property.title}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-110 transition-transform duration-500"
            priority
          />

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={handleToggleFavorite}
              className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              type="button"
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <button
              aria-pressed={isComparing}
              onClick={handleToggleCompare}
              className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                isComparing
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white'
              }`}
              type="button"
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                aria-expanded={showShareOptions}
                aria-haspopup="true"
                onClick={handleShare}
                className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                type="button"
              >
                <ShareIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>

              {showShareOptions && (
                <div
                  className="absolute top-0 right-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-2 w-8 z-20"
                  role="menu"
                  aria-label="Share options"
                >
                  {/* Twitter */}
                  <button
                    onClick={(e) => handleShare(e, 'twitter')}
                    aria-label="Share on Twitter"
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="button"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775..." />
                    </svg>
                  </button>
                  {/* Facebook */}
                  <button
                    onClick={(e) => handleShare(e, 'facebook')}
                    aria-label="Share on Facebook"
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="button"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12..." />
                    </svg>
                  </button>
                  {/* WhatsApp */}
                  <button
                    onClick={(e) => handleShare(e, 'whatsapp')}
                    aria-label="Share on WhatsApp"
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="button"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758..." />
                    </svg>
                  </button>
                  {/* Email */}
                  <button
                    onClick={(e) => handleShare(e, 'email')}
                    aria-label="Share via Email"
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600"
                    type="button"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-gray-600 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9..." />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 title={property.title} className="text-lg font-semibold truncate">
          {property.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1 truncate">
          {property.location}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg">
            <CurrencyConverter amount={property.price} currency={property.currency} />
          </span>

          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {property.type}
          </span>
        </div>
      </div>
    </div>
  );
}
