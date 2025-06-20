'use client';

import React from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ServiceItem } from '@/lib/types/service';
import { formatBytes } from '@/lib/utils';

interface TopServicesProps {
  services: ServiceItem[];
}

export default function TopServices({ services }: TopServicesProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Services</CardTitle>
        <CardDescription>
          Highest performing service accounts on the network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Gas Limit</TableHead>
              <TableHead className="text-right">Storage</TableHead>
              <TableHead className="text-right">Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((serviceItem, i) => (
              <TableRow key={i}>
                <TableCell className="">
                  <Link
                    href={`/service/${serviceItem.service}`}
                    className="text-pink-300 hover:underline"
                  >
                    {serviceItem.service}
                  </Link>
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
        <div className="mt-4 text-right">
          <Button variant="link">
            <Link href="/services">View all services →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
