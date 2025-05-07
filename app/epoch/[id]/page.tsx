import ActivityDashboard from "@/components/dashboard/activity";
import CoreDashboard from "@/components/dashboard/core";
import { mockStatistics } from "@/lib/mock/statistics";
import { Suspense } from "react";

export default async function EpochPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const { cores, vals_current, vals_latest } = mockStatistics;

  return (
    <main className="container mx-auto py-8">
      <section className="mb-8 font-bold">Epoch #{id}</section>
      <Suspense>
        <section className="space-y-8">
          <CoreDashboard cores={cores} />
          <ActivityDashboard current={vals_current} latest={vals_latest} />
        </section>
      </Suspense>
    </main>
  );
}
