import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { paymentIntent, paymentIntentClientSecret } = await request.json();

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
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
} 