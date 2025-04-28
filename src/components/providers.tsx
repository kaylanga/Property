/**
 * Application Providers Component
 * 
 * This component wraps the application with necessary providers for:
 * - React Query for data fetching and caching
 * - Theme management with next-themes
 * - Toast notifications with react-hot-toast
 * 
 * @module providers
 */

'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

/**
 * QueryClient instance for React Query
 * Handles caching, background updates, and data synchronization
 */
const queryClient = new QueryClient();

/**
 * Providers Component
 * 
 * A wrapper component that provides essential functionality to the entire application:
 * - QueryClientProvider: Enables React Query functionality for data fetching
 * - ThemeProvider: Manages application theming with system preference support
 * - Toaster: Provides toast notification functionality
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by providers
 * @returns {JSX.Element} The wrapped application with all necessary providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
} 