import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import { MainLayout } from "../components/layout/main-layout";
import { Navbar } from "../components/navigation/navbar";
import ErrorBoundary from "../components/layout/ErrorBoundary";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Property Africa",
  description: "Find your dream property in Africa",
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
          <ErrorBoundary>
            <Navbar />
            <MainLayout>{children}</MainLayout>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
