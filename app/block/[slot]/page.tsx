import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import BlockTabs from '@/components/block/block-tabs';
import { Button } from '@/components/ui/button';
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

  return (
    <main className="container mx-auto py-8">
      <section className="mb-4 flex flex-row items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">Block {block.header.slot}</div>
          <div className="text-lg text-gray-600">Epoch {calculateEpoch(block.header.slot)}</div>
        </div>

        <div className="flex flex-col items-end justify-start gap-2">
          <div className="flex flex-row items-center gap-2">
            <Link href={`/block/${Number(slotId) - 1}`}>
              <Button
                variant="outline"
                size="default"
                disabled={
                  Number(slotId) - 1 < spacejam.finalized - spacejam.blocks
                }
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/block/${Number(slotId) + 1}`}>
              <Button
                variant="outline"
                size="default"
                disabled={Number(slotId) + 1 > spacejam.finalized}
              >
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            {slotTime(block.header.slot)} ({slotDate(block.header.slot)})
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6">
        {/* Block Header Information */}
        <Card>
          <CardHeader className="pb-2"></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Block Hash
                  </div>
                  <div className="font-mono break-all text-sm">
                    {block.header.hash}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Extrinsic Hash
                  </div>
                  <div className="font-mono break-all text-sm">
                    {block.header.extrinsicHash}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Parent Hash
                  </div>
                  <div className="font-mono break-all text-sm">
                    {block.header.parent}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Parent State Root
                  </div>
                  <div className="font-mono break-all text-sm">
                    {block.header.parentStateRoot}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Validator
                  </div>
                  <div className="font-mono break-all text-sm">
                    <Link
                      href={`/validator/${block.header.author.ed25519}`}
                      className="text-pink-300 hover:underline"
                    >
                      {block.header.author.ed25519}
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Entropy Source
                  </div>
                  <div className="font-mono break-all text-sm">
                    {block.header.entropySource}
                  </div>
                </div>
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
