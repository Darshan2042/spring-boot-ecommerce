import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner - Shows while page is loading
 * Used with React.lazy and Suspense for code splitting
 */
const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-md rounded-[28px] p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-xl">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Loading your experience</h2>
        <p className="text-slate-500">Preparing products, cart, and checkout details</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
