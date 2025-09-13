export interface Spacejam {
  // The number of extrinsics in total.
  extrinsics: number;
  // The latest finalized slot
  finalized: number;
  // The number of services in total.
  blocks: number;
}

export interface NetworkValidator {
  bandersnatch: number;
  node: string;
  ip: string;
  name?: string;
  pfp?: string;
  website?: string;
}
