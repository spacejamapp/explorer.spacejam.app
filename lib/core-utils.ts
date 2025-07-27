import { fetchCoreSafe } from '@/lib/graphql/core';
import type { CoreActivityRecord } from '@/types/statistic';

interface CoreDataSuccess {
  success: true;
  activityData: CoreActivityRecord[];
  epochCount: number;
}

interface CoreDataError {
  success: false;
  error: string;
  activityData: [];
  epochCount: 0;
}

export type CoreDataResult = CoreDataSuccess | CoreDataError;

/**
 * Server-side utility function for Core pages
 * Handles fetching and transforming core data
 * Returns error message when data is not available instead of fallback mock data
 */
export async function getCorePageData(coreIndex: number, limit: number = 50): Promise<CoreDataResult> {
  // Try to fetch core data from GraphQL API using Result pattern
  const { data, error } = await fetchCoreSafe(coreIndex, limit);
  
  if (error) {
    return {
      success: false,
      error: `Failed to fetch core data: ${error.message}`,
      activityData: [],
      epochCount: 0,
    };
  }

  const { core } = data;
  
  if (!core || core.nodes.length === 0) {
    return {
      success: false,
      error: `No data available for core ${coreIndex}`,
      activityData: [],
      epochCount: 0,
    };
  }

  // Transform real GraphQL data to match CoreActivityRecord interface
  const activityData: CoreActivityRecord[] = core.nodes.map((coreNode, index) => ({
    id: coreNode.id,
    gas_used: coreNode.gasUsed,
    imports: coreNode.imports,
    extrinsic_count: coreNode.extrinsicCount,
    exports: coreNode.exports,
    bundle_size: coreNode.bundleSize,
    da_load: coreNode.daLoad,
    popularity: coreNode.popularity,
    epoch: coreNode.epoch.id,
    index: index + 1,
  }));

  return {
    success: true,
    activityData,
    epochCount: activityData.length,
  };
}