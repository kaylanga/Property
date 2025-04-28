/**
 * Property Types
 * 
 * This module defines the types and interfaces related to properties in the system.
 * It includes the main Property interface and related types for property features,
 * locations, and other property-specific data.
 */

/**
 * Currency enum for supported currencies in the system
 */
export enum Currency {
  UGX = 'UGX', // Ugandan Shilling
  USD = 'USD', // US Dollar
  KES = 'KES', // Kenyan Shilling
  TZS = 'TZS', // Tanzanian Shilling
  RWF = 'RWF'  // Rwandan Franc
}

/**
 * Property status enum
 */
export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending',
  OFF_MARKET = 'off_market'
}

/**
 * Property type enum
 */
export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  LAND = 'land',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial'
}

/**
 * Property features interface
 */
export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  squareFootage: number;
  yearBuilt?: number;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasSecurity?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  hasElevator?: boolean;
  hasGym?: boolean;
  hasParking?: boolean;
  hasStorage?: boolean;
  hasBalcony?: boolean;
  hasTerrace?: boolean;
  hasFireplace?: boolean;
  hasBasement?: boolean;
  hasAttic?: boolean;
  hasSolarPanels?: boolean;
  hasSmartHome?: boolean;
  hasFiberInternet?: boolean;
  hasSatelliteTV?: boolean;
  hasCableTV?: boolean;
  hasHighSpeedInternet?: boolean;
  hasPhoneLine?: boolean;
  hasNaturalGas?: boolean;
  hasElectricity?: boolean;
  hasWater?: boolean;
  hasSewage?: boolean;
  hasTrash?: boolean;
  hasRecycling?: boolean;
  hasComposting?: boolean;
  hasRainwaterHarvesting?: boolean;
  hasGreywaterSystem?: boolean;
  hasSolarWaterHeating?: boolean;
  hasGeothermalHeating?: boolean;
  hasWindPower?: boolean;
  hasHydroPower?: boolean;
  hasBiomassPower?: boolean;
  hasNuclearPower?: boolean;
  hasCoalPower?: boolean;
  hasOilPower?: boolean;
  hasGasPower?: boolean;
  hasOtherPower?: boolean;
  hasOtherHeating?: boolean;
  hasOtherCooling?: boolean;
  hasOtherWater?: boolean;
  hasOtherSewage?: boolean;
  hasOtherTrash?: boolean;
  hasOtherRecycling?: boolean;
  hasOtherComposting?: boolean;
  hasOtherRainwater?: boolean;
  hasOtherGreywater?: boolean;
  hasOtherSolar?: boolean;
  hasOtherGeothermal?: boolean;
  hasOtherWind?: boolean;
  hasOtherHydro?: boolean;
  hasOtherBiomass?: boolean;
  hasOtherNuclear?: boolean;
  hasOtherCoal?: boolean;
  hasOtherOil?: boolean;
  hasOtherGas?: boolean;
  hasOther?: boolean;
}

/**
 * Property location interface
 */
export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  subdivision?: string;
  schoolDistrict?: string;
  taxDistrict?: string;
  floodZone?: string;
  zoning?: string;
  lotSize?: number;
  lotDimensions?: {
    width: number;
    length: number;
    unit: 'feet' | 'meters';
  };
  view?: string[];
  accessibility?: string[];
  nearbyAmenities?: string[];
  nearbyTransportation?: string[];
  nearbySchools?: string[];
  nearbyShopping?: string[];
  nearbyRestaurants?: string[];
  nearbyEntertainment?: string[];
  nearbyHealthcare?: string[];
  nearbyParks?: string[];
  nearbyRecreation?: string[];
  nearbyServices?: string[];
  nearbyOther?: string[];
}

/**
 * Property media interface
 */
export interface PropertyMedia {
  images: {
    url: string;
    caption?: string;
    isPrimary: boolean;
    order: number;
  }[];
  videos?: {
    url: string;
    caption?: string;
    thumbnail?: string;
    duration?: number;
  }[];
  virtualTour?: {
    url: string;
    type: '3d' | '360' | 'video';
    thumbnail?: string;
  };
  floorPlans?: {
    url: string;
    caption?: string;
    level?: number;
  }[];
  documents?: {
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
}

/**
 * Property pricing interface
 */
export interface PropertyPricing {
  listPrice: number;
  currency: Currency;
  pricePerSquareFoot?: number;
  priceHistory?: {
    price: number;
    date: string;
    type: 'list' | 'sold' | 'rent';
  }[];
  taxes?: {
    annual: number;
    monthly: number;
    lastUpdated: string;
  };
  fees?: {
    name: string;
    amount: number;
    frequency: 'one-time' | 'monthly' | 'annual';
    description?: string;
  }[];
  incentives?: {
    name: string;
    description: string;
    value: number;
    type: 'percentage' | 'fixed';
    expiryDate?: string;
  }[];
}

/**
 * Property agent interface
 */
export interface PropertyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  title?: string;
  photo?: string;
  bio?: string;
  website?: string;
  socialMedia?: {
    platform: string;
    url: string;
  }[];
  languages?: string[];
  specialties?: string[];
  yearsOfExperience?: number;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiry?: string;
  officeLocation?: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  officePhone?: string;
  officeEmail?: string;
  officeWebsite?: string;
  officeHours?: {
    day: string;
    open: string;
    close: string;
  }[];
}

/**
 * Main Property interface
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  status: PropertyStatus;
  type: PropertyType;
  features: PropertyFeatures;
  location: PropertyLocation;
  media: PropertyMedia;
  pricing: PropertyPricing;
  agent: PropertyAgent;
  agentId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  metadata?: Record<string, any>;
  views?: number;
  favorites?: number;
  shares?: number;
  inquiries?: number;
  showings?: number;
  offers?: number;
  lastViewed?: string;
  lastInquired?: string;
  lastShown?: string;
  lastOffered?: string;
  lastUpdated?: string;
  lastVerified?: string;
  lastPublished?: string;
  lastUnpublished?: string;
  lastArchived?: string;
  lastUnarchived?: string;
  lastDeleted?: string;
  lastRestored?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  lastModifiedReason?: string;
  lastModifiedNotes?: string;
  lastModifiedMetadata?: Record<string, any>;
} 