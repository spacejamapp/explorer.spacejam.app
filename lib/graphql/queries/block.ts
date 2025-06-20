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

export const GET_BLOCK = gql`
  query QueryRoot($slot: Int) {
    block(slot: $slot) {
      header {
        slot
        hash
        parent
        parent_state_root: parentStateRoot
        extrinsic_hash: extrinsicHash
        extrinsic_works: extrinsicWorks
        author_index: authorIndex
        entropy_source: entropySource
        seal
        offenders_mark: offendersMark
        epochMark {
          id
          block
          entropy
          tickets_entropy: ticketsEntropy
          validators
          validators_bandersnatches: validatorsBandersnatches
        }
        ticketsMark {
          id
          block
          ticket_id: ticketId
          attempt
        }
      }
      extrinsic {
        tickets {
          id
          block
          attempt
          signature
        }
        preimages {
          id
          block
          requester
          hash
          blob
        }
        guarantees {
          id
          block
          report
          slot
          signatures
        }
        assurances {
          id
          block
          anchor
          bitfield
          validator_index: validatorIndex
          signature
        }
        disputes {
          verdicts {
            id
            block
            target
            age
            votes
          }
          culprits {
            id
            block
            target
            key
            signature
          }
          faults {
            id
            block
            target
            vote
            key
            signature
          }
        }
      }
    }
  }
`;
