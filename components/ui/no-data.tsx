import React from 'react';
import { AlertCircle, Database } from 'lucide-react';

interface NoDataProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function NoData({
  title = "No data available",
  description = "There is currently no data to display for this resource.",
  icon,
  className = "",
}: NoDataProps) {
  const defaultIcon = icon || <Database className="h-12 w-12 text-muted-foreground" />;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">
        {defaultIcon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
    </div>
  );
}

export function NoDataError({
  title = "Failed to load data",
  description = "There was an error loading the requested data.",
  className = "",
}: Omit<NoDataProps, 'icon'>) {
  return (
    <NoData
      title={title}
      description={description}
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      className={className}
    />
  );
}