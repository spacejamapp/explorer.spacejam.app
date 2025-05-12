import { gql } from '@apollo/client';

export const GET_SPACEJAM = gql`
  query QueryRoot {
    spacejam {
      finalized
      extrinsic
    }
  }
`;
