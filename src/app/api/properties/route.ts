import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { handleAPIError } from '@/lib/api-error-handler';
import { Database } from '@/types/supabase';

/**
 * GET all properties with optional filtering
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { searchParams } = new URL(request.url);

    // Build query with optional filters
    let query = supabase.from('properties').select('*');

    // Apply filters from search params
    const filters = {
      type: searchParams.get('type'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      bedrooms: searchParams.get('bedrooms'),
      bathrooms: searchParams.get('bathrooms'),
      city: searchParams.get('city'),
      country: searchParams.get('country'),
      status: searchParams.get('status') || 'active',
    };

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.minPrice) query = query.gte('pricing->listPrice', parseFloat(filters.minPrice));
    if (filters.maxPrice) query = query.lte('pricing->listPrice', parseFloat(filters.maxPrice));
    if (filters.bedrooms) query = query.eq('features->bedrooms', parseInt(filters.bedrooms));
    if (filters.bathrooms) query = query.eq('features->bathrooms', parseInt(filters.bathrooms));
    if (filters.city) query = query.ilike('location->city', `%${filters.city}%`);
    if (filters.country) query = query.ilike('location->country', `%${filters.country}%`);
    if (filters.status) query = query.eq('status', filters.status);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST create a new property
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const propertyData = await request.json();

    // Validate required fields
    if (!propertyData.title || !propertyData.description || !propertyData.pricing) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, pricing' },
        { status: 400 }
      );
    }

    // Add metadata
    const newProperty = {
      ...propertyData,
      agentId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    const { data, error } = await supabase
      .from('properties')
      .insert(newProperty)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
