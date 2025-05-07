import Blocks from "@/components/dashboard/blocks";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function BlocksPage() {
  return (
    <main className="container mx-auto py-8">
      <section className="mb-8 font-bold">Blocks</section>
      <Suspense>
        <Blocks />
      </Suspense>
    </main>
  );
}
