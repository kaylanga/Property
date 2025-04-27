export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL'
}

export enum Currency {
  UGX = 'UGX',
  USD = 'USD',
  KES = 'KES',
  TZS = 'TZS'
}

export type PropertyStatus = 'for-sale' | 'for-rent';

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
  price: number;
  currency: Currency;
  location: {
    address: string;
    city: string;
    district: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area: number; // in square meters
    yearBuilt?: number;
    parking?: number;
    furnished: boolean;
  };
  amenities: string[];
  images: string[];
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | 'PENDING';
  listingType: 'SALE' | 'RENT';
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  verified: boolean;
  documents: {
    title: string;
    url: string;
    type: string;
  }[];
  virtualTour?: string;
  propertyTax: number;
  maintenanceFee?: number;
  yearBuilt?: number;
  lastRenovated?: number;
  zoning?: string;
  propertyCondition: 'new' | 'excellent' | 'good' | 'fair' | 'needs_renovation';
  viewingAvailability: {
    days: string[];
    hours: string;
  };
} 