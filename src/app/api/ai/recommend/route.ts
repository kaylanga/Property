import { NextRequest, NextResponse } from 'next/server';
// import { recommendationEngine } from '../../../../lib/ai/recommendation-engine';
import { supabase } from '../../../../lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { userId: _userId, userPreferences: _userPreferences, limit } = await request.json();

    // Fetch available properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    // TODO: Re-enable AI recommendations after fixing TensorFlow issues
    // const recommendations = await recommendationEngine.generateRecommendations(
    //   userId,
    //   userPreferences,
    //   properties,
    //   limit
    // );

    // Return basic property list for now
    const recommendations = properties.slice(0, limit || 10).map(property => ({
      propertyId: property.id,
      score: 0.5,
      reasons: ['Basic recommendation']
    }));

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error processing recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
