export function Demo() {
  return (
    <section
      id="demo"
      className="border-t border-ink-200/60 py-16 sm:py-20 dark:border-ink-800/60"
    >
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="h-eyebrow">Live demo</div>
          <h2 className="mt-3 h-section">
            TPC-H Q17, side by side.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Same query, same data, same PostgreSQL 18 binary. The toggle is{" "}
            <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-ink-800">
              SET pg_orca.enable_orca
            </code>
            .
          </p>
        </div>

        {/* Cap the player at ~75vh so the whole 30-second loop fits the
            initial viewport when a visitor lands on /#demo. mx-auto + max-w
            keeps the aspect ratio intact without cropping the SVG itself —
            the entire terminal stays visible end-to-end. */}
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-ink-200/70 bg-ink-950 shadow-xl shadow-ink-950/10 dark:border-ink-800">
          <img
            src="/demo.svg"
            alt="psql session showing TPC-H Q17 on vanilla PostgreSQL 18 (10.0 s) versus the same query under pg_orca (308 ms — 32.7× faster)."
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Scale factor 5 · 30M lineitem rows · 1M part rows · single-node, no parallelism.
        </p>
      </div>
    </section>
  );
}
