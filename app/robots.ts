import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site } from "@/lib/site";

// Mark this route dynamic so headers() works and robots.txt is rendered
// per-request (we vary by Host: agentml.ai vs quantumio.com.cn).
export const dynamic = "force-dynamic";

// Major AI / LLM crawlers — explicitly allowed so they can fetch the site for
// real-time retrieval (Perplexity, ChatGPT, Claude web tool) and so the content
// can be considered for future training sets (GPTBot, ClaudeBot, Google-Extended).
// Default-allow already covers them, but being explicit is the public signal.
const aiCrawlers = [
  "GPTBot", // OpenAI training crawler
  "ChatGPT-User", // ChatGPT browse tool (real-time)
  "OAI-SearchBot", // OpenAI SearchGPT
  "ClaudeBot", // Anthropic training crawler
  "Claude-Web", // Claude.ai web tool
  "anthropic-ai", // Anthropic generic agent
  "PerplexityBot", // Perplexity AI
  "Perplexity-User", // Perplexity user-initiated fetch
  "Google-Extended", // Gemini training opt-in (separate from Googlebot)
  "Bingbot", // Powers Bing Chat / Copilot
  "CCBot", // Common Crawl — feeds many open models
  "FacebookBot", // Llama training input
  "Amazonbot",
  "Applebot-Extended", // Apple Intelligence
  "Bytespider", // ByteDance / Doubao
  "YouBot", // You.com
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Timpibot",
];

// Host-aware: agentml.ai is the SEO-canonical origin (full allow);
// quantumio.com.cn is a China-accelerator mirror that should NOT be
// indexed (every page already declares canonical to agentml.ai, and
// Baidu does not honor cross-domain canonical — so we belt-and-braces
// with Disallow: / when serving the mirror host).
export default async function robots(): Promise<MetadataRoute.Robots> {
  const hdrs = await headers();
  const host = (hdrs.get("host") || "").toLowerCase();

  const cnHost = new URL(site.cnMirror).host;
  const isMirror = host === cnHost;

  if (isMirror) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: site.url,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...aiCrawlers.map((ua) => ({
        userAgent: ua,
        allow: "/",
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
