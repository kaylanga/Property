import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Property Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <div className="space-x-4">
          <Link
            href="/properties"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
