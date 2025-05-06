"use client";

import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CoreActivityRecord } from "@/lib/types/statistic";

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

export default function CoreDashboard({
  cores,
}: {
  cores: CoreActivityRecord[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate total pages
  const totalCores = cores.length;
  const totalPages = Math.ceil(totalCores / pageSize);

  // Get current page of cores
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCores = cores.slice(startIndex, endIndex);

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Performance Metrics</CardTitle>
          <CardDescription>
            Detailed statistics for all execution cores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg shadow overflow-hidden">
            <div className="p-4 border border-b-0 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">
                    Total of {totalCores} execution cores
                  </h2>
                </div>

                <div className="flex items-center gap-4">
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
                </div>
              </div>
            </div>

            <div className="pt-0 p-4 border-x">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Core ID</TableHead>
                    <TableHead>Gas Used</TableHead>
                    <TableHead>Extrinsic Count</TableHead>
                    <TableHead>Import/Export</TableHead>
                    <TableHead>Bundle Size</TableHead>
                    <TableHead>DA Load</TableHead>
                    <TableHead>Popularity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCores.map((core, index) => {
                    const coreIndex = startIndex + index;
                    return (
                      <TableRow key={coreIndex}>
                        <TableCell className="font-medium">
                          Core #{coreIndex + 1}
                        </TableCell>
                        <TableCell>{formatNumber(core.gas_used)}</TableCell>
                        <TableCell>
                          {formatNumber(core.extrinsic_count)}
                        </TableCell>
                        <TableCell>
                          {formatNumber(core.imports)} /{" "}
                          {formatNumber(core.exports)}
                        </TableCell>
                        <TableCell>{formatBytes(core.bundle_size)}</TableCell>
                        <TableCell>{core.da_load}%</TableCell>
                        <TableCell>{core.popularity}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show rows:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
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
    </div>
  );
}
