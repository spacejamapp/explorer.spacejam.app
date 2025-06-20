'use client';

import {
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Header } from '@/lib/types/block';

// Format large numbers with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Calculate data from blocks
function calculateBlockData(blocks: Header[]) {
  return blocks.map((block) => ({
    block: block.slot,
    extrinsics: Math.floor(Math.random() * 1000), // TODO: calculate extrinsics
    // block: block.header.slot,
    // extrinsics:
    //   block.extrinsic.tickets.length +
    //   block.extrinsic.preimage.length +
    //   block.extrinsic.guarantee.length +
    //   block.extrinsic.assurance.length,
  }));
}

interface HistoryCardProps {
  blocks: Header[];
}

export default function HistoryCard({ blocks }: HistoryCardProps) {
  // Calculate block data
  const blockData = calculateBlockData(blocks);

  return (
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
              <XAxis
                dataKey="block"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `Block ${value}`}
                tickLine={false}
                axisLine={false}
                interval={8}
              />
              <YAxis
                stroke="#6b7280"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  value == 0 ? '' : formatNumber(value)
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
                          {typeof value === 'number'
                            ? formatNumber(value)
                            : value}{' '}
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
                stroke="#f9a8d4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
