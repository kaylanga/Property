'use client';

import React, { useState } from 'react';

export default function EscrowPage() {
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [payeeId, setPayeeId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [escrowResult, setEscrowResult] = useState(null);
  const [escrowStatus, setEscrowStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!transactionId || !amount || !payerId || !payeeId) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, amount, payerId, payeeId, paymentMethod }),
      });

      const data = await response.json();

      if (response.ok) {
        setEscrowResult(data.escrowResult);
      } else {
        setError(data.error || 'Escrow payment failed.');
      }
    } catch (_err) {
      setError('An error occurred during escrow payment.');
    } finally {
      setLoading(false);
    }
  };

  const createEscrow = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/escrow', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setEscrowStatus(data.message);
      } else {
        setError(data.error || 'Failed to create escrow');
      }
    } catch (_err) {
      setError('Failed to create escrow');
    } finally {
      setLoading(false);
    }
  };

  const fetchEscrowStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/escrow');
      const data = await res.json();
      if (res.ok) {
        setEscrowStatus(data.escrowStatus);
      } else {
        setError(data.error || 'Failed to fetch escrow status');
      }
    } catch (_err) {
      setError('Failed to fetch escrow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Escrow Management</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mb-6">
        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Payer ID"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Payee ID"
          value={payeeId}
          onChange={(e) => setPayeeId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="mobile_money">Mobile Money</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Processing...' : 'Initiate Escrow Payment'}
        </button>
      </form>

      <div className="mb-4">
        <button
          onClick={createEscrow}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Processing...' : 'Create Escrow'}
        </button>
        <button
          onClick={fetchEscrowStatus}
          disabled={loading}
          className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {loading ? 'Loading...' : 'Check Escrow Status'}
        </button>
      </div>

      {escrowResult && (
        <div className="mt-6 p-4 border rounded bg-green-100 text-green-800">
          <p>{escrowResult.message}</p>
          <p>Status: {escrowResult.status}</p>
          <p>Escrow ID: {escrowResult.escrowId}</p>
        </div>
      )}

      {escrowStatus && <p className="text-lg font-medium">Status: {escrowStatus}</p>}

      {error && (
        <div className="mt-6 p-4 border rounded bg-red-100 text-red-800">
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}
