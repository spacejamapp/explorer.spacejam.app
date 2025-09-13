import { notFound } from 'next/navigation';

import BlockField from '@/components/block/block-field';
import BlockNavigation from '@/components/block/block-navigation';
import BlockTabs from '@/components/block/block-tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { fetchBlock, fetchSpacejam } from '@/lib/graphql';
import { calculateEpoch, slotDate, slotTime, withNotFound } from '@/lib/utils';

export default async function BlockPage({
  params,
}: {
  params: Promise<{ slot: string }>;
}) {
  const slotParam = (await params).slot;
  const slotId = Number(slotParam);
  
  const { block, spacejam } = await getBlockPageData(slotId);

  // Calculate values once for reuse
  const minSlot = spacejam.finalized - spacejam.blocks;
  const maxSlot = spacejam.finalized;
  const timestamp = `${slotTime(block.header.slot)} (${slotDate(block.header.slot)})`;

  return (
    <main className="container mx-auto py-8">
      <section className="mb-4 flex flex-row items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">Block {block.header.slot}</div>
          <div className="text-lg text-gray-600">Epoch {calculateEpoch(block.header.slot)}</div>
        </div>

        <BlockNavigation
          currentSlot={slotId}
          minSlot={minSlot}
          maxSlot={maxSlot}
          timestamp={timestamp}
        />
      </section>
      <div className="grid grid-cols-1 gap-6">
        {/* Block Header Information */}
        <Card>
          <CardHeader className="pb-2"></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <BlockField label="Block Hash" value={block.header.hash} />
                <BlockField label="Extrinsic Hash" value={block.header.extrinsicHash} />
                <BlockField label="Parent Hash" value={block.header.parent} />
                <BlockField label="Parent State Root" value={block.header.parentStateRoot} />
              </div>
              <div className="space-y-2">
                <BlockField 
                  label="Validator" 
                  value={block.header.author.ed25519}
                  isLink={true}
                  href={`/validator/${block.header.author.ed25519}`}
                />
                <BlockField label="Entropy Source" value={block.header.entropySource} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs section - moved to client component */}
        <BlockTabs block={block} />
      </div>
    </main>
  );
}

// Server data fetching function (similar to getServerSideProps concept)
async function getBlockPageData(slotId: number) {
  const [{ block }, { spacejam }] = await Promise.all([
    withNotFound(fetchBlock(slotId)),
    withNotFound(fetchSpacejam()),
  ]);

  if (!block) {
    notFound();
  }

  return {
    block,
    spacejam,
  };
}
