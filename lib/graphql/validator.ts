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

export interface ValidatorDetail {
  id: number;
  ip?: string;
  website?: string;
  scores?: number;
  epochs: ValidatorConnection;
}

// Legacy version for backward compatibility
export const fetchValidator = (id: number, first: number = 10, after?: string) =>
  query<{ validator: ValidatorDetail | null }>(GET_VALIDATOR_QUERY, {
    id,
    first,
    after,
  });

// New Result-based version
export const fetchValidatorSafe = async (
  id: number, 
  first: number = 10, 
  after?: string
): Promise<Result<{ validator: ValidatorDetail | null }>> => {
  return safeAsync(() => 
    query<{ validator: ValidatorDetail | null }>(GET_VALIDATOR_QUERY, { id, first, after })
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
  query QueryValidator($id: Int!, $first: Int = 10, $after: String) {
    validator(id: $id) {
      id
      ip
      website
      scores
      epochs(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            epoch {
              id
            }
            vindex
            blocks
            tickets
            preimages
            guarantees
            assurances
          }
          cursor
        }
        nodes {
          id
          epoch {
            id
          }
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
`;
