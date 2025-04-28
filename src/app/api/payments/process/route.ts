import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Currency } from '../../../../types/property';
import { handleApiError } from '@/lib/api-error-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { paymentMethodId, amount, currency } = await request.json();

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return handleApiError(error, 'Payment Processing');
  }
} 