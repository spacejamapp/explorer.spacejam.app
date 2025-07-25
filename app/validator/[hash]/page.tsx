import React from 'react';

import { notFound } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { fetchValidator, fetchEpoch, fetchSpacejam } from '@/lib/graphql';

import ValidatorTabs from './tabs';

interface PageProps {
  hash: string;
}

export default async function ValidatorDetailsPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const validatorIndex = parseInt((await params).hash, 10);

  try {
    // Try to fetch validator data from GraphQL API
    let validatorData = null;
    let activityData = [];
    let totalBlocks = 0;
    let totalTickets = 0;
    let validatorDisplay;

    try {
      const { validator } = await fetchValidator(validatorIndex, 50);
      validatorData = validator;
    } catch {
      console.warn('Validator API not available, trying epoch fallback');
    }

    if (validatorData) {
      // Use direct validator API data
      activityData = validatorData.epochs.nodes.map((epoch, index) => ({
        blocks: epoch.blocks,
        tickets: epoch.tickets,
        preimages: epoch.preimages,
        preimages_size: 0,
        guarantees: epoch.guarantees,
        assurances: epoch.assurances,
        epoch: epoch.epoch.id,
        index: index + 1,
      }));

      totalBlocks = validatorData.epochs.nodes.reduce((sum, epoch) => sum + epoch.blocks, 0);
      totalTickets = validatorData.epochs.nodes.reduce((sum, epoch) => sum + epoch.tickets, 0);

      validatorDisplay = {
        bandersnatch: validatorIndex,
        node: `validator-${validatorIndex}.jam.network`,
        ip: validatorData.ip || 'N/A',
        name: `Validator ${validatorIndex}`,
        pfp: undefined,
        website: validatorData.website,
      };
    } else {
      // Fallback: try to find validator in current epoch
      const { spacejam } = await fetchSpacejam();
      const currentEpoch = spacejam.epoch;
      
      try {
        const result = await fetchEpoch(currentEpoch);
        const epoch = result.epoch;
        
        // Look for the validator in current epoch by vindex
        const validatorInEpoch = epoch?.validators.nodes.find(
          (v) => v.vindex === validatorIndex
        );
        
        if (!validatorInEpoch) {
          notFound();
        }

        // Create activity data from epoch data
        activityData = [{
          blocks: validatorInEpoch.blocks,
          tickets: validatorInEpoch.tickets,
          preimages: validatorInEpoch.preimages,
          preimages_size: 0,
          guarantees: validatorInEpoch.guarantees,
          assurances: validatorInEpoch.assurances,
          epoch: currentEpoch,
          index: 1,
        }];

        totalBlocks = validatorInEpoch.blocks;
        totalTickets = validatorInEpoch.tickets;

        validatorDisplay = {
          bandersnatch: validatorIndex,
          node: `validator-${validatorIndex}.jam.network`,
          ip: 'N/A',
          name: `Validator ${validatorIndex}`,
          pfp: undefined,
          website: undefined,
        };
      } catch {
        console.error('Failed to fetch epoch data');
        notFound();
      }
    }

    // Get validator initials for the avatar fallback
    const getInitials = () => {
      return `V${validatorIndex}`;
    };

    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex gap-4 items-center">
              <Avatar className="h-20 w-20">
                {validatorDisplay.pfp ? (
                  <AvatarImage
                    src={validatorDisplay.pfp}
                    alt={validatorDisplay.name || `Validator ${validatorIndex}`}
                  />
                ) : null}
                <AvatarFallback className="text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {validatorDisplay.name || `Validator ${validatorIndex}`}
                </h1>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Index: {validatorDisplay.bandersnatch}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {activityData.length} Epoch{activityData.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <div className="text-sm px-3 py-1 rounded-md bg-muted">
                <span className="font-medium">Total Blocks:</span>{' '}
                {totalBlocks.toLocaleString()}
              </div>
              <div className="text-sm px-3 py-1 rounded-md bg-muted">
                <span className="font-medium">Total Tickets:</span>{' '}
                {totalTickets.toLocaleString()}
              </div>
            </div>
          </div>

          <ValidatorTabs validator={validatorDisplay} activityData={activityData} />
        </div>
      </div>
    );
  } catch {
    console.error('Error fetching validator data');
    notFound();
  }
}
