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
import { Service } from '@/lib/graphql';

interface TopServicesProps {
  services: Service[];
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
              <TableHead className="text-right">Storage</TableHead>
              <TableHead className="text-right">Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, i) => (
              <TableRow key={i}>
                <TableCell className="">
                  <Link
                    href={`/service/${service.id}`}
                    className="text-pink-300 hover:underline"
                  >
                    {service.id}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  {service.balance.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {service.total.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{service.items}</TableCell>
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
