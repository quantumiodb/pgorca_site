const features = [
  {
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
    title: "Exhaustive join-order enumeration (DPv2)",
    tag: "Bushy plans, cost-driven",
    body: "CJoinOrderDPv2 + commutativity / associativity xforms enumerate the full join space under ORCA's own cardinality model — bushy and left-deep alike, costed in the same Memo as decorrelation and aggregate pushdown.",
    example: {
      query: "TPC-DS Q25",
      detail: "6-way roll-up join across store_sales × store_returns × catalog_sales × …",
      speedup: "9.0×",
    },
  },
  {
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
        <div className="max-w-2xl">
          <div className="h-eyebrow">Features</div>
          <h2 className="mt-3 h-section">
            Optimizer features ORCA brings to PostgreSQL.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Four structural plan-shape capabilities — not micro-optimizations.
          </p>
        </div>

        <div className="mt-12 border-b border-ink-200 dark:border-ink-800">
          {features.map((f) => (
            <article
              key={f.title}
              className="grid gap-x-12 gap-y-4 border-t border-ink-200 py-8 dark:border-ink-800 lg:grid-cols-[1fr_1.5fr]"
            >
              <div>
                <h3 className="text-xl font-semibold leading-snug">{f.title}</h3>
                <p className="mt-2 font-mono text-sm text-brand-600 dark:text-brand-300">{f.tag}</p>
              </div>
              <div className="min-w-0">
                <p className="leading-relaxed text-muted">{f.body}</p>
                <div className="mt-4 flex items-baseline gap-4 border-l-2 border-brand-500 pl-4 font-mono text-sm">
                  <span className="shrink-0 font-semibold">{f.example.query}</span>
                  <span className="min-w-0 flex-1 text-muted">{f.example.detail}</span>
                  <span className="shrink-0 font-semibold text-brand-600 dark:text-brand-300">
                    {f.example.speedup}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
