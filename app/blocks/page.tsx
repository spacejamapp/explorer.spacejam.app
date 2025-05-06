import Blocks from "@/components/dashboard/blocks";
import { Suspense } from "react";

export default function BlocksPage() {
  return (
    <main className="h-page">
      <h1 className="text-3xl font-bold">Blocks</h1>
      <Suspense>
        <Blocks />
      </Suspense>
    </main>
  );
}
