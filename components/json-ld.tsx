import { site } from "@/lib/site";

// FAQ content lives in components/sections/faq.tsx; duplicating the question
// strings here keeps the JSON-LD self-contained (no client/server bridge) and
// is the form Google actually wants — short, plain-text Q&A pairs.
const faqs: Array<{ q: string; a: string }> = [
  {
    q: "Does pg_orca replace PostgreSQL's planner?",
    a: "No. It registers a planner_hook and is opt-in via SET pg_orca.enable_orca = on — either per session, or persistently with ALTER DATABASE mydb SET pg_orca.enable_orca = on. When disabled, PostgreSQL behaves exactly as it would without the extension loaded.",
  },
  {
    q: "Will it break my existing queries?",
    a: "On any unsupported feature or internal failure, pg_orca falls back to standard_planner automatically. You can observe fallbacks with SET pg_orca.trace_fallback = on — every fallback is logged with its reason.",
  },
  {
    q: "Which PostgreSQL versions are supported?",
    a: "PostgreSQL 18 and 19-devel. The extension targets PG 18's planner / executor API and tracks the in-development PG 19 branch via PG_VERSION_NUM guards.",
  },
  {
    q: "Is this production-ready?",
    a: "Benchmark workloads (TPC-H, TPC-DS) are stable. Use it in development, evaluation, and analytical exploration.",
  },
  {
    q: "How does it compare to pg_hint_plan?",
    a: "pg_hint_plan steers PostgreSQL's planner with hints — same algorithm, different inputs. pg_orca replaces the planner entirely with ORCA's cost-based search.",
  },
  {
    q: "What's the license?",
    a: "MIT-style license. ORCA's source comes from Apache Cloudberry (Apache 2.0); the integration layer is original work for PostgreSQL.",
  },
];

export function JsonLd() {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    description: site.description,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Database",
    operatingSystem: "macOS, Linux",
    softwareVersion: "1.0",
    url: site.url,
    downloadUrl: site.github,
    codeRepository: site.github,
    programmingLanguage: ["C++", "TypeScript"],
    license: "https://opensource.org/licenses/MIT",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "QuantumIO",
      url: site.url,
      email: site.email,
    },
    softwareRequirements: "PostgreSQL 18 or 19-devel, xerces-c, ICU, CMake ≥ 3.20, C++17 compiler",
    keywords: site.keywords.join(", "),
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: "QuantumIO",
      url: site.url,
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "QuantumIO",
    url: site.url,
    email: site.email,
    sameAs: [site.github],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  // Dataset descriptor for the published benchmark results. Helps Google
  // Dataset Search index them and gives AI agents a stable, citable handle.
  const benchmarkDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "pg_orca vs PostgreSQL 18 — TPC-H and TPC-DS benchmark results",
    description:
      "Per-query execution-time comparison of the pg_orca extension (ORCA optimizer) versus PostgreSQL 18's built-in planner. Includes TPC-H at scale factors 1, 5, and 10 (22 queries each) and TPC-DS at scale factor 1 (99 queries). Numbers are 3-run median EXPLAIN ANALYZE execution time with max_parallel_workers_per_gather = 0 and statement_timeout = 120 s.",
    url: site.url + "#benchmarks",
    keywords: [
      "TPC-H",
      "TPC-DS",
      "PostgreSQL",
      "query optimizer",
      "ORCA",
      "benchmark",
    ],
    license: "https://opensource.org/licenses/MIT",
    creator: {
      "@type": "Organization",
      name: "QuantumIO",
      url: site.url,
    },
    datePublished: "2026-05-27",
    dateModified: "2026-05-27",
    version: "b17245d",
    measurementTechnique: "EXPLAIN ANALYZE server-side Execution Time, 3-run median",
    variableMeasured: [
      "ORCA execution time (ms)",
      "PostgreSQL execution time (ms)",
      "Speedup ratio (PG / ORCA)",
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        name: "TPC-H report (2026-05-27)",
        contentUrl:
          "https://github.com/quantumiodb/pgorca/raw/main/test/bench/results/tpch_report_20260527.csv",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        name: "TPC-DS sf=1 report (2026-05-27)",
        contentUrl:
          "https://github.com/quantumiodb/pgorca/raw/main/test/bench/results/tpcds_report_20260527.csv",
      },
    ],
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(benchmarkDataset) }}
      />
    </>
  );
}
