import Blocks from "@/components/dashboard/blocks";
import { Suspense } from "react";

export default function BlocksPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="mx-auto text-xl font-bold">Blocks</h1>
      <Suspense>
        <Blocks />
      </Suspense>
    </main>
  );
}
