// Server-only CSV loader. Imported from Server Components / build-time code only.
// Source: pg_orca repo, test/bench/results/ (HEAD=b17245d, 2026-05-27).

import "server-only";
import fs from "node:fs";
import path from "node:path";
import type {
  BenchmarkRow,
  ChartRow,
  Workload,
  WorkloadData,
  WorkloadSummary,
} from "./benchmarks-types";

const dataDir = path.join(process.cwd(), "data");

function readCsv(filename: string): string[][] {
  const raw = fs.readFileSync(path.join(dataDir, filename), "utf8").replace(/\r/g, "");
  return raw
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => parseCsvLine(l));
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuote = !inQuote;
    } else if (c === "," && !inQuote) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function fmtSpeedup(s: number): string {
  if (s >= 100) return `${Math.round(s)}×`;
  if (s >= 10) return `${s.toFixed(1)}×`;
  return `${s.toFixed(2)}×`;
}

// ------- TPC-H -------

function loadTpch(): { sf5: WorkloadData; sf10: WorkloadData } {
  const rows = readCsv("tpch_report_20260527.csv");
  // The TPC-H report has two tables joined head-to-tail. Find the second header
  // line ("scale_factor,...") to split them.
  const summaryHdrIdx = rows.findIndex(
    (r) => r[0] === "scale_factor" && r.includes("total_orca_s"),
  );
  if (summaryHdrIdx === -1) throw new Error("TPC-H summary header not found");

  const header = rows[0];
  const dataRows = rows.slice(1, summaryHdrIdx);
  const summaryHeader = rows[summaryHdrIdx];
  const summaryData = rows.slice(summaryHdrIdx + 1);

  function build(sf: "5" | "10"): WorkloadData {
    const orcaCol = header.indexOf(`sf${sf}_orca_ms`);
    const pgCol = header.indexOf(`sf${sf}_pg_ms`);
    const spCol = header.indexOf(`sf${sf}_speedup`);

    const all: BenchmarkRow[] = dataRows.map((r) => ({
      query: `Q${r[0]}`,
      orcaMs: Number(r[orcaCol]),
      pgMs: Number(r[pgCol]),
      speedup: Number(r[spCol]),
    }));

    const topWins = [...all].sort((a, b) => b.speedup - a.speedup).slice(0, 8);

    const sumRow = summaryData.find((r) => r[0] === sf)!;
    const idx = (k: string) => summaryHeader.indexOf(k);
    const summary: WorkloadSummary = {
      totalOrcaS: Number(sumRow[idx("total_orca_s")]),
      totalPgS: Number(sumRow[idx("total_pg_s")]),
      geomeanSpeedup: Number(sumRow[idx("geomean_speedup")]),
      medianSpeedup: Number(sumRow[idx("median_speedup")]),
      fasterCount: Number(sumRow[idx("orca_faster>5%")]),
      slowerCount: Number(sumRow[idx("orca_slower>5%")]),
      fallbacks: Number(sumRow[idx("fallbacks")]),
    };

    const id: Workload = sf === "5" ? "tpch-sf5" : "tpch-sf10";
    const label = `TPC-H · sf=${sf}`;
    const totalSummary = `ORCA ${summary.totalOrcaS.toFixed(0)} s vs PG ${summary.totalPgS.toFixed(0)} s — ${summary.geomeanSpeedup.toFixed(2)}× geomean across 22 queries.`;
    const wins = all.filter((r) => r.speedup >= 1.05);
    const biggest = topWins[0];
    const edgeSummary = `${wins.length} of 22 queries faster by ≥5%; biggest single win is ${biggest.query} at ${fmtSpeedup(biggest.speedup)}.`;

    return { id, label, rows: all, topWins, summary, totalSummary, edgeSummary };
  }

  return { sf5: build("5"), sf10: build("10") };
}

// ------- TPC-DS sf=1 -------

function loadTpcds(): WorkloadData {
  const rows = readCsv("tpcds_report_20260527.csv");
  // Split data table (query 1..99) from the trailing key,value SUMMARY block.
  const summaryHdrIdx = rows.findIndex((r) => r[0] === "metric" && r[1] === "value");
  if (summaryHdrIdx === -1) throw new Error("TPC-DS summary header not found");

  const header = rows[0];
  const idx = (k: string) => header.indexOf(k);
  const dataRows = rows.slice(1, summaryHdrIdx);

  const all: BenchmarkRow[] = dataRows.map((r) => {
    const orcaMs = Number(r[idx("orca_ms")]);
    const pgStatus = r[idx("pg_status")];
    const pgTimeout = pgStatus === "TIMEOUT";
    const pgMs = pgTimeout ? null : Number(r[idx("pg_ms")]);
    const rawSp = r[idx("speedup")];
    const speedup = pgTimeout
      ? Number(rawSp.replace(/^>=/, ""))
      : Number(rawSp);
    return { query: `Q${r[0]}`, orcaMs, pgMs, speedup, pgTimeout };
  });

  const topWins = [...all].sort((a, b) => b.speedup - a.speedup).slice(0, 10);

  const summaryMap = new Map<string, string>();
  for (const r of rows.slice(summaryHdrIdx + 1)) summaryMap.set(r[0], r[1] ?? "");

  const summary: WorkloadSummary = {
    totalOrcaS: Number(summaryMap.get("orca_total_s") ?? 0),
    totalPgS: Number(summaryMap.get("pg_total_s") ?? 0),
    geomeanSpeedup: Number(summaryMap.get("geomean_speedup") ?? 0),
    medianSpeedup: Number(summaryMap.get("median_speedup") ?? 0),
    fasterCount: Number(summaryMap.get("orca_faster>5%") ?? 0),
    slowerCount: Number(summaryMap.get("orca_slower>5%") ?? 0),
    fallbacks: 0,
    pgTimeouts: Number(summaryMap.get("pg_timeouts") ?? 0),
    pgTotalLowerBoundS: Number(summaryMap.get("pg_total_s_lowerbound") ?? 0),
  };

  const totalSummary = `On the ${summary.fasterCount + summary.slowerCount + 16} queries both finished: ORCA ${summary.totalOrcaS.toFixed(0)} s vs PG ${summary.totalPgS.toFixed(0)} s.`;
  const timeoutQs = all.filter((r) => r.pgTimeout).map((r) => r.query).join(", ");
  const lowerBoundRatio = summary.pgTotalLowerBoundS! / summary.totalOrcaS;
  const edgeSummary = `ORCA finished ${summary.pgTimeouts} queries PG timed out at 120 s — ${timeoutQs}. Counting the timeout floor → ORCA ≥ ${lowerBoundRatio.toFixed(2)}× faster overall.`;

  return {
    id: "tpcds-sf1",
    label: "TPC-DS · sf=1",
    rows: all,
    topWins,
    summary,
    totalSummary,
    edgeSummary,
  };
}

const tpch = loadTpch();
const tpcds = loadTpcds();

export const workloads: WorkloadData[] = [tpcds, tpch.sf10, tpch.sf5];

const patterns: Record<string, Record<string, string>> = {
  "tpcds-sf1": {
    Q1: "correlated subquery + multi-CTE",
    Q4: "multi-CTE roll-up",
    Q6: "correlated EXISTS over multi-join",
    Q11: "multi-CTE self-join",
    Q14: "complex multi-CTE",
    Q30: "correlated aggregate",
    Q41: "correlated IN + EXISTS",
    Q54: "correlated nested subquery",
    Q74: "multi-CTE self-join",
    Q81: "correlated subquery",
    Q31: "multi-CTE 6-way self-join",
    Q39: "multi-CTE roll-up",
    Q21: "correlated min/max",
    Q87: "set ops + roll-up",
    Q38: "set ops + multi-join",
  },
  "tpch-sf10": {
    Q4: "join + correlated EXISTS (anti-semi)",
    Q5: "5-way star join + filter",
    Q7: "5-way join + GROUP BY",
    Q9: "5-way join + GROUP BY",
    Q10: "4-way join + ORDER BY LIMIT",
    Q12: "2-way join + agg",
    Q17: "correlated aggregate (l_qty < 0.2×AVG)",
    Q18: "3-way join + GROUP BY HAVING",
    Q20: "correlated IN-subquery",
    Q21: "4-way join + NOT EXISTS",
  },
  "tpch-sf5": {
    Q4: "join + correlated EXISTS",
    Q5: "5-way star join + filter",
    Q7: "5-way join + GROUP BY",
    Q10: "4-way join + ORDER BY LIMIT",
    Q17: "correlated aggregate",
    Q18: "3-way join + GROUP BY HAVING",
    Q20: "correlated IN-subquery",
    Q21: "4-way join + NOT EXISTS",
  },
};

export function getChartRows(w: WorkloadData): ChartRow[] {
  const pmap = patterns[w.id] ?? {};
  const top = w.topWins.slice(0, 8).map((r) => ({
    ...r,
    pattern: pmap[r.query] ?? "—",
  }));
  const worst = [...w.rows]
    .filter((r) => !r.pgTimeout && r.speedup > 0)
    .sort((a, b) => a.speedup - b.speedup)[0];
  if (worst) {
    top.push({
      ...worst,
      pattern: pmap[worst.query] ?? "short query — planning overhead",
    });
  }
  return top;
}
