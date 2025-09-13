'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';

// Performance-optimized configuration
nProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 300,
  showSpinner: false,
  trickle: true,
  trickleSpeed: 200,
});

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Start progress bar on route change
    nProgress.start();

    // Use requestAnimationFrame for better performance
    const completeProgress = () => {
      requestAnimationFrame(() => {
        nProgress.done();
      });
    };

    // Complete with slight delay to ensure smooth animation
    const timer = setTimeout(completeProgress, 100);

    return () => {
      clearTimeout(timer);
      nProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}

export default function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}