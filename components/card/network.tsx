'use client';

import React from 'react';

import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Spacejam } from '@/types/network';

interface NetworkCardProps {
  spacejam: Spacejam;
}

export default function NetworkCard({ spacejam }: NetworkCardProps) {
  return (
    <Card className="w-[200px] border-pink-300/30">
      <Link href="/network">
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Network</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 flex flex-col">
          <div className="flex flex-col">
            <div className="text-xs text-gray-500">Blocks / Extrinsics</div>
            <div className="font-bold">
              {spacejam.blocks} / {spacejam.extrinsics}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-gray-500">Finalized Slot</div>
            <div className="font-bold">{spacejam.finalized}</div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
