# pg_orca website

Marketing / documentation site for [pg_orca](https://github.com/quantumiodb/pgorca), built with Next.js 15 and deployed on Vercel.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo at <https://vercel.com/new>.
3. Framework auto-detected as **Next.js**. No env vars required.
4. (Optional) Set a custom domain; update `site.url` in `lib/site.ts` for accurate OG / sitemap URLs.

## Editing content

- **Benchmark numbers** — `lib/benchmarks.ts`. Replace the hardcoded `BenchmarkRow[]` with rows derived from CSV once available.
- **Hero rotating highlights** — `components/sections/hero.tsx` (`highlights` array).
- **Features / Why / FAQ copy** — inline in each `components/sections/*.tsx` file.
- **Theme colors / fonts** — `tailwind.config.ts` (`brand`, `accent`, `ink` palettes).
- **Global metadata** — `lib/site.ts` and `app/layout.tsx`.

## Stack

- Next.js 15 (App Router)
- TypeScript, React 19
- Tailwind CSS v3
- next-themes (dark mode)
- framer-motion (hero animation only)
- shiki (code highlighting)
- lucide-react (icons)
