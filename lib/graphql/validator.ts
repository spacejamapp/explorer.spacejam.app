import { query } from '@/lib/graphql';
import { safeAsync, type Result } from '@/lib/result';
import { type Epoch } from './epoch';
import { type Spacejam } from '@/types/graphql';

// Re-define EpochWithConnections locally since it's not exported from epoch.ts
interface EpochWithConnections extends Epoch {
  validators: {
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
    nodes: Array<{
      id: number;
      epoch: { id: number };
      vindex: number;
      blocks: number;
      tickets: number;
      preimages: number;
      guarantees: number;
      assurances: number;
    }>;
  };
}

export interface ValidatorEpoch {
  id: number;
  epoch: {
    id: number;
  };
  vindex: number;
  blocks: number;
  tickets: number;
  preimages: number;
  guarantees: number;
  assurances: number;
}

export interface ValidatorConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: ValidatorEpoch;
    cursor: string;
  }>;
  nodes: ValidatorEpoch[];
}

export interface EpochValidator {
  id: number;
  epochId: number;
  validatorId: number;
  vindex: number;
  blocks: number;
  tickets: number;
  preimages: number;
  guarantees: number;
  assurances: number;
  epoch: {
    id: number;
  };
  validator: {
    id: number;
  };
}

export interface EpochValidatorConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: EpochValidator;
    cursor: string;
  }>;
  nodes: EpochValidator[];
}

export interface ValidatorDetail {
  id: number;
  ed25519: string;
  bandersnatch: string;
  name: string;
  details: string;
  software: string;
  ip: string;
  website: string;
  scores: number;
  totalBlocks: number;
  totalEpochs: number;
  totalTickets: number;
  epochs: EpochValidatorConnection;
}

// Legacy version for backward compatibility
export const fetchValidator = (index: number) =>
  query<{ validator: ValidatorDetail | null }>(GET_VALIDATOR_QUERY, {
    index,
  });

// New Result-based version
export const fetchValidatorSafe = async (
  index: number
): Promise<Result<{ validator: ValidatorDetail | null }>> => {
  return safeAsync(() => 
    query<{ validator: ValidatorDetail | null }>(GET_VALIDATOR_QUERY, { index })
  );
};

// Add safe versions for dependencies  
export const fetchEpochSafe = async (id: number): Promise<Result<{ epoch: EpochWithConnections }>> => {
  return safeAsync(() => 
    query(`
      query QueryEpoch($id: Int!) {
        epoch(id: $id) {
          id
          block
          entropy
          ticketsEntropy
          blocks
          tickets
          preimages
          preimagesSize
          guarantees
          assurances
          validators(first: 50) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              id
              epoch { id }
              vindex
              blocks
              tickets
              preimages
              guarantees
              assurances
            }
          }
        }
      }
    `, { id })
  );
};

export const fetchSpacejamSafe = async (): Promise<Result<{ spacejam: Spacejam }>> => {
  return safeAsync(() => 
    query(`
      query Spacejam {
        spacejam {
          tickets
          preimages
          guarantees
          assurances
          disputesVerdicts
          disputesCulprits
          disputesFaults
          blocks
          finalized
          services
          extrinsics
          epoch
        }
      }
    `)
  );
};

export const GET_VALIDATOR_QUERY = `
  query QueryValidator($index: Int!) {
    validator(id: $index) {
      id
      ed25519
      bandersnatch
      name
      details
      software
      ip
      website
      scores
      totalBlocks
      totalEpochs
      totalTickets
      epochs(first: 50) {
        nodes {
          id
          epochId
          vindex
          blocks
          tickets
          preimages
          guarantees
          assurances
          epoch {
            id
          }
        }
      }
    }
  }
`;
