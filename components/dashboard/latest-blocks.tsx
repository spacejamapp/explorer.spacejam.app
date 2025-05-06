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
import { mockLatestBlocks } from "@/lib/mock/block";

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

export default function LatestBlocks() {
  // Calculate age for display purposes
  const blocksWithAge = mockLatestBlocks.map((block, index) => {
    // Mock timestamps - the first block is 30 seconds old, each subsequent block is 15 seconds older
    const ageInSeconds = 30 + index * 15;

    return {
      block,
      height: 12345678 - index, // Calculated height
      hash: block.header.extrinsic_hash.substring(0, 16) + "...",
      age: ageInSeconds,
      transactions: block.extrinsic.count,
      validator: `Validator ${String.fromCharCode(65 + index)}`, // A, B, C, etc.
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Latest Blocks</CardTitle>
        <CardDescription>
          The most recent blocks on the SpaceJam network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Height</TableHead>
              <TableHead>Hash</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Txs</TableHead>
              <TableHead>Validator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocksWithAge.map((data) => (
              <TableRow key={data.height}>
                <TableCell className="font-medium">
                  <Link
                    href={`/block/${data.height}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.height}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${data.hash}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.hash}
                  </Link>
                </TableCell>
                <TableCell>{timeAgo(data.age)}</TableCell>
                <TableCell>
                  <Link
                    href={`/txs?block=${data.height}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.transactions}
                  </Link>
                </TableCell>
                <TableCell>{data.validator}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right">
          <Link href="/blocks" className="text-blue-600 hover:underline">
            View all blocks →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
