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
import { Header } from '@/types';

import { Button } from '../ui/button';

export default async function LatestBlocks() {
  const { headers } = (await fetchBlocks(1, 6)) as { headers: Header[] };

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
            {headers.map((data) => (
              <TableRow key={data.slot}>
                <TableCell className="font-medium">
                  <Link
                    href={`/block/${data.slot}`}
                    className="hover:underline text-pink-300"
                  >
                    {data.slot}
                  </Link>
                </TableCell>
                <TableCell>{slotTime(data.slot)}</TableCell>
                <TableCell>
                  <Link
                    href={`/validator/${data.authorIndex}`}
                    className="hover:underline text-pink-300"
                  >
                    {data.authorIndex}
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
