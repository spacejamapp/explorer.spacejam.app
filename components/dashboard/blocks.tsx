"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const pageSize = 10;

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

  // Generate page links
  const pageLinks = [];
  const maxPageLinks = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
  const endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

  if (endPage - startPage + 1 < maxPageLinks) {
    startPage = Math.max(1, endPage - maxPageLinks + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageLinks.push(i);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blocks</h1>

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

        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/blocks?page=${currentPage - 1}`}
                  />
                </PaginationItem>
              )}

              {pageLinks.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`/blocks?page=${page}`}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`/blocks?page=${currentPage + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
