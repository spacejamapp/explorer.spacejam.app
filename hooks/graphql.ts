import { useQuery } from '@tanstack/react-query';
import {
  fetchSpacejam,
  queryKeys,
} from '@/lib/graphql';

// Client-side hooks
export function useSpacejam() {
  return useQuery({
    queryKey: queryKeys.spacejam(),
    queryFn: fetchSpacejam,
  });
}

