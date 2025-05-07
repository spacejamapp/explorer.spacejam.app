"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Statistics } from "@/lib/types/statistic";
import ActivityDashboard from "./activity";
import CoreDashboard from "./core";

// Mock data for statistics
const mockStatistics: Statistics = {
  vals_current: [
    {
      blocks: 1245,
      tickets: 8543,
      preimages: 342,
      preimages_size: 2345678,
      guarantees: 456,
      assurances: 789,
    },
  ],
  vals_latest: [
    {
      blocks: 1234,
      tickets: 8500,
      preimages: 340,
      preimages_size: 2300000,
      guarantees: 450,
      assurances: 780,
    },
  ],
  cores: [
    {
      gas_used: 45678901,
      imports: 1234,
      extrinsic_count: 5678,
      exports: 4321,
      bundle_size: 12345678,
      da_load: 78,
      popularity: 92,
    },
    {
      gas_used: 33456789,
      imports: 987,
      extrinsic_count: 4567,
      exports: 3456,
      bundle_size: 9876543,
      da_load: 65,
      popularity: 88,
    },
    {
      gas_used: 28976543,
      imports: 876,
      extrinsic_count: 3456,
      exports: 2345,
      bundle_size: 7654321,
      da_load: 54,
      popularity: 76,
    },
  ],
};

export default function Statistics() {
  const stats = mockStatistics;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Network Statistics</CardTitle>
          <CardDescription>
            Key metrics for SpaceJam network activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activity Records</TabsTrigger>
              <TabsTrigger value="cores">Execution Cores</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <ActivityDashboard current={stats.vals_current} />
            </TabsContent>

            <TabsContent value="cores">
              <CoreDashboard cores={stats.cores} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
