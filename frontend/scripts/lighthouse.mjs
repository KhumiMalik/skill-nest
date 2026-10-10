// Lighthouse audit (mobile, Lighthouse's default) of key pages, with minimum scores.
// Usage: npm run build && npm start -- --port 3100, then in another terminal: npm run lighthouse
//
// Settings (environment variables):
//   LH_BASE_URL         site to audit (default http://localhost:3100)
//   LH_MIN_SCORE        minimum for accessibility, best practices and SEO (default 0.9)
//   LH_MIN_PERFORMANCE  minimum performance score (default 0.9; CI uses less, as shared runners are slow and noisy)
//   LH_RUNS             runs per page; the median score counts (default 3), because single runs vary a lot
// Lighthouse is run with npx, so it is not a project dependency. It uses Playwright's Chromium unless CHROME_PATH is set.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.LH_BASE_URL ?? "http://localhost:3100";
const MIN_SCORE = Number(process.env.LH_MIN_SCORE ?? 0.9);
const MIN_PERFORMANCE = Number(process.env.LH_MIN_PERFORMANCE ?? 0.9);
const RUNS = Number(process.env.LH_RUNS ?? 3);
const PAGES = [
  "/",
  "/news",
  "/news/robotics-team-qualifies-for-national-final",
  "/events",
  "/admissions",
  "/gallery/sports-day-2026",
  "/contact",
];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const outDir = mkdtempSync(path.join(tmpdir(), "lighthouse-"));
const env = { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? chromium.executablePath() };
let failed = false;
/** Every report, for the machine benchmark at the end. */
const reportsSeen = [];

console.log(`Lighthouse (mobile) on ${BASE_URL}, median of ${RUNS} runs per page`);
console.log(`Minimum scores: performance ${MIN_PERFORMANCE * 100}, others ${MIN_SCORE * 100}\n`);
console.log(["page".padEnd(52), ...CATEGORIES.map((c) => c.slice(0, 11).padStart(12))].join(""));

/** Runs Lighthouse once and returns the parsed report. */
function runLighthouse(page, reportPath) {
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse",
      `"${BASE_URL}${page}"`,
      "--quiet",
      "--output=json",
      `--output-path="${reportPath}"`,
      `--only-categories=${CATEGORIES.join(",")}`,
      '--chrome-flags="--headless=new --no-sandbox"',
    ],
    { env, shell: true, stdio: ["ignore", "ignore", "inherit"] },
  );
  if (result.status !== 0) {
    console.error(`Lighthouse failed on ${page}`);
    process.exit(1);
  }
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  reportsSeen.push(report);
  return report;
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

for (const [index, page] of PAGES.entries()) {
  const reports = Array.from({ length: RUNS }, (_, run) =>
    runLighthouse(page, path.join(outDir, `report-${index}-${run}.json`)),
  );
  // The run with the median performance score, for listing what cost points.
  const byPerformance = [...reports].sort((a, b) => a.categories.performance.score - b.categories.performance.score);
  const { categories, audits } = byPerformance[Math.floor(RUNS / 2)];
  const scores = CATEGORIES.map((category) => median(reports.map((report) => report.categories[category].score)));
  console.log([page.padEnd(52), ...scores.map((score) => String(Math.round(score * 100)).padStart(12))].join(""));

  CATEGORIES.forEach((category, i) => {
    const minimum = category === "performance" ? MIN_PERFORMANCE : MIN_SCORE;
    if (scores[i] < minimum) {
      failed = true;
      // List what cost points, so the failure is actionable.
      const refs = categories[category].auditRefs.filter((ref) => ref.weight > 0);
      const issues = refs
        .map((ref) => audits[ref.id])
        .filter((audit) => audit.score !== null && audit.score < 0.9)
        .map((audit) => `${audit.title}${audit.displayValue ? ` (${audit.displayValue})` : ""}`);
      console.log(`    ${category} below ${minimum * 100}: ${issues.join("; ") || "see the report"}`);
    }
  });
}

// Lighthouse measures this machine's CPU speed on every run. Performance scores are only comparable
// between runs with a similar benchmark: a busy machine (other apps, a build) scores much lower.
const benchmarks = reportsSeen.map((report) => report.environment.benchmarkIndex);
const benchmark = median(benchmarks);
console.log(`\nMachine CPU benchmark (median): ${Math.round(benchmark)}`);
if (benchmark < 1000) {
  console.log("Warning: the machine was busy (benchmark below 1000), so performance scores are lower than usual.");
}
console.log(failed ? "\nSome scores are below the minimum." : "\nAll scores meet the minimum.");
process.exit(failed ? 1 : 0);
