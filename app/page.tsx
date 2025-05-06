// The home page of the SpaceJam project.

import Link from "next/link";
import LatestBlocks from "@/components/dashboard/latest-blocks";

export default function Home() {
  return (
    <main className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">SpaceJam Explorer</h1>
      <LatestBlocks />
    </main>
  );
}
