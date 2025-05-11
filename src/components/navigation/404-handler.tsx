"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

/**
 * Component that detects potential 404 situations and provides user feedback
 * Especially useful for dynamic routes that might not exist
 */
export function NotFoundHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run this logic on client side
    if (typeof window === "undefined") return;

    // Check if we have a redirected param which could indicate a redirected 404
    const params = new URLSearchParams(window.location.search);
    const redirected = params.get("notFound");

    if (redirected === "true") {
      toast.error("The page you were looking for could not be found.");

      // Clean the URL by removing the notFound parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("notFound");

      // Replace state to clean up URL without causing a navigation
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
