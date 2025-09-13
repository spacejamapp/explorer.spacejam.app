'use client';

import React from 'react';

import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EPOCH_LENGTH, SLOT_PERIOD } from '@/lib/params';
import { ActivityRecord } from '@/types/statistic';

// Format large numbers with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
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
  epochNumber?: number;
}

export default function EpochCard({ current, epochNumber }: EpochCardProps) {
  // Calculate aggregate metrics for current epoch
  const currentAggregate = current.reduce(
    (acc, record) => ({
      blocks: acc.blocks + record.blocks,
      tickets: acc.tickets + record.tickets,
      guarantees: acc.guarantees + record.guarantees,
      assurances: acc.assurances + record.assurances,
    }),
    {
      blocks: 0,
      tickets: 0,
      guarantees: 0,
      assurances: 0,
    }
  );

  const totalExtrinsics =
    currentAggregate.tickets +
    currentAggregate.guarantees +
    currentAggregate.assurances;

  // Use the provided epochNumber if available, otherwise calculate from blocks
  const epochNum =
    epochNumber !== undefined
      ? epochNumber
      : calculateEpochInfo(currentAggregate.blocks).epochNumber;
  const { progress, remainingTime } = calculateEpochInfo(
    currentAggregate.blocks
  );

  return (
    <Card className="w-fit border-pink-300/30">
      <Link href={`/epoch/${epochNum}`}>
        <CardHeader className="py-3">
          <CardTitle className="flex flex-row items-end justify-between gap-4">
            <div className="text-lg flex flex-row items-end justify-between gap-2">
              <div className="">Epoch </div>
              {epochNum}
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
          <div className="flex justify-between">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-gray-500">Blocks</div>
              <div className="font-medium">
                {formatNumber(currentAggregate.blocks)}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-gray-500">Extrinsics</div>
              <div className="font-medium">
                {formatNumber(totalExtrinsics)}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
