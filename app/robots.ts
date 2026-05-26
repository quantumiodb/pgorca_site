import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

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

export default function robots(): MetadataRoute.Robots {
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
