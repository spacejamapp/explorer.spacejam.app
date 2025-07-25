'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import React, { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CoreActivityRecord } from '@/types/statistic';

interface CoreTabsProps {
  coreId: number;
  activityData: CoreActivityRecord[];
}

export default function CoreTabs({ activityData }: CoreTabsProps) {
  // State for epoch history view toggle
  const [historyView, setHistoryView] = useState<'table' | 'chart'>('table');

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Add index to each record for consistent x-axis, prefer epoch number if available
  const chartData = activityData.map((record, index) => ({
    ...record,
    displayIndex: record.epoch || record.index || index + 1,
    epochLabel: record.epoch ? `Epoch ${record.epoch}` : `Entry ${index + 1}`,
    index: index + 1, // Keep original index for backward compatibility
  }));

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="history">Epoch History</TabsTrigger>
        <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Core Activity Overview</CardTitle>
            <CardDescription>
              Activity metrics across the last 30 data points
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
                <XAxis
                  dataKey="displayIndex"
                  label={{
                    value: 'Epoch',
                    position: 'insideBottomRight',
                    offset: -10,
                  }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(label) => `Epoch ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="gas_used"
                  name="Gas Used"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="extrinsic_count"
                  name="Extrinsic Count"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Bundle Size</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayIndex" />
                  <YAxis />
                  <Tooltip 
                  labelFormatter={(label) => `Epoch ${label}`}
                />
                  <Area
                    type="monotone"
                    dataKey="bundle_size"
                    name="Bundle Size"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popularity</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.slice(0, 10)} // Show only the 10 most recent data points
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayIndex" />
                  <YAxis />
                  <Tooltip 
                  labelFormatter={(label) => `Epoch ${label}`}
                />
                  <Legend />
                  <Bar dataKey="popularity" name="Popularity" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Gas Usage</CardTitle>
            <CardDescription>Gas used per data point</CardDescription>
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
                <XAxis dataKey="displayIndex" />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: 'Gas Used',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: 'DA Load',
                    angle: 90,
                    position: 'insideRight',
                  }}
                />
                <Tooltip 
                  labelFormatter={(label) => `Epoch ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="gas_used"
                  name="Gas Used"
                  stroke="#ff7300"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="da_load"
                  name="DA Load"
                  stroke="#ff0000"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extrinsic Count</CardTitle>
            <CardDescription>
              Number of extrinsics processed per data point
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
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
                <XAxis dataKey="displayIndex" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Epoch ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="extrinsic_count"
                  name="Extrinsic Count"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Epoch History</CardTitle>
                <CardDescription>
                  Historical performance data across epochs
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={historyView === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHistoryView('table')}
                >
                  Table
                </Button>
                <Button
                  variant={historyView === 'chart' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHistoryView('chart')}
                >
                  Chart
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {historyView === 'table' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Epoch</TableHead>
                    <TableHead className="text-right">Gas Used</TableHead>
                    <TableHead className="text-right">Imports</TableHead>
                    <TableHead className="text-right">Exports</TableHead>
                    <TableHead className="text-right">Extrinsics</TableHead>
                    <TableHead className="text-right">Bundle Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.length > 0 ? (
                    chartData.map((record, index) => (
                      <TableRow key={record.epoch || index}>
                        <TableCell className="font-medium">
                          {record.epoch ? `Epoch ${record.epoch}` : `Entry ${index + 1}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.gas_used)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.imports)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.exports)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.extrinsic_count)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.bundle_size)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No historical data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="h-96">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="displayIndex" 
                        label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => `Epoch ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="gas_used" name="Gas Used" fill="#8884d8" />
                      <Bar dataKey="imports" name="Imports" fill="#00C49F" />
                      <Bar dataKey="exports" name="Exports" fill="#FFBB28" />
                      <Bar dataKey="extrinsic_count" name="Extrinsics" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <div className="text-lg font-medium">No Historical Data</div>
                      <div className="text-sm">This core has no recorded historical data yet</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dataflow" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Imports vs Exports</CardTitle>
            <CardDescription>Data flow metrics for this core</CardDescription>
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
                <XAxis dataKey="displayIndex" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Epoch ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="imports"
                  name="Imports"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="exports"
                  name="Exports"
                  stroke="#10b981"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Imports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityData.length > 0
                  ? (
                      activityData.reduce(
                        (sum, record) => sum + record.imports,
                        0
                      ) / activityData.length
                    ).toFixed(2)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Average imports per data point
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Exports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityData.length > 0
                  ? (
                      activityData.reduce(
                        (sum, record) => sum + record.exports,
                        0
                      ) / activityData.length
                    ).toFixed(2)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Average exports per data point
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
