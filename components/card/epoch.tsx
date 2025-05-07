"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ActivityRecord } from "@/lib/types/statistic";
import { EPOCH_LENGTH, SLOT_PERIOD } from "@/lib/params";

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

// Format time remaining in minutes and seconds
function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

// Calculate epoch information
function calculateEpochInfo(blocks: number) {
  const epochNumber = Math.floor(blocks / EPOCH_LENGTH);
  const blocksInCurrentEpoch = blocks % EPOCH_LENGTH;
  const progress = (blocksInCurrentEpoch / EPOCH_LENGTH) * 100;
  const remainingBlocks = EPOCH_LENGTH - blocksInCurrentEpoch;
  const remainingTime = remainingBlocks * SLOT_PERIOD;

  return {
    epochNumber,
    progress,
    remainingTime,
  };
}

interface EpochCardProps {
  current: ActivityRecord[];
}

export default function EpochCard({ current }: EpochCardProps) {
  // Calculate aggregate metrics for current epoch
  const currentAggregate = current.reduce(
    (acc, record) => ({
      blocks: acc.blocks + record.blocks,
      tickets: acc.tickets + record.tickets,
      preimages: acc.preimages + record.preimages,
      guarantees: acc.guarantees + record.guarantees,
      assurances: acc.assurances + record.assurances,
      preimages_size: acc.preimages_size + record.preimages_size,
    }),
    {
      blocks: 0,
      tickets: 0,
      preimages: 0,
      guarantees: 0,
      assurances: 0,
      preimages_size: 0,
    }
  );

  const totalExtrinsics =
    currentAggregate.tickets +
    currentAggregate.preimages +
    currentAggregate.guarantees +
    currentAggregate.assurances;

  const { epochNumber, progress, remainingTime } = calculateEpochInfo(
    currentAggregate.blocks
  );

  return (
    <Card className="w-fit border-pink-300/30">
      <Link href={`/epoch/${epochNumber}`}>
        <CardHeader className="py-3">
          <CardTitle className="flex flex-row items-end justify-between">
            <div className="text-lg flex flex-row items-end justify-between gap-2">
              <div className="">Epoch </div>
              {epochNumber}
            </div>
            <div className="text-sm text-gray-500 text-center">
              remaining: {formatTimeRemaining(remainingTime)}
            </div>
          </CardTitle>
          <div className="mt-2 flex flex-row items-center justify-between gap-4">
            <Progress value={progress} className="h-2 w-full" />
            <div>{progress.toFixed(0)}%</div>
          </div>
        </CardHeader>
        <CardContent className="py-4 border-t">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-2">Blocks</TableHead>
                <TableHead className="py-2">Extrinsics</TableHead>
                <TableHead className="py-2">Preimage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell className="py-2">
                  {formatNumber(currentAggregate.blocks)}
                </TableCell>
                <TableCell className="py-2">
                  {formatNumber(totalExtrinsics)}
                </TableCell>
                <TableCell className="py-2">
                  {formatBytes(currentAggregate.preimages_size)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Link>
    </Card>
  );
}
