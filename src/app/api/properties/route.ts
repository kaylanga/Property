/**
 * Properties API Routes
 * 
 * This module provides API endpoints for property management.
 * These operations are performed server-side to protect sensitive data and ensure data integrity.
 * 
 * Endpoints:
 * - GET /api/properties - Get properties with optional filtering
 * - POST /api/properties - Create a new property
 * - PUT /api/properties/[id] - Update an existing property
 * - DELETE /api/properties/[id] - Delete a property
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { handleAPIError } from '@/lib/api-error-handler';
import { Property } from '@/types/property';

/**
 * GET handler for retrieving properties with optional filtering
 * 
 * @param {NextRequest} request - The incoming request with optional query parameters
 * @returns {NextResponse} The properties data or an error response
 */
export async function GET(request: NextRequest) {
  try {
    // Create a Supabase client for the server-side route handler
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const propertyType = searchParams.get('propertyType');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    
    // Build the query
    let query = supabase.from('properties').select('*');
    
    // Apply filters if provided
    if (location) {
      query = query.ilike('location->city', `%${location}%`);
    }
    
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice));
    }
    
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice));
    }
    
    if (propertyType) {
      query = query.eq('type', propertyType);
    }
    
    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Return the properties data
    return NextResponse.json({
      properties: data,
      count: count || data.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST handler for creating a new property
 * 
 * @param {NextRequest} request - The incoming request with property data
 * @returns {NextResponse} The created property data or an error response
 */
export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client for the server-side route handler
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const propertyData = await request.json();
    
    // Validate the property data (implement your validation logic here)
    if (!propertyData || typeof propertyData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Add metadata to the property
    const newProperty = {
      ...propertyData,
      agentId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: false, // New properties start as unverified
    };
    
    // Insert the property into the database
    const { data, error } = await supabase
      .from('properties')
      .insert(newProperty)
      .select()
      .single();
    
    if (error) throw error;
    
    // Return the created property data
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
} 