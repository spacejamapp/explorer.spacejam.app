"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Link from "next/link";

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

// Activity Records comparison component
export default function ActivityDashboard({
  current,
}: {
  current: ActivityRecord[];
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
        <CardDescription>
          Detailed statistics for validators in the epoch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-t-lg">
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

                  return (
                    <TableRow key={validatorIndex}>
                      <TableCell className="font-medium">
                        <Link href={`/validator/${validatorIndex + 1}`}>
                          Validator #{validatorIndex + 1}
                        </Link>
                      </TableCell>
                      <TableCell>{formatNumber(validator.blocks)}</TableCell>
                      <TableCell>{formatNumber(validator.tickets)}</TableCell>
                      <TableCell>{formatNumber(validator.preimages)}</TableCell>
                      <TableCell>
                        {formatBytes(validator.preimages_size)}
                      </TableCell>
                      <TableCell>
                        {formatNumber(validator.guarantees)}
                      </TableCell>
                      <TableCell>
                        {formatNumber(validator.assurances)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 flex items-center justify-between">
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
