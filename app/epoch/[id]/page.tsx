import ActivityDashboard from "@/components/dashboard/activity";
import CoreDashboard from "@/components/dashboard/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStatistics } from "@/lib/mock/statistics";
import { formatBytes } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ServerIcon,
  ActivityIcon,
  BarChart4Icon,
  PackageIcon,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function EpochPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const { cores, vals_current } = mockStatistics;

  // Calculate some stats from the mock data
  const totalBlocks = vals_current.reduce((sum, val) => sum + val.blocks, 0);
  const totalGasUsed = cores.reduce((sum, core) => sum + core.gas_used, 0);
  const totalExtrinsics = cores.reduce(
    (sum, core) => sum + core.extrinsic_count,
    0
  );
  const totalBundleSize = cores.reduce(
    (sum, core) => sum + core.bundle_size,
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
