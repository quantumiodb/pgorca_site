export const site = {
  name: "pg_orca",
  // <60 chars, primary keyword first — used as the browser tab title.
  title: "pg_orca: ORCA Query Optimizer for PostgreSQL 18",
  tagline: "The ORCA query optimizer, now a PostgreSQL 18 extension.",
  // <160 chars for Google snippet; loaded with keywords + the headline number.
  description:
    "Open-source PostgreSQL 18 extension that plugs in the ORCA cost-based query optimizer from Greenplum / Apache Cloudberry. Up to 254× faster on TPC-H and TPC-DS analytical queries. MIT-licensed, single-node, install with CREATE EXTENSION.",
  // Canonical (SEO-indexed) origin. agentml.ai is served globally;
  // quantumio.com.cn is a China-accelerator mirror that serves identical
  // content but is excluded from indexing via the canonical tag below.
  url: "https://agentml.ai",
  cnMirror: "https://quantumio.com.cn",
  github: "https://github.com/quantumiodb/pgorca",
  sponsor: "https://github.com/sponsors/quantumiodb",
  email: "support@agentml.ai",
  license: "MIT-style",
  keywords: [
    "PostgreSQL 18",
    "PostgreSQL query optimizer",
    "ORCA optimizer",
    "Greenplum optimizer",
    "Apache Cloudberry",
    "pg_orca",
    "PostgreSQL extension",
    "TPC-H benchmark",
    "TPC-DS benchmark",
    "cost-based optimizer",
    "query planner",
    "bushy join",
    "correlated subquery decorrelation",
    "DXL",
  ],
};

