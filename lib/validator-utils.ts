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
  totalEpochs: number;
}

interface ValidatorDataError {
  success: false;
  error: string;
  activityData: [];
  validatorDisplay: null;
  totalBlocks: 0;
  totalTickets: 0;
  totalEpochs: 0;
}

export type ValidatorDataResult = ValidatorDataSuccess | ValidatorDataError;

/**
 * Server-side utility function for Validator pages
 * Handles fetching and transforming validator data with epoch fallback
 * Returns error message when data is not available instead of fallback mock data
 */
export async function getValidatorPageData(validatorIndex: number): Promise<ValidatorDataResult> {
  // Try to fetch validator data from GraphQL API using Result pattern
  const { data: validatorData, error: validatorError } = await fetchValidatorSafe(validatorIndex);
  
  if (!validatorError && validatorData?.validator) {
    // Successfully got validator data with new API fields
    const validator = validatorData.validator;
    
    const activityData: ActivityRecord[] = validator.epochs.nodes.map((epochData, index) => ({
      blocks: epochData.blocks,
      tickets: epochData.tickets,
      preimages: epochData.preimages,
      preimages_size: 0, // Not available in current schema
      guarantees: epochData.guarantees,
      assurances: epochData.assurances,
      epoch: epochData.epoch.id,
      index: index + 1,
    }));

    const validatorDisplay: ValidatorDisplay = {
      bandersnatch: validatorIndex,
      node: validator.ip || `validator-${validatorIndex}.jam.network`,
      ip: validator.ip || 'N/A',
      name: validator.name || `Validator ${validatorIndex}`,
      pfp: undefined,
      website: validator.website || undefined,
    };

    return {
      success: true,
      activityData,
      validatorDisplay,
      totalBlocks: validator.totalBlocks,
      totalTickets: validator.totalTickets,
      totalEpochs: validator.totalEpochs,
    };
  }

  // TODO: REMOVE FALLBACK FAKE DATA
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
      totalEpochs: 0,
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
      totalEpochs: 0,
    };
  }

  // Check epochData structure step by step to avoid null access errors
  if (!epochData) {
    return {
      success: false,
      error: `No epoch data received for epoch ${currentEpoch}`,
      activityData: [],
      validatorDisplay: null,
      totalBlocks: 0,
      totalTickets: 0,
      totalEpochs: 0,
    };
  }

  if (!epochData.epoch) {
    return {
      success: false,
      error: `Epoch ${currentEpoch} not found`,
      activityData: [],
      validatorDisplay: null,
      totalBlocks: 0,
      totalTickets: 0,
      totalEpochs: 0,
    };
  }

  if (!epochData.epoch.validators || !epochData.epoch.validators.nodes) {
    return {
      success: false,
      error: `No validator data available in epoch ${currentEpoch}`,
      activityData: [],
      validatorDisplay: null,
      totalBlocks: 0,
      totalTickets: 0,
      totalEpochs: 0,
    };
  }

  // Look for the validator in current epoch by vindex
  const validatorInEpoch = epochData.epoch.validators.nodes.find(
    (v) => v.vindex === validatorIndex
  );
  
  if (!validatorInEpoch) {
    return {
      success: false,
      error: `Validator ${validatorIndex} not found in current epoch ${currentEpoch}. Available validators: ${epochData.epoch.validators.nodes.map(v => v.vindex).join(', ')}`,
      activityData: [],
      validatorDisplay: null,
      totalBlocks: 0,
      totalTickets: 0,
      totalEpochs: 0,
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
    totalEpochs: 1, // Fallback case - only current epoch data available
  };
}
