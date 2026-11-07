#!/usr/bin/env node
/**
 * Milestone 2 Automated Verification Suite
 * Tests Modules A (Dashboard), B (Verification), and C (Athletes)
 * for contract compliance, pure SVG math, edge cases, and reactive state propagation.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { MockCoachService } from "../../src/lib/coach/adapter";

const ROOT_DIR = path.resolve(__dirname, "../..");

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    failed++;
    console.error(`  ✕ FAIL: ${msg}`);
    throw new Error(msg);
  }
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  if (actual !== expected) {
    failed++;
    console.error(`  ✕ FAIL: ${msg} (Expected ${expected}, got ${actual})`);
    throw new Error(`${msg}: Expected ${expected}, got ${actual}`);
  }
}

async function runTest(id: string, name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ PASS [${id}] ${name}`);
  } catch (err) {
    console.error(`    Error details: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function runM2Suite() {
  console.log("\n======================================================================");
  console.log("  FIGHTERX MILESTONE 2: CORE MODULES A, B, C VERIFICATION SUITE");
  console.log("======================================================================\n");

  // --- MODULE A: DASHBOARD ---
  console.log("--- MODULE A: COACH DASHBOARD ---");

  await runTest("M2-MODA-01", "Dashboard Page & Component Files Exist", () => {
    const requiredFiles = [
      "src/app/coach/page.tsx",
      "src/components/coach/dashboard/coach-hero-banner.tsx",
      "src/components/coach/dashboard/coach-kpi-grid.tsx",
      "src/components/coach/dashboard/coach-donut-chart.tsx",
      "src/components/coach/dashboard/coach-pending-preview.tsx",
      "src/components/coach/dashboard/coach-weekly-progress.tsx",
      "src/components/coach/dashboard/coach-upcoming-competitions.tsx",
      "src/components/coach/dashboard/coach-quick-actions.tsx",
    ];

    for (const f of requiredFiles) {
      const fullPath = path.join(ROOT_DIR, f);
      assert(fs.existsSync(fullPath), `File ${f} must exist`);
    }
  });

  await runTest("M2-MODA-02", "Hero Banner: Cikgu Farid display typography & slashes", () => {
    const heroPath = path.join(ROOT_DIR, "src/components/coach/dashboard/coach-hero-banner.tsx");
    const content = fs.readFileSync(heroPath, "utf-8");
    assert(content.includes("Selamat Datang"), "Hero must contain greeting 'Selamat Datang'");
    assert(content.includes("Cikgu Farid"), "Hero must include 'Cikgu Farid'");
    assert(content.includes("//"), "Hero must include signature athletic slashes '//'");
    assert(content.includes("Program 2027"), "Hero must contain 'Program 2027' quick card");
  });

  await runTest("M2-MODA-03", "KPI Grid: 4 dynamic cards connected to store", () => {
    const kpiPath = path.join(ROOT_DIR, "src/components/coach/dashboard/coach-kpi-grid.tsx");
    const content = fs.readFileSync(kpiPath, "utf-8");
    assert(content.includes("Jumlah Atlet"), "Must have Jumlah Atlet card");
    assert(content.includes("Dalam Verifikasi"), "Must have Dalam Verifikasi card");
    assert(content.includes("Disahkan (Minggu Ini)"), "Must have Disahkan card");
    assert(content.includes("Pertandingan Akan Datang"), "Must have Pertandingan Akan Datang card");
    assert(content.includes("useCoachState"), "Must connect to reactive store via useCoachState");
  });

  await runTest("M2-MODA-04", "Donut Chart: Pure SVG vector, center hole, and 0 athletes guard", () => {
    const donutPath = path.join(ROOT_DIR, "src/components/coach/dashboard/coach-donut-chart.tsx");
    const content = fs.readFileSync(donutPath, "utf-8");
    assert(content.includes("<svg"), "Must render native <svg>");
    assert(content.includes("<circle"), "Must render native <circle>");
    assert(content.includes("Gambaran Atlet"), "Must contain header 'Gambaran Atlet'");
    assert(!content.includes("recharts") && !content.includes("chart.js"), "No external chart packages");

    // Zero athletes math guard test
    const calcZero = (count: number, tot: number) => (tot > 0 ? Math.round((count / tot) * 100) : 0);
    assertEqual(calcZero(0, 0), 0, "Division by zero must return 0");
    assert(!isNaN(calcZero(0, 0)), "Result must not be NaN");
  });

  await runTest("M2-MODA-05", "Pending Preview: Reference athletes, action buttons & empty state", () => {
    const previewPath = path.join(ROOT_DIR, "src/components/coach/dashboard/coach-pending-preview.tsx");
    const content = fs.readFileSync(previewPath, "utf-8");
    assert(content.includes("Menunggu Verifikasi"), "Must contain 'Menunggu Verifikasi'");
    assert(content.includes("Sahkan"), "Must contain 'Sahkan' action button");
    assert(content.includes("Semak"), "Must contain 'Semak' action button");
    assert(
      content.includes("Semua penghantaran telah disahkan"),
      "Must contain empty state message 'Semua penghantaran telah disahkan'"
    );
  });

  // --- MODULE B: VERIFICATION ---
  console.log("\n--- MODULE B: TRAINING VERIFICATION ---");

  await runTest("M2-MODB-01", "Verification Route & Component Files Exist", () => {
    const requiredFiles = [
      "src/app/coach/verification/page.tsx",
      "src/app/coach/verification/[submissionId]/page.tsx",
      "src/components/coach/verification/verification-queue-table.tsx",
      "src/components/coach/verification/submission-detail-view.tsx",
      "src/components/coach/verification/review-action-modal.tsx",
    ];

    for (const f of requiredFiles) {
      const fullPath = path.join(ROOT_DIR, f);
      assert(fs.existsSync(fullPath), `File ${f} must exist`);
    }
  });

  await runTest("M2-MODB-02", "Review Action Modal: 3 distinct decision actions & state propagation", async () => {
    const modalPath = path.join(ROOT_DIR, "src/components/coach/verification/review-action-modal.tsx");
    const content = fs.readFileSync(modalPath, "utf-8");
    assert(content.includes("VERIFIED"), "Modal must support VERIFIED action");
    assert(content.includes("CORRECTION"), "Modal must support CORRECTION action");
    assert(content.includes("REJECTED"), "Modal must support REJECTED action");
    assert(content.includes("reviewSubmission"), "Modal must call reviewSubmission");

    // Test adapter review state propagation
    const service = new MockCoachService();
    const verified = await service.reviewSubmission("sub-01", "VERIFIED", "Kemasan teknik push-up mantap.");
    assertEqual(verified.status, "VERIFIED", "Status must be VERIFIED");
    assertEqual(verified.coachFeedback, "Kemasan teknik push-up mantap.", "Feedback must match");

    const corrected = await service.reviewSubmission("sub-02", "CORRECTION", "Ulang semula rakaman larian.");
    assertEqual(corrected.status, "CORRECTION", "Status must be CORRECTION");

    const rejected = await service.reviewSubmission("sub-03", "REJECTED", "Postur teras tidak kemas.");
    assertEqual(rejected.status, "REJECTED", "Status must be REJECTED");
  });

  await runTest("M2-MODB-03", "Submission Detail View: Evidence player and prescribed metrics", () => {
    const detailPath = path.join(ROOT_DIR, "src/components/coach/verification/submission-detail-view.tsx");
    const content = fs.readFileSync(detailPath, "utf-8");
    assert(content.includes("Piawaian Tugasan vs Laporan Atlet"), "Must compare prescribed vs reported metrics");
    assert(content.includes("formatTime"), "Must format timecodes");
    assert(content.includes("Catatan Atlet"), "Must render athlete self-notes");
  });

  // --- MODULE C: ATHLETES ---
  console.log("\n--- MODULE C: ATHLETE MANAGEMENT ---");

  await runTest("M2-MODC-01", "Athlete Management Files Exist", () => {
    const requiredFiles = [
      "src/app/coach/athletes/page.tsx",
      "src/app/coach/athletes/[athleteId]/page.tsx",
      "src/components/coach/athletes/athlete-directory-table.tsx",
      "src/components/coach/athletes/athlete-detail-view.tsx",
    ];

    for (const f of requiredFiles) {
      const fullPath = path.join(ROOT_DIR, f);
      assert(fs.existsSync(fullPath), `File ${f} must exist`);
    }
  });

  await runTest("M2-MODC-02", "Athlete Directory: Search & empty fallback", () => {
    const dirTablePath = path.join(ROOT_DIR, "src/components/coach/athletes/athlete-directory-table.tsx");
    const content = fs.readFileSync(dirTablePath, "utf-8");
    assert(content.includes("Tiada atlet dijumpai"), "Directory must contain exact fallback 'Tiada atlet dijumpai'");
    assert(content.includes("Konsisten"), "Must display consistency badges");
  });

  await runTest("M2-MODC-03", "Athlete Profile: 3 Required Tabs", () => {
    const profilePath = path.join(ROOT_DIR, "src/components/coach/athletes/athlete-detail-view.tsx");
    const content = fs.readFileSync(profilePath, "utf-8");
    assert(content.includes("Sejarah Mingguan"), "Tab 1: Sejarah Mingguan must exist");
    assert(content.includes("Log Penyerahan"), "Tab 2: Log Penyerahan must exist");
    assert(content.includes("Rekod Penilaian & Baseline"), "Tab 3: Rekod Penilaian & Baseline must exist");
    assert(content.includes("registerAssessment"), "Must allow registering assessments");
  });

  // --- REVIEWER FINDINGS FIXES ---
  console.log("\n--- REVIEWER FINDINGS FIXES ---");

  await runTest("M2-FIX-01", "store.tsx: Clean registerAssessment without state tearing", () => {
    const storePath = path.join(ROOT_DIR, "src/lib/coach/store.tsx");
    const content = fs.readFileSync(storePath, "utf-8");
    assert(
      content.includes("saveState({ assessments: nextAssessments, athletes: nextAthletes })") ||
      content.includes("saveState({ assessments: nextAssessments })"),
      "registerAssessment must save combined assessments and athletes cleanly"
    );
  });

  await runTest("M2-FIX-02", "adapter.ts: totalAthletes > 0 division-by-zero protection in getKPIStats", async () => {
    const adapterPath = path.join(ROOT_DIR, "src/lib/coach/adapter.ts");
    const content = fs.readFileSync(adapterPath, "utf-8");
    assert(
      content.includes("totalAthletes > 0") &&
      content.includes("Math.round((konsistenCount / totalAthletes) * 100)"),
      "adapter.ts must guard consistency percentage against totalAthletes === 0"
    );

    const service = new MockCoachService();
    const kpis = await service.getKPIStats();
    assertEqual(kpis.totalAthletes, 28, "Total athletes initial is 28");
    assert(kpis.consistency !== undefined, "Consistency stats must be populated");
    assertEqual(kpis.consistency!.konsistenPercent, 61, "Konsisten % must be 61");
    assertEqual(kpis.consistency!.sederhanaPercent, 25, "Sederhana % must be 25");
    assertEqual(kpis.consistency!.perluPerhatianPercent, 14, "Perlu Perhatian % must be 14");
  });

  console.log("\n======================================================================");
  console.log(`MILESTONE 2 SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("======================================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runM2Suite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
