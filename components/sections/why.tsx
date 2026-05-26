import { AlertTriangle, GitBranch, Layers } from "lucide-react";

const items = [
  {
    icon: GitBranch,
    title: "Heuristic join enumeration",
    body: "PostgreSQL switches to a genetic algorithm at 12+ relations (geqo_threshold). Below that, it greedily prefers left-deep trees. Neither path searches the bushy plan space — and both are sensitive to the planner's row estimates.",
    snippet: `-- 6+ way joins like TPC-DS Q25
-- left-deep tree picked even when bushy is dramatically cheaper
SELECT ... FROM store_sales
  JOIN store_returns ON ...
  JOIN catalog_sales ON ...
  JOIN customer    ON ...
  JOIN item        ON ...
  JOIN date_dim    ON ...
GROUP BY ...;`,
  },
  {
    icon: Layers,
    title: "Correlated subqueries become SubPlan",
    body: "Anything beyond plain EXISTS / NOT EXISTS — equality SELECTs, IN-subqueries, nested correlation, subqueries with aggregates — drops to SubPlan / InitPlan: re-executed per outer row instead of being rewritten into a single join.",
    snippet: `-- TPC-H Q17 pattern
SELECT SUM(l_extendedprice) / 7.0
FROM lineitem, part
WHERE p_partkey = l_partkey
  AND l_quantity < (
    SELECT 0.2 * AVG(l_quantity)
    FROM lineitem
    WHERE l_partkey = p_partkey   -- correlated
  );`,
  },
  {
    icon: AlertTriangle,
    title: "Stats lost across CTEs / GROUP BY",
    body: "PostgreSQL's planner loses NDV / histogram information across GROUP BY and CTE boundaries. The downstream join estimate falls back to defaults — and a single bad cardinality can pick a plan that runs for hours.",
    snippet: `-- TPC-DS Q31 / Q39 pattern
WITH ss AS (
  SELECT d_qoy, SUM(ss_ext_sales_price) s
  FROM store_sales JOIN date_dim ON ...
  GROUP BY d_qoy            -- stats dropped here in PG
)
SELECT * FROM ss s1 JOIN ss s2 ON ...
  JOIN ss s3 ON ...;        -- self-join cardinality way off`,
  },
];

export function Why() {
  return (
    <section id="why" className="section border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="h-eyebrow">Why pg_orca</div>
          <h2 className="mt-3 h-section">
            Three things the PostgreSQL planner does not do well.
          </h2>
          <p className="mt-4 text-lg text-muted">
            ORCA was built at Greenplum for exactly this class of problem. pg_orca brings
            that engine to single-node PG 18 — without replacing the planner you already
            have.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <article
                key={it.title}
                className="group relative flex flex-col rounded-2xl border border-ink-200/70 bg-white p-6 transition hover:border-brand-300 hover:shadow-lg dark:border-ink-800 dark:bg-ink-900/40 dark:hover:border-brand-700"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-accent-500/10 text-accent-600 dark:text-accent-400">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{it.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{it.body}</p>
                <pre className="mt-5 overflow-x-auto rounded-lg border border-ink-200/70 bg-ink-50 p-3 text-[11.5px] font-mono leading-snug text-ink-700 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-300">
                  <code>{it.snippet}</code>
                </pre>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
