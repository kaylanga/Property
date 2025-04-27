'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';

interface Investment {
  id: string;
  user_id: string;
  property_id: string;
  amount: number;
  shares: number;
  total_shares: number;
  created_at: string;
  status: 'pending' | 'active' | 'sold';
  property?: Property;
}

interface PropertyInvestmentProps {
  propertyId: string;
  userId: string;
  property: Property;
}

export const PropertyInvestment: React.FC<PropertyInvestmentProps> = ({
  propertyId,
  userId,
  property,
}) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [userShares, setUserShares] = useState<number>(0);

  // Fetch investments
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        
        // Fetch all investments for this property
        const { data: allInvestments, error: allError } = await supabase
          .from('property_investments')
          .select('*')
          .eq('property_id', propertyId);
        
        if (allError) throw allError;
        
        // Fetch user's investments
        const { data: userInvestments, error: userError } = await supabase
          .from('property_investments')
          .select('*')
          .eq('property_id', propertyId)
          .eq('user_id', userId);
        
        if (userError) throw userError;
        
        setInvestments(userInvestments || []);
        
        // Calculate totals
        const total = allInvestments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
        const shares = allInvestments?.reduce((sum, inv) => sum + inv.shares, 0) || 0;
        const userTotal = userInvestments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
        const userShareCount = userInvestments?.reduce((sum, inv) => sum + inv.shares, 0) || 0;
        
        setTotalInvested(total);
        setTotalShares(shares);
        setUserShares(userShareCount);
      } catch (err) {
        console.error('Error fetching investments:', err);
        setError('Failed to load investment data');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [propertyId, userId]);

  const handleInvest = async () => {
    if (investAmount <= 0) return;
    
    try {
      setProcessing(true);
      
      // Calculate shares based on investment amount
      // For simplicity, we'll use a fixed share price
      const sharePrice = property.price / 100; // 1% of property price per share
      const shares = Math.floor(investAmount / sharePrice);
      
      if (shares <= 0) {
        setError('Investment amount is too low');
        return;
      }
      
      // Create investment record
      const { error } = await supabase
        .from('property_investments')
        .insert({
          user_id: userId,
          property_id: propertyId,
          amount: investAmount,
          shares: shares,
          total_shares: totalShares + shares,
          status: 'active',
        });
      
      if (error) throw error;
      
      // Update totals
      setTotalInvested(prev => prev + investAmount);
      setTotalShares(prev => prev + shares);
      setUserShares(prev => prev + shares);
      
      // Refresh investments
      const { data, error: fetchError } = await supabase
        .from('property_investments')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', userId);
      
      if (fetchError) throw fetchError;
      setInvestments(data || []);
      
      // Reset form
      setInvestAmount(0);
    } catch (err) {
      console.error('Error creating investment:', err);
      setError('Failed to process investment');
    } finally {
      setProcessing(false);
    }
  };

  const calculateOwnershipPercentage = () => {
    if (totalShares === 0) return 0;
    return (userShares / totalShares) * 100;
  };

  const calculateEstimatedValue = () => {
    return (userShares / totalShares) * property.price;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Property Investment</h2>
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
      <h2 className="text-xl font-bold mb-4">Property Investment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Your Investment</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold text-blue-600">{property.currency} {userShares > 0 ? (userShares * (property.price / totalShares)).toLocaleString() : '0'}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Shares Owned</p>
            <p className="text-xl font-semibold text-blue-700">{userShares}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Ownership Percentage</p>
            <p className="text-xl font-semibold text-blue-700">{calculateOwnershipPercentage().toFixed(2)}%</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Estimated Value</p>
            <p className="text-xl font-semibold text-blue-700">{property.currency} {calculateEstimatedValue().toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Investment Opportunity</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Property Value</p>
            <p className="text-2xl font-bold text-green-600">{property.currency} {property.price.toLocaleString()}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Total Shares Available</p>
            <p className="text-xl font-semibold text-green-700">{totalShares}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Share Price</p>
            <p className="text-xl font-semibold text-green-700">{property.currency} {(property.price / totalShares || property.price / 100).toLocaleString()}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-xl font-semibold text-green-700">{property.currency} {totalInvested.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Invest in this Property</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount ({property.currency})
            </label>
            <input
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(Number(e.target.value))}
              min="0"
              step="100"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Shares
            </label>
            <div className="w-full p-2 border rounded-md bg-gray-100">
              {investAmount > 0 ? Math.floor(investAmount / (property.price / (totalShares || 100))) : 0}
            </div>
          </div>
        </div>
        <button
          onClick={handleInvest}
          disabled={investAmount <= 0 || processing}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {processing ? 'Processing...' : 'Invest Now'}
        </button>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold">Your Investment History</h3>
        
        {investments.length === 0 ? (
          <p className="text-gray-500">You haven't invested in this property yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(investment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.currency} {investment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        investment.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : investment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </span>
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