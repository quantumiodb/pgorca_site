const items = [
  {
    title: "Bounded join search",
    body: "PostgreSQL's dynamic programming does build bushy trees, but only between relations linked by a join clause, and it switches to a genetic algorithm at 12+ relations (geqo_threshold). Subquery pull-up and aggregate placement are fixed before join search starts, and every choice rides on the planner's row estimates.",
    snippet: `-- 6+ way joins like TPC-DS Q25
-- join order hinges on intermediate row estimates
SELECT ... FROM store_sales
  JOIN store_returns ON ...
  JOIN catalog_sales ON ...
  JOIN customer    ON ...
  JOIN item        ON ...
  JOIN date_dim    ON ...
GROUP BY ...;`,
  },
  {
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
    title: "Partition pruning happens too late",
    body: "PostgreSQL prunes partitions from constant predicates at plan time, but join-key pruning depends on runtime values the planner can't see. ORCA's DynamicTableScan + PartitionSelector decides which partitions to read after the join key is known — pruning that PG simply does not perform.",
    snippet: `-- Star-join: prune sales partitions by date_dim.d_year = 2002
-- PG: scans every sales partition, joins, filters after
-- ORCA: PartitionSelector pushes the year filter to the scan
SELECT SUM(ss_ext_sales_price)
FROM store_sales            -- partitioned by ss_sold_date_sk
JOIN date_dim ON ss_sold_date_sk = d_date_sk
WHERE d_year = 2002;        -- prunes ~95% of partitions at runtime`,
  },
];

export function Why() {
  return (
    <section id="why" className="section border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="container-narrow">
        <div className="max-w-2xl">
          <div className="h-eyebrow">Why pg_orca</div>
          <h2 className="mt-3 h-section">
            Three limits of the PostgreSQL query planner.
          </h2>
          <p className="mt-4 text-lg text-muted">
            ORCA was built at Greenplum for exactly this class of problem. pg_orca brings
            that engine to single-node PostgreSQL 18 &amp; 19 — without replacing the
            planner you already have.
          </p>
        </div>

        <div className="mt-12 border-b border-ink-200 dark:border-ink-800">
          {items.map((it) => (
            <article
              key={it.title}
              className="grid gap-x-12 gap-y-5 border-t border-ink-200 py-8 dark:border-ink-800 lg:grid-cols-[1fr_1.1fr]"
            >
              <div>
                <h3 className="text-xl font-semibold leading-snug">{it.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{it.body}</p>
              </div>
              <pre className="min-w-0 self-start overflow-x-auto rounded-lg border border-ink-200 bg-ink-50 p-4 font-mono text-[12.5px] leading-relaxed text-ink-700 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-300">
                <code>{it.snippet}</code>
              </pre>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
