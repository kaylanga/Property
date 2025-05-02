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
||| src/components/messaging/__tests__/messaging.test.tsx |||
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MessagingSystem } from '../messaging';
import { supabase } from '../../../lib/supabase';
// Mock Supabase client
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      eq: jest.fn(),
    })),
  },
}));
describe('MessagingSystem', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    fullName: 'Test User',
  };
  const mockMessages = [
    {
      id: '1',
      senderId: 'test-user-id',
      receiverId: 'other-user-id',
      content: 'Hello',
      createdAt: new Date().toISOString(),
    },
  ];
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });
  test('renders messaging interface', () => {
    const { getByPlaceholderText, getByText } = render(
      <MessagingSystem currentUser={mockUser} />
    );
    expect(getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(getByText('Messages')).toBeInTheDocument();
  });
  test('sends message successfully', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <MessagingSystem currentUser={mockUser} />
    );
    const input = getByPlaceholderText('Type your message...');
    const sendButton = getByRole('button', { name: /send/i });
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('messages');
    });
  });
  test('loads message history', async () => {
    // Mock the Supabase response
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ data: mockMessages, error: null }),
      eq: jest.fn().mockReturnThis(),
    }));
    const { findByText } = render(
      <MessagingSystem currentUser={mockUser} />
    );
    const message = await findByText('Hello');
    expect(message).toBeInTheDocument();
  });
  test('handles error when sending message', async () => {
    // Mock Supabase error
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockResolvedValue({ error: new Error('Failed to send') }),
    }));
    const { getByPlaceholderText, getByRole, findByText } = render(
      <MessagingSystem currentUser={mockUser} />
    );
    const input = getByPlaceholderText('Type your message...');
    const sendButton = getByRole('button', { name: /send/i });
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    const errorMessage = await findByText(/failed to send message/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CallingSystem } from '../calling';
import { supabase } from '../../../lib/supabase';
// Mock WebRTC APIs
global.RTCPeerConnection = jest.fn().mockImplementation(() => ({
  createOffer: jest.fn(),
  createAnswer: jest.fn(),
  setLocalDescription: jest.fn(),
  setRemoteDescription: jest.fn(),
  addIceCandidate: jest.fn(),
  close: jest.fn(),
}));
describe('CallingSystem', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    fullName: 'Test User',
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders calling interface', () => {
    const { getByText } = render(
      <CallingSystem currentUser={mockUser} />
    );
    expect(getByText('Start Call')).toBeInTheDocument();
  });
  test('initiates call successfully', async () => {
    const { getByText } = render(
      <CallingSystem currentUser={mockUser} />
    );
    const startCallButton = getByText('Start Call');
    fireEvent.click(startCallButton);
    await waitFor(() => {
      expect(RTCPeerConnection).toHaveBeenCalled();
    });
  });
  test('handles incoming call', async () => {
    const { getByText } = render(
      <CallingSystem currentUser={mockUser} />
    );
    // Simulate incoming call
    const incomingCall = {
      callerId: 'other-user-id',
      callerName: 'Other User',
      sdp: 'test-sdp',
    };
    // Mock Supabase real-time subscription
    const mockSubscription = {
      subscribe: jest.fn().mockImplementation((callback) => {
        callback({ new: incomingCall });
        return { unsubscribe: jest.fn() };
      }),
    };
    (supabase.channel as jest.Mock).mockReturnValue(mockSubscription);
    await waitFor(() => {
      expect(getByText('Incoming call from Other User')).toBeInTheDocument();
    });
  });
  test('ends call successfully', async () => {
    const { getByText } = render(
      <CallingSystem currentUser={mockUser} />
    );
    // Start call
    const startCallButton = getByText('Start Call');
    fireEvent.click(startCallButton);
    // End call
    const endCallButton = getByText('End Call');
    fireEvent.click(endCallButton);
    await waitFor(() => {
      expect(RTCPeerConnection.prototype.close).toHaveBeenCalled();
    });
  });
  test('handles WebRTC errors', async () => {
    // Mock RTCPeerConnection error
    global.RTCPeerConnection = jest.fn().mockImplementation(() => {
      throw new Error('WebRTC error');
    });
    const { getByText, findByText } = render(
      <CallingSystem currentUser={mockUser} />
    );
    const startCallButton = getByText('Start Call');
    fireEvent.click(startCallButton);
    const errorMessage = await findByText(/failed to establish call/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
import '@testing-library/jest-dom';
import 'jest-environment-jsdom';
// Mock WebRTC APIs
global.MediaStream = jest.fn().mockImplementation(() => ({
  getTracks: () => [],
}));
global.navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
};
// Mock Supabase Realtime
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    channel: jest.fn(),
    from: jest.fn(),
  }),
}));
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    }
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@types/jest": "^29.2.0",
    "jest": "^29.2.0",
    "jest-environment-jsdom": "^29.2.0",
    "ts-jest": "^29.0.3"
  }
}
// In your component:
<CallingSystem 
  recipientId={agentId}
  propertyId={property.id}
  onClose={() => setShowCallInterface(false)}
/>
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
interface CallingSystemProps {
  recipientId: string;
  propertyId?: string;
  onClose: () => void;
}
export function CallingSystem({ recipientId, propertyId, onClose }: CallingSystemProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const { user } = useAuth();
  const initializeCall = async () => {
    if (!user) {
      toast.error('Please sign in to make calls');
      return;
    }
    setIsConnecting(true);
    setCallStatus('connecting');
    try {
      // Initialize call connection
      const response = await fetch('/api/calls/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          propertyId,
          callerId: user.id,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to initialize call');
      }
      const { callId } = await response.json();
      setCallStatus('connected');
      // Implement WebRTC connection here
      // This is a placeholder for the actual WebRTC implementation
      
    } catch (error) {
      console.error('Call initialization error:', error);
      setCallStatus('failed');
      toast.error('Failed to establish call connection');
    } finally {
      setIsConnecting(false);
    }
  };
  const endCall = async () => {
    try {
      setCallStatus('idle');
      // Implement call termination logic here
      onClose();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          {callStatus === 'idle' && (
            <button
              onClick={initializeCall}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Start Call'}
            </button>
          )}
          {callStatus === 'connecting' && (
            <div className="animate-pulse">
              <p className="text-lg mb-4">Establishing connection...</p>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
          {callStatus === 'connected' && (
            <div>
              <p className="text-lg mb-4">Call in progress</p>
              <button
                onClick={endCall}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
              >
                End Call
              </button>
            </div>
          )}
          {callStatus === 'failed' && (
            <div>
              <p className="text-red-600 mb-4">Call failed to connect</p>
              <button
                onClick={initializeCall}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
} 