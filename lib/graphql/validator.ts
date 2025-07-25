import { query } from '@/lib/graphql';

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

export const fetchValidator = (id: number, first: number = 10, after?: string) =>
  query<{ validator: ValidatorDetail | null }>(GET_VALIDATOR_QUERY, {
    id,
    first,
    after,
  });

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
