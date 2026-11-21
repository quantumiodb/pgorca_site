"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";

// Real EXPLAIN (ANALYZE, BUFFERS) output for TPC-H Q17 at SF=1, taken from the
// Q17 walkthrough post. `mark` flags the lines that explain the difference.
type PlanLine = { text: string; mark?: "bad" | "good" };

const plans: Record<
  "pg" | "orca",
  { tab: string; setting: string; lines: PlanLine[]; note: string }
> = {
  pg: {
    tab: "PostgreSQL 18 planner",
    setting: "off",
    lines: [
      { text: "Aggregate  (actual rows=1.00 loops=1)" },
      { text: "  Buffers: shared hit=237809 read=69794" },
      { text: "  -> Hash Join  (actual rows=587.00 loops=1)" },
      { text: "       Hash Cond: (lineitem.l_partkey = part.p_partkey)" },
      { text: "       Join Filter: (lineitem.l_quantity < (SubPlan 1))" },
      { text: "       -> Seq Scan on lineitem  (actual rows=6001215.00 loops=1)" },
      { text: "       -> Hash  (actual rows=204.00 loops=1)" },
      { text: "            -> Seq Scan on part" },
      { text: "       SubPlan 1", mark: "bad" },
      { text: "         -> Aggregate  (actual rows=1.00 loops=6088)", mark: "bad" },
      { text: "              -> Bitmap Heap Scan on lineitem lineitem_1" },
      { text: "                   -> Bitmap Index Scan on lineitem_partkey_idx" },
      { text: "Planning Time: 1.303 ms" },
      { text: "Execution Time: 1731.993 ms", mark: "bad" },
    ],
    note: "The correlated subquery stays a SubPlan and runs 6,088 times.",
  },
  orca: {
    tab: "pg_orca",
    setting: "on",
    lines: [
      { text: "Aggregate  (actual rows=1.00 loops=1)" },
      { text: "  Buffers: shared hit=17118" },
      { text: "  -> Nested Loop  (actual rows=587.00 loops=1)" },
      { text: "       -> Nested Loop Left Join  (actual rows=204.00 loops=1)" },
      { text: "            -> Seq Scan on part" },
      { text: "            -> HashAggregate  (actual rows=1.00 loops=204)", mark: "good" },
      { text: "                 Group Key: lineitem.l_partkey", mark: "good" },
      { text: "                 -> Index Scan using lineitem_partkey_idx on lineitem" },
      { text: "       -> Index Scan using lineitem_partkey_idx on lineitem lineitem_1" },
      { text: "            Filter: (l_quantity < ((0.2 * (avg(lineitem.l_quantity)))))" },
      { text: "Planning Time: 89.008 ms" },
      { text: "Optimizer: pg_orca", mark: "good" },
      { text: "Execution Time: 70.792 ms", mark: "good" },
    ],
    note: "The subquery is rewritten into a join against a grouped aggregate.",
  },
};

const speedups = [
  { suite: "TPC-DS", query: "Q1", pattern: "ORCA 0.5 s vs PG timeout (120 s)", speedup: "≥254×" },
  { suite: "TPC-DS", query: "Q30", pattern: "correlated aggregate", speedup: "107×" },
  { suite: "TPC-DS", query: "Q81", pattern: "correlated subquery", speedup: "77×" },
  { suite: "TPC-DS", query: "Q41", pattern: "correlated IN + EXISTS", speedup: "37×" },
  { suite: "TPC-H", query: "Q17", pattern: "l_quantity < 0.2 × AVG (correlated)", speedup: "21×" },
];

export function Hero() {
  const [active, setActive] = useState<"pg" | "orca">("orca");
  const plan = plans[active];

  return (
    <section className="border-b border-ink-200 bg-ink-50 pt-14 pb-16 dark:border-ink-800 dark:bg-ink-950 sm:pt-20 sm:pb-20">
      <div className="container-narrow grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div className="min-w-0">
          <h1 className="h-display">
            Plug ORCA into PostgreSQL 18 &amp; 19.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            <strong className="text-ink-900 dark:text-ink-100">pg_orca</strong> is a
            PostgreSQL 18 &amp; 19 extension that swaps in the ORCA cost-based query
            optimizer from Greenplum / Apache Cloudberry — exhaustive join enumeration,
            correlated subquery decorrelation, and dynamic partition pruning. Installed
            with a single{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[0.9em] text-brand-600 ring-1 ring-ink-200 dark:bg-ink-800 dark:text-brand-300 dark:ring-ink-700">
              CREATE EXTENSION
            </code>
            .
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#install"
              className="inline-flex items-center rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 dark:bg-brand-400 dark:text-ink-950 dark:hover:bg-brand-300"
            >
              Install pg_orca
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-ink-300 bg-white px-5 py-2.5 text-sm font-medium text-ink-900 transition hover:border-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:hover:border-brand-400"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>

          <ul className="mt-8 space-y-1.5 text-sm text-muted">
            <li>MIT-style license</li>
            <li>PostgreSQL 18 &amp; 19, macOS &amp; Linux</li>
            <li>Falls back to the standard planner on unsupported queries</li>
          </ul>
        </div>

        {/* psql session: the same TPC-H Q17 under both optimizers */}
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-ink-800 bg-[#0f2233] text-ink-100">
            <div role="tablist" aria-label="Optimizer" className="flex border-b border-white/10 font-mono text-xs">
              {(["pg", "orca"] as const).map((id) => (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={active === id}
                  onClick={() => setActive(id)}
                  className={`px-4 py-2.5 transition-colors ${
                    active === id
                      ? "bg-brand-500 text-white"
                      : "text-ink-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {plans[id].tab}
                </button>
              ))}
            </div>

            <pre
              role="tabpanel"
              tabIndex={0}
              className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.65] sm:text-[12.5px]"
            >
              <code>
                <span className="text-brand-300">tpch=# </span>
                SET pg_orca.enable_orca = {plan.setting};{"\n"}
                <span className="text-brand-300">tpch=# </span>
                EXPLAIN (ANALYZE, BUFFERS) /* TPC-H Q17, SF=1 */ ...;{"\n"}
                {plan.lines.map((l) => (
                  <span
                    key={l.text}
                    className={
                      l.mark === "bad"
                        ? "text-rose-300"
                        : l.mark === "good"
                          ? "text-emerald-300"
                          : "text-ink-300"
                    }
                  >
                    {l.text}
                    {"\n"}
                  </span>
                ))}
              </code>
            </pre>

            <p className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-ink-300">
              {plan.note}{" "}
              <Link
                href="/blog/tpch-q17-decorrelation-walkthrough"
                className="text-brand-300 underline underline-offset-2 hover:text-white"
              >
                Read the Q17 walkthrough
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Headline speedups, laid out like a psql result set */}
      <div className="container-narrow mt-14">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] font-mono text-sm">
            <caption className="caption-bottom pt-2 text-left text-xs text-muted">
              ({speedups.length} rows) Single-node PG 18 vs pg_orca at par=0. See{" "}
              <a href="#benchmarks" className="text-brand-600 underline underline-offset-2 dark:text-brand-300">
                benchmarks
              </a>{" "}
              for methodology.
            </caption>
            <thead>
              <tr className="border-b border-dashed border-ink-400 text-left text-ink-500 dark:border-ink-600 dark:text-ink-400">
                <th className="py-2 pr-4 font-medium">suite</th>
                <th className="border-l border-ink-300 px-4 py-2 font-medium dark:border-ink-700">query</th>
                <th className="border-l border-ink-300 px-4 py-2 text-right font-medium dark:border-ink-700">speedup</th>
                <th className="border-l border-ink-300 px-4 py-2 font-medium dark:border-ink-700">pattern</th>
              </tr>
            </thead>
            <tbody>
              {speedups.map((s) => (
                <tr key={s.query}>
                  <td className="whitespace-nowrap py-1.5 pr-4">{s.suite}</td>
                  <td className="border-l border-ink-300 px-4 py-1.5 dark:border-ink-700">{s.query}</td>
                  <td className="border-l border-ink-300 whitespace-nowrap px-4 py-1.5 text-right font-semibold text-brand-600 dark:border-ink-700 dark:text-brand-300">
                    {s.speedup}
                  </td>
                  <td className="border-l border-ink-300 px-4 py-1.5 text-muted dark:border-ink-700">{s.pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
