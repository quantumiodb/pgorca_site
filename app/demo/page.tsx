import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { site } from "@/lib/site";

const desc =
  "Watch pg_orca decorrelate TPC-H Q17 in real psql output: vanilla PostgreSQL 18 takes 10 seconds, pg_orca finishes the same query in 308 ms.";

export const metadata: Metadata = {
  title: "Demo — TPC-H Q17 in 30 seconds",
  description: desc,
  alternates: { canonical: `${site.url}/demo` },
  openGraph: {
    type: "article",
    url: `${site.url}/demo`,
    title: "pg_orca demo — TPC-H Q17 in 30 seconds",
    description: desc,
  },
  twitter: {
    card: "summary_large_image",
    title: "pg_orca demo — TPC-H Q17 in 30 seconds",
    description: desc,
  },
};

export default function DemoPage() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-24 sm:pb-32">
      {/* Subtle grid background, same vocabulary as the home hero so the page
          feels first-party rather than a one-off landing. */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_50%_at_50%_25%,black,transparent)]">
        <div
          className="absolute inset-0 opacity-[0.18] dark:opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(125 132 151 / 0.35) 1px, transparent 1px), linear-gradient(90deg, rgb(125 132 151 / 0.35) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="container-narrow">
        <div className="mx-auto max-w-3xl text-center">
          <div className="h-eyebrow">Live demo · 30 s loop</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            TPC-H Q17, <span className="gradient-text">side by side</span>.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Same query. Same data. Same PostgreSQL 18 binary. The only thing
            that changes is{" "}
            <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-ink-800">
              SET pg_orca.enable_orca
            </code>
            . Vanilla planner: <strong className="text-ink-900 dark:text-ink-100">10,066 ms</strong>.
            ORCA: <strong className="text-emerald-600 dark:text-emerald-400">308 ms</strong>.
          </p>
        </div>

        {/* SVG player. The animation is self-driving (SMIL keyframes) so we
            keep it inside a plain <img>; no JS, no autoplay quirks. */}
        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-ink-200/70 bg-ink-950 shadow-xl shadow-ink-950/10 dark:border-ink-800">
          <img
            src="/demo.svg"
            alt="psql session: TPC-H Q17 on vanilla PostgreSQL 18 takes 10.07 s; the same query with pg_orca enabled finishes in 308 ms — a 32.7× speedup, driven by correlated subquery decorrelation."
            className="block h-auto w-full"
          />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Scale factor 5 · 30M lineitem rows · 1M part rows · single-node, no
          parallelism · 3-run median EXPLAIN ANALYZE.
        </p>

        {/* What ORCA actually changed — the three load-bearing differences in
            the plan trees the viewer just watched scroll past. */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          <Card
            head="Subquery decorrelation"
            body="The correlated SubPlan re-executes 30,411 times under PG. ORCA rewrites it into a single HashAggregate that runs once."
          />
          <Card
            head="Bushy join enumeration"
            body="PG settles for a Hash Join with a re-executed inner aggregate. ORCA evaluates bushy variants and picks a nested-loop ladder over the pre-aggregated side."
          />
          <Card
            head="94% fewer buffer reads"
            body="The vanilla plan touches 1.6M shared buffers. The ORCA plan reads 87K — pruning falls out of the better join order, not from new indexes."
          />
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
          >
            <Github className="size-4" />
            Try it on GitHub
          </a>
          <Link
            href="/#install"
            className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-900 transition hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:hover:border-ink-600"
          >
            Install instructions
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Card({ head, body }: { head: string; body: string }) {
  return (
    <article className="rounded-2xl border border-ink-200/70 bg-white p-5 dark:border-ink-800 dark:bg-ink-900/40">
      <h2 className="text-base font-semibold">{head}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </article>
  );
}
