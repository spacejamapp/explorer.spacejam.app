import { Service, ServiceData, ServiceItem } from '@/lib/types/service';

// Generate a random code hash
function generateCodeHash(): string {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Generate random preimage hashes
function generatePreimageHashes(count: number): string[] {
  return Array.from({ length: count }, () => generateCodeHash());
}

// Generate a list of mock services
export function getMockServices(count: number = 5): ServiceItem[] {
  const serviceItems: ServiceItem[] = [];

  for (let i = 0; i < count; i++) {
    const service: Service = {
      code: generateCodeHash(),
      balance: Math.floor(Math.random() * 1000000) + 10000, // 10,000 to 1,010,000 JAM
      gas: Math.floor(Math.random() * 5000000) + 100000, // 100,000 to 5,100,000 gas units
      total: Math.floor(Math.random() * 1024 * 1024 * 10) + 1024 * 100, // 100KB to 10.1MB
      items: Math.floor(Math.random() * 500) + 50, // 50 to 550 items
    };

    const serviceData: ServiceData = {
      service,
      preimages: generatePreimageHashes(Math.floor(Math.random() * 3) + 1), // 1-3 preimages
    };

    serviceItems.push({
      service: i + 1, // Service ID
      data: serviceData,
    });
  }

  // Sort by balance (highest first)
  return serviceItems.sort(
    (a, b) => b.data.service.balance - a.data.service.balance
  );
}
