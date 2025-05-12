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
import { Block } from '@/lib/types/block';
import { Button } from '../ui/button';
import { GET_BLOCKS } from '@/lib/graphql/queries/block';
import { query } from '@/lib/apollo';

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

export default async function LatestBlocks() {
  const { data: blocksData } = await query({
    query: GET_BLOCKS,
    variables: {
      from: 1,
      to: 6,
    },
  });

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
            {blocksData.blocks.map((data: BlockWithDisplayData) => (
              <TableRow key={data.slot}>
                <TableCell className='font-medium'>
                  <Link
                    href={`/block/${data.slot}`}
                    className='hover:underline text-pink-300'
                  >
                    {data.slot}
                  </Link>
                </TableCell>
                <TableCell>{data.age ? timeAgo(data.age) : ''}</TableCell>
                <TableCell>
                  <Link
                    href={`/validator/${data.validator}`}
                    className='hover:underline text-pink-300'
                  >
                    {data.validator}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='mt-4 text-right'>
          <Button variant='link'>
            <Link href='/blocks'>View all blocks →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
