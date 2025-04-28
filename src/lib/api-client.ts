/**
 * API Client
 * 
 * This module provides a type-safe client for interacting with the Property Africa API.
 * It includes methods for all CRUD operations on properties and user profiles,
 * with proper error handling and response typing.
 */

import { Property } from '../types/property';

/**
 * API Response interface
 */
export interface APIResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

/**
 * API Error interface
 */
export interface APIError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

/**
 * Property filter interface
 */
export interface PropertyFilter {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFootage?: number;
  maxSquareFootage?: number;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  agentId?: string;
  isVerified?: boolean;
  tags?: string[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * API Client class
 */
class APIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  /**
   * Get headers for request
   */
  private getHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        code: data.code || 'UNKNOWN_ERROR',
        status: response.status,
        details: data.details,
      } as APIError;
    }

    return data as APIResponse<T>;
  }

  /**
   * Make GET request
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    const response = await fetch(this.buildURL(path, params), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Make POST request
   */
  async post<T>(path: string, data: any): Promise<APIResponse<T>> {
    const response = await fetch(this.buildURL(path), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Make PUT request
   */
  async put<T>(path: string, data: any): Promise<APIResponse<T>> {
    const response = await fetch(this.buildURL(path), {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Make DELETE request
   */
  async delete<T>(path: string): Promise<APIResponse<T>> {
    const response = await fetch(this.buildURL(path), {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

// Create API client instance
const apiClient = new APIClient();

/**
 * Property API methods
 */

export async function getProperties(filter?: PropertyFilter): Promise<APIResponse<Property[]>> {
  return apiClient.get<Property[]>('/properties', filter);
}

export async function getPropertyById(id: string): Promise<APIResponse<Property>> {
  return apiClient.get<Property>(`/properties/${id}`);
}

export async function createProperty(property: Omit<Property, 'id'>): Promise<APIResponse<Property>> {
  return apiClient.post<Property>('/properties', property);
}

export async function updateProperty(id: string, property: Partial<Property>): Promise<APIResponse<Property>> {
  return apiClient.put<Property>(`/properties/${id}`, property);
}

export async function deleteProperty(id: string): Promise<APIResponse<void>> {
  return apiClient.delete<void>(`/properties/${id}`);
}

/**
 * User Profile API methods
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  bio?: string;
  photo?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getUserProfile(): Promise<APIResponse<UserProfile>> {
  return apiClient.get<UserProfile>('/profile');
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
  return apiClient.put<UserProfile>('/profile', profile);
}

export async function deleteUserProfile(): Promise<APIResponse<void>> {
  return apiClient.delete<void>('/profile');
}

/**
 * Export API client instance
 */
export default apiClient; 