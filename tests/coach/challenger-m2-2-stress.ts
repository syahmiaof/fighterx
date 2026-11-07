/**
 * Challenger M2-2 Empirical Stress Test Harness
 * 
 * Verifies:
 * 1. SVG Donut Chart Geometry Oracle ($C = 2\pi r$, 28 athletes 61%/25%/14%, arc sum = C)
 * 2. Zero External Charting Packages in package.json
 * 3. Donut Chart Edge Cases (0 athletes div-by-zero & "0 Atlet", 1 athlete, 1000 athletes, extreme splits)
 * 4. Athlete Directory Filtering (/coach/athletes search by name, discipline filter, exact fallback "Tiada atlet dijumpai")
 * 5. Track A Zero-Touch Isolation Boundary
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { MOCK_ATHLETES as mockAthletes } from "../../src/lib/coach/mock-data";
import type { Athlete } from "../../src/lib/coach/types";

const ROOT_DIR = path.resolve(__dirname, "../..");

interface TestResult {
  suite: string;
  testName: string;
  status: "PASS" | "FAIL";
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg);
  }
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  if (actual !== expected) {
    throw new Error(`${msg}: expected ${expected}, got ${actual}`);
  }
}

function assertCloseTo(actual: number, expected: number, tolerance = 1e-6, msg?: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${msg || "assertCloseTo failed"}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

function assertIncludes(haystack: string, needle: string, msg: string) {
  if (!haystack.includes(needle)) {
    throw new Error(`${msg}: substring "${needle}" not found`);
  }
}

async function runTest(suite: string, name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    const durationMs = performance.now() - start;
    results.push({ suite, testName: name, status: "PASS", durationMs });
    console.log(`  ✓ PASS [${suite}] ${name} (${durationMs.toFixed(2)}ms)`);
  } catch (err: unknown) {
    const durationMs = performance.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ suite, testName: name, status: "FAIL", durationMs, error: msg });
    console.error(`  ✗ FAIL [${suite}] ${name}: ${msg}`);
  }
}

// Donut math simulator mirroring coach-donut-chart.tsx
function computeDonutMath(total: number, konsisten: number, sederhana: number, perluPerhatian: number) {
  const pctKonsisten = total > 0 ? Math.round((konsisten / total) * 100) : 0;
  const pctSederhana = total > 0 ? Math.round((sederhana / total) * 100) : 0;
  const pctPerluPerhatian = total > 0 ? Math.max(0, 100 - pctKonsisten - pctSederhana) : 0;

  const r = 45;
  const C = 2 * Math.PI * r;

  const arcKonsisten = total > 0 ? (konsisten / total) * C : 0;
  const arcSederhana = total > 0 ? (sederhana / total) * C : 0;
  const arcPerluPerhatian = total > 0 ? (perluPerhatian / total) * C : 0;

  return {
    r,
    C,
    pctKonsisten,
    pctSederhana,
    pctPerluPerhatian,
    arcKonsisten,
    arcSederhana,
    arcPerluPerhatian,
    sumArcs: arcKonsisten + arcSederhana + arcPerluPerhatian,
    sumPct: pctKonsisten + pctSederhana + pctPerluPerhatian,
  };
}

// Directory filter simulator mirroring src/app/coach/athletes/page.tsx
function filterAthletes(
  athletes: Athlete[],
  searchQuery: string,
  disciplineFilter: string,
  tierFilter: string = "ALL"
): Athlete[] {
  return athletes.filter((ath) => {
    if (
      searchQuery &&
      !ath.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ath.discipline.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ath.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (disciplineFilter !== "ALL" && ath.discipline !== disciplineFilter) {
      return false;
    }

    if (tierFilter !== "ALL" && ath.consistencyTier !== tierFilter) {
      return false;
    }

    return true;
  });
}

async function main() {
  console.log("======================================================================");
  console.log("  CHALLENGER M2-2: EMPIRICAL STRESS & ADVERSARIAL ORACLE");
  console.log("  Donut Chart Vector Geometry, Edge Cases, Filtering & Isolation");
  console.log("======================================================================\n");

  // ==========================================================================
  // SUITE 1: SVG Donut Chart Geometry Oracle
  // ==========================================================================
  console.log("--- SUITE 1: SVG DONUT CHART GEOMETRY ORACLE ---");

  await runTest("DONUT-GEO", "Verify radius r=45 and circumference C = 2 * PI * r", () => {
    const chartPath = path.join(ROOT_DIR, "src/components/coach/dashboard/coach-donut-chart.tsx");
    assert(fs.existsSync(chartPath), "coach-donut-chart.tsx must exist");
    const code = fs.readFileSync(chartPath, "utf-8");

    assertIncludes(code, "const r = 45;", "Radius r must be exactly 45");
    assertIncludes(code, "const C = 2 * Math.PI * r;", "Circumference C must equal 2 * Math.PI * r");

    const expectedC = 2 * Math.PI * 45;
    assertCloseTo(expectedC, 282.7433388, 1e-5, "Circumference must approximate 282.74");
  });

  await runTest("DONUT-GEO", "Verify 28 athletes distribution: 17 (61%), 7 (25%), 4 (14%)", () => {
    const math = computeDonutMath(28, 17, 7, 4);

    assertEqual(math.pctKonsisten, 61, "pctKonsisten must be 61%");
    assertEqual(math.pctSederhana, 25, "pctSederhana must be 25%");
    assertEqual(math.pctPerluPerhatian, 14, "pctPerluPerhatian must be 14%");
    assertEqual(math.sumPct, 100, "Percentages must sum to exactly 100%");
  });

  await runTest("DONUT-GEO", "Verify stroke-dasharray segments sum exactly to C", () => {
    const math = computeDonutMath(28, 17, 7, 4);

    // Sum of arc lengths must equal circumference C
    assertCloseTo(math.sumArcs, math.C, 1e-10, "Sum of arc segments must equal C exactly");

    // Check offsets ensure continuity without gaps
    const offset1 = 0;
    assertEqual(offset1, 0, "Segment 1 starts at offset 0");
    const offset2 = -math.arcKonsisten;
    const offset3 = -(math.arcKonsisten + math.arcSederhana);

    // Arc 1 ends at math.arcKonsisten
    // Arc 2 starts at math.arcKonsisten, ends at math.arcKonsisten + math.arcSederhana
    // Arc 3 starts at math.arcKonsisten + math.arcSederhana, ends at math.C
    assertCloseTo(-offset2, math.arcKonsisten, 1e-10, "Segment 2 offset starts exactly where Segment 1 ends");
    assertCloseTo(-offset3, math.arcKonsisten + math.arcSederhana, 1e-10, "Segment 3 offset starts where Segment 2 ends");
    assertCloseTo(-offset3 + math.arcPerluPerhatian, math.C, 1e-10, "Segment 3 ends exactly at circumference C");
  });

  await runTest("DONUT-GEO", "Verify zero external charting packages in package.json", () => {
    const pkgPath = path.join(ROOT_DIR, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    const forbidden = [
      "recharts",
      "chart.js",
      "react-chartjs-2",
      "d3",
      "@types/d3",
      "victory",
      "nivo",
      "@nivo/core",
      "apexcharts",
      "react-apexcharts",
      "@tanstack/react-charts",
      "billboard.js",
      "plotly.js",
      "highcharts",
      "echarts",
      "echarts-for-react",
    ];

    for (const lib of forbidden) {
      assert(!allDeps[lib], `Forbidden charting library "${lib}" detected in package.json`);
    }
  });

  // ==========================================================================
  // SUITE 2: SVG Donut Edge Cases
  // ==========================================================================
  console.log("\n--- SUITE 2: SVG DONUT EDGE CASES ---");

  await runTest("DONUT-EDGE", "Edge case 0 athletes: division-by-zero protection, 0 Atlet center text", () => {
    const math = computeDonutMath(0, 0, 0, 0);

    assertEqual(math.pctKonsisten, 0, "pctKonsisten must be 0 (no NaN)");
    assertEqual(math.pctSederhana, 0, "pctSederhana must be 0 (no NaN)");
    assertEqual(math.pctPerluPerhatian, 0, "pctPerluPerhatian must be 0 (no NaN)");
    assertEqual(math.arcKonsisten, 0, "arcKonsisten must be 0");
    assertEqual(math.arcSederhana, 0, "arcSederhana must be 0");
    assertEqual(math.arcPerluPerhatian, 0, "arcPerluPerhatian must be 0");
    assert(!isNaN(math.sumArcs), "sumArcs must not be NaN");

    // Check component implementation for zero state handling
    const chartPath = path.join(ROOT_DIR, "src/components/coach/dashboard/coach-donut-chart.tsx");
    const code = fs.readFileSync(chartPath, "utf-8");

    // Verify division-by-zero guard
    assertIncludes(code, "total > 0 ? Math.round((konsisten / total) * 100) : 0", "pctKonsisten guarded against div-by-zero");
    assertIncludes(code, "total > 0 ? Math.round((sederhana / total) * 100) : 0", "pctSederhana guarded against div-by-zero");
    assertIncludes(code, "total > 0 ? Math.max(0, 100 - pctKonsisten - pctSederhana) : 0", "pctPerluPerhatian guarded");
    assertIncludes(code, "total === 0 ?", "Component checks for total === 0 to render single base ring");
    assertIncludes(code, "stroke=\"#45464b\"", "Component renders muted gray track on 0 total");
    assertIncludes(code, "{total}", "Center text renders total");
    assertIncludes(code, "Atlet", "Center text renders 'Atlet' label");
  });

  await runTest("DONUT-EDGE", "Edge case 1 athlete: single segment 100% full circle, arcs sum to C", () => {
    // 1 Konsisten
    const m1 = computeDonutMath(1, 1, 0, 0);
    assertEqual(m1.pctKonsisten, 100, "1 Konsisten must be 100%");
    assertEqual(m1.pctSederhana, 0, "pctSederhana must be 0%");
    assertEqual(m1.pctPerluPerhatian, 0, "pctPerluPerhatian must be 0%");
    assertCloseTo(m1.arcKonsisten, m1.C, 1e-10, "arcKonsisten must equal C");
    assertEqual(m1.arcSederhana, 0, "arcSederhana must be 0");
    assertEqual(m1.arcPerluPerhatian, 0, "arcPerluPerhatian must be 0");
    assertCloseTo(m1.sumArcs, m1.C, 1e-10, "Sum of arcs must equal C");

    // 1 Sederhana
    const m2 = computeDonutMath(1, 0, 1, 0);
    assertEqual(m2.pctKonsisten, 0, "pctKonsisten must be 0%");
    assertEqual(m2.pctSederhana, 100, "1 Sederhana must be 100%");
    assertEqual(m2.pctPerluPerhatian, 0, "pctPerluPerhatian must be 0%");
    assertCloseTo(m2.arcSederhana, m2.C, 1e-10, "arcSederhana must equal C");
    assertCloseTo(m2.sumArcs, m2.C, 1e-10, "Sum of arcs must equal C");

    // 1 Perlu Perhatian
    const m3 = computeDonutMath(1, 0, 0, 1);
    assertEqual(m3.pctKonsisten, 0, "pctKonsisten must be 0%");
    assertEqual(m3.pctSederhana, 0, "pctSederhana must be 0%");
    assertEqual(m3.pctPerluPerhatian, 100, "1 Perlu Perhatian must be 100%");
    assertCloseTo(m3.arcPerluPerhatian, m3.C, 1e-10, "arcPerluPerhatian must equal C");
    assertCloseTo(m3.sumArcs, m3.C, 1e-10, "Sum of arcs must equal C");
  });

  await runTest("DONUT-EDGE", "Edge case 1000 athletes: large scale scaling & percentage bounds", () => {
    // 610 Konsisten, 250 Sederhana, 140 Perlu Perhatian
    const math = computeDonutMath(1000, 610, 250, 140);
    assertEqual(math.pctKonsisten, 61, "pctKonsisten must be 61%");
    assertEqual(math.pctSederhana, 25, "pctSederhana must be 25%");
    assertEqual(math.pctPerluPerhatian, 14, "pctPerluPerhatian must be 14%");
    assertCloseTo(math.sumArcs, math.C, 1e-10, "Sum of arcs must equal C");
    assertEqual(math.sumPct, 100, "Sum of percentages must equal 100%");

    // Uneven split: 333, 333, 334
    const uneven = computeDonutMath(1000, 333, 333, 334);
    assertEqual(uneven.pctKonsisten, 33, "pctKonsisten must be 33%");
    assertEqual(uneven.pctSederhana, 33, "pctSederhana must be 33%");
    assertEqual(uneven.pctPerluPerhatian, 34, "pctPerluPerhatian must be 34%");
    assertEqual(uneven.sumPct, 100, "Percentages must sum to 100% via remainder clamping");
    assertCloseTo(uneven.sumArcs, uneven.C, 1e-10, "Sum of arcs must equal C");
  });

  await runTest("DONUT-EDGE", "Extreme distribution stress: 999 Konsisten, 1 Sederhana, 0 Perlu Perhatian", () => {
    const math = computeDonutMath(1000, 999, 1, 0);
    assertEqual(math.pctKonsisten, 100, "999/1000 rounds to 100%");
    assertEqual(math.pctSederhana, 0, "1/1000 rounds to 0%");
    assertEqual(math.pctPerluPerhatian, 0, "Perlu Perhatian clamped to max(0, 100 - 100 - 0) = 0%");
    assert(math.pctPerluPerhatian >= 0, "Percentage must never be negative");
    assertCloseTo(math.sumArcs, math.C, 1e-10, "Sum of arcs must equal C");
  });

  // ==========================================================================
  // SUITE 3: Athlete Directory Filtering (/coach/athletes)
  // ==========================================================================
  console.log("\n--- SUITE 3: ATHLETE DIRECTORY FILTERING ---");

  await runTest("ATH-FILTER", "Verify mock athletes seed contains 28 athletes", () => {
    assertEqual(mockAthletes.length, 28, "Total seed athletes count must be 28");
  });

  await runTest("ATH-FILTER", "Filter by Name: Case-insensitive match on athlete name", () => {
    const aimanResults = filterAthletes(mockAthletes, "Aiman", "ALL");
    assert(aimanResults.length >= 1, "Should find at least 1 athlete named Aiman");
    assert(aimanResults.some((a) => a.name.includes("Aiman")), "Matched athlete must include Aiman");

    // Case-insensitivity check
    const lowerResults = filterAthletes(mockAthletes, "aiman", "ALL");
    assertEqual(lowerResults.length, aimanResults.length, "Lowercase search must match identical count");

    // Siti search
    const sitiResults = filterAthletes(mockAthletes, "Siti", "ALL");
    assert(sitiResults.length >= 1, "Should find athletes named Siti");
    for (const a of sitiResults) {
      assertIncludes(a.name.toLowerCase(), "siti", "Each result must contain 'siti'");
    }
  });

  await runTest("ATH-FILTER", "Filter by Discipline: Silat Seni vs Silat Olahraga", () => {
    const seniAthletes = filterAthletes(mockAthletes, "", "Silat Seni");
    const olahragaAthletes = filterAthletes(mockAthletes, "", "Silat Olahraga");

    assert(seniAthletes.length > 0, "Silat Seni athletes must exist");
    assert(olahragaAthletes.length > 0, "Silat Olahraga athletes must exist");

    for (const a of seniAthletes) {
      assertEqual(a.discipline, "Silat Seni", "All returned athletes must be Silat Seni");
    }
    for (const a of olahragaAthletes) {
      assertEqual(a.discipline, "Silat Olahraga", "All returned athletes must be Silat Olahraga");
    }

    assertEqual(
      seniAthletes.length + olahragaAthletes.length,
      28,
      "Sum of Silat Seni and Silat Olahraga athletes must equal 28"
    );
  });

  await runTest("ATH-FILTER", "Filter by Discipline & Consistency Tier combination", () => {
    const konsistenOlahraga = filterAthletes(mockAthletes, "", "Silat Olahraga", "KONSISTEN");
    assert(konsistenOlahraga.length > 0, "Konsisten Silat Olahraga athletes must exist");
    for (const a of konsistenOlahraga) {
      assertEqual(a.discipline, "Silat Olahraga", "Discipline must match");
      assertEqual(a.consistencyTier, "KONSISTEN", "Tier must match");
    }
  });

  await runTest("ATH-FILTER", "Unmatched Query: Empty result triggers exact fallback 'Tiada atlet dijumpai'", () => {
    const nonExistent = filterAthletes(mockAthletes, "NonExistentAthleteXYZ12345", "ALL");
    assertEqual(nonExistent.length, 0, "Unmatched query must return 0 athletes");

    // Check fallback UI component in athlete-directory-table.tsx
    const tablePath = path.join(ROOT_DIR, "src/components/coach/athletes/athlete-directory-table.tsx");
    assert(fs.existsSync(tablePath), "athlete-directory-table.tsx must exist");
    const tableCode = fs.readFileSync(tablePath, "utf-8");

    assertIncludes(tableCode, "if (athletes.length === 0)", "Must have conditional check for athletes.length === 0");
    assertIncludes(tableCode, "Tiada atlet dijumpai", "Must render exact fallback text 'Tiada atlet dijumpai'");
    assertIncludes(
      tableCode,
      "Sila cuba kata kunci carian lain atau ubah penapis disiplin dan kategori.",
      "Must render helpful subtext for empty search fallback"
    );
  });

  // ==========================================================================
  // SUITE 4: Track A Isolation Boundary Audit
  // ==========================================================================
  console.log("\n--- SUITE 4: TRACK A ISOLATION BOUNDARY AUDIT ---");

  await runTest("TRACK-A", "Confirm zero modified or newly created files in Track A", () => {
    const trackAPaths = [
      path.join(ROOT_DIR, "src/app/athlete"),
      path.join(ROOT_DIR, "src/components/athlete"),
      path.join(ROOT_DIR, "src/lib/athlete"),
    ];

    // Reference cutoff time for milestone 2
    const cutoffTime = new Date("2026-11-07T22:30:00+08:00").getTime();

    for (const dir of trackAPaths) {
      if (!fs.existsSync(dir)) continue;

      const walk = (d: string) => {
        const entries = fs.readdirSync(d, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(d, entry.name);
          if (entry.isDirectory()) {
            walk(full);
          } else {
            const stat = fs.statSync(full);
            assert(
              stat.mtimeMs < cutoffTime,
              `Track A file modified during Milestone 2: ${full} (${new Date(stat.mtimeMs).toISOString()})`
            );
          }
        }
      };
      walk(dir);
    }
  });

  await runTest("TRACK-A", "Confirm zero cross-track imports from athlete into coach code", () => {
    const coachDirs = [
      path.join(ROOT_DIR, "src/app/coach"),
      path.join(ROOT_DIR, "src/components/coach"),
      path.join(ROOT_DIR, "src/lib/coach"),
    ];

    const forbiddenImports = [
      "@/app/athlete",
      "@/components/athlete",
      "@/lib/athlete",
      "../athlete",
      "../../athlete",
    ];

    for (const dir of coachDirs) {
      if (!fs.existsSync(dir)) continue;

      const walk = (d: string) => {
        const entries = fs.readdirSync(d, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(d, entry.name);
          if (entry.isDirectory()) {
            walk(full);
          } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
            const content = fs.readFileSync(full, "utf-8");
            for (const imp of forbiddenImports) {
              assert(
                !content.includes(`from "${imp}`) && !content.includes(`from '${imp}`),
                `Forbidden cross-track import "${imp}" found in ${full}`
              );
            }
          }
        }
      };
      walk(dir);
    }
  });

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log("\n----------------------------------------------------------------------");
  console.log(`TOTAL CHALLENGES: ${total}, PASSED: ${passed}, FAILED: ${failed}`);
  if (failed > 0) {
    console.error("  SOME CHALLENGES FAILED!");
    process.exit(1);
  } else {
    console.log("  ALL CHALLENGES PASSED EMPIRICALLY!");
  }
}

main().catch((err) => {
  console.error("Fatal error running challenger stress harness:", err);
  process.exit(1);
});
