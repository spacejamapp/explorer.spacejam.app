import { query } from '@/lib/graphql';

export interface Validator {
  id: number;
  epoch: number;
  vindex: number;
  blocks: number;
  tickets: number;
  preimages: number;
  guarantees: number;
  assurances: number;
}

interface ValidatorConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: Validator;
    cursor: string;
  }>;
  nodes: Validator[];
}

export const fetchValidator = (index: number, first: number = 10, after?: string) =>
  query<{ validator: ValidatorConnection }>(GET_VALIDATOR_QUERY, { index, first, after });

export const GET_VALIDATOR_QUERY = `
  query QueryValidator($index: Int!, $first: Int = 10, $after: String) {
    validator(index: $index, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          epoch
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
        epoch
        vindex
        blocks
        tickets
        preimages
        guarantees
        assurances
      }
    }
  }
`;
