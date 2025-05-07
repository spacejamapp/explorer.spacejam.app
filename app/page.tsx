// The home page of the SpaceJam project.

import LatestBlocks from "@/components/dashboard/latest-blocks";
import Epoch from "@/components/dashboard/epoch";
import Link from "next/link";
import { getMockBlocks } from "@/lib/mock/block";
import { mockStatistics } from "@/lib/mock/statistics";
import EpochCard from "@/components/card/epoch";
import HistoryCard from "@/components/card/history";

export default function Home() {
  const blocks = getMockBlocks(20);
  const stats = mockStatistics;

  return (
    <main className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Jamscan</h1> -- powered by{" "}
        <Link href="https://spacejam.app" className="font-bold">
          spacejam
        </Link>
      </div>

      <section className="flex gap-4">
        <EpochCard current={stats.vals_current} />
        <HistoryCard blocks={blocks} />
      </section>

      <LatestBlocks />
    </main>
  );
}
