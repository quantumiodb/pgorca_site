import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import { formatPostDate, getAllPosts, getPost } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx-components";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${site.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: post.canonical || url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    mainEntityOfPage: url,
    keywords: post.tags?.join(", "),
    author: {
      "@type": "Person",
      name: post.author ?? "pg_orca contributors",
    },
    publisher: {
      "@type": "Organization",
      name: "QuantumIO",
      url: site.url,
    },
    inLanguage: "en",
  };

  return (
    <article className="section">
      <div className="container-narrow">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink-900 dark:hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          All posts
        </Link>

        <header className="mt-8 border-b border-ink-200/60 pb-10 dark:border-ink-800/60">
          <div className="flex items-center gap-3 text-xs text-muted">
            <time dateTime={post.date} className="font-mono">
              {formatPostDate(post.date, "long")}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="flex gap-1.5">
                  {post.tags.map((t) => (
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
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-muted">{post.description}</p>
        </header>

        <div className="prose-pgorca mt-12 max-w-3xl">
          {await (async () => {
            const { default: MDXContent } = await evaluate(post.content, {
              ...runtime,
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: "wrap",
                    properties: { className: ["heading-anchor"] },
                  },
                ],
                [
                  rehypeShiki,
                  {
                    themes: { light: "github-light", dark: "github-dark-default" },
                    defaultColor: false,
                  },
                ],
              ],
            });
            return <MDXContent components={mdxComponents} />;
          })()}
        </div>

        <div className="mt-16 max-w-3xl rounded-2xl border border-ink-200/60 bg-gradient-to-br from-white to-ink-50 p-8 dark:border-ink-800/60 dark:from-ink-900 dark:to-ink-950">
          <p className="h-eyebrow">Try it</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Install pg_orca in one command
          </h2>
          <p className="mt-3 text-muted">
            {site.tagline} MIT-licensed, falls back to PostgreSQL&apos;s planner on
            unsupported queries.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#install"
              className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#benchmarks"
              className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-900 transition hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:hover:border-ink-600"
            >
              See benchmarks
            </Link>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      </div>
    </article>
  );
}
