"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";
import { workloads, type Workload } from "@/lib/benchmarks";
import { cn } from "@/lib/utils";

export function Benchmarks() {
  const [active, setActive] = useState<Workload>("tpcds-sf5");
  const data = useMemo(
    () => workloads.find((w) => w.id === active)!,
    [active],
  );

  const maxSpeedup = useMemo(
    () => Math.max(...data.rows.map((r) => Math.max(r.speedup, 1 / r.speedup))),
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
                Speedup vs PostgreSQL 18 (×)
              </span>
              <span className="font-mono">par = 0</span>
            </div>

            <ul className="mt-6 space-y-4">
              {data.rows.map((row) => {
                const win = row.speedup >= 1;
                const magnitude = win ? row.speedup : 1 / row.speedup;
                const width = Math.min(100, (magnitude / maxSpeedup) * 100);
                return (
                  <li key={row.query} className="grid grid-cols-[56px_1fr_84px] items-center gap-3">
                    <span className="font-mono text-sm font-semibold">{row.query}</span>
                    <div className="relative h-6 rounded bg-ink-100 dark:bg-ink-800/60">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 rounded transition-all",
                          win
                            ? "bg-gradient-to-r from-brand-500 to-accent-500"
                            : "bg-gradient-to-r from-rose-500/70 to-rose-400/70",
                        )}
                        style={{ width: `${width}%` }}
                        title={row.pattern}
                      />
                      <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-mono text-white/90 mix-blend-luminosity">
                        {row.pattern}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "flex items-center justify-end gap-1 font-mono text-sm tabular-nums",
                        win ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                      )}
                    >
                      {win ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                      {win
                        ? `${row.speedup.toFixed(row.speedup >= 10 ? 0 : 1)}×`
                        : `0.${Math.round(row.speedup * 100)
                            .toString()
                            .padStart(2, "0")}×`}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 flex items-start gap-2 border-t border-ink-200/60 pt-4 text-xs text-muted dark:border-ink-800">
              <Info className="size-3.5 mt-0.5 shrink-0" />
              Geometric / arithmetic means in the summary at right include all queries
              (wins and losses). Bar chart shows top wins and a representative loss.
            </p>
          </div>

          {/* Right: summary stats */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-ink-200/70 bg-gradient-to-br from-white to-brand-50/40 p-6 dark:border-ink-800 dark:from-ink-900 dark:to-brand-950/30">
              <div className="h-eyebrow">Overall</div>
              <p className="mt-3 text-base leading-relaxed text-ink-900 dark:text-ink-100">
                {data.totalSummary}
              </p>
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
                Single-node PG 18 (commit 8a431b6d) vs same binary with{" "}
                <code className="font-mono text-ink-700 dark:text-ink-200">pg_orca</code>
                {" "}loaded. Same hardware, same shared_buffers, warm OS cache.
                statement_timeout = 120 s. Numbers from pg_orca repo, branch{" "}
                <code className="font-mono">main</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
