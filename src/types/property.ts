export type PropertyType = 'apartment' | 'house' | 'condo' | 'land' | 'unfinished';

export type PropertyStatus = 'for-sale' | 'for-rent';

export type Currency = 'UGX' | 'USD' | 'KES' | 'TZS' | 'RWF';

export type Amenity = 
  | 'parking'
  | 'security'
  | 'swimming-pool'
  | 'gym'
  | 'garden'
  | 'furnished'
  | 'air-conditioning'
  | 'internet'
  | 'water-supply'
  | 'electricity'
  | 'fence'
  | 'gate';

export interface Location {
  city: string;
  district: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  totalArea: number; // in square meters
  yearBuilt?: number;
  floor?: number;
  totalFloors?: number;
  parkingSpaces?: number;
  amenities: Amenity[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: Currency;
  location: Location;
  features: PropertyFeatures;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  agentId: string;
  isVerified: boolean;
  isFeatured: boolean;
} 