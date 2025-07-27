import React from 'react';
import { notFound } from 'next/navigation';

import { getCorePageData, type CoreDataResult } from '@/lib/core-utils';
import { NoDataError } from '@/components/ui/no-data';

import CoreTabs from './tabs';
import ToastHandler from './toast-handler';

interface PageProps {
  id: string;
}

export default async function CoreDetailsPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const { id } = await params;
  const coreIndex = parseInt(id, 10);

  // Validate core index
  if (isNaN(coreIndex) || coreIndex < 0) {
    notFound();
  }

  // Fetch and transform core data using dedicated utility function
  const result: CoreDataResult = await getCorePageData(coreIndex, 50);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Core {coreIndex}</h1>
          {result.success && (
            <div className="text-sm text-muted-foreground">
              {result.epochCount} epoch{result.epochCount !== 1 ? 's' : ''} of data
            </div>
          )}
        </div>

        {result.success ? (
          <CoreTabs coreId={coreIndex} activityData={result.activityData} />
        ) : (
          <>
            <NoDataError
              title={`No data available for Core ${coreIndex}`}
              description={result.error}
            />
            <ToastHandler error={result.error} />
          </>
        )}
      </div>
    </div>
  );
}
