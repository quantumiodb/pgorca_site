import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { formatPostDate, getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Field notes on the ORCA query optimizer, PostgreSQL extension internals, and benchmark methodology.",
  alternates: {
    canonical: `${site.url}/blog`,
    types: {
      "application/atom+xml": [{ url: `${site.url}/blog/feed.xml`, title: "pg_orca blog" }],
    },
  },
  openGraph: {
    type: "website",
    url: `${site.url}/blog`,
    title: "pg_orca blog",
    description:
      "Field notes on the ORCA query optimizer, PostgreSQL extension internals, and benchmark methodology.",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section className="section">
      <div className="container-narrow">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink-200/60 pb-10 dark:border-ink-800/60">
          <div>
            <p className="h-eyebrow">Blog</p>
            <h1 className="mt-3 h-section">Field notes</h1>
            <p className="mt-4 max-w-2xl text-muted">
              Walkthroughs of the ORCA optimizer, PostgreSQL extension internals,
              and benchmark methodology. Written while building{" "}
              <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-ink-800">
                pg_orca
              </code>
              .
            </p>
          </div>
          <a
            href="/blog/feed.xml"
            className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-mono text-ink-700 transition hover:border-accent-400 hover:text-accent-600 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-200 dark:hover:border-accent-500 dark:hover:text-accent-400"
          >
            <Rss className="size-3.5" />
            RSS
          </a>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-muted">No posts yet.</p>
        ) : (
          <ul className="mt-10 divide-y divide-ink-200/60 dark:divide-ink-800/60">
            {posts.map((p) => (
              <li key={p.slug} className="group py-8">
                <Link href={`/blog/${p.slug}`} className="block">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <time dateTime={p.date} className="font-mono">
                      {formatPostDate(p.date)}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{p.readingMinutes} min read</span>
                    {p.tags && p.tags.length > 0 && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="flex gap-1.5">
                          {p.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ink-600 dark:bg-ink-800 dark:text-ink-300"
                            >
                              {t}
                            </span>
                          ))}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                    {p.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-muted">{p.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                    Read post
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
