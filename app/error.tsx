'use client';

import { useEffect } from 'react';

import ServiceUnavailable from '@/components/ui/service-unavailable';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error handler:', error);
  }, [error]);

  // Check if it's a network-related error
  const isNetworkError = error.message?.toLowerCase().includes('fetch failed') ||
                         error.message?.toLowerCase().includes('network error') ||
                         error.message?.toLowerCase().includes('connection refused');

  return (
    <div className="container mx-auto py-8">
      <ServiceUnavailable 
        title={isNetworkError ? "Service Temporarily Unavailable" : "Something went wrong"}
        message={
          isNetworkError 
            ? "We're experiencing connectivity issues. Please try again in a moment."
            : "An unexpected error occurred. Please refresh the page and try again."
        }
        showRetry={true}
        onRetry={reset}
      />
    </div>
  );
}
