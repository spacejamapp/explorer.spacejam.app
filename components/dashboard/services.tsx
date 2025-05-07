"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceItem } from "@/lib/types/service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMockServices } from "@/lib/mock/service";
import { formatHash } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// Helper function to format numbers with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Services() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get("rows") || "10")
  );

  // Get all services from the mock data
  const allServices = getMockServices(40);
  const totalServices = 42; // Mock total services count

  // Calculate total pages
  const totalPages = Math.ceil(allServices.length / pageSize);

  // Get current page of services
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentServices = allServices.slice(startIndex, endIndex);

  // Format bytes to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);

    // Navigate to first page with new page size
    router.push(`/services?page=1&rows=${newSize}`);
  };

  // Navigation handlers
  const goToFirstPage = () => router.push(`/services?page=1&rows=${pageSize}`);
  const goToPrevPage = () =>
    router.push(
      `/services?page=${Math.max(1, currentPage - 1)}&rows=${pageSize}`
    );
  const goToNextPage = () =>
    router.push(
      `/services?page=${Math.min(totalPages, currentPage + 1)}&rows=${pageSize}`
    );
  const goToLastPage = () =>
    router.push(`/services?page=${totalPages}&rows=${pageSize}`);

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="p-4 border border-b-0 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">
              Total of {formatNumber(totalServices)} services
            </h2>
            <p className="text-sm text-gray-600">
              (Showing services {startIndex + 1} to{" "}
              {Math.min(endIndex, allServices.length)} of {allServices.length})
            </p>
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
              <TableHead>Service</TableHead>
              <TableHead>Code Hash</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Gas Limit</TableHead>
              <TableHead className="text-right">Storage</TableHead>
              <TableHead className="text-right">Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentServices.map((serviceItem, i) => (
              <TableRow key={i}>
                <TableCell className="">
                  <Link
                    href={`/service/${serviceItem.service}`}
                    className="text-pink-300 hover:underline"
                  >
                    {serviceItem.service}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatHash(serviceItem.data.service.code)}
                </TableCell>
                <TableCell className="text-right">
                  {serviceItem.data.service.balance.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {serviceItem.data.service.gas.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatBytes(serviceItem.data.service.total)}
                </TableCell>
                <TableCell className="text-right">
                  {serviceItem.data.service.items}
                </TableCell>
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
  );
}
