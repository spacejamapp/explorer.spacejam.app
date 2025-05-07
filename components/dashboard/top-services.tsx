"use client";

import React from "react";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TopServicesProps {
  services: ServiceItem[];
}

export default function TopServices({ services }: TopServicesProps) {
  // Format bytes to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
                    className="hover:underline text-pink-300"
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
