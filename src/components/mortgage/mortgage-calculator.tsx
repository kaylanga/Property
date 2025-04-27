'use client';

import React, { useState, useEffect } from 'react';
import { CurrencyConverter } from '../common/currency-converter';

interface MortgageCalculatorProps {
  propertyPrice: number;
  currency: string;
}

interface MortgageCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice,
  currency,
}) => {
  const [downPayment, setDownPayment] = useState<number>(20);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);

  const calculateMortgage = () => {
    const principal = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment using the mortgage payment formula
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const schedule = [];
    let remainingBalance = principal;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }

    setCalculation({
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule: schedule,
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPayment, loanTerm, interestRate]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Mortgage Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment (%)
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center mt-2">{downPayment}%</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Years)
          </label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full p-2 border rounded"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Price
          </label>
          <div className="p-2 border rounded bg-gray-50">
            <CurrencyConverter amount={propertyPrice} from={currency} />
          </div>
        </div>
      </div>

      {calculation && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Monthly Payment</h3>
              <p className="text-2xl font-bold text-blue-600">
                <CurrencyConverter amount={calculation.monthlyPayment} from={currency} />
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Payment</h3>
              <p className="text-2xl font-bold text-green-600">
                <CurrencyConverter amount={calculation.totalPayment} from={currency} />
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Total Interest</h3>
              <p className="text-2xl font-bold text-purple-600">
                <CurrencyConverter amount={calculation.totalInterest} from={currency} />
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Amortization Schedule</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculation.amortizationSchedule.slice(0, 12).map((row) => (
                    <tr key={row.month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <CurrencyConverter amount={row.payment} from={currency} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <CurrencyConverter amount={row.principal} from={currency} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <CurrencyConverter amount={row.interest} from={currency} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <CurrencyConverter amount={row.remainingBalance} from={currency} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Apply for Mortgage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 