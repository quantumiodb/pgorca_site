import { renderAtomFeed } from "@/lib/feed";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const xml = renderAtomFeed({
    posts: getAllPosts(),
    feedUrl: `${site.url}/blog/feed.xml`,
    pageUrl: `${site.url}/blog`,
    title: `${site.name} blog`,
    subtitle: "Field notes on the ORCA query optimizer and PostgreSQL internals.",
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
