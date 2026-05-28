"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { site } from "@/lib/site";

const homeLinks = [
  { href: "/#why", label: "Why" },
  { href: "/#benchmarks", label: "Benchmarks" },
  { href: "/#features", label: "Features" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#install", label: "Install" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/60 bg-white/80 backdrop-blur dark:border-ink-800/60 dark:bg-ink-950/80">
      <div className="container-narrow flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight">
          <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-accent-500 text-xs text-white">
            pg
          </span>
          <span>pg_orca</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isHome &&
            homeLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-1.5 text-sm text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          <Link
            href="/blog"
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              pathname.startsWith("/blog")
                ? "bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-white"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
            }`}
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-md border border-ink-200 bg-white text-ink-700 transition hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:border-ink-600"
          >
            <Github className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
