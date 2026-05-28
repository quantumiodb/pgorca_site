import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { formatPostDate, getAllPosts } from "@/lib/posts";

export function BlogTeaser() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="section">
      <div className="container-narrow">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="h-eyebrow inline-flex items-center gap-2">
              <BookOpen className="size-3.5" />
              Blog
            </div>
            <h2 className="mt-3 h-section">From the field notes</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Deep dives on ORCA internals, configuration, and benchmark methodology — written while building pg_orca.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-900 transition hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:hover:border-ink-600"
          >
            All posts
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-ink-200/70 bg-white p-6 transition hover:border-brand-300 dark:border-ink-800 dark:bg-ink-900/40 dark:hover:border-brand-700"
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <time dateTime={p.date} className="font-mono">
                    {formatPostDate(p.date)}
                  </time>
                  <span aria-hidden>·</span>
                  <span>{p.readingMinutes} min read</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-ink-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {p.description}
                </p>
                <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                  Read post
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
