'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MarketAnalyticsProps {
  region?: string;
  propertyType?: string;
  timeframe?: '1m' | '3m' | '6m' | '1y' | 'all';
}

interface PriceData {
  date: string;
  averagePrice: number;
  medianPrice: number;
  count: number;
}

interface PropertyTypeData {
  type: string;
  count: number;
  averagePrice: number;
}

interface MarketTrend {
  metric: string;
  value: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const PropertyMarketAnalytics: React.FC<MarketAnalyticsProps> = ({
  region,
  propertyType,
  timeframe = '6m',
}) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [propertyTypeData, setPropertyTypeData] = useState<PropertyTypeData[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch price trends
        const { data: priceTrends, error: priceError } = await supabase.rpc(
          'get_price_trends',
          {
            p_region: region,
            p_property_type: propertyType,
            p_timeframe: selectedTimeframe,
          }
        );
        
        if (priceError) throw priceError;
        setPriceData(priceTrends || []);
        
        // Fetch property type distribution
        const { data: typeDistribution, error: typeError } = await supabase.rpc(
          'get_property_type_distribution',
          {
            p_region: region,
            p_timeframe: selectedTimeframe,
          }
        );
        
        if (typeError) throw typeError;
        setPropertyTypeData(typeDistribution || []);
        
        // Fetch market trends
        const { data: trends, error: trendsError } = await supabase.rpc(
          'get_market_trends',
          {
            p_region: region,
            p_property_type: propertyType,
            p_timeframe: selectedTimeframe,
          }
        );
        
        if (trendsError) throw trendsError;
        setMarketTrends(trends || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load market analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [region, propertyType, selectedTimeframe]);

  const formatCurrency = (value: number) => {
    return `UGX ${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getTrendDirection = (change: number) => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'stable';
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'down':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Property Market Analytics</h2>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Property Market Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTimeframe('1m')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedTimeframe === '1m'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1M
          </button>
          <button
            onClick={() => setSelectedTimeframe('3m')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedTimeframe === '3m'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3M
          </button>
          <button
            onClick={() => setSelectedTimeframe('6m')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedTimeframe === '6m'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setSelectedTimeframe('1y')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedTimeframe === '1y'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1Y
          </button>
          <button
            onClick={() => setSelectedTimeframe('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedTimeframe === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
        </div>
      </div>
      
      {marketTrends.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {marketTrends.map((trend, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">{trend.metric}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xl font-bold">{formatCurrency(trend.value)}</p>
                <div className={`flex items-center ${getTrendColor(getTrendDirection(trend.change))}`}>
                  <span className="text-sm font-medium mr-1">
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </span>
                  {getTrendIcon(getTrendDirection(trend.change))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Price Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                  labelFormatter={formatDate}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averagePrice"
                  stroke="#8884d8"
                  name="Average Price"
                />
                <Line
                  type="monotone"
                  dataKey="medianPrice"
                  stroke="#82ca9d"
                  name="Median Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Property Type Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} properties (${formatCurrency(props.payload.averagePrice)})`,
                    props.payload.type,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Average Price by Property Type</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={propertyTypeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Average Price']}
              />
              <Legend />
              <Bar dataKey="averagePrice" fill="#8884d8" name="Average Price" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}; 