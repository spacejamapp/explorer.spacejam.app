// The home page of the SpaceJam project.

import ActivityDashboard from "@/components/dashboard/activity";
import CoreDashboard from "@/components/dashboard/core";
import LatestBlocks from "@/components/dashboard/latest-blocks";
import { mockStatistics } from "@/lib/mock/statistics";
import Link from "next/link";

export default function Home() {
  const stats = mockStatistics;

  return (
    <main className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Jamscan</h1> -- powered by{" "}
        <Link href="https://spacejam.io">spacejam</Link>
      </div>

      <LatestBlocks />

      <ActivityDashboard
        current={stats.vals_current}
        latest={stats.vals_latest}
      />

      <CoreDashboard cores={stats.cores} />
    </main>
  );
}
