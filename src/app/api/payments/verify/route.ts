import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleAPIError, APIError, ValidationError } from '@/lib/api-error-handler';
import { handleVercelError, isVercelError } from '@/lib/vercel-error-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.paymentIntentId) {
      throw new ValidationError('Payment intent ID is required');
    }

    const { paymentIntent, paymentIntentClientSecret } = body;

    // Retrieve the payment intent
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);

    // Verify that the client secret matches
    if (intent.client_secret !== paymentIntentClientSecret) {
      return NextResponse.json(
        { error: 'Invalid client secret' },
        { status: 400 }
      );
    }

    // Check the payment status
    if (intent.status === 'succeeded') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: `Payment status: ${intent.status}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    
    if (isVercelError(error)) {
      return handleVercelError(error);
    }
    
    const apiError = handleAPIError(error);
    return NextResponse.json(
      { error: apiError.message, code: apiError.code, details: apiError.details },
      { status: apiError.statusCode }
    );
  }
} 