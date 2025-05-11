/**
 * Property Type Definitions
 *
 * This file contains all the type definitions related to properties
 * in the real estate marketplace.
 */

export enum PropertyType {
  Apartment = "apartment",
  House = "house",
  Villa = "villa",
  Land = "land",
  Commercial = "commercial",
  OfficeSpace = "office",
  Warehouse = "warehouse",
  Hotel = "hotel",
}

export enum Currency {
  UGX = "UGX", // Ugandan Shilling
  KES = "KES", // Kenyan Shilling
  TZS = "TZS", // Tanzanian Shilling
  NGN = "NGN", // Nigerian Naira
  GHS = "GHS", // Ghanaian Cedi
  ZAR = "ZAR", // South African Rand
  USD = "USD", // US Dollar
  EUR = "EUR", // Euro
}

export enum PropertyStatus {
  Available = "available",
  Pending = "pending",
  Sold = "sold",
  Rented = "rented",
  UnderConstruction = "under-construction",
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface PropertyPricing {
  listPrice: number;
  currency: Currency;
  pricePerSqFt?: number;
  rentalPrice?: number;
  rentalPeriod?: "daily" | "weekly" | "monthly" | "yearly";
  maintenanceFee?: number;
  propertyTax?: number;
  discount?: number;
  negotiable: boolean;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize?: number;
  yearBuilt?: number;
  parking?: number;
  furnished: boolean;
  amenities: string[];
  accessibility?: string[];
  energyRating?: string;
}

export interface PropertyMedia {
  images: {
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }[];
  videos?: {
    url: string;
    caption?: string;
    thumbnail?: string;
  }[];
  floorPlans?: {
    url: string;
    level?: string;
    squareFootage?: number;
  }[];
  virtualTour?: {
    url: string;
    provider?: string;
  };
  documents?: {
    url: string;
    name: string;
    type: string;
  }[];
}

export interface PropertyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar?: string;
  licenseNumber?: string;
  bio?: string;
  listingCount: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  location: PropertyLocation;
  pricing: PropertyPricing;
  features: PropertyFeatures;
  media: PropertyMedia;
  agent: PropertyAgent;
  listedAt: string;
  updatedAt: string;
  viewCount: number;
  is_featured?: boolean;
  verification?: {
    isVerified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
  };
  metadata?: Record<string, any>;
}

export interface PropertyAlert {
  id: string;
  userId: string;
  criteria: {
    location?: string;
    propertyTypes?: PropertyType[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    features?: string[];
  };
  isActive: boolean;
  notificationFrequency: "daily" | "weekly" | "monthly";
  createdAt: string;
  updatedAt: string;
  lastNotificationAt?: string;
}

export interface PropertyFavorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

export interface PropertyComparison {
  userId: string;
  propertyIds: string[];
  createdAt: string;
}

export interface PropertyVisit {
  id: string;
  propertyId: string;
  userId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
