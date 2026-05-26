import { workloads, getChartRows } from "@/lib/benchmarks";
import type { ChartRow, WorkloadData } from "@/lib/benchmarks-types";
import { BenchmarksClient } from "./benchmarks-client";

export function Benchmarks() {
  // Build server-side: read CSVs, compute chart rows, hand off to client component.
  const data: Array<WorkloadData & { chartRows: ChartRow[] }> = workloads.map(
    (w) => ({ ...w, chartRows: getChartRows(w) }),
  );

  return <BenchmarksClient workloads={data} />;
}
