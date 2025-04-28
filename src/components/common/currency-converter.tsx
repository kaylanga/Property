'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CurrencyConverterProps {
  amount: number;
  from: string;
  to?: string;
}

const exchangeRates = {
  USD: 1,
  UGX: 3700, // 1 USD = 3700 UGX
  KES: 130,  // 1 USD = 130 KES
  TZS: 2500, // 1 USD = 2500 TZS
  RWF: 1200, // 1 USD = 1200 RWF
  ZAR: 18,   // 1 USD = 18 ZAR
  NGN: 750,  // 1 USD = 750 NGN
  GHS: 12,   // 1 USD = 12 GHS
};

const currencySymbols = {
  USD: '$',
  UGX: 'UGX',
  KES: 'KES',
  TZS: 'TZS',
  RWF: 'RWF',
  ZAR: 'R',
  NGN: '₦',
  GHS: 'GH₵',
};

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  amount,
  from,
  to,
}) => {
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<number>(amount);

  // Detect user's location and set their currency
  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const currency = data.currency || 'USD';
        setUserCurrency(currency);
      } catch (error) {
        console.error('Error detecting user currency:', error);
        setUserCurrency('USD');
      }
    };

    detectUserCurrency();
  }, []);

  // Convert amount when currencies or amount changes
  useEffect(() => {
    const targetCurrency = to || userCurrency;
    if (from === targetCurrency) {
      setConvertedAmount(amount);
      return;
    }

    const fromRate = exchangeRates[from as keyof typeof exchangeRates] || 1;
    const toRate = exchangeRates[targetCurrency as keyof typeof exchangeRates] || 1;
    const converted = (amount / fromRate) * toRate;
    setConvertedAmount(converted);
  }, [amount, from, to, userCurrency]);

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <span>
      {formatAmount(convertedAmount, to || userCurrency)}
    </span>
  );
}; 