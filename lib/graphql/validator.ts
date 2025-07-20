import { query } from '@/lib/graphql';

export interface ValidatorDetail {
  id: number;
  ed25519?: string;
  bandersnatch?: string;
  name?: string;
  details?: string;
  software?: string;
  ip?: string;
  website?: string;
  scores?: number;
}

export interface ValidatorEpoch {
  id: number;
  vindex: number;
  blocks: number;
  tickets: number;
  preimages: number;
  guarantees: number;
  assurances: number;
}

interface ValidatorEpochConnection {
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

export interface ValidatorWithEpochs extends ValidatorDetail {
  epochs: ValidatorEpochConnection;
}

export const fetchValidator = (id: number, first: number = 10, after?: string) =>
  query<{ validator: ValidatorWithEpochs | null }>(GET_VALIDATOR_QUERY, {
    id,
    first,
    after,
  });

export const GET_VALIDATOR_QUERY = `
  query QueryValidator($id: Int!, $first: Int = 10, $after: String) {
    validator(id: $id) {
      id
      ed25519
      bandersnatch
      name
      details
      software
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
