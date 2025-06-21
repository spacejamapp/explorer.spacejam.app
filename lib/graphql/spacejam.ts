import { query } from '@/lib/graphql';
import { Spacejam } from '@/types';

// Query definitions (converted from GraphQL gql tagged templates)
export const GET_SPACEJAM_QUERY = `
  query Spacejam {
    spacejam {
      blocks
      finalized
      extrinsics
    }
  }
`;

// Query functions
export const fetchSpacejam = () => query<{ spacejam: Spacejam }>(GET_SPACEJAM_QUERY);


