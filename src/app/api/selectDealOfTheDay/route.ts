import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(_request: NextRequest) {
  try {
    // Verify required columns by attempting to select them
    try {
      const { error: testQueryError } = await supabase
        .from('properties')
        .select('id, is_deal_of_the_day, viewcount, listed_at, title, description, list_price, address, bedrooms, bathrooms, images')
        .limit(0); // Returns only column info

      if (testQueryError) {
        console.error('Schema verification error:', testQueryError);
        return NextResponse.json(
          { 
            error: 'Database schema verification failed',
            details: testQueryError,
            solution: `Run these SQL statements to add missing columns:
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_deal_of_the_day BOOLEAN DEFAULT FALSE;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS viewcount INTEGER DEFAULT 0;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS listed_at TIMESTAMPTZ DEFAULT NOW();
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS description TEXT;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS list_price NUMERIC(12,2) NOT NULL;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS address TEXT;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS bedrooms INT;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms INT;
              ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB;`
          }, 
          { status: 400 }
        );
      }
    } catch (err) {
      console.error('Schema verification failed:', err);
      return NextResponse.json(
        { 
          error: 'Database schema verification failed',
          details: err,
          solution: 'Check your database schema and ensure all required columns exist'
        }, 
        { status: 500 }
      );
    }

    // Reset all properties' is_deal_of_the_day to false
    const { data: resetData, error: resetError } = await supabase
      .from('properties')
      .update({ is_deal_of_the_day: false })
      .eq('is_deal_of_the_day', true)
      .select('*');

    if (resetError) {
      console.error('Detailed reset error:', {
        message: resetError.message,
        code: resetError.code,
        details: resetError.details,
        hint: resetError.hint,
      });
      return NextResponse.json(
        { 
          error: 'Failed to reset deal of the day flags',
          details: resetError 
        }, 
        { status: 500 }
      );
    }

    console.log(`Reset ${resetData?.length ?? 0} deal of the day flags`);

    // Select the property with highest viewcount as the new deal of the day
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, viewcount')
      .order('viewcount', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Select error:', error);
      return NextResponse.json({ error: 'Failed to select new deal of the day' }, { status: 500 });
    }

    if (!properties || properties.length === 0) {
      console.error('No properties found for deal of the day');
      return NextResponse.json({ error: 'No properties found for deal of the day' }, { status: 404 });
    }

    const selectedPropertyId = properties[0].id;

    // Set is_deal_of_the_day to true for the selected property
    const { error: updateError } = await supabase
      .from('properties')
      .update({ is_deal_of_the_day: true })
      .eq('id', selectedPropertyId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update deal of the day' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deal of the day updated', propertyId: selectedPropertyId });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
