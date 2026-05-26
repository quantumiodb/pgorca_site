import { Cpu, Gauge, ShieldCheck } from "lucide-react";

const limits = [
  {
    icon: Gauge,
    title: "Planning overhead is high",
    metric: "13.7 ms vs 0.25 ms",
    body: "ORCA's CBO is consistently heavier than PG's planner. On a 1-row point lookup, planning alone takes ~14 ms — where PG finishes in under 1 ms. For OLTP / latency-sensitive paths, planning dominates total wall time.",
  },
  {
    icon: Cpu,
    title: "No parallel query yet",
    metric: "Single-worker plans only",
    body: "ORCA generates serial plans — Gather / Parallel Seq Scan / Parallel Hash Join nodes are not emitted. Benchmarks are run with max_parallel_workers_per_gather = 0 for an apples-to-apples comparison. On hardware where PG benefits from parallelism, ORCA's serial plan can lose on wall time even when its plan shape is structurally better.",
  },
];

export function Honest() {
  return (
    <section className="section border-t border-ink-200/60 bg-ink-50/40 dark:border-ink-800/60 dark:bg-ink-950/60">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="h-eyebrow !text-ink-500 dark:!text-ink-400">Honest</div>
          <h2 className="mt-3 h-section">
            What pg_orca is <span className="text-rose-500">not</span> good at.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Optimizer quality cuts both ways. The same exhaustive search that produces
            254× wins on complex analytics costs measurable planning time on simple
            queries — and ORCA hasn&apos;t learned PG&apos;s parallel executor yet.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {limits.map((l) => {
            const Icon = l.icon;
            return (
              <div
                key={l.title}
                className="rounded-2xl border border-ink-200/70 bg-white p-6 dark:border-ink-800 dark:bg-ink-900/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Icon className="size-4" />
                    <span className="font-mono text-xs uppercase tracking-[0.15em]">
                      {l.metric}
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{l.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{l.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-4 rounded-2xl border border-emerald-300/50 bg-emerald-50/60 p-6 dark:border-emerald-800/40 dark:bg-emerald-950/30">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
              Failsafe: always returns a plan
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
              Any query ORCA can&apos;t handle — unsupported feature, internal error,
              timeout — falls back to PostgreSQL&apos;s{" "}
              <code className="font-mono">standard_planner</code> automatically. Enable{" "}
              <code className="font-mono">pg_orca.trace_fallback</code> to log every
              fallback with reason.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
