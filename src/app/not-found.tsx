'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 dark:text-yellow-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl sm:text-9xl font-bold text-blue-600 dark:text-blue-400">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The requested page could not be located
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/properties"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
