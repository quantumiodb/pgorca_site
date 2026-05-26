// Speedups derived from TODO.md (commit 29fc891, 2026-05-19) — pg_orca vs PG 18 at par=0.
// Replace with full CSV when available.

export type Workload = "tpch-sf10" | "tpcds-sf5" | "tpcds-sf1";

export interface BenchmarkRow {
  query: string;
  speedup: number; // ratio: PG_time / ORCA_time. Values > 1 = ORCA wins.
  pattern: string;
  note?: string;
}

export interface WorkloadData {
  id: Workload;
  label: string;
  totalSummary: string;
  edgeSummary: string;
  rows: BenchmarkRow[];
}

export const workloads: WorkloadData[] = [
  {
    id: "tpcds-sf5",
    label: "TPC-DS · sf=5",
    totalSummary:
      "ORCA 1,458 s vs PG 1,492 s on the 90 queries both finished (par=0).",
    edgeSummary:
      "ORCA also completed 9 / 99 queries that PG timed out at 120 s — Q1, Q4, Q6, Q11, Q14, Q30, Q74, Q81, Q95.",
    rows: [
      { query: "Q41", speedup: 156, pattern: "correlated IN + EXISTS" },
      { query: "Q25", speedup: 9.0, pattern: "6-way roll-up join" },
      { query: "Q29", speedup: 7.0, pattern: "6-way roll-up join" },
      { query: "Q21", speedup: 7.3, pattern: "correlated min/max with HAVING" },
      { query: "Q17", speedup: 7.3, pattern: "correlated aggregate" },
      { query: "Q31", speedup: 5.8, pattern: "multi-CTE self-join" },
      { query: "Q39", speedup: 5.8, pattern: "multi-CTE self-join" },
      { query: "Q55", speedup: 4.9, pattern: "star join + aggregate" },
      { query: "Q82", speedup: 0.18, pattern: "short query — planning overhead" },
      { query: "Q61", speedup: 0.001, pattern: "trivial query (1.27 s vs 0.6 ms)" },
    ],
  },
  {
    id: "tpch-sf10",
    label: "TPC-H · sf=10",
    totalSummary: "ORCA 637 s vs PG 658 s — 1.12× geomean at par=0.",
    edgeSummary:
      "Wins concentrated on correlated-subquery and bushy-join queries; smaller queries are close to parity.",
    rows: [
      { query: "Q17", speedup: 20.7, pattern: "correlated aggregate (l_quantity < 0.2 × AVG)" },
      { query: "Q4", speedup: 2.55, pattern: "join + correlated EXISTS, anti-semi" },
      { query: "Q10", speedup: 1.71, pattern: "4-way join + ORDER BY LIMIT" },
      { query: "Q21", speedup: 1.26, pattern: "4-way join + NOT EXISTS" },
      { query: "Q5", speedup: 0.62, pattern: "missing equijoin implied predicate (known)" },
    ],
  },
  {
    id: "tpcds-sf1",
    label: "TPC-DS · sf=1",
    totalSummary:
      "ORCA 627 s vs PG 513 s on the 94 common queries — ORCA 1.22× slower in raw sum.",
    edgeSummary:
      "ORCA completes 5 / 99 PG-timeout queries (Q1, Q4, Q6, Q11, Q74). Counting the 120 s timeout floor → ORCA ≥ 1.77× faster overall.",
    rows: [
      { query: "Q41", speedup: 95, pattern: "correlated IN + EXISTS" },
      { query: "Q17", speedup: 6.4, pattern: "correlated aggregate" },
      { query: "Q21", speedup: 5.8, pattern: "correlated min/max" },
      { query: "Q31", speedup: 4.3, pattern: "multi-CTE self-join" },
      { query: "Q25", speedup: 3.9, pattern: "6-way join" },
    ],
  },
];
