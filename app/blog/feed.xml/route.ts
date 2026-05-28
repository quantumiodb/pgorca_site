import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const updated = posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString();
  const feedUrl = `${site.url}/blog/feed.xml`;

  const entries = posts
    .map((p) => {
      const url = `${site.url}/blog/${p.slug}`;
      const published = new Date(p.date).toISOString();
      const modified = new Date(p.updated ?? p.date).toISOString();
      return `  <entry>
    <id>${url}</id>
    <title>${escapeXml(p.title)}</title>
    <link href="${url}"/>
    <published>${published}</published>
    <updated>${modified}</updated>
    <summary>${escapeXml(p.description)}</summary>
    <author><name>${escapeXml(p.author ?? "pg_orca contributors")}</name></author>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(site.name)} blog</title>
  <subtitle>Field notes on the ORCA query optimizer and PostgreSQL internals.</subtitle>
  <link href="${feedUrl}" rel="self"/>
  <link href="${site.url}/blog"/>
  <id>${site.url}/blog</id>
  <updated>${new Date(updated).toISOString()}</updated>
${entries}
</feed>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
