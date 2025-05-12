import { gql } from '@apollo/client';

export const GET_BLOCKS = gql`
  query QueryRoot($from: Int, $to: Int) {
    blocks(from: $from, to: $to) {
      slot
      validator: authorIndex
      hash: extrinsicHash
    }
  }
`;
