"use client";

import { useState } from "react";
import { Github, Mail, Plus } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Does pg_orca replace PostgreSQL's planner?",
    a: "No. It registers a planner_hook and is opt-in via SET pg_orca.enable_orca = on — either per session, or persistently with ALTER DATABASE mydb SET pg_orca.enable_orca = on. When disabled, PostgreSQL behaves exactly as it would without the extension loaded.",
  },
  {
    q: "Will it break my existing queries?",
    a: "On any unsupported feature or internal failure, pg_orca falls back to standard_planner automatically. You can observe fallbacks with SET pg_orca.trace_fallback = on — every fallback is logged with its reason.",
  },
  {
    q: "Which PostgreSQL versions are supported?",
    a: "PostgreSQL 18 and 19-devel. The extension targets PG 18's planner / executor API and tracks the in-development PG 19 branch via PG_VERSION_NUM guards (rockylinux:9 + PG19 build/test runs in CI). Earlier versions removed walkers.h and other internals that pg_orca depends on, and were not back-ported.",
  },
  {
    q: "Is this production-ready?",
    a: "Alpha. Benchmark workloads (TPC-H, TPC-DS) are stable. Use it in development, evaluation, and analytical exploration. Don't deploy to latency-sensitive OLTP code paths until the planning-overhead mitigations land.",
  },
  {
    q: "How does it compare to pg_hint_plan?",
    a: "pg_hint_plan steers PostgreSQL's planner with hints — same algorithm, different inputs. pg_orca replaces the planner entirely with ORCA's cost-based search. They solve different problems and can coexist (one per session).",
  },
  {
    q: "What's the license? Is ORCA properly attributed?",
    a: "MIT-style license. ORCA's source comes from Apache Cloudberry (Apache 2.0); the integration layer is original work for PostgreSQL. Full notices in the LICENSE and NOTICE files in the repository.",
  },
  {
    q: "Can I tune ORCA's behavior?",
    a: "Yes. pg_orca exposes GUC parameters under the pg_orca.* and optimizer_* prefixes — including search strategy, segment count, sort cost factor, metadata cache size, and trace flags. See the GUC Parameters section of the README.",
  },
  {
    q: "How can I contribute?",
    a: "Issues, PRs, and benchmark contributions are welcome on GitHub. The largest open work items are: shape-keyed plan caching, heuristic fast-path for OLTP queries, and additional cost-model tuning for single-node workloads.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="h-eyebrow">FAQ</div>
          <h2 className="mt-3 h-section">
            pg_orca FAQ — install, compatibility, license.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-ink-200/60 overflow-hidden rounded-2xl border border-ink-200/70 bg-white dark:divide-ink-800 dark:border-ink-800 dark:bg-ink-900/40">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} initiallyOpen={i === 0} />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-ink-200/70 bg-gradient-to-br from-white to-brand-50/40 p-8 dark:border-ink-800 dark:from-ink-900 dark:to-brand-950/30">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="h-eyebrow">Get in touch</div>
              <h3 className="mt-3 text-xl font-semibold">
                Questions, integration help, or commercial support?
              </h3>
              <p className="mt-2 text-sm text-muted">
                Reach the team for benchmark questions, deployment advice, or to discuss
                using pg_orca in your stack.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
              >
                <Mail className="size-4" />
                {site.email}
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted transition hover:text-brand-600 dark:hover:text-brand-400"
              >
                <Github className="size-3.5" />
                Or open a GitHub issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  q,
  a,
  initiallyOpen,
}: {
  q: string;
  a: string;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!initiallyOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-ink-50/60 dark:hover:bg-ink-800/40"
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        <Plus
          className={cn(
            "size-4 shrink-0 text-muted transition-transform",
            open && "rotate-45 text-accent-500",
          )}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed text-muted">{a}</div>
      )}
    </div>
  );
}
