/**
 * Extrinsic related types
 */

import { WorkReport } from "./work";

export interface Extrinsic { 
    tickets: TicketEnvelope[];
    preimages: Preimage[];
    guarantees: ReportGuarantee[];
    assurances: Assurance[];
}

export interface TicketEnvelope {
    attempt: number;
    signature: string;
}

export interface Preimage {
    requester: number;
    blob: string;
}

export interface ReportGuarantee {
    report: WorkReport;
    slot: number;
    signatures: ValidatorSignature[];
}

export interface ValidatorSignature {
    validator_index: number;
    signature: string;
}

export interface Assurance {
    anchor: string;
    bitfield: number[];
    validator_index: number;
    signature: string;
}

