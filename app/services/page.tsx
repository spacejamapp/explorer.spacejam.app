import { Suspense } from 'react';

import Services from '@/components/dashboard/services';

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
