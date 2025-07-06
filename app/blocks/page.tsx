import { Suspense } from 'react';

import Blocks from '@/components/dashboard/blocks';
import { fetchSpacejam } from '@/lib/graphql';
import { fetchBlocks } from '@/lib/graphql/block';

interface BlocksPageProps {
  searchParams?: Promise<{
    after?: string;
    first?: string;
  }>;
}

export default async function BlocksPage({ searchParams }: BlocksPageProps) {
  // Await searchParams
  const params = await searchParams;
  const after = params?.after;
  const first = Number(params?.first || '20');

  try {
    // Server-side data fetching at page level
    const { headers } = await fetchBlocks(first, after);
    const { spacejam } = await fetchSpacejam();

    return (
      <main className="container mx-auto py-8">
        <section className="mb-8 font-bold text-2xl">Blocks</section>
        <Suspense>
          <Blocks headerConnection={headers} totalBlocks={spacejam.blocks} />
        </Suspense>
      </main>
    );
  } catch (error) {
    return (
      <main className="container mx-auto py-8">
        <section className="mb-8 font-bold text-2xl">Blocks</section>
        <div>
          Error loading blocks:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </main>
    );
  }
}
