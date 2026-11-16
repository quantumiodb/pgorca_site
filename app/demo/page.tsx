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
