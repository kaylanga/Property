/**
 * Currency Converter Component
 *
 * A reusable component that converts property prices between different currencies.
 * Automatically detects the user's location and preferred currency, with fallback to USD.
 * Supports multiple African currencies including UGX, KES, TZS, RWF, and USD.
 *
 * Exchange rates are relative to UGX (Ugandan Shilling) as the base currency.
 * The component handles:
 * - Automatic currency detection based on user's location
 * - Currency preference persistence in cookies
 * - Real-time currency conversion
 * - Proper currency formatting using Intl.NumberFormat
 *
 * @module currency-converter
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Currency } from '../../types/property';

/**
 * Props for the CurrencyConverter component
 * @interface CurrencyConverterProps
 * @property {number} amount - The amount to convert
 * @property {Currency} fromCurrency - The source currency of the amount
 * @property {string} [className] - Optional CSS class name for styling
 */
interface CurrencyConverterProps {
  amount: number;
  fromCurrency: Currency;
  className?: string;
}

/**
 * Exchange rates relative to UGX (Ugandan Shilling)
 * These rates represent the value of 1 UGX in each currency
 * For example: 1 UGX = 0.00027 USD
 */
const exchangeRates: Record<Currency, number> = {
  [Currency.UGX]: 1,
  [Currency.KES]: 0.041, // 1 UGX = 0.041 KES
  [Currency.TZS]: 0.63, // 1 UGX = 0.63 TZS
  [Currency.RWF]: 0.32, // 1 UGX = 0.32 RWF
  [Currency.USD]: 0.00027, // 1 UGX = 0.00027 USD
};

/**
 * CurrencyConverter Component
 *
 * Converts property prices between different currencies based on:
 * - User's detected location (via IP)
 * - Stored preference in cookies
 * - Fallback to USD if detection fails
 *
 * Features:
 * - Automatic currency detection
 * - Persistent currency preference
 * - Real-time conversion
 * - Proper currency formatting
 *
 * @param {CurrencyConverterProps} props - Component props
 * @returns {JSX.Element} Formatted currency amount in user's preferred currency
 */
export function CurrencyConverter({
  amount,
  fromCurrency,
  className = '',
}: CurrencyConverterProps) {
  const [userCurrency, setUserCurrency] = useState<Currency>(Currency.UGX);
  const [convertedAmount, setConvertedAmount] = useState(amount);

  useEffect(() => {
    // Get user's location from cookies or browser
    const getUserLocation = async () => {
      try {
        // First try to get from cookies
        const storedCurrency = document.cookie
          .split('; ')
          .find((row) => row.startsWith('userCurrency='))
          ?.split('=')[1] as Currency;

        if (
          storedCurrency &&
          Object.values(Currency).includes(storedCurrency)
        ) {
          setUserCurrency(storedCurrency);
          return;
        }

        // If not in cookies, try to get from browser
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        // Map country codes to currencies
        const countryToCurrency: Record<string, Currency> = {
          UG: Currency.UGX,
          KE: Currency.KES,
          TZ: Currency.TZS,
          RW: Currency.RWF,
        };

        const detectedCurrency =
          countryToCurrency[data.country_code] || Currency.USD;
        setUserCurrency(detectedCurrency);

        // Store in cookies for 30 days
        document.cookie = `userCurrency=${detectedCurrency};max-age=${30 * 24 * 60 * 60};path=/`;
      } catch (error) {
        console.error('Error detecting user location:', error);
        setUserCurrency(Currency.USD);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    // Convert amount when currencies change
    const converted =
      amount * (exchangeRates[userCurrency] / exchangeRates[fromCurrency]);
    setConvertedAmount(converted);
  }, [amount, fromCurrency, userCurrency]);

  /**
   * Formats a number as currency using the browser's Intl API
   *
   * @param {number} amount - The amount to format
   * @param {Currency} currency - The currency code
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount: number, currency: Currency): string => {
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
