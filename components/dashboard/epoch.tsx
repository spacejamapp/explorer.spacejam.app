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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import type { ActivityRecord } from "@/lib/types/statistic";
import type { Block } from "@/lib/types/block";
import { EPOCH_LENGTH, SLOT_PERIOD } from "@/lib/params";
import { Progress } from "@/components/ui/progress";
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

// Calculate data from blocks
function calculateBlockData(blocks: Block[]) {
  return blocks.map((block) => ({
    block: block.header.slot,
    extrinsics:
      block.extrinsic.tickets.length +
      block.extrinsic.preimage.length +
      block.extrinsic.guarantee.length +
      block.extrinsic.assurance.length,
  }));
}

// Epoch Activities Dashboard component
export default function Epoch({
  current,
  latest,
  blocks,
}: {
  current: ActivityRecord[];
  latest: ActivityRecord[];
  blocks: Block[];
}) {
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

  // Calculate block data
  const blockData = calculateBlockData(blocks);

  return (
    <div className="flex gap-4">
      <Card className="w-fit">
        <CardHeader className="py-3">
          <div className="flex items-center gap-4 justify-between">
            <CardTitle className="text-lg">
              Epoch{" "}
              <Link href={`/epoch/${epochNumber}`} className="underline">
                {epochNumber}
              </Link>
            </CardTitle>
            <div className="text-sm text-gray-500">
              remaining: {formatTimeRemaining(remainingTime)}
            </div>
          </div>
          <div className="mt-2 flex flex-row items-center justify-between gap-4">
            {/* Progress bar for epoch progress */}
            <Progress value={progress} className="h-2 w-full" />
            <div>{progress.toFixed(0)}%</div>
          </div>
        </CardHeader>
        <CardContent className="py-2">
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
      </Card>

      <Card className="flex-1 min-w-[200px]">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Extrinsic History</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={blockData}>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
                <XAxis
                  dataKey="block"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `Block ${value}`}
                  tickLine={false}
                  axisLine={false}
                  // interval="preserveStartEnd"
                  interval={8}
                />
                <YAxis
                  stroke="#6b7280"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    value == 0 ? "" : formatNumber(value)
                  }
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value;
                      const block = payload[0].payload.block;
                      return (
                        <div className="p-2 border rounded shadow-sm">
                          <p className="text-sm">Block {block}</p>
                          <p className="text-sm font-medium">
                            Extrinsics:
                            {typeof value === "number"
                              ? formatNumber(value)
                              : value}{" "}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="extrinsics"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
