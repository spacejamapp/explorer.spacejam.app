'use client';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLink,
  Globe,
} from 'lucide-react';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

// Mock data for when GraphQL is not available
const mockValidatorData = {
  nodes: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    epoch: 1,
    vindex: i,
    blocks: Math.floor(Math.random() * 10000) + 1000,
    tickets: Math.floor(Math.random() * 50000) + 5000,
    preimages: Math.floor(Math.random() * 1000) + 100,
    guarantees: Math.floor(Math.random() * 500) + 50,
    assurances: Math.floor(Math.random() * 800) + 200,
  })),
  pageInfo: {
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: 'cursor1',
    endCursor: 'cursor20',
  },
};

// Helper function to format numbers with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper function to calculate uptime (mock calculation)
function calculateUptime(blocks: number): number {
  return Math.min(99.5 + (blocks / 10000) * 0.5, 100);
}

interface ValidatorsProps {
  // Props for when using GraphQL data
  validatorConnection?: {
    nodes: Array<{
      id: number;
      epoch: number;
      vindex: number;
      blocks: number;
      tickets: number;
      preimages: number;
      guarantees: number;
      assurances: number;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
  totalValidators?: number;
}

export default function ValidatorsPage({
  validatorConnection = mockValidatorData,
  totalValidators = 1337,
}: ValidatorsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get('first') || '20')
  );

  const { nodes: validators, pageInfo } = validatorConnection;

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);
    router.push(`/validators?first=${newSize}`);
  };

  // Navigation handlers for cursor-based pagination
  const goToNextPage = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      router.push(`/validators?first=${pageSize}&after=${pageInfo.endCursor}`);
    }
  };

  const goToPrevPage = () => {
    if (pageInfo.hasPreviousPage && pageInfo.startCursor) {
      // For previous page, we'd need to implement before cursor logic
      // For now, just go back to first page
      router.push(`/validators?first=${pageSize}`);
    }
  };

  // Get validator initials for avatar fallback
  const getInitials = (validator: (typeof validators)[0]) => {
    return `V${validator.id}`;
  };

  // Mock additional data that's not in GraphQL schema
  const getValidatorMockData = (validator: (typeof validators)[0]) => {
    return {
      name: Math.random() > 0.3 ? `Validator ${validator.id}` : undefined,
      pfp:
        Math.random() > 0.7
          ? `https://avatars.githubusercontent.com/u/${10000 + validator.id}`
          : undefined,
      website:
        Math.random() > 0.6
          ? `https://validator-${validator.id}.network.io`
          : undefined,
      isActive: Math.random() > 0.1,
      uptime: calculateUptime(validator.blocks),
      stake: Math.floor(Math.random() * 900000) + 100000,
      lastSeen: Math.floor(Math.random() * 3600),
    };
  };

  // Helper function to format uptime percentage
  function formatUptime(uptime: number): string {
    return `${uptime.toFixed(2)}%`;
  }

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="p-4 border border-b-0 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">
              Total of {formatNumber(totalValidators)} validators
            </h2>
            <p className="text-sm text-gray-600">
              (Showing {validators.length} validators)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={!pageInfo.hasPreviousPage}
                className="px-3"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pageInfo.startCursor ? '...' : '1'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={!pageInfo.hasNextPage}
                className="px-3"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-0 p-4 border-x">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Validator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Blocks</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Guarantees</TableHead>
              <TableHead>Assurances</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validators.map((validator) => {
              const mockData = getValidatorMockData(validator);
              return (
                <TableRow key={validator.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {mockData.pfp ? (
                          <AvatarImage
                            src={mockData.pfp}
                            alt={mockData.name || `Validator ${validator.id}`}
                          />
                        ) : null}
                        <AvatarFallback className="text-xs">
                          {getInitials(validator)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          <Link
                            href={`/validator/${validator.id}`}
                            className="text-pink-300 hover:underline"
                          >
                            {mockData.name || `Validator ${validator.id}`}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500">
                          #{validator.id} • vindex: {validator.vindex}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={mockData.isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {mockData.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatNumber(validator.blocks)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatNumber(validator.tickets)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatNumber(validator.guarantees)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatNumber(validator.assurances)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          mockData.uptime > 99
                            ? 'bg-green-500'
                            : mockData.uptime > 95
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <span className="text-sm">
                        {formatUptime(mockData.uptime)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/validator/${validator.id}`}
                        className="text-pink-300 hover:text-pink-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      {mockData.website && (
                        <a
                          href={mockData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show rows:</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="20" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
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
            disabled={!pageInfo.hasPreviousPage}
            className="px-3"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!pageInfo.hasNextPage}
            className="px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
