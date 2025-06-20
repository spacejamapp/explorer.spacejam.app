'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Validator } from '@/lib/types/network';
import { ActivityRecord } from '@/lib/types/statistic';

interface ValidatorTabsProps {
  validator: Validator;
  activityData: ActivityRecord[];
}

export default function ValidatorTabs({
  validator,
  activityData,
}: ValidatorTabsProps) {
  // Add index to each record for consistent x-axis
  const chartData = activityData.map((record, index) => ({
    ...record,
    index: index + 1, // Starting from 1 for better readability
  }));

  // Colors for pie chart
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  // Prepare data for pie chart
  const pieData = [
    { name: 'Blocks', value: activityData[0]?.blocks || 0 },
    { name: 'Tickets', value: activityData[0]?.tickets || 0 },
    { name: 'Preimages', value: activityData[0]?.preimages || 0 },
    { name: 'Guarantees', value: activityData[0]?.guarantees || 0 },
    { name: 'Assurances', value: activityData[0]?.assurances || 0 },
  ];

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Format bytes to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Validator Overview</CardTitle>
            <CardDescription>
              Activity distribution for validator{' '}
              {validator.name || validator.bandersnatch}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Node</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium truncate">
                {validator.node}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">IP Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{validator.ip}</div>
            </CardContent>
          </Card>

          {validator.website && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Website</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={validator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-blue-600 hover:underline truncate block"
                >
                  {validator.website}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Block & Transaction Activity</CardTitle>
            <CardDescription>
              Historical block and transaction activity
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="blocks"
                  name="Blocks"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tickets"
                  name="Tickets"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preimage Activity</CardTitle>
            <CardDescription>Preimage count and size over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: 'Count',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: 'Size (bytes)',
                    angle: 90,
                    position: 'insideRight',
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'Preimage Size') {
                      return formatBytes(value as number);
                    }
                    return formatNumber(value as number);
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="preimages"
                  name="Preimage Count"
                  stroke="#ff7300"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="preimages_size"
                  name="Preimage Size"
                  stroke="#ff0000"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stats" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Guarantees vs Assurances</CardTitle>
            <CardDescription>
              Comparison of guarantees and assurances over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Legend />
                <Bar dataKey="guarantees" name="Guarantees" fill="#8884d8" />
                <Bar dataKey="assurances" name="Assurances" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Blocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(
                  activityData.reduce((sum, record) => sum + record.blocks, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total blocks produced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(
                  activityData.reduce((sum, record) => sum + record.tickets, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total tickets processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Data Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(
                  activityData.reduce(
                    (sum, record) => sum + record.preimages_size,
                    0
                  )
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total preimage data processed
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
