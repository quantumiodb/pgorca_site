"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";
import type { ChartRow, Workload, WorkloadData } from "@/lib/benchmarks-types";
import { formatSpeedup } from "@/lib/benchmarks-types";
import { cn } from "@/lib/utils";

type Props = {
  workloads: Array<WorkloadData & { chartRows: ChartRow[] }>;
};

export function BenchmarksClient({ workloads }: Props) {
  const [active, setActive] = useState<Workload>(workloads[0].id);
  const data = useMemo(
    () => workloads.find((w) => w.id === active)!,
    [active, workloads],
  );

  // Cap visual width using log scale so a 254× bar doesn't dwarf a 20× bar.
  const maxLog = useMemo(
    () => Math.max(...data.chartRows.map((r) => Math.log10(Math.max(r.speedup, 1 / Math.max(r.speedup, 0.001))))),
    [data],
  );

  return (
    <section
      id="benchmarks"
      className="section border-t border-ink-200/60 bg-ink-50/40 dark:border-ink-800/60 dark:bg-ink-950/60"
    >
      <div className="container-narrow">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="h-eyebrow">Benchmarks</div>
            <h2 className="mt-3 h-section">Real workloads. Real numbers.</h2>
            <p className="mt-4 text-lg text-muted">
              ORCA&apos;s wins cluster on complex queries with correlated subqueries,
              multi-CTE joins, and 6+ way roll-ups — the cases PostgreSQL&apos;s planner
              treats heuristically.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Workload"
            className="inline-flex rounded-lg border border-ink-200 bg-white p-1 text-sm dark:border-ink-800 dark:bg-ink-900"
          >
            {workloads.map((w) => (
              <button
                key={w.id}
                role="tab"
                aria-selected={active === w.id}
                onClick={() => setActive(w.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 font-medium transition",
                  active === w.id
                    ? "bg-ink-900 text-white shadow-sm dark:bg-white dark:text-ink-900"
                    : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white",
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Bar chart */}
          <div className="rounded-2xl border border-ink-200/70 bg-white p-6 dark:border-ink-800 dark:bg-ink-900/40">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-mono uppercase tracking-[0.15em]">
                Speedup vs PostgreSQL 18 (×, log scale)
              </span>
              <span className="font-mono">par = 0</span>
            </div>

            <ul className="mt-6 space-y-3.5">
              {data.chartRows.map((row, i) => {
                const win = row.speedup >= 1;
                const magnitude = win ? row.speedup : 1 / Math.max(row.speedup, 0.001);
                // log-scale width
                const width = Math.min(100, (Math.log10(magnitude) / maxLog) * 100);
                const labelText = row.pgTimeout
                  ? `${row.pattern} · PG TIMEOUT`
                  : row.pattern;
                return (
                  <li
                    key={`${row.query}-${i}`}
                    className="grid grid-cols-[56px_1fr_94px] items-center gap-3"
                  >
                    <span className="font-mono text-sm font-semibold">{row.query}</span>
                    <div className="relative h-7 rounded bg-ink-100 dark:bg-ink-800/60">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 rounded transition-all",
                          win
                            ? "bg-gradient-to-r from-brand-500 to-accent-500"
                            : "bg-gradient-to-r from-rose-500/70 to-rose-400/70",
                        )}
                        style={{ width: `${Math.max(width, 5)}%` }}
                        title={labelText}
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[11px] font-mono text-white/95 [text-shadow:0_1px_2px_rgb(0_0_0_/_0.5)]">
                        {labelText}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "flex items-center justify-end gap-1 font-mono text-sm tabular-nums",
                        win
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400",
                      )}
                    >
                      {win ? (
                        <ArrowUpRight className="size-3.5" />
                      ) : (
                        <ArrowDownRight className="size-3.5" />
                      )}
                      {row.pgTimeout ? `≥${Math.round(row.speedup)}×` : formatSpeedup(row.speedup)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 flex items-start gap-2 border-t border-ink-200/60 pt-4 text-xs text-muted dark:border-ink-800">
              <Info className="size-3.5 mt-0.5 shrink-0" />
              Top 8 wins plus the largest regression. Bars use a log scale so 254× and
              20× both stay readable.{" "}
              {data.summary.pgTimeouts && data.summary.pgTimeouts > 0
                ? `"≥N×" rows are lower bounds where PG hit the 120s timeout.`
                : null}
            </p>
          </div>

          {/* Right: summary stats */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-ink-200/70 bg-gradient-to-br from-white to-brand-50/40 p-6 dark:border-ink-800 dark:from-ink-900 dark:to-brand-950/30">
              <div className="h-eyebrow">Overall</div>
              <p className="mt-3 text-base leading-relaxed text-ink-900 dark:text-ink-100">
                {data.totalSummary}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat label="geomean" value={`${data.summary.geomeanSpeedup.toFixed(2)}×`} />
                <Stat label="median" value={`${data.summary.medianSpeedup.toFixed(2)}×`} />
                <Stat label="ORCA wins >5%" value={`${data.summary.fasterCount}`} sub={`of ${data.summary.fasterCount + data.summary.slowerCount + 16}`} />
              </dl>
            </div>

            <div className="rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-50 to-emerald-100/40 p-6 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-emerald-900/20">
              <div className="h-eyebrow !text-emerald-600 dark:!text-emerald-400">
                Coverage edge
              </div>
              <p className="mt-3 text-base leading-relaxed text-ink-900 dark:text-ink-100">
                {data.edgeSummary}
              </p>
            </div>

            <div className="rounded-2xl border border-ink-200/70 bg-white p-6 text-sm text-muted dark:border-ink-800 dark:bg-ink-900/40">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">
                Methodology
              </p>
              <p className="mt-3">
                Single-node PG 18 vs same binary with{" "}
                <code className="font-mono text-ink-700 dark:text-ink-200">pg_orca</code>{" "}
                loaded (build <code className="font-mono">b17245d</code>, adaptive
                join-order downshift). 3-run median of EXPLAIN ANALYZE execution time.
                <br />
                <code className="font-mono">
                  max_parallel_workers_per_gather = 0 · statement_timeout = 120 s
                </code>
                . Generated 2026-05-27.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-ink-200/60 bg-white/60 p-2.5 dark:border-ink-800 dark:bg-ink-950/40">
      <div className="font-mono text-base font-bold tabular-nums text-ink-900 dark:text-ink-100">
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted">{label}</div>
      {sub && <div className="text-[10px] text-muted">{sub}</div>}
    </div>
  );
}
