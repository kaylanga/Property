import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Currency } from '../../../../types/property';
import { handleAPIError, APIError, ValidationError } from '@/lib/api-error-handler';
import { handleVercelError, isVercelError } from '@/lib/vercel-error-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.amount || !body.currency) {
      throw new ValidationError('Amount and currency are required');
    }

    const { paymentMethodId, amount, currency } = body;

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
    console.error('Payment processing error:', error);
    
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