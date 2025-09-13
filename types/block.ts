/**
 * block related types
 */
import { Extrinsic } from '@/types/extrinsic';

export type TicketsMark = TicketBody[];

export interface Block {
  header: Header;
  extrinsic: Extrinsic;
}

export interface Header {
  slot: number;
  hash: string;
  parent: string;
  parentStateRoot: string;
  extrinsicHash: string;
  epochMark?: EpochMark;
  ticketsMark?: TicketsMark;
  offendersMark: string[];
  extrinsicCount: number;
  authorIndex: number;
  author: {
    ed25519: string;
  };
  entropySource: string;
  seal: string;
}

export interface EpochMark {
  id: number;
  block: number;
  entropy: string;
  tickets_entropy: string;
  validators: EpochValidator[];
  validators_bandersnatches: string[];
}

export interface EpochValidator {
  bandersnatch: string;
  ed25519: string;
}

export interface Validator {
  id: number;
  ed25519: string;
  bandersnatch: string;
  name: string;
  details: string;
  software: string;
  ip: string;
  website: string;
  scores: number;
  totalBlocks: number;
  totalEpochs: number;
  totalTickets: number;
}

export interface TicketBody {
  id: string;
  attempt: number;
  block: number;
  ticket_id: string;
}

export interface GetBlockVariables {
  slot: number;
}

export interface GetBlocksVariables {
  from: number;
  to: number;
}
