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
import { NetworkValidator } from '@/types/network';
import { ActivityRecord } from '@/types/statistic';

interface ValidatorTabsProps {
  validator: NetworkValidator;
  activityData: (ActivityRecord & { epoch?: number; index?: number })[];
}

export default function ValidatorTabs({
  validator,
  activityData,
}: ValidatorTabsProps) {
  // State for epoch history view toggle
  const [historyView, setHistoryView] = useState<'table' | 'chart'>('table');

  // Add index to each record for consistent x-axis, prefer epoch number if available
  const chartData = activityData.map((record, index) => ({
    ...record,
    displayIndex: record.epoch || record.index || index + 1,
    epochLabel: record.epoch ? `Epoch ${record.epoch}` : `Entry ${index + 1}`,
  }));

  // Colors for pie chart (including one for "Others")
  const COLORS = [
    '#0088FE',
    '#00C49F', 
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
    '#D0D0D0', // Gray for "Others"
  ];

  // Prepare data for pie chart - get totals across all epochs for better representation
  const totalsByType = activityData.reduce((acc, record) => ({
    blocks: acc.blocks + record.blocks,
    tickets: acc.tickets + record.tickets,
    preimages: acc.preimages + record.preimages,
    guarantees: acc.guarantees + record.guarantees,
    assurances: acc.assurances + record.assurances,
  }), { blocks: 0, tickets: 0, preimages: 0, guarantees: 0, assurances: 0 });

  const allPieData = [
    { name: 'Blocks', value: totalsByType.blocks },
    { name: 'Tickets', value: totalsByType.tickets },
    { name: 'Preimages', value: totalsByType.preimages },   
    { name: 'Guarantees', value: totalsByType.guarantees },
    { name: 'Assurances', value: totalsByType.assurances },
  ];
  
  // Format large numbers with commas - define early to avoid hoisting issues
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Calculate total first to determine percentages
  const totalValue = allPieData.reduce((sum, item) => sum + item.value, 0);
  
  // For the pie chart visual: only show items that are at least 1% to avoid overlap
  const visualPieData = allPieData.filter(item => {
    const percentage = (item.value / totalValue) * 100;
    return item.value > 0 && percentage >= 1;
  });
  
  // Group small items for visual display
  const smallItems = allPieData.filter(item => {
    const percentage = (item.value / totalValue) * 100;
    return item.value > 0 && percentage < 1;
  });
  
  // Create final pie data for visual rendering
  const finalPieData = [...visualPieData];
  if (smallItems.length > 0) {
    const othersValue = smallItems.reduce((sum, item) => sum + item.value, 0);
    finalPieData.push({ name: 'Others', value: othersValue });
  }
  
  // For the legend: show ALL items including 0% ones
  const legendData = allPieData.map((entry, index) => ({
    value: `${entry.name}: ${formatNumber(entry.value)} (${((entry.value / totalValue) * 100).toFixed(1)}%)`,
    type: 'rect' as const,
    color: COLORS[index % COLORS.length],
    id: `legend-${index}`
  }));

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
        <TabsTrigger value="history">Epoch History</TabsTrigger>
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
            {finalPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={finalPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ outline: 'none' }}
                  >
                    {finalPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        style={{ outline: 'none' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Others') {
                        const othersDetail = smallItems.map(item => `${item.name}: ${formatNumber(item.value)}`).join(', ');
                        return [`${formatNumber(value as number)} (${othersDetail})`, name];
                      }
                      return formatNumber(value as number);
                    }}
                  />
                  <Legend 
                    payload={legendData}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-medium">No Activity Data</div>
                  <div className="text-sm">This validator has no recorded activity yet</div>
                </div>
              </div>
            )}
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
                <XAxis 
                  dataKey="displayIndex" 
                  label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value) => formatNumber(value as number)}
                  labelFormatter={(label) => `Epoch ${label}`}
                />
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
                <XAxis 
                  dataKey="displayIndex" 
                  label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
                />
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
                    <TableHead className="text-right">Blocks</TableHead>
                    <TableHead className="text-right">Tickets</TableHead>
                    <TableHead className="text-right">Preimages</TableHead>
                    <TableHead className="text-right">Guarantees</TableHead>
                    <TableHead className="text-right">Assurances</TableHead>
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
                          {formatNumber(record.blocks)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.tickets)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.preimages)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.guarantees)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(record.assurances)}
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
                        formatter={(value) => formatNumber(value as number)}
                        labelFormatter={(label) => `Epoch ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="blocks" name="Blocks" fill={COLORS[0]} />
                      <Bar dataKey="tickets" name="Tickets" fill={COLORS[1]} />
                      <Bar dataKey="preimages" name="Preimages" fill={COLORS[2]} />
                      <Bar dataKey="guarantees" name="Guarantees" fill={COLORS[3]} />
                      <Bar dataKey="assurances" name="Assurances" fill={COLORS[4]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <div className="text-lg font-medium">No Historical Data</div>
                      <div className="text-sm">This validator has no recorded historical data yet</div>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                <XAxis 
                  dataKey="displayIndex" 
                  label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatNumber(value as number)}
                  labelFormatter={(label) => `Epoch ${label}`}
                />
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
