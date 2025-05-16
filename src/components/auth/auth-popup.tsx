'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export const AuthPopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-xl shadow-xl w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Sign In</Dialog.Title>

          {/* OAuth Button */}
          <button
            onClick={() => {
              // Replace with your OAuth handler
              console.log('Sign in with Google');
            }}
            className="w-full mb-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Sign in with Google
          </button>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
