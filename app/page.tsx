// The home page of the SpaceJam project.

import LatestBlocks from '@/components/dashboard/latest-blocks';
import TopServices from '@/components/dashboard/top-services';
import Link from 'next/link';
import { getMockBlocks } from '@/lib/mock/block';
import { mockStatistics } from '@/lib/mock/statistics';
import { getMockServices } from '@/lib/mock/service';
import EpochCard from '@/components/card/epoch';
import HistoryCard from '@/components/card/history';
import NetworkCard from '@/components/card/network';
import ActiveCores from '@/components/dashboard/active-cores';
import SearchComponent from '@/components/search';
import { query } from '@/lib/apollo';
import { GET_SPACEJAM } from '@/lib/graphql/queries/spacejam';
import { GET_BLOCKS } from '@/lib/graphql/queries/block';

export default async function Home() {
  const blocks = getMockBlocks(20);
  const stats = mockStatistics;
  const services = getMockServices(5);
  const { data: blocksData } = await query({
    query: GET_BLOCKS,
    variables: {
      from: 1,
      to: 21,
    },
  });
  const { data: spacejamData } = await query({
    query: GET_SPACEJAM,
  });

  // console.log(blocksData);

  return (
    <main className='container mx-auto py-6 space-y-8'>
      <section className='text-sm py-2 text-gray-500 flex flex-row justify-between items-end'>
        <div>
          Note that the JAM network is still under heavy development by the
          implementers, and the data on this site is not yet fully accurate, but
          still, it&apos;s our pleasure to share you the data of the testnet!
        </div>
        <div className='w-1/3 text-right'>
          powered by
          <Link
            href='https://spacejam.app'
            className='font-bold text-foreground text-pink-300'
          >
            {' '}
            SpaceJam
          </Link>
        </div>
      </section>

      <section>
        <SearchComponent />
      </section>

      <section className='flex gap-4'>
        <EpochCard current={stats.vals_current} />
        <NetworkCard
          network={{
            finalized: spacejamData?.spacejam.finalized,
            extrinsics: spacejamData?.spacejam.extrinsic,
            services: 42,
          }}
        />
        <HistoryCard blocks={blocks} />
      </section>

      <section>
        <ActiveCores />
      </section>

      <section className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <LatestBlocks />
        <TopServices services={services} />
      </section>
    </main>
  );
}
