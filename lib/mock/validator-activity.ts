import { ActivityRecord } from '@/lib/types/statistic';

// Generate realistic random data for validator activity
export function generateValidatorActivityMock(
  validatorHash: number,
  count: number = 30
): ActivityRecord[] {
  const records: ActivityRecord[] = [];

  for (let i = 0; i < count; i++) {
    // Generate realistic values with some random fluctuation
    records.push({
      blocks: Math.floor(Math.random() * 30) + 5,
      tickets: Math.floor(Math.random() * 200) + 50,
      preimages: Math.floor(Math.random() * 50) + 10,
      preimages_size: Math.floor(Math.random() * 1024 * 1024 * 5) + 1024 * 500, // 500KB to 5.5MB
      guarantees: Math.floor(Math.random() * 40) + 10,
      assurances: Math.floor(Math.random() * 35) + 5,
    });
  }

  return records;
}

// Get mock data for a specific validator
export function getMockValidatorActivity(
  validatorHash: number,
  count: number = 30
): ActivityRecord[] {
  return generateValidatorActivityMock(validatorHash, count);
}

// Get detailed validator information
export function getMockValidatorDetails(validatorHash: number) {
  // In a real application, this would fetch from an API
  return {
    id: validatorHash,
    uptime: Math.random() * 10 + 90, // 90-100% uptime
    stake: Math.floor(Math.random() * 1000000) + 100000, // 100k to 1.1M staked
    commission: Math.random() * 10, // 0-10% commission
    delegators: Math.floor(Math.random() * 100) + 10, // 10-110 delegators
  };
}
