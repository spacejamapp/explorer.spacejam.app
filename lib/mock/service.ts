import { Service } from "@/lib/types/service";

// Generate a random code hash
function generateCodeHash(): string {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

// Generate a list of mock services
export function getMockServices(count: number = 5): Service[] {
  const services: Service[] = [];

  for (let i = 0; i < count; i++) {
    services.push({
      code: generateCodeHash(),
      balance: Math.floor(Math.random() * 1000000) + 10000, // 10,000 to 1,010,000 JAM
      gas: Math.floor(Math.random() * 5000000) + 100000, // 100,000 to 5,100,000 gas units
      total: Math.floor(Math.random() * 1024 * 1024 * 10) + 1024 * 100, // 100KB to 10.1MB
      items: Math.floor(Math.random() * 500) + 50, // 50 to 550 items
    });
  }

  // Sort by balance (highest first)
  return services.sort((a, b) => b.balance - a.balance);
} 