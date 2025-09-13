'use client';

import React from 'react';

import ServiceUnavailable from '@/components/ui/service-unavailable';
import { NetworkError } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // If it's a NetworkError, show ServiceUnavailable
      if (this.state.error instanceof NetworkError) {
        return (
          <div className="container mx-auto py-8">
            <ServiceUnavailable 
              title="Service Temporarily Unavailable"
              message="We're experiencing connectivity issues. Please try again in a moment."
              showRetry={true}
              onRetry={() => {
                // Reset error state and reload
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            />
          </div>
        );
      }

      // For other errors, show generic error message
      return (
        <div className="container mx-auto py-8">
          <ServiceUnavailable 
            title="Something went wrong"
            message="An unexpected error occurred. Please refresh the page and try again."
            showRetry={true}
            onRetry={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          />
        </div>
      );
    }

    return this.props.children;
  }
}