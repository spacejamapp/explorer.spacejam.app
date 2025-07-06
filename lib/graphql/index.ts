import { GraphQLResponse } from '@/types/graphql';

const ENDPOINT = 'http://localhost:3000';

// Query key factories
export const queryKeys = {
  spacejam: () => ['spacejam'] as const,
  blocks: () => ['blocks'] as const,
  blocksList: (first: number, after?: string) =>
    ['blocks', { first, after }] as const,
  block: (slot: number) => ['block', slot] as const,
  blockRaw: (slot: number) => ['blockRaw', slot] as const,
  services: () => ['services'] as const,
  servicesList: (first: number, after?: string) =>
    ['services', { first, after }] as const,
  service: (id: number) => ['service', id] as const,
  validator: (index: number, first: number, after?: string) =>
    ['validator', { index, first, after }] as const,
  core: (index: number, first: number, after?: string) =>
    ['core', { index, first, after }] as const,
  epoch: (id: number) => ['epoch', id] as const,
};

export async function query<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}

export * from './block';
export * from './spacejam';
export * from './validator';
export * from './service';
export { fetchCore, GET_CORE_QUERY } from './core';
export type { Core as CoreGraphQL } from './core';
export { fetchEpoch, GET_EPOCH_QUERY } from './epoch';
export type {
  Epoch as EpochGraphQL,
  Validator as ValidatorGraphQL,
  Core as EpochCore,
} from './epoch';
