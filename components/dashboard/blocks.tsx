import Link from 'next/link';

import Pagination from '@/components/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatHash, slotTime } from '@/lib/utils';
import { Header } from '@/types';

// Helper function to format numbers with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface BlocksProps {
  headers: Header[];
  currentPage: number;
  pageSize: number;
  startIndex: number;
}

export default function Blocks({
  headers,
  currentPage,
  pageSize,
  startIndex,
}: BlocksProps) {
  const totalBlocks = 22424442; // TODO Mock total blocks count
  const totalPages = 100; // TODO Mock total pages

  // Calculate the first and last block numbers for the range
  const firstBlockInView = headers.length > 0 ? headers[0].slot : 0;
  const lastBlockInView =
    headers.length > 0 ? headers[headers.length - 1].slot : 0;

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="p-4 border border-b-0 rounded-t-lg ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">
              Total of {formatNumber(totalBlocks)} blocks
            </h2>
            <p className="text-sm text-gray-600">
              (Showing blocks between #{firstBlockInView} to #{lastBlockInView})
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              showPageSize={false}
            />
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
                <TableCell>{header.authorIndex}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          showPageSize={true}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          showPageSize={false}
        />
      </div>
    </div>
  );
}
