// Types + pure helpers — safe to import from both server and client components.

export type Workload = "tpch-sf10" | "tpch-sf5" | "tpcds-sf1";

export interface BenchmarkRow {
  query: string;
  speedup: number;
  pgTimeout?: boolean;
  orcaMs: number;
  pgMs: number | null;
}

export interface WorkloadSummary {
  totalOrcaS: number;
  totalPgS: number;
  geomeanSpeedup: number;
  medianSpeedup: number;
  fasterCount: number;
  slowerCount: number;
  fallbacks: number;
  pgTimeouts?: number;
  pgTotalLowerBoundS?: number;
}

export interface ChartRow extends BenchmarkRow {
  pattern: string;
}

export interface WorkloadData {
  id: Workload;
  label: string;
  rows: BenchmarkRow[];
  topWins: BenchmarkRow[];
  summary: WorkloadSummary;
  totalSummary: string;
  edgeSummary: string;
}

export function formatSpeedup(s: number): string {
  if (s >= 100) return `${Math.round(s)}×`;
  if (s >= 10) return `${s.toFixed(1)}×`;
  if (s >= 1) return `${s.toFixed(2)}×`;
  return `${s.toFixed(2)}×`;
}
