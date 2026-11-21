"use client";

import { useState } from "react";
import { Apple, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

type Os = "macos" | "linux";

const deps = {
  macos: `brew install postgresql@18 xerces-c cmake ninja icu4c`,
  linux: `# Debian / Ubuntu
sudo apt install -y libxerces-c-dev cmake ninja-build build-essential
# (Build PostgreSQL 18 from source or use the official PGDG repo)`,
};

const buildSteps = `# 2. Clone & build
git clone https://github.com/quantumiodb/pgorca.git
cd pgorca && mkdir build && cd build
cmake .. -DPG_CONFIG=$(which pg_config) -DCMAKE_BUILD_TYPE=Release -GNinja
ninja -j$(nproc)
ninja install`;

const enableSteps = `-- 3. Install the extension in the target database.
--    CREATE EXTENSION loads the library into the current session,
--    so pg_orca.* GUCs and planner_hook are live immediately.
CREATE EXTENSION pg_orca;

-- 4. (Recommended) Auto-load pg_orca for every new connection
--    to this database. Per-database scope, no server restart;
--    takes effect for sessions opened from this point on.
ALTER DATABASE mydb SET session_preload_libraries = 'pg_orca';

-- 5. Enable ORCA — per session, or persistently with
--    ALTER DATABASE mydb SET pg_orca.enable_orca = on
SET pg_orca.enable_orca = on;

-- 6. Run a query — ORCA optimizes it.
EXPLAIN SELECT * FROM lineitem WHERE l_quantity < 5;`;

const scopeSteps = `-- Cluster-wide (every database, every role):
ALTER SYSTEM SET session_preload_libraries = 'pg_orca';
SELECT pg_reload_conf();

-- Single role only:
ALTER ROLE bench SET session_preload_libraries = 'pg_orca';

-- Co-exist with sibling preload libraries — list them explicitly:
ALTER DATABASE mydb SET session_preload_libraries = 'pg_orca,pg_stat_statements';

-- Roll back:
ALTER DATABASE mydb RESET session_preload_libraries;
DROP EXTENSION pg_orca;`;

export function Install() {
  const [os, setOs] = useState<Os>("macos");

  return (
    <section id="install" className="section border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="container-narrow">
        <div className="max-w-2xl">
          <div className="h-eyebrow">Install</div>
          <h2 className="mt-3 h-section">
            Install pg_orca on PostgreSQL 18 or 19 in three steps.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Requires PostgreSQL 18 or 19, xerces-c, ICU, CMake ≥ 3.20, and a C++17 compiler.
            No patches to PostgreSQL itself.
          </p>
        </div>

        <div className="mt-12 border-b border-ink-200 dark:border-ink-800">
          {/* Step 1 */}
          <Step n={1} title="Install dependencies">
            <div className="mb-3 inline-flex rounded-lg border border-ink-200 bg-white p-1 text-sm dark:border-ink-800 dark:bg-ink-900">
              <OsTab active={os === "macos"} onClick={() => setOs("macos")} icon={Apple} label="macOS" />
              <OsTab active={os === "linux"} onClick={() => setOs("linux")} icon={Terminal} label="Linux" />
            </div>
            <CodeBlock code={deps[os]} language="bash" />
          </Step>

          {/* Step 2 */}
          <Step n={2} title="Clone & build">
            <CodeBlock code={buildSteps} language="bash" />
          </Step>

          {/* Step 3 */}
          <Step n={3} title="Install, preload, enable, run">
            <CodeBlock code={enableSteps} language="sql" filename="psql" />
          </Step>
        </div>

        <div className="mt-10 border-l-2 border-brand-500 bg-brand-50/60 p-6 text-sm dark:border-brand-800/40 dark:bg-brand-950/30">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            Why session_preload_libraries, not shared_preload_libraries
          </p>
          <p className="mt-2 text-ink-800 dark:text-ink-200">
            <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono dark:bg-ink-800">
              session_preload_libraries
            </code>{" "}
            loads pg_orca into each new backend at connection time — no postmaster
            restart, scoped to one database (or one role), and easily reverted with{" "}
            <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono dark:bg-ink-800">
              RESET
            </code>
            . Existing sessions stay on the standard planner until they reconnect.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-ink-200/70 bg-white p-6 dark:border-ink-800 dark:bg-ink-900/40">
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">
            Alternative scopes
          </p>
          <p className="mt-2 mb-4 text-sm text-muted">
            Pick the scope that matches how broadly you want pg_orca enabled.
          </p>
          <CodeBlock code={scopeSteps} language="sql" filename="psql" />
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-12 gap-y-4 border-t border-ink-200 py-8 dark:border-ink-800 lg:grid-cols-[15rem_1fr]">
      <h3 className="flex items-baseline gap-3 text-lg font-semibold">
        <span className="font-mono text-brand-500 dark:text-brand-300">{n}.</span>
        {title}
      </h3>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function OsTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-medium transition",
        active
          ? "bg-brand-500 text-white dark:bg-brand-400 dark:text-ink-950"
          : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
