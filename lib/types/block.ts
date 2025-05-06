/** 
 * block related types
 */


export type TicketsMark = TicketBody[];

export interface Header {
    parent: string;
    parent_state_root: string;
    extrinsic_hash: string;
    slot: number;
    epoch_mark?: EpochMark;
    tickets_mark?: TicketsMark;
    offeners_mark: string[];
    author_index: number;
    entropy_source: string;
    seal: string;
}

export interface EpochMark {
    entropy: string;
    tickets_entropy: string;
    validators: EpochValidator[];
}

export interface EpochValidator {
    bandersnatch: string;
    ed25519: string;
}

export interface TicketBody {
    id: string;
    attempt: number;
}