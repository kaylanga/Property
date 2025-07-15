import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const propertyId = formData.get('propertyId') as string;

    if (!file || !userId || !propertyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process image with Sharp
    const buffer = Buffer.from(await file.arrayBuffer());
    const processedImage = await sharp(buffer)
      .resize(1200, 800, { fit: 'inside' })
      .modulate({
        brightness: 1.1,
        contrast: 1.1,
        saturation: 1.05
      })
      .composite([{
        input: Buffer.from(`
          <svg width="1200" height="800">
            <text x="50%" y="50%" 
                  font-family="Arial" 
                  font-size="48" 
                  fill="rgba(255,255,255,0.5)"
                  text-anchor="middle">
              Property Africa - ${userId}
            </text>
          </svg>
        `),
        blend: 'over'
      }])
      .sharpen()
      .toBuffer();

    // Upload to Supabase Storage
    const fileName = `${propertyId}/${uuidv4()}.jpg`;
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, processedImage, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) throw error;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!supabaseUrl) {
      console.warn('⚠️  NEXT_PUBLIC_SUPABASE_URL is not configured. Image URL will be incomplete.');
    }

    return NextResponse.json({
      success: true,
      path: data.path,
      url: supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/property-images/${fileName}` : `/storage/v1/object/public/property-images/${fileName}`
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
