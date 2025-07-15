// import { NextApiRequest, NextApiResponse } from 'next';
// import { supabase } from '../../../lib/supabase-client';
// import { getRentTrendPredictions, getPriceTrendPredictions } from '../../../lib/ai/trend-predictor';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const trendType = url.searchParams.get('type');

  if (!trendType || !['rent', 'price'].includes(trendType)) {
    return new Response(JSON.stringify({ error: 'Invalid trend type' }), { status: 400 });
  }

  try {
    // TODO: Re-enable AI trend predictions after fixing TensorFlow issues
    // let predictions;

    // if (trendType === 'rent') {
    //   predictions = await getRentTrendPredictions();
    // } else {
    //   predictions = await getPriceTrendPredictions();
    // }

    // Return mock predictions for now
    const predictions = {
      trend: 'up',
      confidence: 0.75,
      forecast: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        predicted_value: Math.random() * 100000 + 500000
      }))
    };

    return new Response(JSON.stringify({ predictions }), { status: 200 });
  } catch (error) {
    console.error('Error fetching trend predictions:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
