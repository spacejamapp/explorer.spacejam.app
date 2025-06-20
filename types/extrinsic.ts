/**
 * Extrinsic related types
 */

export interface Extrinsic {
  tickets: TicketEnvelope[];
  preimages: Preimage[];
  guarantees: ReportGuarantee[];
  assurances: Assurance[];
  disputes: Disputes;
}

export interface Disputes {
  verdicts: Verdict[];
  culprits: Culprit[];
  faults: Fault[];
}

export interface Verdict {
  id: number;
  block: number;
  target: string;
  age: number;
  votes: string[];
}

export interface Culprit {
  id: number;
  block: number;
  target: string;
  key: string;
  signature: string;
}

export interface Fault {
  id: number;
  block: number;
  target: string;
  vote: boolean;
  key: string;
  signature: string;
}

export interface TicketEnvelope {
  id: number;
  block: number;
  attempt: number;
  signature: string;
}

export interface Preimage {
  id: number;
  block: number;
  requester: number;
  hash: string;
  blob: string;
}

export interface ReportGuarantee {
  id: number;
  block: number;
  report: string;
  slot: number;
  signatures: string[];
}

export interface ValidatorSignature {
  validator_index: number;
  signature: string;
}

export interface Assurance {
  id: number;
  block: number;
  anchor: string;
  bitfield: string;
  validator_index: number;
  signature: string;
}
