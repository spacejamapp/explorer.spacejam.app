import Services from "@/components/dashboard/services";
import { Suspense } from "react";

export default function ServicesPage() {
  return (
    <main className="container mx-auto py-8">
      <section className="mb-8 font-bold text-2xl">Services</section>
      <Suspense>
        <Services />
      </Suspense>
    </main>
  );
}
