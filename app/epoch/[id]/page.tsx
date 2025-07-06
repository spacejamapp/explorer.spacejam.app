import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChart4Icon,
  PackageIcon,
  ServerIcon,
} from 'lucide-react';

import { Suspense } from 'react';

import Link from 'next/link';

import ActivityDashboard from '@/components/dashboard/activity';
import CoreDashboard from '@/components/dashboard/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchEpoch } from '@/lib/graphql';
import { mockStatistics } from '@/lib/mock/statistics';
import { formatBytes } from '@/lib/utils';

export default async function EpochPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  // Default zero values for validators and cores
  const defaultVals = [
    {
      blocks: 0,
      tickets: 0,
      preimages: 0,
      preimages_size: 0,
      guarantees: 0,
      assurances: 0,
    },
  ];
  const defaultCores = [
    {
      gas_used: 0,
      imports: 0,
      extrinsic_count: 0,
      exports: 0,
      bundle_size: 0,
      da_load: 0,
      popularity: 0,
    },
  ];

  const { epoch } = await fetchEpoch(Number(id));
  if (!epoch) {
    // Also use default zero values if epoch data cannot be fetched
    return (
      <main className="container mx-auto py-8">
        <section className="mb-8 font-bold text-2xl">Epoch {id}</section>
        <Suspense>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Render zeroed stats cards here if needed */}
          </section>
          <Tabs defaultValue="cores" className="space-y-4">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="cores">Cores</TabsTrigger>
              <TabsTrigger value="activity">Validator Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="cores" className="space-y-4">
              <CoreDashboard cores={defaultCores} />
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <ActivityDashboard current={defaultVals} />
            </TabsContent>
          </Tabs>
        </Suspense>
      </main>
    );
  }

  // Map GraphQL data to dashboard props
  const cores = epoch.cores.nodes.map((core: any) => ({
    id: core.id,
    gas_used: core.gasUsed,
    imports: core.imports,
    extrinsic_count: core.extrinsicCount,
    exports: core.exports,
    bundle_size: core.bundleSize,
    da_load: core.daLoad,
    popularity: core.popularity,
  }));

  const vals_current = epoch.validators.nodes.map((val: any) => ({
    id: val.id,
    blocks: val.blocks,
    tickets: val.tickets,
    preimages: val.preimages,
    guarantees: val.guarantees,
    assurances: val.assurances,
    preimages_size: 0,
  }));

  // Calculate some stats from the GraphQL data
  const totalBlocks = vals_current.reduce(
    (sum: number, val: any) => sum + val.blocks,
    0
  );
  const totalGasUsed = cores.reduce(
    (sum: number, core: any) => sum + core.gas_used,
    0
  );
  const totalExtrinsics = cores.reduce(
    (sum: number, core: any) => sum + core.extrinsic_count,
    0
  );
  const totalBundleSize = cores.reduce(
    (sum: number, core: any) => sum + core.bundle_size,
    0
  );

  return (
    <main className="container mx-auto py-8">
      <section className="mb-8 font-bold flex flex-row items-center space-x-4">
        <div className="text-xl w-[120px]">Epoch {id}</div>
        <div className="flex flex-row items-center space-x-2">
          <Link href={`/epoch/${Number(id) - 1}`}>
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/epoch/${Number(id) + 1}`}>
            <Button variant="outline" size="sm">
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Suspense>
        {/* Statistics cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-lg">
                <BarChart4Icon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Blocks</div>
                <div className="text-2xl font-bold">
                  {totalBlocks.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-lg">
                <ServerIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Extrinsics</div>
                <div className="text-2xl font-bold">
                  {totalExtrinsics.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="bg-green-100 dark:bg-green-950 p-3 rounded-lg">
                <PackageIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Bundle Size</div>
                <div className="text-2xl font-bold">
                  {formatBytes(totalBundleSize)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-lg">
                <ActivityIcon className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Gas Used</div>
                <div className="text-2xl font-bold">
                  {(totalGasUsed / 1000000).toFixed(1)}M
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabbed interface */}
        <Tabs defaultValue="cores" className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="cores">Cores</TabsTrigger>
            <TabsTrigger value="activity">Validator Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="cores" className="space-y-4">
            <CoreDashboard cores={cores} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ActivityDashboard current={vals_current} />
          </TabsContent>
        </Tabs>
      </Suspense>
    </main>
  );
}
