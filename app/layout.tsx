import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#080a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: "pg_orca contributors", url: site.github }],
  creator: "pg_orca contributors",
  publisher: "QuantumIO",
  applicationName: site.name,
  category: "technology",
  alternates: {
    canonical: site.url,
    types: {
      // Auto-discovery for LLM-friendly content. Following the proposed
      // llmstxt.org convention so AI tools (Anthropic, Mintlify, etc.) can
      // pick up the digest without parsing the visual HTML.
      "text/plain": [
        { url: "/llms.txt", title: "LLM-friendly site index" },
        { url: "/llms-full.txt", title: "Full content for LLM ingestion" },
      ],
      "application/atom+xml": [
        { url: "/blog/feed.xml", title: "pg_orca blog" },
        {
          url: "/blog/tags/postgres/feed.xml",
          title: "pg_orca blog — PostgreSQL posts",
        },
      ],
    },
  },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: "@quantumiodb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "google-site-verification": "", // fill in after Search Console verifies
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Nav />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
