import React from "react";
import { notFound } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getMockValidatorActivity } from "@/lib/mock/validator-activity";
import { mockValidators } from "@/lib/mock/validator";
import ValidatorTabs from "./tabs";

interface PageProps {
  hash: string;
}

export default async function ValidatorDetailsPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const validatorHash = parseInt((await params).hash, 10);

  // Find the validator in our mock data
  const validator = mockValidators.find(
    (v) => v.bandersnatch === validatorHash
  );

  // If validator not found, show 404
  if (!validator) {
    notFound();
  }

  // Get activity data for this validator
  const activityData = getMockValidatorActivity(validatorHash, 30);

  // Get validator initials for the avatar fallback
  const getInitials = () => {
    if (validator.name) {
      return validator.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    }
    return `V${validatorHash}`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex gap-4 items-center">
            <Avatar className="h-20 w-20">
              {validator.pfp ? (
                <AvatarImage
                  src={validator.pfp}
                  alt={validator.name || `Validator ${validatorHash}`}
                />
              ) : null}
              <AvatarFallback className="text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {validator.name || `Validator ${validatorHash}`}
              </h1>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Hash: {validator.bandersnatch}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            <div className="text-sm px-3 py-1 rounded-md bg-muted">
              <span className="font-medium">Produced:</span>{" "}
              {activityData.reduce((sum, record) => sum + record.blocks, 0)}{" "}
              blocks
            </div>
            <div className="text-sm px-3 py-1 rounded-md bg-muted">
              <span className="font-medium">Processed:</span>{" "}
              {activityData.reduce((sum, record) => sum + record.tickets, 0)}{" "}
              tickets
            </div>
          </div>
        </div>

        <ValidatorTabs validator={validator} activityData={activityData} />
      </div>
    </div>
  );
}
