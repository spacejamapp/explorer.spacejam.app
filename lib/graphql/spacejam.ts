import { query } from '@/lib/graphql';
import { Spacejam } from '@/types/graphql';

// Query definitions (converted from GraphQL gql tagged templates)
export const GET_SPACEJAM_QUERY = `
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
`;

// Query functions
export const fetchSpacejam = () =>
  query<{ spacejam: Spacejam }>(GET_SPACEJAM_QUERY);
