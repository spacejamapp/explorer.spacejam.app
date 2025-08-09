'use client';

import { useEffect } from 'react';
import { toast } from '@/lib/toast';

interface ToastHandlerProps {
  error: string;
}

/**
 * Client-side component to handle showing toast messages
 * This needs to be a separate client component since toast needs browser APIs
 */
export default function ToastHandler({ error }: ToastHandlerProps) {
  useEffect(() => {
    if (error) {
      toast.warning(error, { duration: 6000 });
    }
  }, [error]);

  return null; // This component doesn't render anything visible
}