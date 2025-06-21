import { query } from '@/lib/graphql';
import { Block, Header } from '@/types';

export const fetchBlocks = (from: number, to: number) =>
  query<{ headers: Header[] }>(GET_BLOCKS_QUERY, { from, to });

export const fetchBlock = (slot: number) =>
  query<{ blockRaw: string }>(GET_BLOCK_QUERY, { slot }).then((data) => {
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
  query QueryBlocks($from: Int, $to: Int) {
    headers(from: $from, to: $to) {
      slot
      hash
      parent
      parentStateRoot
      extrinsicHash
      extrinsicCount
      authorIndex
      entropySource
      offendersMark
    }
  }
`;

export const GET_BLOCK_QUERY = `
  query QueryBlock($slot: Int) {
    blockRaw(slot: $slot)
  }
`;
