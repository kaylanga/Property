import React, { useState } from 'react';

export default function BiometricKYC() {
  const [biometricData, setBiometricData] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setBiometricData(event.target.value);
    setVerificationResult(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!biometricData) {
      setError('Please enter biometric data.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/biometric-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'sample-user-id', biometricData }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationResult(data.verificationResult);
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (_err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Biometric KYC Verification</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <textarea
          placeholder="Enter biometric data (simulated)"
          value={biometricData}
          onChange={handleInputChange}
          className="w-full h-32 p-2 border rounded mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Verifying...' : 'Submit Biometric Data'}
        </button>
      </form>

      {verificationResult && (
        <div className="mt-6 p-4 border rounded bg-green-100 text-green-800">
          <p>{verificationResult.message}</p>
          <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 border rounded bg-red-100 text-red-800">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
