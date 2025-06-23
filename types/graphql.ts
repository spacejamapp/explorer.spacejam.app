// GraphQL API Types

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

// Query Variables
export interface GetBlocksVariables {
  from: number;
  to: number;
}

export interface GetBlockVariables {
  slot: number;
}

// Spacejam Types
export interface Spacejam {
  tickets: number;
  preimages: number;
  guarantees: number;
  assurances: number;
  disputesVerdicts: number;
  disputesCulprits: number;
  disputesFaults: number;
  blocks: number;
  finalized: number;
  services: number;
  extrinsics: number;
}

// Block Types
export interface EpochMark {
  id: number;
  block: number;
  entropy: string;
  tickets_entropy: string;
  validators: number;
  validators_bandersnatches: string;
}

export interface TicketsMark {
  id: number;
  block: number;
  ticket_id: number;
  attempt: number;
}

export interface Header {
  slot: number;
  hash: string;
  parent: string;
  parent_state_root: string;
  extrinsic_hash: string;
  extrinsic_count: number;
  author_index: number;
  entropy_source: string;
  seal: string;
  offenders_mark: string[];
  epochMark?: EpochMark;
  ticketsMark?: TicketsMark;
}

export interface TicketEnvelope {
  id: number;
  block: number;
  attempt: number;
  signature: string;
}

export interface PreimageEnvelope {
  id: number;
  block: number;
  requester: string;
  hash: string;
  blob: string;
}

export interface GuaranteeEnvelope {
  id: number;
  block: number;
  report: string;
  slot: number;
  signatures: string;
}

export interface AssuranceEnvelope {
  id: number;
  block: number;
  anchor: string;
  bitfield: string;
  validator_index: number;
  signature: string;
}

export interface DisputeVerdict {
  id: number;
  block: number;
  target: string;
  age: number;
  votes: string;
}

export interface DisputeCulprit {
  id: number;
  block: number;
  target: string;
  key: string;
  signature: string;
}

export interface DisputeFault {
  id: number;
  block: number;
  target: string;
  vote: string;
  key: string;
  signature: string;
}

export interface Disputes {
  verdicts: DisputeVerdict[];
  culprits: DisputeCulprit[];
  faults: DisputeFault[];
}

export interface Extrinsic {
  tickets: TicketEnvelope[];
  preimages: PreimageEnvelope[];
  guarantees: GuaranteeEnvelope[];
  assurances: AssuranceEnvelope[];
  disputes: Disputes;
}

export interface Block {
  header: Header;
  extrinsic: Extrinsic;
}

export interface BlockDetails {
  slot: number;
  raw: string;
  header: Header & {
    epochMark: EpochMark;
    ticketsMark: TicketsMark;
  };
  extrinsic: Extrinsic;
}
