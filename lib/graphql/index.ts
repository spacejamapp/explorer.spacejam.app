import { GraphQLResponse } from '@/types/graphql';

const ENDPOINT = 'http://localhost:3000';

// Query key factories
export const queryKeys = {
  spacejam: () => ['spacejam'] as const,
  blocks: () => ['blocks'] as const,
  blocksList: (from: number, to: number) => ['blocks', { from, to }] as const,
  block: (slot: number) => ['block', slot] as const,
};

export async function query<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
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
