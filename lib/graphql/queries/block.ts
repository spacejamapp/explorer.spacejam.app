import { gql } from '@apollo/client';

export const GET_BLOCKS = gql`
  query QueryRoot($from: Int, $to: Int) {
    blocks(from: $from, to: $to) {
      slot
      hash
      parent
      seal
      parent_state_root: parentStateRoot
      extrinsic_hash: extrinsicHash
      extrinsic_works: extrinsicWorks
      author_index: authorIndex
      entropy_source: entropySource
      offenders_mark: offendersMark
    }
  }
`;
