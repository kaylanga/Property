export type UserRole = 'client' | 'landlord' | 'broker' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    parking: number;
    furnished: boolean;
  };
  images: string[];
  status: 'available' | 'rented' | 'sold';
  type: 'apartment' | 'house' | 'land' | 'commercial';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  propertyId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'stripe' | 'paypal' | 'mobile_money';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  documentType: 'id' | 'passport' | 'business_registration';
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
} 