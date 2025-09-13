import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceUnavailableProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function ServiceUnavailable({
  title = "Service Temporarily Unavailable",
  message = "We're experiencing connectivity issues. Please try again in a moment.",
  showRetry = false,
  onRetry,
}: ServiceUnavailableProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        {showRetry && (
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
