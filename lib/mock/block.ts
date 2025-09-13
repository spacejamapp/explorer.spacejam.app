import {
  Block,
  EpochMark,
  EpochValidator,
  Header,
  TicketsMark,
} from '@/types/block';
import { Extrinsic } from '@/types/extrinsic';

// Helper function to create a mock block
export function createMockBlock(slot: number, parent: string): Block {
  const header: Header = {
    parent,
    hash: generateRandomHash(),
    parentStateRoot: generateRandomHash(),
    extrinsicHash: generateRandomHash(),
    slot,
    epochMark: createMockEpochMark(),
    ticketsMark: createMockTicketsMark(),
    offendersMark: [generateRandomHash(), generateRandomHash()],
    extrinsicCount: Math.floor(Math.random() * 50) + 1,
    authorIndex: Math.floor(Math.random() * 100),
    author: {
      ed25519: generateRandomHash(),
    },
    entropySource: generateRandomHash(),
    seal: generateRandomHash(),
  };

  const extrinsic: Extrinsic = {
    tickets: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      (_, i) => ({
        id: i,
        block: slot,
        attempt: i + 1,
        signature: generateRandomHash(),
      })
    ),
    preimages: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      (_, i) => ({
        id: i,
        block: slot,
        requester: Math.floor(Math.random() * 100),
        hash: generateRandomHash(),
        blob: generateRandomHash(),
      })
    ),
    guarantees: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      (_, i) => ({
        id: i,
        block: slot,
        report: generateRandomHash(),
        slot: Math.floor(Math.random() * 1000),
        signatures: Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          () => generateRandomHash()
        ),
      })
    ),
    assurances: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      (_, i) => ({
        id: i,
        block: slot,
        anchor: generateRandomHash(),
        bitfield: Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 2)
        ).join(''),
        validator_index: Math.floor(Math.random() * 100),
        signature: generateRandomHash(),
      })
    ),
    disputes: {
      verdicts: [],
      culprits: [],
      faults: [],
    },
  };

  return {
    header,
    extrinsic,
  };
}

// Create an array of mock blocks
export function getMockBlocks(count: number = 25): Block[] {
  const blocks: Block[] = [];
  const startSlot = 12345678;

  let parent =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  for (let i = 0; i < count; i++) {
    const block = createMockBlock(startSlot - i, parent);
    blocks.push(block);
    parent = generateRandomHash();
  }

  return blocks;
}

// Helper functions to generate mock data
function generateRandomHash(): string {
  return (
    '0x' +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  );
}

function createMockEpochMark(): EpochMark {
  return {
    id: Math.floor(Math.random() * 1000),
    block: Math.floor(Math.random() * 1000),
    entropy: generateRandomHash(),
    tickets_entropy: generateRandomHash(),
    validators: Array.from({ length: 5 }, () => createMockValidator()),
    validators_bandersnatches: Array.from({ length: 5 }, () => generateRandomHash()),
  };
}

function createMockValidator(): EpochValidator {
  return {
    bandersnatch: generateRandomHash(),
    ed25519: generateRandomHash(),
  };
}



function createMockTicketsMark(): TicketsMark {
  return Array.from({ length: 3 }, (_, i) => ({
    id: generateRandomHash(),
    attempt: i + 1,
    block: Math.floor(Math.random() * 1000),
    ticket_id: generateRandomHash(),
  }));
}
