"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMockServices } from "@/lib/mock/service";
import { formatHash, formatBytes } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper function to format numbers with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Sorting types
type SortField = "service" | "balance" | "gasLimit" | "storage" | "items";
type SortOrder = "asc" | "desc";

export default function Services() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get("rows") || "10")
  );

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("service");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Get all services from the mock data
  const allServices = getMockServices(40);
  const totalServices = 42; // Mock total services count

  // Sort services
  const sortedServices = useMemo(() => {
    return [...allServices].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "service":
          comparison = a.service - b.service;
          break;
        case "balance":
          comparison = a.data.service.balance - b.data.service.balance;
          break;
        case "gasLimit":
          comparison = a.data.service.gas - b.data.service.gas;
          break;
        case "storage":
          comparison = a.data.service.total - b.data.service.total;
          break;
        case "items":
          comparison = a.data.service.items - b.data.service.items;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [allServices, sortField, sortOrder]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedServices.length / pageSize);

  // Get current page of services
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentServices = sortedServices.slice(startIndex, endIndex);

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);

    // Navigate to first page with new page size
    router.push(`/services?page=1&rows=${newSize}`);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Set sort field
  const handleSortFieldChange = (field: SortField) => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
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
              {Math.min(endIndex, sortedServices.length)} of{" "}
              {sortedServices.length})
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    Sort by <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange("service")}
                  >
                    Service
                  </DropdownMenuItem>
                  <DropdownMenuItem>Code Hash</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange("balance")}
                  >
                    Balance
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange("gasLimit")}
                  >
                    Gas Limit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange("storage")}
                  >
                    Storage
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange("items")}
                  >
                    Items
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                className="flex items-center gap-1"
              >
                {sortOrder === "asc" ? (
                  <>
                    <ArrowUpIcon className="h-4 w-4" /> Asc
                  </>
                ) : (
                  <>
                    <ArrowDownIcon className="h-4 w-4" /> Desc
                  </>
                )}
              </Button>

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
              <TableHead>
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSortFieldChange("service")}
                >
                  Service
                  {sortField === "service" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer">
                  Code Hash
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center gap-1 justify-end cursor-pointer"
                  onClick={() => handleSortFieldChange("balance")}
                >
                  Balance
                  {sortField === "balance" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center gap-1 justify-end cursor-pointer"
                  onClick={() => handleSortFieldChange("gasLimit")}
                >
                  Gas Limit
                  {sortField === "gasLimit" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center gap-1 justify-end cursor-pointer"
                  onClick={() => handleSortFieldChange("storage")}
                >
                  Storage
                  {sortField === "storage" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center gap-1 justify-end cursor-pointer"
                  onClick={() => handleSortFieldChange("items")}
                >
                  Items
                  {sortField === "items" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentServices.map((serviceItem, i) => (
              <TableRow key={i}>
                <TableCell>
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
