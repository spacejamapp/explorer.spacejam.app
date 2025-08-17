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
