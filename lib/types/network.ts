export interface Network {
  // The number of extrinsics in total.
  extrinsics: number;
  // The latest finalized slot
  finalized: number;
  // The number of services in total.
  services: number;
}

export interface Validator {
  bandersnatch: number;
  node: string;
  ip: string;
  name?: string;
  pfp?: string;
  website?: string;
}
