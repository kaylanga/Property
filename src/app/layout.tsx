import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Providers } from '@/providers/providers';
import { validateEnvVariables } from '@/lib/env-validator';

// Validate environment variables
if (typeof window === 'undefined') {
  validateEnvVariables();
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Property Africa',
  description: 'Your trusted partner in African real estate',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
} 