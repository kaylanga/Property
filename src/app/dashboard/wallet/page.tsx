'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../../components/auth/protected-route';
import DashboardHeader from '../../../components/user/DashboardHeader';
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  PlusIcon,
  MinusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export default function WalletPage() {
  const [balance, _setBalance] = useState(2500000);
  const [_loading, _setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [transactions, _setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      amount: 1200000,
      description: 'Rental payment received from John Doe',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      reference: 'TXN-001'
    },
    {
      id: '2',
      type: 'debit',
      amount: 50000,
      description: 'Platform service fee',
      date: '2024-01-14T14:20:00Z',
      status: 'completed',
      reference: 'TXN-002'
    },
    {
      id: '3',
      type: 'credit',
      amount: 800000,
      description: 'Property sale commission - Kampala Apartment',
      date: '2024-01-12T09:15:00Z',
      status: 'completed',
      reference: 'TXN-003'
    },
    {
      id: '4',
      type: 'debit',
      amount: 25000,
      description: 'Withdrawal to bank account',
      date: '2024-01-10T16:45:00Z',
      status: 'pending',
      reference: 'TXN-004'
    },
    {
      id: '5',
      type: 'credit',
      amount: 300000,
      description: 'Deposit from mobile money',
      date: '2024-01-08T11:00:00Z',
      status: 'completed',
      reference: 'TXN-005'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'failed': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter || t.status === filter;
  });

  const totalCredit = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <div className="px-6 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Wallet Management</h1>
            <p className="text-gray-600">Manage your funds, view transactions, and track your earnings</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Available Balance</p>
                  <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
                </div>
                <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
              </div>
              <div className="flex items-center mt-4 text-green-100">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+15% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCredit)}</p>
                </div>
                <ArrowUpIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDebit)}</p>
                </div>
                <ArrowDownIcon className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Funds
              </button>
              <button className="flex items-center justify-center px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <MinusIcon className="h-5 w-5 mr-2" />
                Withdraw
              </button>
              <button className="flex items-center justify-center px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <ArrowUpIcon className="h-5 w-5 mr-2" />
                Transfer
              </button>
              <button className="flex items-center justify-center px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                Exchange
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                <div className="flex space-x-2">
                  {['all', 'credit', 'debit', 'pending'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFilter(option)}
                      className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                        filter === option
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowUpIcon className="h-5 w-5" />
                        ) : (
                          <ArrowDownIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">Ref: {transaction.reference}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        getStatusColor(transaction.status)
                      }`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1 capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 text-center">
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                Load More Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

