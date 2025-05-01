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
enum Currency {
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
enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  LAND = 'land',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial'
}

export { PropertyType };

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
  // Additional sustainability features
  energyEfficiencyRating?: string;
  waterEfficiencyRating?: string;
  carbonFootprint?: number;
  greenBuildingCertification?: string;
  sustainabilityFeatures?: string[];
  // Additional accessibility features
  isWheelchairAccessible?: boolean;
  hasElevatorAccess?: boolean;
  hasRamps?: boolean;
  hasWideHallways?: boolean;
  hasAdaptedBathroom?: boolean;
  hasLoweredCounters?: boolean;
  hasGrabBars?: boolean;
  hasVisualAids?: boolean;
  hasAudioAids?: boolean;
  hasEmergencySystem?: boolean;
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
  metadata?: Record<string, any>;
};

 * A component that allows users to create and manage property alerts based on specific criteria.
env
ENDPOINTS_ENCRYPTION_KEY=your-32-byte-secret-key
const encryptedData = {
  iv: "your-iv-hex-string",
  content: "your-encrypted-content-hex-string"
};
const secretKey = "your-32-byte-secret-key";
try {
  const decrypted = decryptAES(encryptedData, secretKey);
  console.log('Decrypted:', decrypted);
} catch (error) {
  console.error('Decryption failed:', error);
}
interface EncryptedData {
  iv: string;
  content: string;
}
/**
 * Decrypts AES encrypted data using a 32-byte key (AES-256)
 * 
 * @param encryptedData - The encrypted data object containing IV and content
 * @param secretKey - The secret key used for decryption (must be 32 bytes for AES-256)
 * @returns The decrypted data as a string
 */
export function decryptAES(encryptedData: EncryptedData, secretKey: string): string {
  try {
    // Ensure the key is exactly 32 bytes (256 bits) for AES-256
    const key = Buffer.from(secretKey.padEnd(32, '0').slice(0, 32));
    
    // Convert IV from hex string to Buffer
    const iv = Buffer.from(encryptedData.iv, 'hex');
    
    // Create decipher
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    
    // Decrypt the content
    let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt endpoints data');
  }
}
/**
 * Generates a random encryption key of specified length
 * 
 * @param length - The length of the key in bytes
 * @returns The generated key as a hex string
 */
export function generateKey(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
interface EncryptedData {
  iv: string;
  content: string;
}
/**
 * Decrypts AES encrypted data using a 32-byte key (AES-256)
 * 
 * @param encryptedData - The encrypted data object containing IV and content
 * @param secretKey - The secret key used for decryption (must be 32 bytes for AES-256)
 * @returns The decrypted data as a string
 */
export function decryptAES(encryptedData: EncryptedData, secretKey: string): string {
  try {
    // Ensure the key is exactly 32 bytes (256 bits) for AES-256
    const key = Buffer.from(secretKey.padEnd(32, '0').slice(0, 32));
    
    // Convert IV from hex string to Buffer
    const iv = Buffer.from(encryptedData.iv, 'hex');
    
    // Create decipher
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    
    // Decrypt the content
    let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt endpoints data');
  }
}
/**
 * Generates a random encryption key of specified length
 * 
 * @param length - The length of the key in bytes
 * @returns The generated key as a hex string
 */
export function generateKey(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
 * - Location preferences
 * - Property types
 * - Price ranges
 * - Specific features
 * 
 * Features:
 * - Real-time form validation
 * - User-specific alert creation
 * - Customizable notification frequency
 * - Error handling with toast notifications
 * 
 * @component
 * @example
 *
 * Property Alerts Component
 * 
 * A component that allows users to create and manage property alerts based on specific criteria.
 * Users can set up notifications for properties matching their preferences including:
 * - Location preferences
 * - Property types
 * - Price ranges
 * - Specific features
 * 
 * Features:
 * - Real-time form validation
 * - User-specific alert creation
 * - Customizable notification frequency
 * - Error handling with toast notifications
 * 
 * @component
 * @example
 *
import { toast } from 'react-hot-toast';
import { PropertyType, Currency } from '../../types/property';
interface AlertCriteria {
  propertyTypes: PropertyType[];
  minPrice: number;
  maxPrice: number;
  currency: Currency;
  location: string;
  minBedrooms: number;
  frequency: 'daily' | 'weekly' | 'monthly';
}
export function PropertyAlerts() {
  const [criteria, setCriteria] = useState<AlertCriteria>({
    propertyTypes: [],
    minPrice: 0,
    maxPrice: 0,
    currency: Currency.UGX,
    location: '',
    minBedrooms: 0,
    frequency: 'weekly'
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });
      if (response.ok) {
        toast.success('Property alert created successfully!');
      } else {
        throw new Error('Failed to create alert');
      }
    } catch (error) {
      toast.error('Failed to create property alert');
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Property Alert</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Property Types</label>
          <select
            multiple
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value as PropertyType);
              setCriteria({ ...criteria, propertyTypes: selected });
            }}
          >
            {Object.values(PropertyType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Price</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={criteria.minPrice}
              onChange={(e) => setCriteria({ ...criteria, minPrice: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Price</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={criteria.maxPrice}
              onChange={(e) => setCriteria({ ...criteria, maxPrice: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={criteria.location}
            onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
            placeholder="Enter city or region"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Alert Frequency</label>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={criteria.frequency}
            onChange={(e) => setCriteria({ ...criteria, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
}
    interactive?: boolean;
  };
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
# Mobile Money API Keys
MTN_MOBILE_MONEY_API_KEY=your_mtn_mobile_money_api_key
MPESA_API_KEY=your_mpesa_api_key
AIRTEL_MONEY_API_KEY=your_airtel_money_api_key
TIGO_PESA_API_KEY=your_tigo_pesa_api_key
# Virtual Tour Configuration
NEXT_PUBLIC_MATTERPORT_API_KEY=your_matterport_api_key
NEXT_PUBLIC_VIRTUAL_TOUR_PROVIDER=matterport
# Property Alerts Configuration
ALERT_NOTIFICATION_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
ALERT_PROCESSING_INTERVAL=3600
# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
-- Create property_alerts table
CREATE TABLE property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
-- Add indexes for better query performance
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_active ON property_alerts(is_active);
CREATE INDEX idx_property_virtual_tour ON properties((virtual_tour IS NOT NULL));
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
-- Create property_alerts table
CREATE TABLE property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
-- Add indexes for better query performance
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_active ON property_alerts(is_active);
CREATE INDEX idx_property_virtual_tour ON properties((virtual_tour IS NOT NULL));
ALTER TABLE properties
ADD COLUMN virtual_tour jsonb DEFAULT NULL;
-- Create property_alerts table
CREATE TABLE property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  notification_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_notification_at timestamptz DEFAULT NULL
);
-- Add indexes for better query performance
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_active ON property_alerts(is_active);
CREATE INDEX idx_property_virtual_tour ON properties((virtual_tour IS NOT NULL));
import { PropertyComparison } from '@/components/properties/property-comparison';
import { PropertyAlerts } from '@/components/properties/property-alerts';
import { PropertyComparison } from '@/components/properties/property-comparison';
import { PropertyAlerts } from '@/components/properties/property-alerts';
import { PropertyComparison } from '@/components/properties/property-comparison';
import { PropertyAlerts } from '@/components/properties/property-alerts';
    lastUpdated?: string;
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