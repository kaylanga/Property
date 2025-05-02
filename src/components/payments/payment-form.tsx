'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
interface MobileMoneyProvider {
  apiEndpoint: string;
  apiKey: string | undefined;
  countries: string[];
  currencies: string[];
}
const mobileMoneyProviders: Record<string, MobileMoneyProvider> = {
  'MTN Mobile Money': {
    apiEndpoint: 'https://api.mtn.com/collection/v1_0',
    apiKey: process.env.MTN_MOBILE_MONEY_API_KEY,
    countries: ['UG', 'RW'],
    currencies: ['UGX', 'RWF']
  },
  'M-Pesa': {
    apiEndpoint: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    apiKey: process.env.MPESA_API_KEY,
    countries: ['KE', 'TZ'],
    currencies: ['KES', 'TZS']
  },
  'Airtel Money': {
    apiEndpoint: 'https://api.airtel.com/money/v1',
    apiKey: process.env.AIRTEL_MONEY_API_KEY,
    countries: ['UG', 'KE', 'TZ', 'RW'],
    currencies: ['UGX', 'KES', 'TZS', 'RWF']
  },
  'Tigo Pesa': {
    apiEndpoint: 'https://api.tigo.com/v1',
    apiKey: process.env.TIGO_PESA_API_KEY,
    countries: ['TZ'],
    currencies: ['TZS']
  }
};
type PaymentMethod = 'card' | 'mobile_money';

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      onError('Payment processing unavailable. Please try again later.');
      return;
    }
    setLoading(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });
      if (error) {
        throw error;
      }
      // Send payment method ID to your server
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount,
          currency,
        }),
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileMoneyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/payments/mobile-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          phoneNumber,
          provider: mobileMoneyProviders[currency][0], // Default to first provider
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        <div className="flex space-x-4 mb-4">
          <button
            className={`flex-1 py-2 px-4 rounded ${
              paymentMethod === 'card'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            Card Payment
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded ${
              paymentMethod === 'mobile_money'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setPaymentMethod('mobile_money')}
          >
            Mobile Money
          </button>
        </div>
      </div>

      {paymentMethod === 'card' ? (
        <form onSubmit={handleCardPayment} className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Card'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMobileMoneyPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Money Provider
            </label>
            <select className="w-full px-4 py-2 border rounded-lg">
              {mobileMoneyProviders[currency].map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your mobile money number"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Mobile Money'}
          </button>
        </form>
      )}
    </div>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
} 