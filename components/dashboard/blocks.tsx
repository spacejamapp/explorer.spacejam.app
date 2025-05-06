"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getMockBlocks } from "@/lib/mock/block";
import { formatHash } from "@/lib/utils";

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

export default function BlocksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get("rows") || "25")
  );

  // Get all blocks from the mock data
  const allBlocks = getMockBlocks(100);

  // Calculate total pages
  const totalPages = Math.ceil(allBlocks.length / pageSize);

  // Get current page of blocks
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBlocks = allBlocks.slice(startIndex, endIndex);

  // Calculate age for display
  const blocksWithAge = currentBlocks.map((block, index) => {
    // Mock timestamps - blocks get progressively older
    const baseAge = 30 + startIndex * 15;
    const ageInSeconds = baseAge + index * 15;

    return {
      block,
      height: block.header.slot,
      extrinsicHash: formatHash(block.header.extrinsic_hash),
      parentHash: formatHash(block.header.parent),
      age: ageInSeconds,
      transactions: block.extrinsic.count,
      validator: block.header.author_index.toString(),
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
      `/blocks?page=${Math.max(1, currentPage - 1)}&rows=${pageSize}`
    );
  const goToNextPage = () =>
    router.push(
      `/blocks?page=${Math.min(totalPages, currentPage + 1)}&rows=${pageSize}`
    );
  const goToLastPage = () =>
    router.push(`/blocks?page=${totalPages}&rows=${pageSize}`);

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="p-4">
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
                    href={`/block/${data.block.header.parent}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.parentHash}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${data.block.header.extrinsic_hash}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.extrinsicHash}
                  </Link>
                </TableCell>
                <TableCell>{timeAgo(data.age)}</TableCell>
                <TableCell>{data.transactions}</TableCell>
                <TableCell>{data.validator}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show rows:</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="25" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="px-3"
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="px-3"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
