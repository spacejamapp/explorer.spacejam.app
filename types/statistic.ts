/**
 * Represents a statistic with a value and a label.
 */

export interface ActivityRecord {
  id?: number;
  blocks: number;
  tickets: number;
  preimages: number;
  preimages_size: number;
  guarantees: number;
  assurances: number;
}

export interface CoreActivityRecord {
  gas_used: number;
  imports: number;
  extrinsic_count: number;
  exports: number;
  bundle_size: number;
  da_load: number;
  popularity: number;
}

export interface Statistics {
  vals_current: ActivityRecord[];
  vals_latest: ActivityRecord[];
  cores: CoreActivityRecord[];
}
