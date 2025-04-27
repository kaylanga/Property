'use client';

import React, { useState, useEffect } from 'react';
import { Currency } from '../../types/property';

interface CurrencyConverterProps {
  amount: number;
  fromCurrency: Currency;
  className?: string;
}

const exchangeRates: Record<Currency, number> = {
  UGX: 1,
  USD: 0.00027,
  KES: 0.041,
  TZS: 0.63,
  RWF: 0.32,
};

export function CurrencyConverter({
  amount,
  fromCurrency,
  className = '',
}: CurrencyConverterProps) {
  const [userCurrency, setUserCurrency] = useState<Currency>('UGX');
  const [convertedAmount, setConvertedAmount] = useState(amount);

  useEffect(() => {
    // Get user's location from cookies or browser
    const getUserLocation = async () => {
      try {
        // First try to get from cookies
        const storedCurrency = document.cookie
          .split('; ')
          .find(row => row.startsWith('userCurrency='))
          ?.split('=')[1] as Currency;

        if (storedCurrency) {
          setUserCurrency(storedCurrency);
          return;
        }

        // If not in cookies, try to get from browser
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Map country codes to currencies
        const countryToCurrency: Record<string, Currency> = {
          UG: 'UGX',
          KE: 'KES',
          TZ: 'TZS',
          RW: 'RWF',
        };

        const detectedCurrency = countryToCurrency[data.country_code] || 'USD';
        setUserCurrency(detectedCurrency);

        // Store in cookies for 30 days
        document.cookie = `userCurrency=${detectedCurrency};max-age=${30 * 24 * 60 * 60};path=/`;
      } catch (error) {
        console.error('Error detecting user location:', error);
        setUserCurrency('USD');
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    // Convert amount when currencies change
    const converted = amount * (exchangeRates[userCurrency] / exchangeRates[fromCurrency]);
    setConvertedAmount(converted);
  }, [amount, fromCurrency, userCurrency]);

  const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <span className={className}>
      {formatCurrency(convertedAmount, userCurrency)}
    </span>
  );
} 