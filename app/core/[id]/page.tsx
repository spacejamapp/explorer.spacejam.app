import React from "react";
import { getMockCoreActivity } from "@/lib/mock/core";
import CoreTabs from "./tabs";

interface PageProps {
  id: string;
}

export default async function CoreDetailsPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const { id } = await params;
  const coreId = parseInt(id, 10);
  const activityData = getMockCoreActivity(coreId, 30);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Core {coreId}</h1>
        </div>

        <CoreTabs coreId={coreId} activityData={activityData} />
      </div>
    </div>
  );
}
