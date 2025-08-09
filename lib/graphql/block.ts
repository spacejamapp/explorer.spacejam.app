import { query } from '@/lib/graphql';
import { Block, Header } from '@/types';

interface HeaderConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: Header;
    cursor: string;
  }>;
  nodes: Header[];
}

export const fetchBlocks = (first: number = 10, after?: string) =>
  query<{ headers: HeaderConnection }>(GET_BLOCKS_QUERY, { first, after });

export const fetchBlock = (slot: number) =>
  query<{ block: Block }>(GET_BLOCK_QUERY, { slot });

export const fetchBlockRaw = (slot: number) =>
  query<{ blockRaw: string }>(GET_BLOCK_RAW_QUERY, { slot }).then((data) => {
    const rblock = JSON.parse(data.blockRaw);
    const block = rblock as Block;
    block.header.parentStateRoot = rblock.header.parent_state_root as string;
    block.header.extrinsicHash = rblock.header.extrinsic_hash as string;
    block.header.authorIndex = rblock.header.author_index as number;
    block.header.entropySource = rblock.header.entropy_source as string;
    block.header.offendersMark = rblock.header.offenders_mark as string[];
    return block;
  });

export const GET_BLOCKS_QUERY = `
  query QueryBlocks($first: Int = 10, $after: String) {
    headers(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          slot
          hash
          parent
          parentStateRoot
          extrinsicHash
          extrinsicCount
          authorIndex
          entropySource
          offendersMark
          currentEpoch
        }
        cursor
      }
      nodes {
        slot
        hash
        parent
        parentStateRoot
        extrinsicHash
        extrinsicCount
        authorIndex
        entropySource
        offendersMark
        currentEpoch
      }
    }
  }
`;

export const GET_BLOCK_QUERY = `
  query QueryBlock($slot: Int!) {
    block(slot: $slot) {
      header {
        slot
        hash
        parent
        parentStateRoot
        extrinsicHash
        extrinsicCount
        authorIndex
        entropySource
        seal
        offendersMark
        epochMark {
          id
          block
          entropy
          ticketsEntropy
          blocks
          tickets
          preimages
          preimagesSize
          guarantees
          assurances
        }
        ticketsMark {
          id
          block
          ticketId
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
          slot
          signatures
          spec
          core
          authorizerHash
          authOutput
          authGas
        }
        assurances {
          id
          block
          anchor
          bitfield
          validatorIndex
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

export const GET_BLOCK_RAW_QUERY = `
  query QueryBlockRaw($slot: Int!) {
    blockRaw(slot: $slot)
  }
`;
