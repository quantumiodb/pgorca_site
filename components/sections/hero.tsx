"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const highlights = [
  { value: "≥254×", label: "TPC-DS Q1 — ORCA 0.5 s vs PG timeout (120 s)" },
  { value: "107×", label: "TPC-DS Q30 — correlated aggregate" },
  { value: "77×", label: "TPC-DS Q81 — correlated subquery" },
  { value: "37×", label: "TPC-DS Q41 — correlated IN + EXISTS" },
  { value: "21×", label: "TPC-H Q17 — l_quantity < 0.2 × AVG (correlated)" },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % highlights.length), 2400);
    return () => clearInterval(id);
  }, []);

  const h = highlights[index];

  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]">
        <div
          className="absolute inset-0 opacity-[0.18] dark:opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(125 132 151 / 0.35) 1px, transparent 1px), linear-gradient(90deg, rgb(125 132 151 / 0.35) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="container-narrow grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-xs font-medium text-ink-700 backdrop-blur dark:border-ink-700 dark:bg-ink-900/60 dark:text-ink-200">
            <Sparkles className="size-3.5 text-accent-500" />
            ORCA, the optimizer behind Greenplum &amp; Apache Cloudberry
          </div>

          <h1 className="mt-6 h-display">
            Plug <span className="gradient-text">ORCA</span> into{" "}
            <br className="hidden sm:block" />
            PostgreSQL 18 &amp; 19-devel.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            <strong>pg_orca</strong> is a PostgreSQL 18 &amp; 19-devel extension that swaps in the
            ORCA cost-based query optimizer from Greenplum / Apache Cloudberry —
            exhaustive join enumeration, correlated subquery decorrelation, and
            dynamic partition pruning. Installed with a single{" "}
            <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-ink-800">CREATE EXTENSION</code>.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#install"
              className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
            >
              Get started
              <ArrowRight className="size-4" />
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-900 transition hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:hover:border-ink-600"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>

          <p className="mt-6 text-xs text-muted">
            MIT-style license · PostgreSQL 18 &amp; 19-devel · macOS &amp; Linux · Auto-fallback on
            unsupported queries
          </p>
        </div>

        {/* Right card: rotating speedup */}
        <div className="relative">
          <div className="relative rounded-2xl border border-ink-200/80 bg-gradient-to-br from-white to-ink-50 p-8 shadow-xl shadow-ink-950/5 dark:border-ink-800 dark:from-ink-900 dark:to-ink-950 dark:shadow-black/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.15em] text-muted">
                Speedup vs PG 18
              </span>
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgb(16_185_129)]" />
            </div>

            <div className="mt-6 h-40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex h-full flex-col justify-between"
                >
                  <div className="text-6xl sm:text-7xl font-bold tracking-tight gradient-text">
                    {h.value}
                  </div>
                  <div className="text-sm text-muted">{h.label}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-1.5">
              {highlights.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show speedup ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition ${
                    i === index ? "bg-accent-500" : "bg-ink-200 dark:bg-ink-800"
                  }`}
                />
              ))}
            </div>

            <div className="mt-6 border-t border-ink-200/60 pt-4 text-xs text-muted dark:border-ink-800">
              Measured on a single-node PG 18 vs <code className="font-mono">pg_orca</code> at par=0.
              See <a href="#benchmarks" className="text-brand-600 hover:underline dark:text-brand-400">benchmarks</a> for methodology.
            </div>
          </div>

          {/* floating glow */}
          <div className="pointer-events-none absolute -inset-x-10 -bottom-12 -z-10 h-32 rounded-full bg-gradient-to-r from-brand-500/40 to-accent-500/40 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
