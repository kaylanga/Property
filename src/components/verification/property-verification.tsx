'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface VerificationDocument {
  id: string;
  property_id: string;
  document_type: string;
  document_url: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_notes?: string;
  created_at: string;
  updated_at: string;
}

interface PropertyVerificationProps {
  propertyId: string;
  isOwner?: boolean;
}

export const PropertyVerification: React.FC<PropertyVerificationProps> = ({
  propertyId,
  isOwner = false,
}) => {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('title_deed');

  // Fetch verification documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('verification_documents')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setDocuments(data || []);
      } catch (err) {
        console.error('Error fetching verification documents:', err);
        setError('Failed to load verification documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [propertyId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;
    
    try {
      setUploading(true);
      
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${propertyId}_${documentType}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, selectedFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);
      
      // Create document record
      const { error: insertError } = await supabase
        .from('verification_documents')
        .insert({
          property_id: propertyId,
          document_type: documentType,
          document_url: publicUrl,
          verification_status: 'pending',
        });
      
      if (insertError) throw insertError;
      
      // Refresh documents
      const { data, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
      
      // Reset form
      setSelectedFile(null);
      setDocumentType('title_deed');
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'title_deed':
        return 'Title Deed';
      case 'tax_clearance':
        return 'Tax Clearance';
      case 'building_permit':
        return 'Building Permit';
      case 'survey_plan':
        return 'Survey Plan';
      case 'identity_proof':
        return 'Identity Proof';
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Property Verification</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Property Verification</h2>
      
      {isOwner && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Upload Verification Document</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="title_deed">Title Deed</option>
                <option value="tax_clearance">Tax Clearance</option>
                <option value="building_permit">Building Permit</option>
                <option value="survey_plan">Survey Plan</option>
                <option value="identity_proof">Identity Proof</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="font-semibold">Verification Documents</h3>
        
        {documents.length === 0 ? (
          <p className="text-gray-500">No verification documents uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getDocumentTypeLabel(doc.document_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(doc.verification_status)}`}>
                        {doc.verification_status.charAt(0).toUpperCase() + doc.verification_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a 
                        href={doc.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}; 