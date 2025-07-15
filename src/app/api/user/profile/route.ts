/**
 * User Profile API Routes
 *
 * This module provides API endpoints for user profile management.
 * These operations are performed server-side to protect sensitive data.
 *
 * Endpoints:
 * - GET /api/user/profile - Get the current user's profile
 * - PUT /api/user/profile - Update the current user's profile
 * - DELETE /api/user/profile - Delete the current user's profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { handleAPIError } from '@/lib/api-error-handler';

/**
 * GET handler for retrieving the current user's profile
 *
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} The user's profile data or an error response
 */
export async function GET(_request: NextRequest) {
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

    // Fetch the user's profile from the database
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;

    // Return the profile data, excluding sensitive fields
    const { password_hash: _password_hash, ...safeProfile } = data;
    return NextResponse.json(safeProfile);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * PUT handler for updating the current user's profile
 *
 * @param {NextRequest} request - The incoming request with profile updates
 * @returns {NextResponse} The updated profile data or an error response
 */
export async function PUT(request: NextRequest) {
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

    // Parse the request body
    const updates = await request.json();

    // Validate the updates (implement your validation logic here)
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Remove any sensitive fields that shouldn't be updated through this endpoint
    const { id: _id, role: _role, is_verified: _is_verified, ...safeUpdates } = updates;

    // Update the user's profile in the database
    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) throw error;

    // Return the updated profile data, excluding sensitive fields
    const { password_hash: _password_hash, ...safeProfile } = data;
    return NextResponse.json(safeProfile);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * DELETE handler for deleting the current user's profile
 * This is a sensitive operation that should only be performed server-side
 *
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} A success message or an error response
 */
export async function DELETE(_request: NextRequest) {
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

    // Delete the user's profile from the database
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', session.user.id);

    if (deleteError) throw deleteError;

    // Delete the user's auth account
    const { error: authError } = await supabase.auth.admin.deleteUser(
      session.user.id
    );

    if (authError) throw authError;

    // Return a success message
    return NextResponse.json(
      { message: 'Profile deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
