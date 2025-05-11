"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HeartIcon,
  ArrowsRightLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../../hooks/useAuth";
import { Property } from "../../types/property";
import { CurrencyConverter } from "../common/currency-converter";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    setIsFavorite(!isFavorite);

    // In a real implementation, would save to database
    try {
      if (!isFavorite) {
        // Add to favorites
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: property.id }),
        });
      } else {
        // Remove from favorites
        await fetch(`/api/favorites/${property.id}`, { method: "DELETE" });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      setIsFavorite(!isFavorite); // Revert on error
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsComparing(!isComparing);

    // In a real implementation, would update comparison state in a global context
  };

  const handleShare = (e: React.MouseEvent, platform?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (platform) {
      // Share to specific platform
      const shareUrl = `${window.location.origin}/properties/${property.id}`;

      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${shareUrl}&text=Check out this property!`,
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
          );
          break;
        case "whatsapp":
          window.open(
            `https://wa.me/?text=Check out this property! ${shareUrl}`,
          );
          break;
        case "email":
          window.open(
            `mailto:?subject=Check out this property&body=${shareUrl}`,
          );
          break;
      }

      setShowShareOptions(false);
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  // Format the price with proper currency symbol
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Property Badge */}
      {property.is_featured && (
        <div className="absolute top-4 left-4 z-10 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md">
          Featured
        </div>
      )}

      {/* Property Image */}
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-60 overflow-hidden">
          <Image
            src={property.media.images[0].url}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-500"
          />

          {/* Controls overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              {isFavorite ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <button
              onClick={handleToggleCompare}
              className={`p-2 ${
                isComparing
                  ? "bg-blue-600 text-white"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300"
              } rounded-full hover:bg-blue-600 hover:text-white transition-colors`}
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <ShareIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>

              {showShareOptions && (
                <div className="absolute top-0 right-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-2 w-8">
                  <button
                    onClick={(e) => handleShare(e, "twitter")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-blue-400"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleShare(e, "facebook")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-blue-600"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleShare(e, "whatsapp")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-green-500"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleShare(e, "email")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current text-gray-600 dark:text-gray-400"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Property Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md mb-2">
              {property.type}
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              <Link
                href={`/properties/${property.id}`}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {property.title}
              </Link>
            </h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">From</div>
            <CurrencyConverter
              amount={property.pricing.listPrice}
              fromCurrency={property.pricing.currency}
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {property.location.city}, {property.location.country}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {property.features.bedrooms} bd
            </span>
          </div>
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011-1h8a1 1 0 011 1v1h1a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h1V2a1 1 0 011-1zm11 1H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {property.features.bathrooms} ba
            </span>
          </div>
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {property.features.squareFootage} m²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
