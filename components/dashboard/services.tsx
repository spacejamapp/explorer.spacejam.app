'use client';

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
} from 'lucide-react';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useServices } from '@/hooks/graphql';
import { formatBytes, formatHash } from '@/lib/utils';

// Sorting types
type SortField = 'id' | 'balance' | 'total' | 'items';
type SortOrder = 'asc' | 'desc';

export default function Services() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const after = searchParams.get('after');
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get('rows') || '10')
  );

  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch services data
  const { data, error, isLoading } = useServices(pageSize, after || undefined);

  // Sort services
  const sortedServices = useMemo(() => {
    if (!data?.services?.nodes) return [];
    return [...data.services.nodes].sort((a, b) => {
      let comparison = 0;

      switch (sortField as SortField) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'balance':
          comparison = a.balance - b.balance;
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'items':
          comparison = a.items - b.items;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, sortField, sortOrder]);

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);

    // Navigate to first page with new page size
    router.push(`/services?rows=${newSize}`);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Set sort field
  const handleSortFieldChange = (field: SortField) => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const goToPrevPage = () => {
    router.push(
      `/services?after=${data?.services.pageInfo.startCursor}&rows=${pageSize}`
    );
  };
  const goToNextPage = () => {
    router.push(
      `/services?after=${data?.services.pageInfo.endCursor}&rows=${pageSize}`
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading services</div>;

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="p-4 border border-b-0 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">Services</h2>
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
                  <DropdownMenuItem onClick={() => handleSortFieldChange('id')}>
                    Service
                  </DropdownMenuItem>
                  <DropdownMenuItem>Code Hash</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange('balance')}
                  >
                    Balance
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange('total')}
                  >
                    Storage
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortFieldChange('items')}
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
                {sortOrder === 'asc' ? (
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
                onClick={goToPrevPage}
                disabled={!data?.services.pageInfo.hasPreviousPage}
                className="p-0 w-8 h-8"
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={!data?.services.pageInfo.hasNextPage}
                className="p-0 w-8 h-8"
              >
                <ArrowRightIcon />
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
                  onClick={() => handleSortFieldChange('id')}
                >
                  Service
                  {sortField === 'id' &&
                    (sortOrder === 'asc' ? (
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
                  onClick={() => handleSortFieldChange('balance')}
                >
                  Balance
                  {sortField === 'balance' &&
                    (sortOrder === 'asc' ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center gap-1 justify-end cursor-pointer"
                  onClick={() => handleSortFieldChange('total')}
                >
                  Storage
                  {sortField === 'total' &&
                    (sortOrder === 'asc' ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div
                  className="flex items-center gap-1 justify-end cursor-pointer"
                  onClick={() => handleSortFieldChange('items')}
                >
                  Items
                  {sortField === 'items' &&
                    (sortOrder === 'asc' ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedServices.map((service, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Link
                    href={`/service/${service.id}`}
                    className="text-pink-300 hover:underline"
                  >
                    {service.id}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatHash(service.code)}
                </TableCell>
                <TableCell className="text-right">
                  {service.balance.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatBytes(service.total)}
                </TableCell>
                <TableCell className="text-right">{service.items}</TableCell>
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
            onClick={goToPrevPage}
            disabled={!data?.services.pageInfo.hasPreviousPage}
            className="px-3"
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!data?.services.pageInfo.hasNextPage}
            className="px-3"
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
