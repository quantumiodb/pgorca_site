import { Database, GitMerge, LineChart, Network } from "lucide-react";

const features = [
  {
    icon: GitMerge,
    title: "Correlated subquery decorrelation",
    tag: "ORCA's signature capability",
    body: "ORCA's CXformApply2Join family algebraically rewrites Apply into a regular Join — so correlated subqueries become a single optimizable plan instead of a per-row SubPlan.",
    example: {
      query: "TPC-H Q17",
      detail: "l_quantity < 0.2 × AVG(l_quantity) WHERE l_partkey = p_partkey",
      speedup: "20.7×",
    },
  },
  {
    icon: Network,
    title: "Exhaustive join-order enumeration (DPv2)",
    tag: "Bushy plans, cost-driven",
    body: "CJoinOrderDPv2 + commutativity / associativity xforms enumerate the full join space under ORCA's own cardinality model — bushy and left-deep alike. PG's GEQO is a fallback above 12 relations; this is dynamic programming all the way through.",
    example: {
      query: "TPC-DS Q25",
      detail: "6-way roll-up join across store_sales × store_returns × catalog_sales × …",
      speedup: "9.0×",
    },
  },
  {
    icon: LineChart,
    title: "Robust statistics propagation",
    tag: "Stats survive GROUP BY / CTE",
    body: "CGroupByStatsProcessor preserves the full input histogram (NDV included) on grouping columns. CTE consumers inherit stats via colid mapping — so downstream joins still see real cardinalities, not defaults.",
    example: {
      query: "TPC-DS Q31",
      detail: "2 CTEs, 6-way self-join with stadistinct preserved across grouping",
      speedup: "5.8×",
    },
  },
  {
    icon: Database,
    title: "Partitioned tables",
    tag: "Dynamic partition pruning",
    body: "DXL's PartitionSelector is wired through pg_orca's translation layer end-to-end. Partition pruning happens at optimization time and at runtime, on the same plan ORCA generates for non-partitioned scans.",
    example: {
      query: "DDL",
      detail: "PARTITION BY RANGE / LIST / HASH — all selector types supported",
      speedup: "✓",
    },
  },
];

export function Features() {
  return (
    <section id="features" className="section border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="h-eyebrow">Features</div>
          <h2 className="mt-3 h-section">What ORCA does that the PG planner doesn&apos;t.</h2>
          <p className="mt-4 text-lg text-muted">
            Four structural plan-shape capabilities — not micro-optimizations.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-7 transition hover:border-brand-300 hover:shadow-lg dark:border-ink-800 dark:bg-ink-900/40 dark:hover:border-brand-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 place-items-center rounded-lg bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-400">
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full border border-accent-300/60 bg-accent-50 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent-700 dark:border-accent-700/40 dark:bg-accent-950/30 dark:text-accent-300">
                    {f.tag}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold leading-snug">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>

                <div className="mt-6 flex items-center justify-between rounded-lg border border-ink-200/60 bg-ink-50/60 p-3 dark:border-ink-800 dark:bg-ink-950/60">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-ink-500 dark:text-ink-400">
                      {f.example.query}
                    </div>
                    <div className="truncate text-xs text-ink-700 dark:text-ink-300">
                      {f.example.detail}
                    </div>
                  </div>
                  <div className="ml-3 shrink-0 font-mono text-lg font-bold gradient-text">
                    {f.example.speedup}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
