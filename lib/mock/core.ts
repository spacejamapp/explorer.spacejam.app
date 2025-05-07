import { CoreActivityRecord } from "@/lib/types/statistic";

// Generate realistic random data for core activity
export function generateCoreActivityMock(coreId: number, count: number = 30): CoreActivityRecord[] {
  const records: CoreActivityRecord[] = [];

  for (let i = 0; i < count; i++) {
    // Generate realistic values with some random fluctuation
    records.push({
      gas_used: Math.floor(Math.random() * 5000) + 20000,
      imports: Math.floor(Math.random() * 50) + 10,
      extrinsic_count: Math.floor(Math.random() * 100) + 50,
      exports: Math.floor(Math.random() * 40) + 5,
      bundle_size: Math.floor(Math.random() * 500) + 100,
      da_load: Math.random() * 0.5 + 0.1, // 0.1 to 0.6 range
      popularity: Math.random() * 100 // 0 to 100 range
    });
  }

  return records;
}

// Get mock data for a specific core
export function getMockCoreActivity(coreId: number, count: number = 30): CoreActivityRecord[] {
  return generateCoreActivityMock(coreId, count);
}

// Get core details based on ID
export function getMockCoreDetails(coreId: number) {
  const coreTypes = ["Processing", "Consensus", "Storage", "Networking"];
  const statusOptions = ["Active", "Inactive", "Pending", "Maintenance"];
  
  return {
    id: coreId,
    name: `Core ${coreId}`,
    type: coreTypes[coreId % coreTypes.length],
    status: statusOptions[coreId % statusOptions.length],
    version: `v1.${Math.floor(coreId / 10)}.${coreId % 10}`,
  };
}

// Get a list of all active cores
export function getMockCoresList(count: number = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Core ${i + 1}`,
    type: ["Processing", "Consensus", "Storage", "Networking"][i % 4],
    status: i % 10 === 0 ? "Maintenance" : i % 15 === 0 ? "Inactive" : "Active", 
  }));
}
