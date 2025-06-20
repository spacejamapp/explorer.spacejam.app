import {
  Block,
  EpochMark,
  EpochValidator,
  Header,
  TicketsMark,
} from '@/lib/types/block';
import { Extrinsic } from '@/lib/types/extrinsic';

// Helper function to create a mock block
export function createMockBlock(slot: number, parent: string): Block {
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
    seal: generateRandomHash(),
  };

  const extrinsic: Extrinsic = {
    tickets: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      (_, i) => ({
        attempt: i + 1,
        signature: generateRandomHash(),
      })
    ),
    preimage: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
      requester: Math.floor(Math.random() * 100),
      blob: generateRandomHash(),
    })),
    guarantee: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => ({
        report: {
          spec: {
            hash: generateRandomHash(),
            length: Math.floor(Math.random() * 1000),
            erasure_root: generateRandomHash(),
            exports_root: generateRandomHash(),
            exports_count: Math.floor(Math.random() * 10),
          },
          context: {
            anchor: generateRandomHash(),
            state_root: generateRandomHash(),
            beefy_root: generateRandomHash(),
            loookup_anchor: generateRandomHash(),
            lookup_anchor_slot: Math.floor(Math.random() * 1000),
            prerequisites: [generateRandomHash()],
            authorizer_hash: generateRandomHash(),
            auth_output: generateRandomHash(),
            lookup: [
              {
                hash: generateRandomHash(),
                exports_root: generateRandomHash(),
              },
            ],
            results: [
              {
                service_id: Math.floor(Math.random() * 100),
                code_hash: generateRandomHash(),
                payload_hash: generateRandomHash(),
                acccumulate_gas: Math.floor(Math.random() * 1000),
                result: { ok: generateRandomHash() },
                refine_load: {
                  gas_used: Math.floor(Math.random() * 1000),
                  imports: [Math.floor(Math.random() * 100)],
                  extrinsic_count: Math.floor(Math.random() * 10),
                  extrinsic_size: Math.floor(Math.random() * 1000),
                  exports: Math.floor(Math.random() * 10),
                },
              },
            ],
            auth_gas_used: Math.floor(Math.random() * 1000),
          },
          core_index: Math.floor(Math.random() * 10),
          authorizer_hash: generateRandomHash(),
          auth_output: generateRandomHash(),
        },
        slot: Math.floor(Math.random() * 1000),
        signatures: Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          () => ({
            validator_index: Math.floor(Math.random() * 100),
            signature: generateRandomHash(),
          })
        ),
      })
    ),
    assurance: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => ({
        anchor: generateRandomHash(),
        bitfield: Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 2)
        ),
        validator_index: Math.floor(Math.random() * 100),
        signature: generateRandomHash(),
      })
    ),
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
    entropy: generateRandomHash(),
    tickets_entropy: generateRandomHash(),
    validators: Array.from({ length: 5 }, () => createMockValidator()),
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
  }));
}
