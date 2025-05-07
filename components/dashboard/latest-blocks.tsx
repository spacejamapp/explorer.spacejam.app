import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMockBlocks } from "@/lib/mock/block";
import { Block } from "@/lib/types/block";
import { formatHash } from "@/lib/utils";
import { Button } from "../ui/button";

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

interface BlockWithDisplayData {
  block: Block;
  slot: number;
  hash: string;
  age: number;
  transactions: number;
  validator: string;
}

export default function LatestBlocks() {
  // Get the latest 5 blocks from the mock data
  const mockBlocks = getMockBlocks(5);

  // Calculate age for display purposes
  const blocksWithAge: BlockWithDisplayData[] = mockBlocks.map(
    (block, index) => {
      // Mock timestamps - the first block is 30 seconds old, each subsequent block is 15 seconds older
      const ageInSeconds = 30 + index * 15;

      return {
        block,
        slot: block.header.slot, // Use the slot as height
        hash: formatHash(block.header.extrinsic_hash),
        age: ageInSeconds,
        transactions:
          block.extrinsic.assurance.length +
          block.extrinsic.guarantee.length +
          block.extrinsic.preimage.length +
          block.extrinsic.tickets.length,
        validator: block.header.author_index.toString(),
      };
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Blocks</CardTitle>
        <CardDescription>
          The most recent blocks on the SpaceJam network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Validator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocksWithAge.map((data: BlockWithDisplayData) => (
              <TableRow key={data.slot}>
                <TableCell className="font-medium">
                  <Link
                    href={`/block/${data.slot}`}
                    className="hover:underline text-pink-300"
                  >
                    {data.slot}
                  </Link>
                </TableCell>
                <TableCell>{timeAgo(data.age)}</TableCell>
                <TableCell>
                  <Link
                    href={`/validator/${data.validator}`}
                    className="hover:underline text-pink-300"
                  >
                    {data.validator}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right">
          <Button variant="link">
            <Link href="/blocks">View all blocks →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
