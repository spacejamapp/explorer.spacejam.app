import { Block, Header, EpochMark, EpochValidator, TicketsMark, TicketBody } from "@/lib/types/block";
import { Extrinsic, TicketEnvelope, Preimage, ReportGuarantee, Assurance } from "@/lib/types/extrinsic";

// Helper function to create a mock block
export function createMockBlock(slot: number, parent: string): Block {
  const hash = generateRandomHash();
  
  const header: Header = {
    parent,
    parent_state_root: generateRandomHash(),
    extrinsic_hash: generateRandomHash(),
    slot,
    epoch_mark: createMockEpochMark(),
    tickets_mark: createMockTicketsMark(),
    offeners_mark: [generateRandomHash(), generateRandomHash()],
    author_index: Math.floor(Math.random() * 100),
    entropy_source: generateRandomHash(),
    seal: generateRandomHash()
  };

  const extrinsic: Extrinsic = {
    hash: generateRandomHash(),
    size: Math.floor(Math.random() * 1000) + 500,
    count: Math.floor(Math.random() * 150) + 50
  };

  return {
    header,
    extrinsic
  };
}

// Create an array of mock blocks
export function getMockBlocks(count: number = 25): Block[] {
  const blocks: Block[] = [];
  const startSlot = 12345678;
  
    let parent = "0x0000000000000000000000000000000000000000000000000000000000000000";
    for (let i = 0; i < count; i++) {
      const block = createMockBlock(startSlot - i, parent);
      blocks.push(block);
      parent = generateRandomHash();
    }
  
  return blocks;
}

// Helper functions to generate mock data
function generateRandomHash(): string {
  return "0x" + Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function createMockEpochMark(): EpochMark {
  return {
    entropy: generateRandomHash(),
    tickets_entropy: generateRandomHash(),
    validators: Array.from({ length: 5 }, () => createMockValidator())
  };
}

function createMockValidator(): EpochValidator {
  return {
    bandersnatch: generateRandomHash(),
    ed25519: generateRandomHash()
  };
}

function createMockTicketsMark(): TicketsMark {
  return Array.from({ length: 3 }, (_, i) => ({
    id: generateRandomHash(),
    attempt: i + 1
  }));
}


