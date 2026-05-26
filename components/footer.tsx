import Link from "next/link";
import { site } from "@/lib/site";

const cols = [
  {
    title: "Project",
    links: [
      { href: site.github, label: "GitHub" },
      { href: `${site.github}/issues`, label: "Issues" },
      { href: `${site.github}/blob/main/LICENSE`, label: "License" },
    ],
  },
  {
    title: "Docs",
    links: [
      { href: `${site.github}#build--install`, label: "Build & Install" },
      { href: `${site.github}/blob/main/testing.md`, label: "Testing Guide" },
      { href: `${site.github}#guc-parameters`, label: "GUC Parameters" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "https://cloudberry.apache.org", label: "Apache Cloudberry" },
      { href: "https://www.postgresql.org/", label: "PostgreSQL" },
      {
        href: "https://15721.courses.cs.cmu.edu/spring2019/papers/22-optimizer1/p337-soliman.pdf",
        label: "ORCA Paper (SIGMOD '14)",
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200/60 bg-ink-50/50 py-12 dark:border-ink-800/60 dark:bg-ink-950">
      <div className="container-narrow">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold">
              <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-accent-500 text-xs text-white">
                pg
              </span>
              <span>pg_orca</span>
            </Link>
            <p className="mt-3 text-sm text-muted">{site.tagline}</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">
                {c.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-ink-700 transition hover:text-brand-600 dark:text-ink-200 dark:hover:text-brand-400"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-ink-200/60 pt-6 text-xs text-muted dark:border-ink-800/60">
          <p>
            Built on Apache Cloudberry ORCA. Not affiliated with the PostgreSQL Global
            Development Group. PostgreSQL is a trademark of the PostgreSQL Community
            Association of Canada.
          </p>
        </div>
      </div>
    </footer>
  );
}
