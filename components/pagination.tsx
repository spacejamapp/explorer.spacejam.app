'use client';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  showPageSize?: boolean;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  showPageSize = false,
  basePath = '/blocks',
}: PaginationProps) {
  const router = useRouter();

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    router.push(`${basePath}?page=1&rows=${newSize}`);
  };

  // Navigation handlers
  const goToFirstPage = () =>
    router.push(`${basePath}?page=1&rows=${pageSize}`);
  const goToPrevPage = () =>
    router.push(
      `${basePath}?page=${Math.max(1, currentPage - 1)}&rows=${pageSize}`
    );
  const goToNextPage = () =>
    router.push(
      `${basePath}?page=${Math.min(totalPages, currentPage + 1)}&rows=${pageSize}`
    );
  const goToLastPage = () =>
    router.push(`${basePath}?page=${totalPages}&rows=${pageSize}`);

  if (showPageSize) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Show rows:</span>
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
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
        className="p-0 w-8 h-8"
      >
        <ArrowLeftIcon />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="p-0 w-8 h-8"
      >
        <ArrowRightIcon />
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
  );
}
