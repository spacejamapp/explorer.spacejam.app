import { query } from '@/lib/graphql';

export interface Epoch {
  id: number;
  block: number;
  entropy: string;
  ticketsEntropy: string;
  validatorsEd25519: string[];
  validatorsBandersnatches: string[];
  blocks: number;
  tickets: number;
  preimages: number;
  preimagesSize: number;
  guarantees: number;
  assurances: number;
}

export interface Validator {
  id: number;
  epoch: number;
  vindex: number;
  blocks: number;
  tickets: number;
  preimages: number;
  guarantees: number;
  assurances: number;
}

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

interface ValidatorConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: Validator;
    cursor: string;
  }>;
  nodes: Validator[];
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

interface EpochWithConnections extends Epoch {
  validators: ValidatorConnection;
  cores: CoreConnection;
}

export const fetchEpoch = (id: number) =>
  query<{ epoch: EpochWithConnections }>(GET_EPOCH_QUERY, { id });

export const GET_EPOCH_QUERY = `
  query QueryEpoch($id: Int!) {
    epoch(id: $id) {
      id
      block
      entropy
      ticketsEntropy
      validatorsEd25519
      validatorsBandersnatches
      blocks
      tickets
      preimages
      preimagesSize
      guarantees
      assurances
      validators(first: 50) {
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
            blocks
            tickets
            preimages
            guarantees
            assurances
          }
          cursor
        }
        nodes {
          id
          epoch
          vindex
          blocks
          tickets
          preimages
          guarantees
          assurances
        }
      }
      cores(first: 50) {
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
  }
`;
