import { Suspense } from 'react';

import Blocks from '@/components/dashboard/blocks';
import { fetchSpacejam } from '@/lib/graphql';
import { fetchBlocks } from '@/lib/graphql/block';
import { Header } from '@/types';

interface BlocksPageProps {
  searchParams?: Promise<{
    page?: string;
    rows?: string;
  }>;
}

export default async function BlocksPage({ searchParams }: BlocksPageProps) {
  // Await searchParams
  const params = await searchParams;
  const currentPage = Number(params?.page || '1');
  const pageSize = Number(params?.rows || '10');

  // Get current page of blocks
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = startIndex + pageSize;

  try {
    // Server-side data fetching at page level
    const { headers } = await fetchBlocks(startIndex, endIndex);
    const { spacejam } = await fetchSpacejam();

    return (
      <main className="container mx-auto py-8">
        <section className="mb-8 font-bold text-2xl">Blocks</section>
        <Suspense>
          <Blocks
            headers={headers}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={Math.ceil(spacejam.blocks / pageSize)}
            totalBlocks={spacejam.blocks}
          />
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
