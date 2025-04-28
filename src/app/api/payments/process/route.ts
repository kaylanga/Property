import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Currency } from '../../../../types/property';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface PaymentRequest {
  paymentMethodId: string;
  amount: number;
  currency: Currency;
}

export async function POST(request: Request) {
  try {
    const { paymentMethodId, amount, currency } = (await request.json()) as PaymentRequest;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase() as Lowercase<Currency>,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
} 