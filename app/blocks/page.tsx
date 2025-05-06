import Blocks from "@/components/dashboard/blocks";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function BlocksPage() {
  return (
    <main className="container mx-auto py-8">
      <section className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </section>
      <Suspense>
        <Blocks />
      </Suspense>
    </main>
  );
}
