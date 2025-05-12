'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatHash } from '@/lib/utils';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GetBlocksVariables, Header } from '@/lib/types';
import { GET_BLOCKS } from '@/lib/graphql/queries/block';

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

// Helper function to format numbers with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function BlocksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') || '1');
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get('rows') || '10'),
  );

  // Get current page of blocks
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = startIndex + pageSize;

  // Get all blocks from the mock data
  const { data: { blocks } = { blocks: [] }, loading } = useQuery<
    {
      blocks: Header[];
    },
    GetBlocksVariables
  >(GET_BLOCKS, {
    variables: {
      from: startIndex,
      to: endIndex,
    },
  });

  if (loading) return <div>Loading...</div>;

  const totalBlocks = 22424442; // TODO Mock total blocks count
  const totalPages = 100; // TODO Mock total pages

  // Calculate the first and last block numbers for the range
  const firstBlockInView = blocks.length > 0 ? blocks[0].slot : 0;
  const lastBlockInView =
    blocks.length > 0 ? blocks[blocks.length - 1].slot : 0;

  // Calculate age for display
  const blocksWithAge = blocks.map((block, index) => {
    // Mock timestamps - blocks get progressively older
    const baseAge = 30 + startIndex * 15;
    const ageInSeconds = baseAge + index * 15;

    return {
      ...block,
      age: ageInSeconds, // TODO: calculate age
      transactions: 23,
      extrinsic_hash: formatHash(block.extrinsic_hash),
      parent: formatHash(block.parent),
      // transactions: // TODO: calculate transactions
      //   block.extrinsic.assurance.length +
      //   block.extrinsic.guarantee.length +
      //   block.extrinsic.preimage.length +
      //   block.extrinsic.tickets.length,
    };
  });

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);

    // Navigate to first page with new page size
    router.push(`/blocks?page=1&rows=${newSize}`);
  };

  // Navigation handlers
  const goToFirstPage = () => router.push(`/blocks?page=1&rows=${pageSize}`);
  const goToPrevPage = () =>
    router.push(
      `/blocks?page=${Math.max(1, currentPage - 1)}&rows=${pageSize}`,
    );
  const goToNextPage = () =>
    router.push(
      `/blocks?page=${Math.min(totalPages, currentPage + 1)}&rows=${pageSize}`,
    );
  const goToLastPage = () =>
    router.push(`/blocks?page=${totalPages}&rows=${pageSize}`);

  return (
    <div className='rounded-lg shadow overflow-hidden'>
      <div className='p-4 border border-b-0 rounded-t-lg '>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-medium'>
              Total of {formatNumber(totalBlocks)} blocks
            </h2>
            <p className='text-sm text-gray-600'>
              (Showing blocks between #{firstBlockInView} to #{lastBlockInView})
            </p>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className='px-3'
              >
                First
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className='p-0 w-8 h-8'
              >
                <ArrowLeftIcon />
              </Button>
              <span className='text-sm'>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className='p-0 w-8 h-8'
              >
                <ArrowRightIcon />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className='px-3'
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-0 p-4 border-x'>
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
            {blocksWithAge.map((data) => (
              <TableRow key={data.slot}>
                <TableCell className='font-medium'>
                  <Link
                    href={`/block/${data.slot}`}
                    className='text-pink-300 hover:underline'
                  >
                    {data.slot}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${data.parent}`}
                    className='text-pink-300 hover:underline'
                  >
                    {data.parent}
                  </Link>
                </TableCell>
                <TableCell>{data.extrinsic_hash}</TableCell>
                <TableCell>{timeAgo(data.age)}</TableCell>
                <TableCell>{data.transactions}</TableCell>
                <TableCell>{data.author_index}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='p-4 border-t flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Show rows:</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className='w-20'>
              <SelectValue placeholder='10' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='25'>25</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className='px-3'
          >
            First
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className='px-3'
          >
            <ArrowLeftIcon />
          </Button>
          <span className='text-sm'>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className='px-3'
          >
            <ArrowRightIcon />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className='px-3'
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
