"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { Network } from "@/lib/types/network";

// Format large numbers with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

interface NetworkCardProps {
  network: Network;
}

export default function NetworkCard({ network }: NetworkCardProps) {
  return (
    <Card className="w-[200px]">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">Network</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col">
          <div className="text-xs text-gray-500">Extrinsics</div>
          <div className="font-bold">{formatNumber(network.extrinsics)}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-gray-500">Finalized Slot</div>
          <div className="font-bold">{formatNumber(network.finalized)}</div>
        </div>
        <div className="mt-4 text-end">
          <Link
            href="/network"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            View live stats →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
