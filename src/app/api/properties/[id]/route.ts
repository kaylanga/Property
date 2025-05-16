/**
 * Individual Property API Routes
 *
 * This module provides API endpoints for managing individual properties.
 * These operations are performed server-side to protect sensitive data and ensure data integrity.
 *
 * Endpoints:
 * - GET /api/properties/[id] - Get a specific property by ID
 * - PUT /api/properties/[id] - Update a specific property
 * - DELETE /api/properties/[id] - Delete a specific property
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { handleAPIError } from '@/lib/api-error-handler';

/**
 * GET handler for retrieving a specific property by ID
 *
 * @param {NextRequest} request - The incoming request
 * @param {Object} params - Route parameters
 * @param {string} params.id - The property ID
 * @returns {NextResponse} The property data or an error response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Create a Supabase client for the server-side route handler
    const supabase = createRouteHandlerClient({ cookies });

    // Get the property ID from the route parameters
    const { id } = params;

    // Fetch the property from the database
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Return the property data
    return NextResponse.json(data);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * PUT handler for updating a specific property
 *
 * @param {NextRequest} request - The incoming request with property updates
 * @param {Object} params - Route parameters
 * @param {string} params.id - The property ID
 * @returns {NextResponse} The updated property data or an error response
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Create a Supabase client for the server-side route handler
    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user's session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the property ID from the route parameters
    const { id } = params;

    // Parse the request body
    const updates = await request.json();

    // Validate the updates (implement your validation logic here)
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Check if the property exists and belongs to the current user
    const { data: existingProperty, error: fetchError } = await supabase
      .from('properties')
      .select('agentId')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if the user is authorized to update this property
    if (existingProperty.agentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove any sensitive fields that shouldn't be updated through this endpoint
    const { id: _, agentId, createdAt, ...safeUpdates } = updates;

    // Add the updated timestamp
    const propertyUpdates = {
      ...safeUpdates,
      updatedAt: new Date().toISOString(),
    };

    // Update the property in the database
    const { data, error } = await supabase
      .from('properties')
      .update(propertyUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Return the updated property data
    return NextResponse.json(data);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * DELETE handler for deleting a specific property
 *
 * @param {NextRequest} request - The incoming request
 * @param {Object} params - Route parameters
 * @param {string} params.id - The property ID
 * @returns {NextResponse} A success message or an error response
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Create a Supabase client for the server-side route handler
    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user's session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the property ID from the route parameters
    const { id } = params;

    // Check if the property exists and belongs to the current user
    const { data: existingProperty, error: fetchError } = await supabase
      .from('properties')
      .select('agentId')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if the user is authorized to delete this property
    if (existingProperty.agentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the property from the database
    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) throw error;

    // Return a success message
    return NextResponse.json(
      { message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
