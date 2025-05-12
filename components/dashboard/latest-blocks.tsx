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
import { Header, GET_BLOCKS_VARIABLES } from '@/lib/types/block';
import { Button } from '../ui/button';
import { GET_BLOCKS } from '@/lib/graphql/queries/block';
import { query } from '@/lib/apollo';
import { formatHash } from '@/lib/utils';

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

export default async function LatestBlocks() {
  const {
    data: { blocks },
  } = await query<{ blocks: Header[] }, GET_BLOCKS_VARIABLES>({
    query: GET_BLOCKS,
    variables: {
      from: 1,
      to: 6,
    },
  });

  const blocksWithAge = blocks.map((block, index) => {
    // Mock timestamps - the first block is 30 seconds old, each subsequent block is 15 seconds older
    const ageInSeconds = 30 + index * 15;

    return {
      hash: formatHash(block.extrinsic_hash),
      age: ageInSeconds, // TODO: calculate age
      ...block,
    };
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
            {blocksWithAge.map((data) => (
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
                    href={`/validator/${data.author_index}`}
                    className='hover:underline text-pink-300'
                  >
                    {data.author_index}
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
