'use client';

import Image from 'next/image';

interface PropertyCardProps {
  property: {
    id: string;
    title?: string;
    location?: {
      address?: string;
      city?: string;
    } | string;
    media?: {
      images?: Array<{
        url?: string;
        isPrimary?: boolean;
      }>;
    };
    pricing?: {
      listPrice?: number;
      currency?: string;
    };
    features?: {
      bedrooms?: number;
      bathrooms?: number;
    };
    image_url?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Log to debug if needed
  // console.log('Property:', property);

  const images = Array.isArray(property.media?.images) ? property.media!.images : [];
  const mainImage = images.find((img) => img?.isPrimary) || images[0];
  const imageUrl = mainImage?.url || property.image_url || '/default-property.jpg';

  const title = property.title ?? 'Untitled Property';
  const price = property.pricing?.listPrice ?? property.price ?? 0;
  const currency = property.pricing?.currency ?? 'UGX';

  const bedrooms = property.features?.bedrooms ?? property.bedrooms ?? 0;
  const bathrooms = property.features?.bathrooms ?? property.bathrooms ?? 0;

  const location = typeof property.location === 'string'
    ? property.location
    : property.location?.address || 'Location not specified';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`${title} image`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
          {location}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-green-700 dark:text-green-400">
            {currency} {price.toLocaleString()}
          </span>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            <span className="mr-2">
              {bedrooms} bed{bedrooms !== 1 ? 's' : ''}
            </span>
            •
            <span className="ml-2">
              {bathrooms} bath{bathrooms !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
