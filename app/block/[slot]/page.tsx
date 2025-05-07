import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMockBlocks } from "@/lib/mock/block";
import { formatHash } from "@/lib/utils";
import BlockTabs from "@/components/block/block-tabs";
import ExtrinsicsList from "@/components/block/extrinsics-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

// Helper function to format time ago
function timeAgo(secondsAgo: number): string {
  if (secondsAgo < 60) return `${secondsAgo} sec ago`;
  const minutes = Math.floor(secondsAgo / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

// Generate a random age for the block (for demo purposes)
function getRandomBlockAge(): number {
  return Math.floor(Math.random() * 600) + 30; // Between 30 seconds and 10 minutes
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{ slot: string }>;
}) {
  // Server-side data fetching
  const slotId = (await params).slot;

  // Get all blocks and find the one with matching slot
  const allBlocks = getMockBlocks(100);
  const block = allBlocks.find((b) => b.header.slot.toString() === slotId);

  // Calculate the block age
  const blockAge = getRandomBlockAge();

  // If block isn't found, show 404
  if (!block) {
    notFound();
  }

  // Extract data for display
  const blockData = {
    slot: block.header.slot,
    extrinsicHash: formatHash(block.header.extrinsic_hash || ""),
    parentHash: formatHash(block.header.parent || ""),
    parentStateRoot: formatHash(block.header.parent_state_root || ""),
    validator: block.header.author_index,
    transactionCount:
      block.extrinsic.tickets.length +
      block.extrinsic.preimage.length +
      block.extrinsic.guarantee.length +
      block.extrinsic.assurance.length,
    entropySource: formatHash(block.header.entropy_source || ""),
  };

  return (
    <main className="container mx-auto py-8">
      <section className="mb-4 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="text-xl font-bold">Block {blockData.slot}</div>
          <Link href={`/block/${Number(slotId) - 1}`}>
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/block/${Number(slotId) + 1}`}>
            <Button variant="outline" size="sm">
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          {timeAgo(blockAge)} (
          {new Date(Date.now() - blockAge * 1000).toLocaleString()})
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
                    Extrinsic Hash
                  </div>
                  <div className="font-mono break-all text-sm">
                    {block.header.extrinsic_hash}
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
                    {block.header.parent_state_root}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Validator
                  </div>
                  <div className="text-sm">{block.header.author_index}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Entropy Source
                  </div>
                  <div className="font-mono break-all text-sm">
                    {block.header.entropy_source}
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
