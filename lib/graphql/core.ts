import { query } from '@/lib/graphql';

export interface Core {
  id: number;
  epoch: number;
  vindex: number;
  gasUsed: number;
  imports: number;
  extrinsicCount: number;
  extrinsicSize: number;
  exports: number;
  bundleSize: number;
  daLoad: number;
  popularity: number;
}

interface CoreConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: Core;
    cursor: string;
  }>;
  nodes: Core[];
}

export const fetchCore = (index: number, first: number = 10, after?: string) =>
  query<{ core: CoreConnection }>(GET_CORE_QUERY, { index, first, after });

export const GET_CORE_QUERY = `
  query QueryCore($index: Int!, $first: Int = 10, $after: String) {
    core(index: $index, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          epoch
          vindex
          gasUsed
          imports
          extrinsicCount
          extrinsicSize
          exports
          bundleSize
          daLoad
          popularity
        }
        cursor
      }
      nodes {
        id
        epoch
        vindex
        gasUsed
        imports
        extrinsicCount
        extrinsicSize
        exports
        bundleSize
        daLoad
        popularity
      }
    }
  }
`;
