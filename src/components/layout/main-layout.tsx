/**
 * Main Layout Component
 *
 * The root layout component that provides the basic structure for the application.
 * Features:
 * - Responsive container with padding
 * - Dark mode support
 * - Integration with PropertyAssistant AI component
 * - Consistent spacing and background colors
 *
 * @module main-layout
 */

"use client";

import React, { useEffect, useState } from "react";
import { PropertyAssistant } from "../ai/property-assistant";
import { supabase } from "../../lib/supabase-client";

/**
 * Props for the MainLayout component
 * @interface MainLayoutProps
 * @property {React.ReactNode} children - Child components to be rendered within the layout
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout Component
 *
 * Provides the main structure for the application, including:
 * - Full-height container with responsive padding
 * - Dark mode compatible background colors
 * - Integration of the AI property assistant
 * - Consistent spacing and layout
 *
 * @param {MainLayoutProps} props - Component props
 * @returns {JSX.Element} The main layout structure with children and AI assistant
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">{children}</main>
      <PropertyAssistant />
    </div>
  );
}
