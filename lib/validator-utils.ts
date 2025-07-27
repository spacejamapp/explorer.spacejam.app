import { fetchValidatorSafe, fetchEpochSafe, fetchSpacejamSafe } from '@/lib/graphql/validator';
import type { ActivityRecord } from '@/types/statistic';

export interface ValidatorDisplay {
  bandersnatch: number;
  node: string;
  ip: string;
  name: string;
  pfp?: string;
  website?: string;
}

interface ValidatorDataSuccess {
  success: true;
  activityData: ActivityRecord[];
  validatorDisplay: ValidatorDisplay;
  totalBlocks: number;
  totalTickets: number;
}

interface ValidatorDataError {
  success: false;
  error: string;
  activityData: [];
  validatorDisplay: null;
  totalBlocks: 0;
  totalTickets: 0;
}

export type ValidatorDataResult = ValidatorDataSuccess | ValidatorDataError;

/**
 * Server-side utility function for Validator pages
 * Handles fetching and transforming validator data with epoch fallback
 * Returns error message when data is not available instead of fallback mock data
 */
export async function getValidatorPageData(validatorIndex: number, limit: number = 50): Promise<ValidatorDataResult> {
  // Try to fetch validator data from GraphQL API using Result pattern
  const { data: validatorData, error: validatorError } = await fetchValidatorSafe(validatorIndex, limit);
  
  if (!validatorError && validatorData?.validator) {
    // Successfully got validator data
    const validator = validatorData.validator;
    
    const activityData: ActivityRecord[] = validator.epochs.nodes.map((epoch, index) => ({
      blocks: epoch.blocks,
      tickets: epoch.tickets,
      preimages: epoch.preimages,
      preimages_size: 0, // Not available in current schema
      guarantees: epoch.guarantees,
      assurances: epoch.assurances,
      epoch: epoch.epoch.id,
      index: index + 1,
    }));

    const totalBlocks = validator.epochs.nodes.reduce((sum, epoch) => sum + epoch.blocks, 0);
    const totalTickets = validator.epochs.nodes.reduce((sum, epoch) => sum + epoch.tickets, 0);

    const validatorDisplay: ValidatorDisplay = {
      bandersnatch: validatorIndex,
      node: `validator-${validatorIndex}.jam.network`,
      ip: validator.ip || 'N/A',
      name: `Validator ${validatorIndex}`,
      pfp: undefined,
      website: validator.website,
    };

    return {
      success: true,
      activityData,
      validatorDisplay,
      totalBlocks,
      totalTickets,
    };
  }

  // Fallback: try to find validator in current epoch
  console.warn('Direct validator API not available, trying epoch fallback');
  
  const { data: spacejamData, error: spacejamError } = await fetchSpacejamSafe();
  
  if (spacejamError) {
    return {
      success: false,
      error: `Failed to fetch network data: ${spacejamError.message}`,
      activityData: [],
      validatorDisplay: null,
      totalBlocks: 0,
      totalTickets: 0,
    };
  }

  const currentEpoch = spacejamData.spacejam.epoch;
  const { data: epochData, error: epochError } = await fetchEpochSafe(currentEpoch);
  
  if (epochError) {
    return {
      success: false,
      error: `Failed to fetch epoch data: ${epochError.message}`,
      activityData: [],
      validatorDisplay: null,
      totalBlocks: 0,
      totalTickets: 0,
    };
  }

  // Look for the validator in current epoch by vindex
  const validatorInEpoch = epochData.epoch?.validators.nodes.find(
    (v) => v.vindex === validatorIndex
  );
  
  if (!validatorInEpoch) {
    return {
      success: false,
      error: `Validator ${validatorIndex} not found in current epoch ${currentEpoch}`,
      activityData: [],
      validatorDisplay: null,
      totalBlocks: 0,
      totalTickets: 0,
    };
  }

  // Create activity data from epoch data
  const activityData: ActivityRecord[] = [{
    blocks: validatorInEpoch.blocks,
    tickets: validatorInEpoch.tickets,
    preimages: validatorInEpoch.preimages,
    preimages_size: 0,
    guarantees: validatorInEpoch.guarantees,
    assurances: validatorInEpoch.assurances,
    epoch: currentEpoch,
    index: 1,
  }];

  const validatorDisplay: ValidatorDisplay = {
    bandersnatch: validatorIndex,
    node: `validator-${validatorIndex}.jam.network`,
    ip: 'N/A',
    name: `Validator ${validatorIndex}`,
    pfp: undefined,
    website: undefined,
  };

  return {
    success: true,
    activityData,
    validatorDisplay,
    totalBlocks: validatorInEpoch.blocks,
    totalTickets: validatorInEpoch.tickets,
  };
}