/*
 * work related types
 */

export interface WorkReport {
  spec: WorkPackageSpec;
  context: RefineContext;
  core_index: number;
  authorizer_hash: string;
  auth_output: string;
}

export interface WorkPackageSpec {
  hash: string;
  length: number;
  erasure_root: string;
  exports_root: string;
  exports_count: number;
}

export interface RefineContext {
  anchor: string;
  state_root: string;
  beefy_root: string;
  loookup_anchor: string;
  lookup_anchor_slot: number;
  prerequisites: string[];
  authorizer_hash: string;
  auth_output: string;
  lookup: ReportedWorkPackage[];
  results: WorkResult[];
  auth_gas_used: number;
}

export interface ReportedWorkPackage {
  hash: string;
  exports_root: string;
}

export interface WorkResult {
  service_id: number;
  code_hash: string;
  payload_hash: string;
  accumulate_gas: number;
  result: WorkExecResult;
  refine_load: RefineLoad;
}

export interface RefineLoad {
  gas_used: number;
  imports: number[];
  extrinsic_count: number;
  extrinsic_size: number;
  exports: number;
}

export type WorkExecResult =
  | { ok: string }
  | 'out_of_gas'
  | 'panic'
  | 'bad_code'
  | 'code_oversize';
