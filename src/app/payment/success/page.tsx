'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    async function handlePaymentSuccess() {
      if (!sessionId) {
        toast.error('Invalid payment session');
        router.push('/');
        return;
      }

      try {
        // Verify the payment with your backend
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        const { subscription } = await response.json();

        // Update the user's subscription status in Supabase
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: subscription.userId,
            plan_type: subscription.planType,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          });

        if (error) throw error;

        toast.success('Payment successful! Your subscription is now active.');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('There was an error processing your payment. Please contact support.');
        router.push('/');
      }
    }

    handlePaymentSuccess();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Processing Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
          <div className="mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 