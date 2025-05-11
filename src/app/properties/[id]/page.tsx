"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { VirtualTourViewer } from "../../../components/virtual-tour/VirtualTourViewer";
import { supabase } from "../../../lib/supabase";
import { CurrencyConverter } from "../../../components/common/currency-converter";
import { Property } from "../../../types/property";
import Link from "next/link";
import Image from "next/image";
import {
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  HomeIcon,
  ArrowsRightLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch property data
  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
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
          .from("favorites")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("property_id", id)
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
        await supabase.from("favorites").insert({
          user_id: session.user.id,
          property_id: id,
          created_at: new Date().toISOString(),
        });
      } else {
        // Remove from favorites
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", session.user.id)
          .eq("property_id", id);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
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
      {/* Breadcrumbs */}
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

      {/* Property Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>
              {property.location.address}, {property.location.city},{" "}
              {property.location.country}
            </span>
          </div>
        </div>

        <div className="flex space-x-4 mt-4 sm:mt-0">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full border ${
              isFavorite
                ? "bg-red-100 border-red-400 text-red-500 dark:bg-red-900 dark:border-red-700"
                : "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400"
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

      {/* Property Media */}
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
        ) : (
          <div>
            <div className="relative h-[450px] rounded-lg overflow-hidden mb-4">
              <img
                src={property.media.images[activeImage].url}
                alt={`${property.title} - Image ${activeImage + 1}`}
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
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Virtual Tour
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {property.media.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden h-24 ${
                    activeImage === index ? "ring-2 ring-blue-600" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image.url}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Property Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Overview */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <HomeIcon className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Type
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {property.type}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Bedrooms
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {property.features.bedrooms}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Bathrooms
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {property.features.bathrooms}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Size
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {property.features.squareFootage} sqm
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Features & Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.features.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Location
            </h2>
            <div className="rounded-lg overflow-hidden h-64 mb-4">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${property.location.latitude},${property.location.longitude}&zoom=15&size=600x400&markers=color:red%7C${property.location.latitude},${property.location.longitude}&key=YOUR_API_KEY`}
                alt="Property Location Map"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-start space-x-2">
              <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <address className="not-italic text-gray-700 dark:text-gray-300">
                {property.location.address}
                <br />
                {property.location.city}, {property.location.state}{" "}
                {property.location.postalCode}
                <br />
                {property.location.country}
              </address>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Price
              </span>
              <div className="flex items-end">
                <CurrencyConverter
                  amount={property.pricing.listPrice}
                  fromCurrency={property.pricing.currency}
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                />
                {property.pricing.pricePerSqFt && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    (${property.pricing.pricePerSqFt}/sq ft)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {new Date(property.listedAt).toLocaleDateString()} -{" "}
                {property.status}
              </span>
            </div>

            <div className="space-y-3">
              <a
                href={`/chat?property=${property.id}`}
                className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center"
              >
                Contact Agent
              </a>
              <a
                href={`/properties/${property.id}/schedule`}
                className="block w-full py-3 px-4 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg text-center border border-gray-300 dark:border-gray-600"
              >
                Schedule Viewing
              </a>
              <button
                onClick={toggleFavorite}
                className={`w-full py-3 px-4 font-medium rounded-lg text-center flex items-center justify-center ${
                  isFavorite
                    ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {isFavorite ? (
                  <>
                    <HeartIconSolid className="h-5 w-5 mr-2" />
                    Saved to Favorites
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5 mr-2" />
                    Save to Favorites
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Agent Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                <img
                  src={property.agent.avatar || "/images/default-avatar.png"}
                  alt={property.agent.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {property.agent.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {property.agent.company}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {property.agent.phone}
                </a>
              </div>
              <div className="flex">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {property.agent.email}
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <a
                href={`/agents/${property.agent.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View all {property.agent.listingCount} properties from this
                agent
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
