import ActivityDashboard from "@/components/dashboard/activity";
import CoreDashboard from "@/components/dashboard/core";
import { Button } from "@/components/ui/button";
import { mockStatistics } from "@/lib/mock/statistics";
import { ArrowLeftIcon, ArrowRightIcon, MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function EpochPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const { cores, vals_current, vals_latest } = mockStatistics;

  // TODO: we need to know the latest epoch

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
        <section className="space-y-8">
          <CoreDashboard cores={cores} />
          <ActivityDashboard current={vals_current} latest={vals_latest} />
        </section>
      </Suspense>
    </main>
  );
}
