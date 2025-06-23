import { query } from '@/lib/graphql';

export interface Service {
  id: number;
  code: string;
  balance: number;
  accumulate: number;
  transfer: number;
  total: number;
  items: number;
}

export interface Preimage {
  id: number;
  block: number;
  requester: number;
  hash: string;
  blob: number[];
}

export interface WorkResult {
  id: number;
  guarantee: number;
  service: number;
  code: string;
  payload: string;
  gas: number;
  result: string;
  refineGas: number;
  refineImports: number;
  refineExtrinsicCount: number;
  refineExtrinsicSize: number;
  refineExports: number;
}

interface ServiceConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: Service;
    cursor: string;
  }>;
  nodes: Service[];
}

interface PreimageConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: Preimage;
    cursor: string;
  }>;
  nodes: Preimage[];
}

interface WorkResultConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: WorkResult;
    cursor: string;
  }>;
  nodes: WorkResult[];
}

interface ServiceWithConnections extends Service {
  preimages: PreimageConnection;
  works: WorkResultConnection;
}

export const fetchServices = (first: number = 10, after?: string) =>
  query<{ services: ServiceConnection }>(GET_SERVICES_QUERY, { first, after });

export const fetchService = (id: number) =>
  query<{ service: ServiceWithConnections }>(GET_SERVICE_QUERY, { id });

export const GET_SERVICES_QUERY = `
  query QueryServices($first: Int = 10, $after: String) {
    services(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          code
          balance
          accumulate
          transfer
          total
          items
        }
        cursor
      }
      nodes {
        id
        code
        balance
        accumulate
        transfer
        total
        items
      }
    }
  }
`;

export const GET_SERVICE_QUERY = `
  query QueryService($id: Int!) {
    service(id: $id) {
      id
      code
      balance
      accumulate
      transfer
      total
      items
      preimages(first: 20) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            block
            requester
            hash
            blob
          }
          cursor
        }
        nodes {
          id
          block
          requester
          hash
          blob
        }
      }
      works(first: 20) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            guarantee
            service
            code
            payload
            gas
            result
            refineGas
            refineImports
            refineExtrinsicCount
            refineExtrinsicSize
            refineExports
          }
          cursor
        }
        nodes {
          id
          guarantee
          service
          code
          payload
          gas
          result
          refineGas
          refineImports
          refineExtrinsicCount
          refineExtrinsicSize
          refineExports
        }
      }
    }
  }
`;
