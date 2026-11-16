"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const mobileLinks = [...homeLinks, { href: "/demo", label: "Demo" }, { href: "/blog", label: "Blog" }];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-700 bg-brand-500 text-white dark:border-ink-800 dark:bg-brand-900">
      <div className="container-narrow flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight">
          <span className="grid size-7 place-items-center rounded-md bg-white text-xs text-brand-500">
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
                className="rounded-md px-3 py-1.5 text-sm transition text-white/80 hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          <Link
            href="/demo"
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              pathname.startsWith("/demo")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            Demo
          </Link>
          <Link
            href="/blog"
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              pathname.startsWith("/blog")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
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
            className="grid size-9 place-items-center rounded-md border border-white/25 text-white transition hover:bg-white/10"
          >
            <Github className="size-4" />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-md border border-white/25 text-white transition hover:bg-white/10 md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-white/15 md:hidden">
          <ul className="container-narrow grid grid-cols-2 gap-x-4 py-3">
            {mobileLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
