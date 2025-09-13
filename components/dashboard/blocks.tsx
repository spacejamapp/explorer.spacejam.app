'use client';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatHash, slotTime, truncateString } from '@/lib/utils';
import { Header } from '@/types';

// Helper function to format numbers with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface HeaderConnection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: Array<{
    node: Header;
    cursor: string;
  }>;
  nodes: Header[];
}

interface BlocksProps {
  headerConnection: HeaderConnection;
  totalBlocks: number;
}

export default function Blocks({ headerConnection, totalBlocks }: BlocksProps) {
  const router = useRouter();
  const { nodes: headers, pageInfo } = headerConnection;

  // Calculate the first and last block numbers for the range
  const firstBlockInView = headers.length > 0 ? headers[0].slot : 0;
  const lastBlockInView =
    headers.length > 0 ? headers[headers.length - 1].slot : 0;

  // Navigation handlers for cursor-based pagination
  const goToNextPage = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      router.push(`/blocks?first=20&after=${pageInfo.endCursor}`);
    }
  };

  const goToPrevPage = () => {
    if (pageInfo.hasPreviousPage) {
      // For simplicity, go back to first page
      router.push(`/blocks?first=20`);
    }
  };

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="p-4 border border-b-0 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">
              Total of {formatNumber(totalBlocks)} blocks
            </h2>
            <p className="text-sm text-gray-600">
              (Showing blocks between #{firstBlockInView} to #{lastBlockInView})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={!pageInfo.hasPreviousPage}
              className="p-0 w-8 h-8"
            >
              <ArrowLeftIcon />
            </Button>
            <span className="text-sm">
              {pageInfo.startCursor ? 'Page ...' : 'Page 1'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={!pageInfo.hasNextPage}
              className="p-0 w-8 h-8"
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-0 p-4 border-x">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Parent Hash</TableHead>
              <TableHead>Extrinsic Hash</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Txs</TableHead>
              <TableHead>Validator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headers.map((header) => (
              <TableRow key={header.slot}>
                <TableCell className="font-medium">
                  <Link
                    href={`/block/${header.slot}`}
                    className="text-pink-300 hover:underline"
                  >
                    {header.slot}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${header.parent}`}
                    className="text-pink-300 hover:underline"
                  >
                    {formatHash(header.parent)}
                  </Link>
                </TableCell>
                <TableCell>{formatHash(header.extrinsicHash)}</TableCell>
                <TableCell>{slotTime(header.slot)}</TableCell>
                <TableCell>{header.extrinsicCount}</TableCell>
                <TableCell>
                  <Link
                    href={`/validator/${header.author.ed25519}`}
                    className="text-pink-300 hover:underline font-mono text-sm"
                    title={header.author.ed25519}
                  >
                    {truncateString(header.author.ed25519)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {headers.length} blocks
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={!pageInfo.hasPreviousPage}
            className="px-3"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!pageInfo.hasNextPage}
            className="px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
