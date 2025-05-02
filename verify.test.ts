import { POST } from '../route';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      retrieve: jest.fn()
    }
  }));
});
describe('Payment Verification API', () => {
  let mockStripe: jest.Mocked<Stripe>;
  beforeEach(() => {
    mockStripe = new Stripe('mock_key') as jest.Mocked<Stripe>;
  });
  it('should verify valid payment intent', async () => {
    const mockPaymentIntent = {
      id: 'pi_123',
      client_secret: 'secret_123',
      status: 'succeeded'
    };
    mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
    const request = new Request('http://localhost:3000/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({
        paymentIntent: 'pi_123',
        paymentIntentClientSecret: 'secret_123'
      })
    });
    const response = await POST(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });
  it('should handle invalid client secret', async () => {
    const mockPaymentIntent = {
      id: 'pi_123',
      client_secret: 'secret_123',
      status: 'succeeded'
    };
    mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);
    const request = new Request('http://localhost:3000/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({
        paymentIntent: 'pi_123',
        paymentIntentClientSecret: 'wrong_secret'
      })
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});