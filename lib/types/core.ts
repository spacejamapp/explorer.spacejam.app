// Core activity record for tracking performance over epochs
export interface CoreActivityRecord {
  coreId: number;
  epoch: number;
  timestamp: string; // ISO string
  blocksProcessed: number;
  gasUsed: number;
  extrinsicsProcessed: number;
  successRate: number; // 0-1 representing percentage
  failedExtrinsics: number;
  averageBlockTime: number; // in seconds
  verificationLevel: number; // 1-3 representing verification tiers
  rewardPoints: number;
}

// Core details summary
export interface CoreDetails {
  id: number;
  name: string;
  type: string;
  status: string;
  version: string;
  uptime: number;
  totalRewards: number;
  stakingPoints: number;
  location: string;
  joinedAt: string; // ISO string
}

// Core summary for listings
export interface CoreSummary {
  id: number;
  name: string;
  type: string;
  status: string;
} 