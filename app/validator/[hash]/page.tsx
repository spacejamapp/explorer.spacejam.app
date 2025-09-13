import React from 'react';
import { notFound } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getValidatorPageData, type ValidatorDataResult } from '@/lib/validator-utils';
import { NoDataError } from '@/components/ui/no-data';

import ValidatorTabs from './tabs';
import ToastHandler from './toast-handler';

interface PageProps {
  hash: string;
}

export default async function ValidatorDetailsPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const hashParam = (await params).hash;
  
  // Try to parse as numeric index first (backward compatibility)
  const validatorIndex = parseInt(hashParam, 10);
  
  // If it's not a valid number, treat it as an ed25519 string
  if (isNaN(validatorIndex) || validatorIndex < 0) {
    // For now, we'll still need the numeric ID to fetch validator data
    // TODO: Update API to support fetching by ed25519 string
    notFound();
  }

  // Fetch and transform validator data using dedicated utility function
  const result: ValidatorDataResult = await getValidatorPageData(validatorIndex);

  if (!result.success) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Validator {validatorIndex}</h1>
          </div>
          
          <NoDataError
            title={`No data available for Validator ${validatorIndex}`}
            description={result.error}
          />
          <ToastHandler error={result.error} />
        </div>
      </div>
    );
  }

  const { activityData, validatorDisplay, totalBlocks, totalTickets, totalEpochs } = result;

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
                  {totalEpochs} Epoch{totalEpochs !== 1 ? 's' : ''}
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
            <div className="text-sm px-3 py-1 rounded-md bg-muted">
              <span className="font-medium">Total Epochs:</span>{' '}
              {totalEpochs.toLocaleString()}
            </div>
          </div>
        </div>

        <ValidatorTabs validator={validatorDisplay} activityData={activityData} />
      </div>
    </div>
  );
}
