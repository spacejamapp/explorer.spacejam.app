import React from 'react';
import { notFound } from 'next/navigation';

import { fetchCore } from '@/lib/graphql';
import { getMockCoreActivity } from '@/lib/mock/core';

import CoreTabs from './tabs';

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

  try {
    // Try to fetch core data from GraphQL API
    let coreData = null;
    let activityData = [];

    try {
      const { core } = await fetchCore(coreIndex, 50);
      coreData = core;
    } catch (error) {
      console.warn('Core API not available, using fallback mock data:', error);
    }

    if (coreData && coreData.nodes.length > 0) {
      // Use real GraphQL data - map to match CoreActivityRecord interface
      activityData = coreData.nodes.map((core) => ({
        id: core.id,
        gas_used: core.gasUsed,
        imports: core.imports,
        extrinsic_count: core.extrinsicCount,
        exports: core.exports,
        bundle_size: core.bundleSize,
        da_load: core.daLoad,
        popularity: core.popularity,
      }));
    } else {
      // Fallback to mock data if no real data available
      activityData = getMockCoreActivity(coreIndex, 30);
    }

    // If no data at all, show not found
    if (activityData.length === 0) {
      notFound();
    }

    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Core {coreIndex}</h1>
            <div className="text-sm text-muted-foreground">
              {coreData ? `${activityData.length} epoch${activityData.length !== 1 ? 's' : ''} of data` : 'Mock data'}
            </div>
          </div>

          <CoreTabs coreId={coreIndex} activityData={activityData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching core data:', error);
    notFound();
  }
}
