'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Core page error:', error);
  }, [error]);

  return (
    <main className="container mx-auto py-8">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Something went wrong!</h1>
          <p className="text-muted-foreground text-lg">
            There was an error loading the core data.
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Error: {error.message}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}