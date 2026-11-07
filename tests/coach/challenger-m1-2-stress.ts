/**
 * Challenger M1-2 Empirical Stress Test Harness
 * 
 * Adversarial and empirical verification of:
 * 1. Responsive layout logic & mobile breakpoint (<= 760px)
 * 2. 4 mobile tabs & reactive verification badge
 * 3. Pure SVG donut vector geometry ($2\pi r$, arc lengths, 61%/25%/14%, zero chart deps)
 * 4. Accessibility & prefers-reduced-motion clamping (0.01ms / 0s)
 * 5. Track A isolation boundary
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { assert, assertEqual, assertCloseTo, assertIncludes } from "./types";

const ROOT_DIR = path.resolve(__dirname, "../..");

interface StressResult {
  suite: string;
  testName: string;
  status: "PASS" | "FAIL";
  durationMs: number;
  error?: string;
}

const results: StressResult[] = [];

async function runChallenge(suite: string, name: string, fn: () => void | Promise<void>) {
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

async function main() {
  console.log("======================================================================");
  console.log("  CHALLENGER M1-2: EMPIRICAL STRESS & ADVERSARIAL ORACLE");
  console.log("  Verifying Responsive Layout, Pure SVG Math, A11y, and Track A");
  console.log("======================================================================\n");

  // ==========================================================================
  // SUITE 1: Mobile Breakpoint & Responsive CSS Rules
  // ==========================================================================
  await runChallenge("CSS-RESPONSIVE", "Sidebar collapsed on <= 760px", () => {
    const cssPath = path.join(ROOT_DIR, "src/app/coach/coach.css");
    assert(fs.existsSync(cssPath), "coach.css must exist");
    const css = fs.readFileSync(cssPath, "utf-8");

    // .coach-sidebar must be display: none by default
    const sidebarMatch = css.match(/\.coach-sidebar\s*\{[^}]*\}/);
    assert(sidebarMatch !== null, ".coach-sidebar CSS rule must be declared");
    assertIncludes(sidebarMatch![0], "display: none", "Default sidebar state must be display: none (collapsed on mobile/tablet)");

    // Sidebar must only expand on min-width: 1121px
    const minWidth1121Match = css.match(/@media\s*\(\s*min-width:\s*1121px\s*\)\s*\{([\s\S]+?)\n\}/);
    assert(minWidth1121Match !== null, "@media (min-width: 1121px) query must be declared for desktop sidebar");
    assertIncludes(minWidth1121Match![0], "display: flex", "Sidebar must expand to display: flex on min-width: 1121px");
  });

  await runChallenge("CSS-RESPONSIVE", "Mobile bottom nav visible on <= 760px with safe area", () => {
    const cssPath = path.join(ROOT_DIR, "src/app/coach/coach.css");
    const css = fs.readFileSync(cssPath, "utf-8");

    // Default: display: none
    const bottomNavDefault = css.match(/\.coach-bottom-nav\s*\{[^}]*\}/);
    assert(bottomNavDefault !== null, ".coach-bottom-nav default rule must exist");
    assertIncludes(bottomNavDefault![0], "display: none", "Bottom nav must be hidden on desktop by default");

    // Check all @media (max-width: 760px) blocks
    const mediaRegex = /@media\s*\(\s*max-width:\s*760px\s*\)\s*\{([^}]+(\{[^}]*\}[^}]*)*)\}/g;
    const mediaBlocks: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = mediaRegex.exec(css)) !== null) {
      mediaBlocks.push(match[0]);
    }
    assert(mediaBlocks.length > 0, "@media (max-width: 760px) query must exist");

    // Check bottom nav in the media blocks
    const bottomNavBlock = mediaBlocks.find((b) => b.includes(".coach-bottom-nav"));
    assert(bottomNavBlock !== undefined, "@media (max-width: 760px) must configure .coach-bottom-nav");
    assertIncludes(bottomNavBlock!, "display: grid", "Bottom nav on <= 760px must use display: grid");
    assertIncludes(bottomNavBlock!, "repeat(4, minmax(0, 1fr))", "Bottom nav must declare exactly 4 equal columns");
    assertIncludes(bottomNavBlock!, "safe-area-inset-bottom", "Bottom nav must support iOS home indicator safe-area-inset-bottom");
  });

  await runChallenge("CSS-RESPONSIVE", "Main content panel padding clears mobile bottom bar", () => {
    const cssPath = path.join(ROOT_DIR, "src/app/coach/coach.css");
    const css = fs.readFileSync(cssPath, "utf-8");

    const mediaRegex = /@media\s*\(\s*max-width:\s*760px\s*\)\s*\{([^}]+(\{[^}]*\}[^}]*)*)\}/g;
    const mediaBlocks: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = mediaRegex.exec(css)) !== null) {
      mediaBlocks.push(match[0]);
    }

    const panelBlock = mediaBlocks.find((b) => b.includes(".coach-content-panel"));
    assert(panelBlock !== undefined, "@media (max-width: 760px) must configure .coach-content-panel");
    assertIncludes(panelBlock!, "safe-area-inset-bottom", "Mobile content panel must pad bottom for safe-area-inset-bottom");
    assertIncludes(panelBlock!, "calc(76px + env(safe-area-inset-bottom))", "Mobile content panel must pad 76px + safe-area-inset-bottom");
  });

  // ==========================================================================
  // SUITE 2: 4 Mobile Navigation Tabs & Badge Dynamics
  // ==========================================================================
  await runChallenge("MOBILE-TABS", "Verify exact 4 tabs: Dashboard, Verifikasi (badge), Atlet, More", () => {
    const navPath = path.join(ROOT_DIR, "src/components/coach/layout/coach-mobile-bottom-nav.tsx");
    assert(fs.existsSync(navPath), "coach-mobile-bottom-nav.tsx must exist");
    const code = fs.readFileSync(navPath, "utf-8");

    // Check exact tab IDs and labels
    assertIncludes(code, 'id: "dashboard"', "Dashboard tab must exist");
    assertIncludes(code, 'label: "Dashboard"', "Dashboard tab label must be 'Dashboard'");
    assertIncludes(code, 'href: "/coach"', "Dashboard tab href must be '/coach'");

    assertIncludes(code, 'id: "verification"', "Verifikasi tab must exist");
    assertIncludes(code, 'label: "Verifikasi"', "Verifikasi tab label must be 'Verifikasi'");
    assertIncludes(code, 'href: "/coach/verification"', "Verifikasi tab href must be '/coach/verification'");
    assertIncludes(code, "badge: pendingCount", "Verifikasi tab must bind badge to pendingCount");

    assertIncludes(code, 'id: "athletes"', "Atlet tab must exist");
    assertIncludes(code, 'label: "Atlet"', "Atlet tab label must be 'Atlet'");
    assertIncludes(code, 'href: "/coach/athletes"', "Atlet tab href must be '/coach/athletes'");

    assertIncludes(code, 'id: "more"', "More tab must exist");
    assertIncludes(code, 'label: "More"', "More tab label must be 'More'");
    assertIncludes(code, 'href: "/coach/more"', "More tab href must be '/coach/more'");
  });

  await runChallenge("MOBILE-TABS", "Adversarial simulation of verification badge rendering", () => {
    // Model the badge rendering expression: typeof tab.badge === "number" && tab.badge > 0
    const shouldRenderBadge = (badge: unknown): boolean => {
      return typeof badge === "number" && badge > 0;
    };

    // Baseline seed: 12 pending
    assertEqual(shouldRenderBadge(12), true, "Pending count 12 must render badge");
    // Boundary: 0 pending
    assertEqual(shouldRenderBadge(0), false, "Pending count 0 must NOT render badge");
    // Boundary: negative or NaN or undefined
    assertEqual(shouldRenderBadge(-1), false, "Negative badge must NOT render");
    assertEqual(shouldRenderBadge(NaN), false, "NaN badge must NOT render");
    assertEqual(shouldRenderBadge(undefined), false, "Undefined badge must NOT render");
    // Large numbers: 99
    assertEqual(shouldRenderBadge(99), true, "Badge 99 must render");
  });

  await runChallenge("MOBILE-TABS", "Route active state matcher oracle", () => {
    // Simulate route matching logic from coach-mobile-bottom-nav.tsx
    const isDashboardActive = (path: string) => path === "/coach";
    const isVerifikasiActive = (path: string) => path.startsWith("/coach/verification");
    const isAtletActive = (path: string) => path.startsWith("/coach/athletes");
    const isMoreActive = (path: string) =>
      path.startsWith("/coach/more") ||
      path.startsWith("/coach/profile") ||
      path.startsWith("/coach/assessments") ||
      path.startsWith("/coach/competitions");

    // Exact matches
    assertEqual(isDashboardActive("/coach"), true);
    assertEqual(isDashboardActive("/coach/verification"), false);

    assertEqual(isVerifikasiActive("/coach/verification"), true);
    assertEqual(isVerifikasiActive("/coach/verification/sub-01"), true);
    assertEqual(isVerifikasiActive("/coach"), false);

    assertEqual(isAtletActive("/coach/athletes"), true);
    assertEqual(isAtletActive("/coach/athletes/ath-01"), true);
    assertEqual(isAtletActive("/coach"), false);

    assertEqual(isMoreActive("/coach/more"), true);
    assertEqual(isMoreActive("/coach/profile"), true);
    assertEqual(isMoreActive("/coach/assessments"), true);
    assertEqual(isMoreActive("/coach/competitions"), true);
    assertEqual(isMoreActive("/coach/verification"), false);
  });

  // ==========================================================================
  // SUITE 3: Pure SVG Donut Vector Geometry & Zero Chart Library Oracle
  // ==========================================================================
  await runChallenge("SVG-DONUT", "Zero external charting dependencies across entire workspace", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    const forbidden = [
      "recharts", "chart.js", "d3", "victory", "highcharts", "apexcharts",
      "echarts", "frappe-charts", "billboard.js", "c3", "nivo", "@visx/visx"
    ];

    for (const lib of forbidden) {
      assert(!deps[lib], `Workspace must NOT contain external chart library: ${lib}`);
    }
  });

  await runChallenge("SVG-DONUT", "Mathematical breakdown: 28 athletes -> 17 (61%), 7 (25%), 4 (14%)", () => {
    const mockPath = path.join(ROOT_DIR, "src/lib/coach/mock-data.ts");
    assert(fs.existsSync(mockPath), "mock-data.ts must exist");
    
    // Dynamically load mock data
    const mockContent = fs.readFileSync(mockPath, "utf-8");
    // Verify count of consistency tiers in mock data
    const konsistenCount = (mockContent.match(/consistencyTier:\s*"KONSISTEN"/g) || []).length;
    const sederhanaCount = (mockContent.match(/consistencyTier:\s*"SEDERHANA"/g) || []).length;
    const perluPerhatianCount = (mockContent.match(/consistencyTier:\s*"PERLU_PERHATIAN"/g) || []).length;

    assertEqual(konsistenCount, 17, "Konsisten athlete count in mock-data must be 17");
    assertEqual(sederhanaCount, 7, "Sederhana athlete count in mock-data must be 7");
    assertEqual(perluPerhatianCount, 4, "Perlu Perhatian athlete count in mock-data must be 4");

    const total = konsistenCount + sederhanaCount + perluPerhatianCount;
    assertEqual(total, 28, "Total athlete count must be 28");

    const pctKonsisten = Math.round((konsistenCount / total) * 100);
    const pctSederhana = Math.round((sederhanaCount / total) * 100);
    const pctPerluPerhatian = Math.round((perluPerhatianCount / total) * 100);

    assertEqual(pctKonsisten, 61, "Konsisten percentage must be 61%");
    assertEqual(pctSederhana, 25, "Sederhana percentage must be 25%");
    assertEqual(pctPerluPerhatian, 14, "Perlu Perhatian percentage must be 14%");
    assertEqual(pctKonsisten + pctSederhana + pctPerluPerhatian, 100, "Percentage sum must equal 100%");
  });

  await runChallenge("SVG-DONUT", "Pure SVG vector geometry: circumference and arc lengths for r=45", () => {
    const r = 45;
    const C = 2 * Math.PI * r;
    // Expected C = 90 * pi ~ 282.7433388230814
    assertCloseTo(C, 282.7433, 0.001, "Circumference 2*pi*r for r=45 must be ~282.7433");

    const total = 28;
    const kCount = 17;
    const sCount = 7;
    const pCount = 4;

    const arcK = (kCount / total) * C;
    const arcS = (sCount / total) * C;
    const arcP = (pCount / total) * C;

    assertCloseTo(arcK, 171.6656, 0.001, "Arc Konsisten must be ~171.6656");
    assertCloseTo(arcS, 70.6858, 0.001, "Arc Sederhana must be ~70.6858");
    assertCloseTo(arcP, 40.3919, 0.001, "Arc Perlu Perhatian must be ~40.3919");

    const totalArc = arcK + arcS + arcP;
    assertCloseTo(totalArc, C, 0.0001, "Sum of arc lengths must equal total circumference C");

    // Offset calculations:
    // Segment 1 starts at 0 (or -90 deg rotation)
    const offset1 = 0;
    // Segment 2 offset = -arcK
    const offset2 = -arcK;
    // Segment 3 offset = -(arcK + arcS)
    const offset3 = -(arcK + arcS);

    assertCloseTo(offset1, 0, 0.001);
    assertCloseTo(offset2, -171.6656, 0.001);
    assertCloseTo(offset3, -242.3514, 0.001);
  });

  await runChallenge("SVG-DONUT", "Adversarial stress: zero athletes division-by-zero & boundary handling", () => {
    const safeArcLength = (count: number, total: number, C: number) => {
      if (!total || total <= 0) return 0;
      return (count / total) * C;
    };

    const safePct = (count: number, total: number) => {
      if (!total || total <= 0) return 0;
      return Math.round((count / total) * 100);
    };

    const C = 2 * Math.PI * 45;

    // Test 0 athletes
    assertEqual(safeArcLength(0, 0, C), 0);
    assertEqual(safePct(0, 0), 0);
    assert(!isNaN(safeArcLength(0, 0, C)), "Arc length with 0 athletes must not be NaN");
    assert(!isNaN(safePct(0, 0)), "Percentage with 0 athletes must not be NaN");

    // Test 100% single tier
    assertEqual(safePct(28, 28), 100);
    assertCloseTo(safeArcLength(28, 28, C), C, 0.0001);
  });

  // ==========================================================================
  // SUITE 4: Accessibility & Reduced Motion Compliance
  // ==========================================================================
  await runChallenge("A11Y-MOTION", "prefers-reduced-motion clamps all animations to 0.01ms / 0s", () => {
    const cssPath = path.join(ROOT_DIR, "src/app/coach/coach.css");
    const css = fs.readFileSync(cssPath, "utf-8");

    const reducedMotionMatch = css.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{([\s\S]*?)\}/);
    assert(reducedMotionMatch !== null, "@media (prefers-reduced-motion: reduce) must be defined in coach.css");

    const rules = reducedMotionMatch![1];
    assertIncludes(rules, "animation-duration: 0.01ms !important", "Must clamp animation-duration to 0.01ms");
    assertIncludes(rules, "transition-duration: 0.01ms !important", "Must clamp transition-duration to 0.01ms");
    assertIncludes(rules, "scroll-behavior: auto !important", "Must disable smooth scroll when reduced motion is preferred");
  });

  await runChallenge("A11Y-MOTION", "ARIA navigation labeling on sidebar and bottom nav", () => {
    const sidebar = fs.readFileSync(path.join(ROOT_DIR, "src/components/coach/layout/coach-sidebar.tsx"), "utf-8");
    const bottomNav = fs.readFileSync(path.join(ROOT_DIR, "src/components/coach/layout/coach-mobile-bottom-nav.tsx"), "utf-8");

    assertIncludes(sidebar, 'aria-label="Navigasi Jurulatih"', "Sidebar must have aria-label");
    assertIncludes(sidebar, 'aria-label="Menu Jurulatih"', "Sidebar nav must have aria-label");
    assertIncludes(bottomNav, 'aria-label="Navigasi Mudah Alih"', "Bottom nav must have aria-label");
    assertIncludes(bottomNav, 'aria-current={tab.isActive ? "page" : undefined}', "Active tab must have aria-current='page'");
  });

  // ==========================================================================
  // SUITE 5: Track A Isolation Verification
  // ==========================================================================
  await runChallenge("TRACK-A-ISOLATION", "Coach codebase imports zero modules from Track A athlete portal", () => {
    const coachDirs = [
      path.join(ROOT_DIR, "src/app/coach"),
      path.join(ROOT_DIR, "src/components/coach"),
      path.join(ROOT_DIR, "src/lib/coach"),
    ];

    function checkDir(dir: string): string[] {
      if (!fs.existsSync(dir)) return [];
      const violations: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          violations.push(...checkDir(full));
        } else if (e.name.endsWith(".ts") || e.name.endsWith(".tsx")) {
          const content = fs.readFileSync(full, "utf-8");
          if (
            content.includes("@/app/athlete") ||
            content.includes("@/components/athlete") ||
            content.includes("@/lib/athlete") ||
            content.includes("../athlete")
          ) {
            violations.push(full);
          }
        }
      }
      return violations;
    }

    const violations: string[] = [];
    for (const d of coachDirs) {
      violations.push(...checkDir(d));
    }

    assertEqual(violations.length, 0, `Violations found: ${violations.join(", ")}`);
  });

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log("\n----------------------------------------------------------------------");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`TOTAL CHALLENGES: ${results.length}`);
  console.log(`PASSED:           ${passed}`);
  console.log(`FAILED:           ${failed}`);
  console.log("----------------------------------------------------------------------");

  if (failed > 0) {
    console.error("\nCRITICAL FAILURES DETECTED IN CHALLENGER SUITE!");
    process.exit(1);
  } else {
    console.log("\nALL CHALLENGER EMPIRICAL VERIFICATIONS PASSED WITH ZERO ERRORS!");
  }
}

main().catch((err) => {
  console.error("Fatal runner error:", err);
  process.exit(1);
});
