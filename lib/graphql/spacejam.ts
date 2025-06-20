import { query } from '@/lib/graphql';

// Query definitions (converted from GraphQL gql tagged templates)
export const GET_SPACEJAM_QUERY = `
  query QueryRoot {
    spacejam {
      finalized
      extrinsic
    }
  }
`;

// Query functions
export const fetchSpacejam = () => query<any>(GET_SPACEJAM_QUERY);
