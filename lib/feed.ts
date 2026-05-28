import "server-only";
import type { PostMeta } from "./posts";
import { site } from "./site";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type FeedOptions = {
  posts: PostMeta[];
  feedUrl: string;
  pageUrl: string;
  title: string;
  subtitle: string;
};

export function renderAtomFeed({
  posts,
  feedUrl,
  pageUrl,
  title,
  subtitle,
}: FeedOptions): string {
  const updated =
    posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString();

  const entries = posts
    .map((p) => {
      const url = `${site.url}/blog/${p.slug}`;
      const published = new Date(p.date).toISOString();
      const modified = new Date(p.updated ?? p.date).toISOString();
      const categories = (p.tags ?? [])
        .map((t) => `    <category term="${escapeXml(t)}"/>`)
        .join("\n");
      return `  <entry>
    <id>${url}</id>
    <title>${escapeXml(p.title)}</title>
    <link href="${url}"/>
    <published>${published}</published>
    <updated>${modified}</updated>
    <summary>${escapeXml(p.description)}</summary>
    <author><name>${escapeXml(p.author ?? "pg_orca contributors")}</name></author>
${categories}
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(subtitle)}</subtitle>
  <link href="${feedUrl}" rel="self"/>
  <link href="${pageUrl}"/>
  <id>${pageUrl}</id>
  <updated>${new Date(updated).toISOString()}</updated>
${entries}
</feed>
`;
}
