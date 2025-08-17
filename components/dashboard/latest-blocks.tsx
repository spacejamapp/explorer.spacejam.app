import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchBlocks } from '@/lib/graphql';
import { slotTime } from '@/lib/utils';

import { Button } from '../ui/button';

// Utility function to truncate hash for display
function truncateHash(hash: string): string {
  if (!hash) return '';
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export default async function LatestBlocks() {
  const { headers } = await fetchBlocks(6);
  const blocks = headers.nodes;

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
              <TableHead className="w-[100px]">Slot</TableHead>
              <TableHead className="w-[120px]">Age</TableHead>
              <TableHead className="w-[200px]">Block Hash</TableHead>
              <TableHead className="w-[120px]">Validator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((data) => (
              <TableRow key={data.slot} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  <Link
                    href={`/block/${data.slot}`}
                    className="hover:underline text-pink-300 transition-colors"
                  >
                    {data.slot}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {slotTime(data.slot)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${data.slot}`}
                    className="font-mono text-sm hover:underline text-pink-300 transition-colors"
                    title={data.hash}
                  >
                    {truncateHash(data.hash)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/validator/${data.authorIndex}`}
                    className="hover:underline text-pink-300 transition-colors"
                  >
                    {data.authorIndex}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 text-right">
          <Button variant="link" className="text-pink-300 hover:text-pink-200">
            <Link href="/blocks">View all blocks →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
