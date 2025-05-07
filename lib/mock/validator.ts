import { Validator } from "../types/network";

// Sample coordinates for validators
export const validatorCoordinates: Record<number, [number, number]> = {
    1: [-122.4194, 37.7749], // San Francisco
    2: [-87.6298, 41.8781], // Chicago
    3: [-74.006, 40.7128], // New York
    4: [-0.1278, 51.5074], // London
    5: [2.3522, 48.8566], // Paris
    6: [13.405, 52.52], // Berlin
    7: [37.6173, 55.7558], // Moscow
    8: [139.6917, 35.6895], // Tokyo
    9: [151.2093, -33.8688], // Sydney
    10: [-118.2437, 34.0522], // Los Angeles
    11: [116.4074, 39.9042], // Beijing
    12: [77.209, 28.6139], // New Delhi
  };
  
  // Mock validators conforming to the Validator interface
export const mockValidators: Validator[] = Array.from({ length: 12 }, (_, i) => ({
    bandersnatch: i + 1,
    node: `node-${i + 1}.network.io`,
    ip: `192.168.1.${i + 10}`,
    name: `Validator ${i + 1}`,
    pfp:
      i % 3 === 0
        ? `https://avatars.githubusercontent.com/u/${10000 + i}`
        : undefined,
    website: i % 2 === 0 ? `https://validator-${i + 1}.network.io` : undefined,
  }));