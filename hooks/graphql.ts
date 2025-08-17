import { useQuery } from '@tanstack/react-query';

import {
  fetchBlock,
  fetchBlockRaw,
  fetchBlocks,
  fetchCore,
  fetchEpoch,
  fetchService,
  fetchServices,
  fetchSpacejam,
  fetchValidator,
  queryKeys,
} from '@/lib/graphql';

// Client-side hooks
export function useSpacejam() {
  return useQuery({
    queryKey: queryKeys.spacejam(),
    queryFn: fetchSpacejam,
  });
}

export function useBlocks(first: number = 10, after?: string) {
  return useQuery({
    queryKey: queryKeys.blocksList(first, after),
    queryFn: () => fetchBlocks(first, after),
  });
}

export function useBlock(slot: number) {
  return useQuery({
    queryKey: queryKeys.block(slot),
    queryFn: () => fetchBlock(slot),
  });
}

export function useBlockRaw(slot: number) {
  return useQuery({
    queryKey: queryKeys.blockRaw(slot),
    queryFn: () => fetchBlockRaw(slot),
  });
}

export function useServices(first: number = 10, after?: string) {
  return useQuery({
    queryKey: queryKeys.servicesList(first, after),
    queryFn: () => fetchServices(first, after),
  });
}

export function useService(id: number) {
  return useQuery({
    queryKey: queryKeys.service(id),
    queryFn: () => fetchService(id),
  });
}

export function useValidator(index: number) {
  return useQuery({
    queryKey: queryKeys.validator(index, 10), // Keep queryKey structure for cache compatibility
    queryFn: () => fetchValidator(index),
  });
}

export function useCore(index: number, first: number = 10, after?: string) {
  return useQuery({
    queryKey: queryKeys.core(index, first, after),
    queryFn: () => fetchCore(index, first, after),
  });
}

export function useEpoch(id: number) {
  return useQuery({
    queryKey: queryKeys.epoch(id),
    queryFn: () => fetchEpoch(id),
  });
}
