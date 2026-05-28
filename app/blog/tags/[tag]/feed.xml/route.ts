import { notFound } from "next/navigation";
import { renderAtomFeed } from "@/lib/feed";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tag: string }> },
) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  const feedUrl = `${site.url}/blog/tags/${tag}/feed.xml`;
  const pageUrl = `${site.url}/blog`;

  const xml = renderAtomFeed({
    posts,
    feedUrl,
    pageUrl,
    title: `${site.name} blog — ${tag}`,
    subtitle: `Posts tagged "${tag}" from the ${site.name} blog.`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
