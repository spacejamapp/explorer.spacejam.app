import { useQuery } from '@tanstack/react-query';

import {
  fetchBlock,
  fetchBlocks,
  fetchSpacejam,
  queryKeys,
} from '@/lib/graphql';
import {
  Block,
  BlockDetails,
  GetBlocksVariables,
  Header,
  Spacejam,
} from '@/types/index';

// Client-side hooks
export function useSpacejam() {
  return useQuery({
    queryKey: queryKeys.spacejam(),
    queryFn: fetchSpacejam,
  });
}

export function useBlocks(variables: GetBlocksVariables) {
  return useQuery<{ blocks: Header[] }>({
    queryKey: queryKeys.blocksList(variables.from, variables.to),
    queryFn: () => fetchBlocks(variables.from, variables.to),
  });
}

export function useBlock(slot: number) {
  return useQuery<{ block: BlockDetails }>({
    queryKey: queryKeys.block(slot),
    queryFn: () => fetchBlock(slot),
    enabled: !!slot,
  });
}
