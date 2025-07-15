'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../../components/auth/protected-route';
import DashboardHeader from '../../../components/user/DashboardHeader';
import Link from 'next/link';
import { 
  BuildingOfficeIcon, 
  PlusCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url: string;
  type: string;
  status: 'active' | 'pending' | 'sold' | 'rented';
  views: number;
  inquiries: number;
  created_at: string;
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern 3BR Apartment in Kampala',
      price: 1200000,
      location: 'Kampala, Uganda',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      image_url: '/images/default-property.jpg',
      type: 'apartment',
      status: 'active',
      views: 245,
      inquiries: 12,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'Luxury Villa in Nakuru',
      price: 3500000,
      location: 'Nakuru, Kenya',
      bedrooms: 5,
      bathrooms: 4,
      area: 300,
      image_url: '/images/default-property.jpg',
      type: 'villa',
      status: 'active',
      views: 189,
      inquiries: 8,
      created_at: '2024-01-12'
    },
    {
      id: '3',
      title: 'Commercial Office Space',
      price: 5000000,
      location: 'Nairobi, Kenya',
      bedrooms: 0,
      bathrooms: 4,
      area: 500,
      image_url: '/images/default-property.jpg',
      type: 'commercial',
      status: 'rented',
      views: 156,
      inquiries: 25,
      created_at: '2024-01-08'
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [_loading, _setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rented': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  const handleDelete = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  return (
    <ProtectedRoute requiredRole="landlord">
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Properties</h1>
              <p className="text-gray-600">Manage your property listings and track performance</p>
            </div>
            <Link
              href="/sell/property-upload"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add New Property
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.reduce((sum, p) => sum + p.views, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <HomeIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.reduce((sum, p) => sum + p.inquiries, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex space-x-2">
              {['all', 'active', 'pending', 'sold', 'rented'].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${
                    filter === option
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Image */}
                <div className="relative h-48">
                  <img 
                    src={property.image_url} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-property.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium capitalize ${
                      getStatusColor(property.status)
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-gray-800 capitalize">
                      {property.type}
                    </span>
                  </div>
                </div>
                
                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  
                  <div className="text-lg font-bold text-green-600 mb-3">
                    {formatCurrency(property.price)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <HomeIcon className="h-4 w-4 mr-1" />
                      {property.bedrooms} beds
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {property.views} views
                    </div>
                    <div className="text-xs">
                      {property.area} m²
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{property.inquiries} inquiries</span>
                    <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      href={`/properties/${property.id}`}
                      className="flex-1 flex items-center justify-center py-2 px-3 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <Link 
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="flex-1 flex items-center justify-center py-2 px-3 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="flex items-center justify-center py-2 px-3 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'You haven\'t listed any properties yet.' 
                  : `No properties with status "${filter}" found.`}
              </p>
              <Link
                href="/sell/property-upload"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                List Your First Property
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

