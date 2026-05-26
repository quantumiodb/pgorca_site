const steps = [
  {
    n: "01",
    title: "DXL — language between two worlds",
    body: "ORCA was built optimizer-first, database-agnostic. DXL (Data eXchange Language, XML-based) is its IR. pg_orca translates a PostgreSQL Query AST into DXL and the resulting DXL plan back into PG's PlannedStmt.",
  },
  {
    n: "02",
    title: "Memo + Xforms — cost-based search",
    body: "Plans live in a Memo (Volcano/Cascades-style group structure). Transformation rules (xforms) generate alternatives — join associativity, Apply-to-Join, GROUP BY pushdown, index selection — and the cost model picks a winner over the whole space.",
  },
  {
    n: "03",
    title: "Failsafe — always returns a plan",
    body: "Anything ORCA can't handle (unsupported feature, internal error, timeout) falls back to PostgreSQL's standard_planner automatically. Set pg_orca.trace_fallback = on to log each fallback with reason.",
  },
];

export function Architecture() {
  return (
    <section
      id="architecture"
      className="section border-t border-ink-200/60 bg-ink-50/40 dark:border-ink-800/60 dark:bg-ink-950/60"
    >
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="h-eyebrow">Architecture</div>
          <h2 className="mt-3 h-section">
            Architecture: how pg_orca turns a query into a plan.
          </h2>
          <p className="mt-4 text-lg text-muted">
            pg_orca registers a <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-ink-800">planner_hook</code>.
            When ORCA is enabled, the query takes a detour through DXL — and comes back as
            a regular PG plan.
          </p>
        </div>

        <div className="mt-14 rounded-2xl border border-ink-200/70 bg-white p-8 dark:border-ink-800 dark:bg-ink-900/40">
          <FlowDiagram />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-ink-200/70 bg-white p-6 dark:border-ink-800 dark:bg-ink-900/40"
            >
              <div className="font-mono text-xs text-accent-500">{s.n}</div>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowDiagram() {
  return (
    <svg
      viewBox="0 0 960 280"
      className="w-full h-auto"
      role="img"
      aria-label="pg_orca query flow diagram: PostgreSQL Query AST passes through the planner_hook into pg_orca, which translates to DXL, runs the ORCA optimizer with Memo, transformation rules and statistics, and emits a DXL plan that is translated back into a PostgreSQL PlannedStmt for the executor. On failure it falls back to standard_planner."
    >
      <defs>
        <linearGradient id="grad-brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5b87ff" />
          <stop offset="100%" stopColor="#3563f6" />
        </linearGradient>
        <linearGradient id="grad-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-ink-400 dark:text-ink-500" />
        </marker>
      </defs>

      {/* Top row: PG */}
      <Node x={20} y={40} w={140} h={56} label="PG Query AST" sub="parser/analyzer" tone="ink" />
      <Arrow x1={160} y1={68} x2={210} y2={68} />
      <Node x={210} y={40} w={150} h={56} label="planner_hook" sub="pg_orca.cpp" tone="brand" />
      <Arrow x1={360} y1={68} x2={410} y2={68} />
      <Node x={410} y={40} w={140} h={56} label="Query → DXL" sub="translate/" tone="brand" />
      <Arrow x1={550} y1={68} x2={600} y2={68} />
      <Node x={600} y={40} w={170} h={56} label="ORCA Optimizer" sub="libgpopt + xforms" tone="accent" />

      {/* Down from ORCA */}
      <Arrow x1={685} y1={96} x2={685} y2={150} />

      {/* Middle: Memo + Cost */}
      <Node x={520} y={150} w={140} h={56} label="Memo" sub="groups + cost" tone="accent" dashed />
      <Node x={690} y={150} w={170} h={56} label="Statistics" sub="histograms · NDV · MCV" tone="accent" dashed />
      <Arrow x1={605} y1={178} x2={690} y2={178} bidi />

      {/* Bottom row */}
      <Arrow x1={520} y1={178} x2={420} y2={178} />
      <Node x={250} y={150} w={170} h={56} label="relcache adapter" sub="gpopt/relcache/" tone="brand" dashed />
      <Arrow x1={335} y1={206} x2={335} y2={230} />

      <Node x={20} y={150} w={170} h={56} label="DXL Plan" sub="best-cost alternative" tone="ink" />
      <Arrow x1={250} y1={178} x2={190} y2={178} />

      <Arrow x1={105} y1={206} x2={105} y2={230} />
      <Node x={20} y={230} w={170} h={40} label="PlannedStmt" sub="" tone="ink" />
      <Arrow x1={190} y1={250} x2={250} y2={250} />
      <Node x={250} y={230} w={170} h={40} label="PG Executor" sub="" tone="ink" />

      {/* Fallback arrow */}
      <g opacity="0.7">
        <path
          d="M 280 96 Q 280 130 105 200 Q 50 220 50 230"
          stroke="currentColor"
          strokeDasharray="4 4"
          fill="none"
          className="text-rose-400"
        />
        <text x="280" y="125" className="fill-rose-500 dark:fill-rose-400" fontSize="10" fontFamily="monospace">
          on failure: standard_planner
        </text>
      </g>
    </svg>
  );
}

function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  tone,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  tone: "ink" | "brand" | "accent";
  dashed?: boolean;
}) {
  const fill =
    tone === "brand"
      ? "url(#grad-brand)"
      : tone === "accent"
        ? "url(#grad-accent)"
        : "rgb(255 255 255 / 0)";
  const textColor = tone === "ink" ? "fill-ink-900 dark:fill-ink-100" : "fill-white";
  const subColor = tone === "ink" ? "fill-ink-500 dark:fill-ink-400" : "fill-white/80";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={fill}
        stroke={tone === "ink" ? "currentColor" : "none"}
        className={tone === "ink" ? "text-ink-300 dark:text-ink-700" : ""}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text x={x + w / 2} y={y + (sub ? 24 : 26)} textAnchor="middle" fontSize="13" fontWeight="600" className={textColor}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 42} textAnchor="middle" fontSize="10" fontFamily="monospace" className={subColor}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, bidi }: { x1: number; y1: number; x2: number; y2: number; bidi?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeWidth={1.5}
      markerEnd="url(#arrow)"
      markerStart={bidi ? "url(#arrow)" : undefined}
      className="text-ink-400 dark:text-ink-500"
    />
  );
}
