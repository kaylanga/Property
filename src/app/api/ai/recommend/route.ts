import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { preferences, budget, location } = await request.json();

    // Basic property recommendation logic
    // In a real app, this would use ML models or more sophisticated matching
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'active');

    // Filter by budget if provided
    if (budget?.min) {
      query = query.gte('pricing->listPrice', budget.min);
    }
    if (budget?.max) {
      query = query.lte('pricing->listPrice', budget.max);
    }

    // Filter by location if provided
    if (location) {
      query = query.ilike('location->city', `%${location}%`);
    }

    // Filter by property type if provided
    if (preferences?.propertyType) {
      query = query.eq('type', preferences.propertyType);
    }

    // Filter by bedrooms if provided
    if (preferences?.bedrooms) {
      query = query.gte('features->bedrooms', preferences.bedrooms);
    }

    // Filter by bathrooms if provided
    if (preferences?.bathrooms) {
      query = query.gte('features->bathrooms', preferences.bathrooms);
    }

    const { data: properties, error } = await query.limit(10);

    if (error) {
      console.error('Error fetching recommendations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      );
    }

    // Simple scoring based on preference matching
    const scoredProperties = properties?.map(property => {
      let score = 0;
      
      // Score based on budget fit
      const price = property.pricing?.listPrice || 0;
      if (budget?.min && budget?.max) {
        const budgetRange = budget.max - budget.min;
        const budgetMid = (budget.min + budget.max) / 2;
        const priceDiff = Math.abs(price - budgetMid);
        score += Math.max(0, 100 - (priceDiff / budgetRange) * 100);
      }

      // Score based on feature matches
      if (preferences?.propertyType === property.type) score += 50;
      if (preferences?.bedrooms && property.features?.bedrooms >= preferences.bedrooms) score += 30;
      if (preferences?.bathrooms && property.features?.bathrooms >= preferences.bathrooms) score += 20;

      return {
        ...property,
        recommendationScore: Math.round(score)
      };
    }) || [];

    // Sort by score descending
    scoredProperties.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return NextResponse.json({
      success: true,
      recommendations: scoredProperties,
      total: scoredProperties.length
    });

  } catch (error) {
    console.error('Error in AI recommend route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'AI Recommendation API - Use POST method with preferences data' },
    { status: 200 }
  );
}
