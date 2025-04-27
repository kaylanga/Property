'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface MortgageApplicationProps {
  propertyId: string;
  propertyPrice: number;
  currency: string;
}

interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  employmentStatus: string;
  employmentDuration: number;
  bankName: string;
  accountNumber: string;
  downPayment: number;
  loanTerm: number;
  additionalDocuments: File[];
}

export const MortgageApplication: React.FC<MortgageApplicationProps> = ({
  propertyId,
  propertyPrice,
  currency,
}) => {
  const [formData, setFormData] = useState<ApplicationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    monthlyIncome: 0,
    employmentStatus: '',
    employmentDuration: 0,
    bankName: '',
    accountNumber: '',
    downPayment: 20,
    loanTerm: 20,
    additionalDocuments: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monthlyIncome' || name === 'employmentDuration' || name === 'downPayment' || name === 'loanTerm'
        ? Number(value)
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        additionalDocuments: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload documents to Supabase Storage
      const documentUrls = await Promise.all(
        formData.additionalDocuments.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from('mortgage-documents')
            .upload(fileName, file);

          if (error) throw error;
          return data.path;
        })
      );

      // Create mortgage application record
      const { error: applicationError } = await supabase
        .from('mortgage_applications')
        .insert({
          property_id: propertyId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          monthly_income: formData.monthlyIncome,
          employment_status: formData.employmentStatus,
          employment_duration: formData.employmentDuration,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          down_payment_percentage: formData.downPayment,
          loan_term_years: formData.loanTerm,
          document_urls: documentUrls,
          status: 'pending',
        });

      if (applicationError) throw applicationError;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Application Submitted</h2>
        <p className="text-green-700">
          Thank you for your mortgage application. We will review your application and contact you
          within 2-3 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income
          </label>
          <input
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Status
          </label>
          <select
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="business-owner">Business Owner</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Duration (Years)
          </label>
          <input
            type="number"
            name="employmentDuration"
            value={formData.employmentDuration}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment (%)
          </label>
          <input
            type="number"
            name="downPayment"
            value={formData.downPayment}
            onChange={handleInputChange}
            required
            min="5"
            max="50"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Years)
          </label>
          <select
            name="loanTerm"
            value={formData.loanTerm}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="5">5 years</option>
            <option value="10">10 years</option>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Documents (ID, Proof of Income, Bank Statements)
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}; 