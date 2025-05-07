"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { ActivityRecord } from "@/lib/types/statistic";

// Format large numbers with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Format bytes to readable format
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Calculate percentage change
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Display change with arrow and color
function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) {
    return <span className="text-gray-500">0%</span>;
  }

  const isPositive = change > 0;
  const className = isPositive ? "text-green-500" : "text-red-500";
  const arrow = isPositive ? "↑" : "↓";

  return (
    <span className={className}>
      {arrow} {Math.abs(change).toFixed(2)}%
    </span>
  );
}

// Activity Records comparison component
export default function ActivityDashboard({
  current,
  latest,
}: {
  current: ActivityRecord[];
  latest: ActivityRecord[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Calculate total pages
  const totalValidators = current.length;
  const totalPages = Math.ceil(totalValidators / pageSize);

  // Get current page of validators
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalValidators);
  const currentValidators = current.slice(startIndex, endIndex);

  // Navigation handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPrevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validator Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Validator</TableHead>
                <TableHead>Blocks</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Preimages</TableHead>
                <TableHead>Preimage Size</TableHead>
                <TableHead>Guarantees</TableHead>
                <TableHead>Assurances</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentValidators.map((validator, index) => {
                const validatorIndex = startIndex + index;
                const latestValidator = latest[validatorIndex];

                return (
                  <TableRow key={validatorIndex}>
                    <TableCell className="font-medium">
                      Validator #{validatorIndex + 1}
                    </TableCell>
                    <TableCell>{formatNumber(validator.blocks)}</TableCell>
                    <TableCell>{formatNumber(validator.tickets)}</TableCell>
                    <TableCell>{formatNumber(validator.preimages)}</TableCell>
                    <TableCell>
                      {formatBytes(validator.preimages_size)}
                    </TableCell>
                    <TableCell>{formatNumber(validator.guarantees)}</TableCell>
                    <TableCell>{formatNumber(validator.assurances)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="p-4 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="6" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
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
                className="px-3"
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
