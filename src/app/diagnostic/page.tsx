"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase-client";

export default function DiagnosticPage() {
  const [uiCheck, setUiCheck] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [apiCheck, setApiCheck] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [dbCheck, setDbCheck] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [dbMessage, setDbMessage] = useState<string>(
    "Checking Supabase connection...",
  );
  const [apiMessage, setApiMessage] = useState<string>(
    "Checking API connectivity...",
  );
  const [propertyCount, setPropertyCount] = useState<number | null>(null);
  const [environmentVars, setEnvironmentVars] = useState<{
    [key: string]: boolean;
  }>({});

  // Check UI rendering
  useEffect(() => {
    try {
      // Simple test to verify React is rendering correctly
      setUiCheck("success");
    } catch (error) {
      console.error("UI rendering error:", error);
      setUiCheck("error");
    }
  }, []);

  // Check environment variables
  useEffect(() => {
    const vars = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    setEnvironmentVars(vars);
  }, []);

  // Check Supabase connection
  useEffect(() => {
    async function checkDatabase() {
      try {
        // Test query to verify database connection
        const { data, error, count } = await supabase
          .from("properties")
          .select("*", { count: "exact" })
          .limit(1);

        if (error) {
          throw error;
        }

        setPropertyCount(count);
        setDbCheck("success");
        setDbMessage(
          `Successfully connected to Supabase. Found ${count} properties.`,
        );
      } catch (error: any) {
        console.error("Database error:", error);
        setDbCheck("error");
        setDbMessage(`Database error: ${error.message || "Unknown error"}`);
      }
    }

    checkDatabase();
  }, []);

  // Check API endpoints
  useEffect(() => {
    async function checkApi() {
      try {
        // Try to fetch from an API route to verify server connectivity
        const response = await fetch("/api/health-check");

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        setApiCheck("success");
        setApiMessage("API endpoints are working properly.");
      } catch (error: any) {
        console.error("API error:", error);
        setApiCheck("error");
        setApiMessage(
          `API error: ${error.message || "Unable to connect to API endpoints"}`,
        );

        // If API route doesn't exist, we'll still create a health check
        if (error.message.includes("404")) {
          setApiMessage(
            "API health check endpoint not found. Consider creating one at /api/health-check",
          );
        }
      }
    }

    checkApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Property Africa System Diagnostic
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Checking all components of your application
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              UI Component Test
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Verifying React components are rendering correctly
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  uiCheck === "loading"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : uiCheck === "success"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                }`}
              >
                {uiCheck === "loading" ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : uiCheck === "success" ? (
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-500 dark:text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {uiCheck === "loading"
                    ? "Checking UI..."
                    : uiCheck === "success"
                      ? "UI components are rendering correctly"
                      : "UI rendering issue detected"}
                </h3>
                {uiCheck === "success" && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      React is working properly. This diagnostic page is proof!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Environment Variables
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Checking for required configuration
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(environmentVars).map(([key, exists]) => (
                <li key={key} className="py-4 flex">
                  <div
                    className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                      exists
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    {exists ? (
                      <svg
                        className="h-4 w-4 text-green-500 dark:text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 text-red-500 dark:text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {key}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {exists
                        ? "Present"
                        : "Missing - Add this to your .env.local file"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Database Connection
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Testing connection to Supabase
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  dbCheck === "loading"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : dbCheck === "success"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                }`}
              >
                {dbCheck === "loading" ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : dbCheck === "success" ? (
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-500 dark:text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {dbCheck === "loading"
                    ? "Checking database..."
                    : dbCheck === "success"
                      ? "Database connection successful"
                      : "Database connection issue"}
                </h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>{dbMessage}</p>
                  {dbCheck === "success" && propertyCount !== null && (
                    <p className="mt-1">
                      Your database has {propertyCount} properties in the
                      'properties' table.
                      {propertyCount === 0 &&
                        " You may want to add some test data."}
                    </p>
                  )}
                  {dbCheck === "error" && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        1. Check that your Supabase URL and Anon Key are correct
                        in your .env.local file
                        <br />
                        2. Verify that your Supabase service is running
                        <br />
                        3. Check that the 'properties' table exists in your
                        database
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              API Endpoints
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Checking API connectivity
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  apiCheck === "loading"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : apiCheck === "success"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                }`}
              >
                {apiCheck === "loading" ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : apiCheck === "success" ? (
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-500 dark:text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {apiCheck === "loading"
                    ? "Checking API endpoints..."
                    : apiCheck === "success"
                      ? "API endpoints are working"
                      : "API connectivity issue"}
                </h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>{apiMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Suggested Next Steps
            </h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {(!process.env.NEXT_PUBLIC_SUPABASE_URL ||
                !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
                <li>
                  Set up your Supabase environment variables in .env.local
                </li>
              )}
              {dbCheck === "error" && (
                <li>
                  Fix your database connection issues according to the error
                  message
                </li>
              )}
              {dbCheck === "success" && propertyCount === 0 && (
                <li>Add some property data to your Supabase database</li>
              )}
              {apiCheck === "error" && apiMessage.includes("not found") && (
                <li>Create an API health check endpoint</li>
              )}
              <li>Add more content to your homepage and verify routing</li>
              <li>Implement user authentication using Supabase Auth</li>
              <li>Add more styling and components to your UI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
