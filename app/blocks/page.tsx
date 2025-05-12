import Blocks from '@/components/dashboard/blocks';
import { Suspense } from 'react';

export default function BlocksPage() {
  return (
    <main className='container mx-auto py-8'>
      <section className='mb-8 font-bold text-2xl'>Blocks</section>
      <Suspense>
        <Blocks />
      </Suspense>
    </main>
  );
}
