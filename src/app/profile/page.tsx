'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/auth/protected-route';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.kycDocuments) {
      setUploadedDocs(user.kycDocuments);
    }
  }, [user]);

  if (!user) {
    return null; // or a loading spinner
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('document', selectedFile);

    try {
      const res = await fetch('/api/kyc/document-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadedDocs((prev) => [...prev, data.fileUrl]);
        setSelectedFile(null);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (_err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.fullName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verified</label>
              <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.isVerified ? 'Yes' : 'No'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">KYC Documents</label>
              {uploadedDocs.length > 0 ? (
                <ul className="list-disc list-inside text-gray-900 dark:text-white">
                  {uploadedDocs.map((doc, idx) => (
                    <li key={idx}>
                      <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Document {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet.</p>
              )}
              <input type="file" onChange={handleFileChange} className="mt-2" aria-label="Upload KYC Document" />
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
              {error && <p className="text-red-600 mt-2" role="alert">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
