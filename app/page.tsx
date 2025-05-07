// The home page of the SpaceJam project.

import ActivityDashboard from "@/components/dashboard/activity";
import CoreDashboard from "@/components/dashboard/core";
import LatestBlocks from "@/components/dashboard/latest-blocks";
import EpochActivitiesDashboard from "@/components/dashboard/epoch-activities";
import { mockStatistics } from "@/lib/mock/statistics";
import Link from "next/link";
import { getMockBlocks } from "@/lib/mock/block";

export default function Home() {
  const stats = mockStatistics;
  const blocks = getMockBlocks(20);

  return (
    <main className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Jamscan</h1> -- powered by{" "}
        <Link href="https://spacejam.app" className="font-bold">
          spacejam
        </Link>
      </div>

      <EpochActivitiesDashboard
        current={stats.vals_current}
        latest={stats.vals_latest}
        blocks={blocks}
      />

      <LatestBlocks />

      <CoreDashboard cores={stats.cores} />

      <ActivityDashboard
        current={stats.vals_current}
        latest={stats.vals_latest}
      />
    </main>
  );
}
