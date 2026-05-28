import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// Per-request so we can vary by Host (CN mirror returns an empty sitemap).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hdrs = await headers();
  const host = (hdrs.get("host") || "").toLowerCase();
  const cnHost = new URL(site.cnMirror).host;

  // The China-accelerator mirror serves identical HTML to humans but
  // must not advertise URLs to crawlers — robots.txt disallows everything,
  // and the sitemap is empty so Bing/Baidu don't try to index this host.
  if (host === cnHost) return [];

  const now = new Date();
  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${site.url}/#benchmarks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/#features`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/#install`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/#architecture`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/#faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/blog`,
      lastModified: posts[0] ? new Date(posts[0].updated ?? posts[0].date) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
  ];
}
