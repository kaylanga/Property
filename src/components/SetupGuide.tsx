"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link?: string;
  linkText?: string;
}

export default function SetupGuide() {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: "env",
      title: "Set up environment variables",
      description: "Create a .env.local file with your Supabase credentials",
      completed:
        !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      link: "/diagnostic",
      linkText: "Run Diagnostics",
    },
    {
      id: "database",
      title: "Create database tables",
      description: "Set up your Supabase database with the necessary tables",
      completed: false,
      link: "https://supabase.com/dashboard",
      linkText: "Open Supabase Dashboard",
    },
    {
      id: "auth",
      title: "Configure authentication",
      description:
        "Set up authentication in Supabase and update your application",
      completed: false,
      link: "/login",
      linkText: "Test Auth Flow",
    },
    {
      id: "properties",
      title: "Add property data",
      description: "Add your first property listings to the database",
      completed: false,
    },
    {
      id: "styling",
      title: "Customize styling",
      description: "Update the design to match your brand",
      completed: false,
    },
  ]);

  const toggleStep = (id: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step,
      ),
    );
  };

  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Property Africa Setup Guide
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Complete these steps to get your application up and running
        </p>
        <div className="mt-2">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {steps.map((step, index) => (
          <li key={step.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    step.completed
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {step.completed && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
                {step.link && (
                  <Link
                    href={step.link}
                    className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    target={step.link.startsWith("http") ? "_blank" : undefined}
                  >
                    {step.linkText}
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Completed
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
