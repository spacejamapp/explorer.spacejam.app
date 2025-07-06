// The home page of the SpaceJam project.
import Link from 'next/link';

import EpochCard from '@/components/card/epoch';
import HistoryCard from '@/components/card/history';
import NetworkCard from '@/components/card/network';
import ActiveCores from '@/components/dashboard/active-cores';
import LatestBlocks from '@/components/dashboard/latest-blocks';
import TopServices from '@/components/dashboard/top-services';
import SearchComponent from '@/components/search';
import {
  fetchBlocks,
  fetchEpoch,
  fetchServices,
  fetchSpacejam,
} from '@/lib/graphql';
import { Spacejam } from '@/types/graphql';

export default async function Home() {
  const { services } = await fetchServices(5);
  const { headers } = await fetchBlocks(21);
  const { spacejam } = (await fetchSpacejam()) as { spacejam: Spacejam };
  const currentEpoch = spacejam.epoch;

  let vals_current;
  if (currentEpoch === 0) {
    vals_current = [
      {
        blocks: 0,
        tickets: 0,
        preimages: 0,
        preimages_size: 0,
        guarantees: 0,
        assurances: 0,
      },
    ];
  } else {
    const { epoch } = await fetchEpoch(currentEpoch);
    vals_current = epoch
      ? epoch.validators.nodes.map((val) => ({
          blocks: val.blocks,
          tickets: val.tickets,
          preimages: val.preimages,
          preimages_size: 0, // or use actual value if available
          guarantees: val.guarantees,
          assurances: val.assurances,
        }))
      : [
          {
            blocks: 0,
            tickets: 0,
            preimages: 0,
            preimages_size: 0,
            guarantees: 0,
            assurances: 0,
          },
        ];
  }

  return (
    <main className="container mx-auto py-6 space-y-8">
      <section className="text-sm py-2 text-gray-500 flex flex-row justify-between items-end">
        <div>
          Note that the JAM network is still under heavy development by the
          implementers, and the data on this site is not yet fully accurate, but
          still, it&apos;s our pleasure to share you the data of the testnet!
        </div>
        <div className="w-1/3 text-right">
          powered by
          <Link
            href="https://spacejam.app"
            className="font-bold text-foreground text-pink-300"
          >
            {' '}
            SpaceJam
          </Link>
        </div>
      </section>

      <section>
        <SearchComponent />
      </section>

      <section className="flex gap-4">
        <EpochCard current={vals_current} epochNumber={currentEpoch} />
        <NetworkCard spacejam={spacejam} />
        <HistoryCard headers={headers.nodes} />
      </section>

      <section>
        <ActiveCores />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LatestBlocks />
        <TopServices services={services.nodes} />
      </section>
    </main>
  );
}
