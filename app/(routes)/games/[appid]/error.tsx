'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-red-500/10 border border-red-500/30 rounded-full p-4 mb-4">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        We couldn&apos;t load the details for this game. This might be a temporary issue with the Steam API or our connection.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
