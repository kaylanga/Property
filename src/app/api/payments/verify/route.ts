import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleAPIError } from '@/lib/api-error-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(request: Request) {
  try {
    const { paymentIntent, paymentIntentClientSecret } = await request.json();
    if (!paymentIntent || !paymentIntentClientSecret) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);
    if (intent.client_secret !== paymentIntentClientSecret) {
      return NextResponse.json(
        { error: 'Invalid client secret' },
        { status: 400 }
      );
    }
    if (intent.status === 'succeeded') {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: `Payment status: ${intent.status}` },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return handleAPIError(error);
  }
}
