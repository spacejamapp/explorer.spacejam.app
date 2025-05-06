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

// Mock data for latest blocks
const mockBlocks = [
  {
    slot: 12345678,
    hash: "0x1a2b3c4d5e6f...",
    timestamp: new Date(Date.now() - 30000), // 30 seconds ago
    author: "Validator A",
  },
  {
    slot: 12345677,
    hash: "0xf6e5d4c3b2a1...",
    timestamp: new Date(Date.now() - 45000), // 45 seconds ago
    author: "Validator B",
  },
  {
    slot: 12345676,
    hash: "0x7a8b9c0d1e2f...",
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    author: "Validator C",
  },
  {
    slot: 12345675,
    hash: "0xe1d2c3b4a5f6...",
    timestamp: new Date(Date.now() - 75000), // 1 minute 15 seconds ago
    author: "Validator D",
  },
  {
    slot: 12345674,
    hash: "0x9f8e7d6c5b4a...",
    timestamp: new Date(Date.now() - 90000), // 1 minute 30 seconds ago
    author: "Validator E",
  },
];

// Helper function to format time ago
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function LatestBlocks() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Latest Blocks</CardTitle>
        <CardDescription>
          The most recent blocks on the JAM network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Hash</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Author</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBlocks.map((block) => (
              <TableRow key={block.slot}>
                <TableCell className="font-medium">
                  <Link
                    href={`/block/${block.slot}`}
                    className="text-blue-600 hover:underline"
                  >
                    {block.slot}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${block.hash}`}
                    className="text-blue-600 hover:underline"
                  >
                    {block.hash}
                  </Link>
                </TableCell>
                <TableCell>{timeAgo(block.timestamp)}</TableCell>
                <TableCell>{block.author}</TableCell>
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
