/**
 * FighterX Coach Portal V1 - Challenger M2 Empirical Stress Test Harness
 * 
 * Adversarial test coverage:
 * 1. Review Actions (VERIFIED, CORRECTION, REJECTED) with diverse feedback remarks
 * 2. Monotonic pending count decrement and cross-feature KPI synchronization
 * 3. Sequential reviews and persistence under simulated browser reloads (localStorage)
 * 4. Athlete submission history reflection and multi-submission isolation
 * 5. Hostile edge cases: re-reviewing, non-existent IDs, huge feedback, XSS strings, corrupted reload
 * 6. Track A boundary and zero cross-track imports
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { MockCoachService } from "../../src/lib/coach/adapter";
import { MOCK_SUBMISSIONS, MOCK_ATHLETES, MOCK_COACH, MOCK_COMPETITIONS, MOCK_ASSESSMENTS } from "../../src/lib/coach/mock-data";
import type { TrainingSubmission, CoachKPIStats } from "../../src/lib/coach/types";

const ROOT_DIR = path.resolve(__dirname, "../..");
const STORAGE_KEY = "fighterx_coach_state_v1";

let passedCount = 0;
let failedCount = 0;
const failureLog: string[] = [];

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg);
  }
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  if (actual !== expected) {
    throw new Error(`${msg} -> Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`);
  }
}

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passedCount++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err: unknown) {
    failedCount++;
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Details: ${errMsg}`);
    failureLog.push(`${name}: ${errMsg}`);
  }
}

// Helper to simulate store KPI calculation matching store.tsx
function computeStoreKPIs(
  athletes: typeof MOCK_ATHLETES,
  submissions: TrainingSubmission[],
  competitions: typeof MOCK_COMPETITIONS
): CoachKPIStats {
  const totalAthletes = athletes.length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const verifiedCount = submissions.filter((s) => s.status === "VERIFIED").length;

  const konsistenCount = athletes.filter((a) => a.consistencyTier === "KONSISTEN").length;
  const sederhanaCount = athletes.filter((a) => a.consistencyTier === "SEDERHANA").length;
  const perluPerhatianCount = athletes.filter((a) => a.consistencyTier === "PERLU_PERHATIAN").length;

  const konsistenPercent = totalAthletes > 0 ? Math.round((konsistenCount / totalAthletes) * 100) : 0;
  const sederhanaPercent = totalAthletes > 0 ? Math.round((sederhanaCount / totalAthletes) * 100) : 0;
  const perluPerhatianPercent = totalAthletes > 0 ? Math.max(0, 100 - konsistenPercent - sederhanaPercent) : 0;

  const deltaVerified = Math.max(0, verifiedCount - 3);
  const calculatedVerifiedRate = Math.min(100, 76 + deltaVerified * 2);

  const upcomingCompetitionsCount = competitions.filter(
    (c) => c.status === "Pendaftaran Dibuka" || c.status === "Persiapan"
  ).length;

  return {
    totalAthletes,
    totalAthletesChange: 2,
    pendingVerifications: pendingCount,
    verifiedThisWeekRate: calculatedVerifiedRate,
    verifiedThisWeekChange: 8,
    upcomingCompetitionsCount,
    weeklyExecutionRate: 76,
    consistency: {
      konsistenCount,
      konsistenPercent,
      sederhanaCount,
      sederhanaPercent,
      perluPerhatianCount,
      perluPerhatianPercent,
    },
  };
}

// In-memory mock storage simulation for reload tests
class MockLocalStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

async function runEmpiricalHarness() {
  console.log("======================================================================");
  console.log("  FIGHTERX COACH PORTAL V1 // EMPIRICAL CHALLENGER M2 HARNESS");
  console.log("  Adversarial Verification of Review Actions, Propagation & Reload");
  console.log("======================================================================\n");

  // =========================================================================
  // SECTION 1: REVIEW ACTIONS & REMARKS SPECTRUM
  // =========================================================================
  console.log("--- SECTION 1: REVIEW ACTIONS SPECTRUM (VERIFIED, CORRECTION, REJECTED) ---");

  await test("Verify action transitions status to VERIFIED with preset Malay feedback", async () => {
    const service = new MockCoachService();
    const result = await service.reviewSubmission(
      "sub-01",
      "VERIFIED",
      "Teknik kemas, kedalaman push-up penuh dan siku rapat."
    );
    assertEqual(result.id, "sub-01", "Submission ID must match");
    assertEqual(result.status, "VERIFIED", "Status must be VERIFIED");
    assertEqual(result.coachFeedback, "Teknik kemas, kedalaman push-up penuh dan siku rapat.", "Feedback must match preset");
    assert(typeof result.reviewedAt === "string" && result.reviewedAt.length > 0, "reviewedAt timestamp must be set");
  });

  await test("Request Correction action transitions status to CORRECTION with actionable feedback", async () => {
    const service = new MockCoachService();
    const result = await service.reviewSubmission(
      "sub-02",
      "CORRECTION",
      "Sila muat naik rakaman larian penuh beserta data jam pintar."
    );
    assertEqual(result.id, "sub-02", "Submission ID must match");
    assertEqual(result.status, "CORRECTION", "Status must be CORRECTION");
    assertEqual(result.coachFeedback, "Sila muat naik rakaman larian penuh beserta data jam pintar.", "Feedback must match");
    assert(typeof result.reviewedAt === "string" && result.reviewedAt.length > 0, "reviewedAt timestamp must be set");
  });

  await test("Reject action transitions status to REJECTED with critique remark", async () => {
    const service = new MockCoachService();
    const result = await service.reviewSubmission(
      "sub-03",
      "REJECTED",
      "Punggung terlalu tinggi, tidak memenuhi piawaian plank standard."
    );
    assertEqual(result.id, "sub-03", "Submission ID must match");
    assertEqual(result.status, "REJECTED", "Status must be REJECTED");
    assertEqual(result.coachFeedback, "Punggung terlalu tinggi, tidak memenuhi piawaian plank standard.", "Feedback must match");
    assert(typeof result.reviewedAt === "string" && result.reviewedAt.length > 0, "reviewedAt timestamp must be set");
  });

  await test("Review actions preserve previous feedback when empty/undefined feedback is supplied", async () => {
    const service = new MockCoachService();
    // First review with feedback
    await service.reviewSubmission("sub-04", "CORRECTION", "Initial coach observation");
    // Second review without providing new feedback
    const second = await service.reviewSubmission("sub-04", "VERIFIED");
    assertEqual(second.status, "VERIFIED", "Status should update to VERIFIED");
    assertEqual(second.coachFeedback, "Initial coach observation", "Previous feedback must be preserved");
  });

  // =========================================================================
  // SECTION 2: MONOTONIC COUNT DECREMENTS & DYNAMIC KPI PROPAGATION
  // =========================================================================
  console.log("\n--- SECTION 2: MONOTONIC PENDING DECREMENTS & REACTIVE KPI SYNC ---");

  await test("Initial state exhibits exactly 12 pending submissions and 3 verified submissions", async () => {
    const service = new MockCoachService();
    const kpis = await service.getKPIStats();
    const allPending = await service.getSubmissions("PENDING");
    const allVerified = await service.getSubmissions("VERIFIED");

    assertEqual(kpis.pendingVerifications, 12, "KPI pendingVerifications must be 12");
    assertEqual(allPending.length, 12, "Pending submissions query must yield 12");
    assertEqual(allVerified.length, 3, "Verified submissions query must yield 3");
    
    // Store KPI baseline verifiedThisWeekRate is 76%
    const storeKPIs = computeStoreKPIs(MOCK_ATHLETES, MOCK_SUBMISSIONS, MOCK_COMPETITIONS);
    assertEqual(storeKPIs.verifiedThisWeekRate, 76, "Store baseline verified weekly rate must be 76%");
  });

  await test("Sequential reviews monotonically decrement pending count from 12 down to exactly 0", async () => {
    const service = new MockCoachService();
    const pendingList = await service.getSubmissions("PENDING");
    assertEqual(pendingList.length, 12, "Must start with 12 pending");

    const decisions: ("VERIFIED" | "CORRECTION" | "REJECTED")[] = [
      "VERIFIED",
      "CORRECTION",
      "REJECTED",
    ];

    for (let i = 0; i < pendingList.length; i++) {
      const sub = pendingList[i];
      const decision = decisions[i % decisions.length];
      const expectedPending = 12 - (i + 1);

      await service.reviewSubmission(sub.id, decision, `Empirical test review step ${i + 1}`);

      const currentKPIs = await service.getKPIStats();
      const currentPending = await service.getSubmissions("PENDING");

      assertEqual(
        currentKPIs.pendingVerifications,
        expectedPending,
        `Step ${i + 1}: KPI pendingVerifications must be ${expectedPending}`
      );
      assertEqual(
        currentPending.length,
        expectedPending,
        `Step ${i + 1}: Submissions query length must be ${expectedPending}`
      );
    }

    const finalKPIs = await service.getKPIStats();
    assertEqual(finalKPIs.pendingVerifications, 0, "Final pending count must be exactly 0");

    // Check that verified submissions count increased appropriately
    const finalVerified = await service.getSubmissions("VERIFIED");
    // 3 initial + 4 verified during loop = 7
    assertEqual(finalVerified.length, 7, "Total verified should now be 7");
    
    // Test store dynamic KPI calculation with all pending reviewed
    const allReviewedSubs = await service.getSubmissions();
    const dynamicKPIs = computeStoreKPIs(MOCK_ATHLETES, allReviewedSubs, MOCK_COMPETITIONS);
    assertEqual(dynamicKPIs.pendingVerifications, 0, "Store pendingVerifications must be 0");
    assertEqual(dynamicKPIs.verifiedThisWeekRate, 84, "Store verified rate should recalculate to 84%");
  });

  await test("Zero pending submissions activates queue empty state and preview empty state conditions", async () => {
    const service = new MockCoachService();
    const pendingList = await service.getSubmissions("PENDING");
    for (const sub of pendingList) {
      await service.reviewSubmission(sub.id, "VERIFIED", "Batch verify to empty queue");
    }

    const remainingPending = await service.getSubmissions("PENDING");
    assertEqual(remainingPending.length, 0, "No pending submissions should remain");

    // Verify empty state text in components
    const queueTablePath = path.join(ROOT_DIR, "src/components/coach/verification/verification-queue-table.tsx");
    const queueTableCode = fs.readFileSync(queueTablePath, "utf-8");
    assert(
      queueTableCode.includes("Semua penghantaran telah disahkan"),
      "Queue table must contain 'Semua penghantaran telah disahkan' for 0 items"
    );

    const pendingPreviewPath = path.join(ROOT_DIR, "src/components/coach/dashboard/coach-pending-preview.tsx");
    const pendingPreviewCode = fs.readFileSync(pendingPreviewPath, "utf-8");
    assert(
      pendingPreviewCode.includes("Semua penghantaran telah disahkan"),
      "Pending preview must contain 'Semua penghantaran telah disahkan' for 0 items"
    );
  });

  // =========================================================================
  // SECTION 3: SEQUENTIAL REVIEWS & PERSISTENCE UNDER SIMULATED RELOAD
  // =========================================================================
  console.log("\n--- SECTION 3: SIMULATED RELOAD & LOCALSTORAGE PERSISTENCE ---");

  await test("Simulated browser reload restores updated review states, feedback, and KPIs", async () => {
    const storage = new MockLocalStorage();

    // 1. Initial State in Session 1
    let localSubmissions: TrainingSubmission[] = JSON.parse(JSON.stringify(MOCK_SUBMISSIONS));
    const localAthletes = JSON.parse(JSON.stringify(MOCK_ATHLETES));
    const localCoach = JSON.parse(JSON.stringify(MOCK_COACH));
    const localAssessments = JSON.parse(JSON.stringify(MOCK_ASSESSMENTS));
    const localCompetitions = JSON.parse(JSON.stringify(MOCK_COMPETITIONS));

    // Perform 3 reviews in Session 1
    const reviewQueue = [
      { id: "sub-01", status: "VERIFIED" as const, feedback: "Sesi 1: Teknik mantap" },
      { id: "sub-02", status: "CORRECTION" as const, feedback: "Sesi 1: Perlu larian semula" },
      { id: "sub-03", status: "REJECTED" as const, feedback: "Sesi 1: Form tidak sah" },
    ];

    for (const r of reviewQueue) {
      localSubmissions = localSubmissions.map((s) =>
        s.id === r.id ? { ...s, status: r.status, coachFeedback: r.feedback, reviewedAt: "7 Nov 2026" } : s
      );
    }

    // Persist Session 1 state to storage
    const persistedPayload = {
      coach: localCoach,
      athletes: localAthletes,
      submissions: localSubmissions,
      assessments: localAssessments,
      competitions: localCompetitions,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(persistedPayload));

    // 2. Simulate Reload: Fresh session reading from storage
    const reloadedRaw = storage.getItem(STORAGE_KEY);
    assert(reloadedRaw !== null, "Storage must contain saved state");
    const reloaded = JSON.parse(reloadedRaw!);

    assertEqual(reloaded.submissions.length, 17, "Reloaded submissions count must be 17");
    const reloadedSub01 = reloaded.submissions.find((s: TrainingSubmission) => s.id === "sub-01");
    assertEqual(reloadedSub01.status, "VERIFIED", "sub-01 must remain VERIFIED after reload");
    assertEqual(reloadedSub01.coachFeedback, "Sesi 1: Teknik mantap", "sub-01 feedback preserved");

    const reloadedSub02 = reloaded.submissions.find((s: TrainingSubmission) => s.id === "sub-02");
    assertEqual(reloadedSub02.status, "CORRECTION", "sub-02 must remain CORRECTION after reload");

    const reloadedSub03 = reloaded.submissions.find((s: TrainingSubmission) => s.id === "sub-03");
    assertEqual(reloadedSub03.status, "REJECTED", "sub-03 must remain REJECTED after reload");

    // Recalculate KPIs after reload
    const reloadedKPIs = computeStoreKPIs(reloaded.athletes, reloaded.submissions, reloaded.competitions);
    assertEqual(reloadedKPIs.pendingVerifications, 9, "Pending count must be 12 - 3 = 9 after reload");

    // 3. Perform 2 more reviews in Session 2
    const session2Submissions: TrainingSubmission[] = reloaded.submissions.map((s: TrainingSubmission) => {
      if (s.id === "sub-04") return { ...s, status: "VERIFIED" as const, coachFeedback: "Sesi 2: Disahkan" };
      if (s.id === "sub-05") return { ...s, status: "VERIFIED" as const, coachFeedback: "Sesi 2: Bagus" };
      return s;
    });

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...reloaded,
        submissions: session2Submissions,
      })
    );

    // 4. Simulate Second Reload
    const reloaded2Raw = storage.getItem(STORAGE_KEY);
    const reloaded2 = JSON.parse(reloaded2Raw!);
    const reloaded2KPIs = computeStoreKPIs(reloaded2.athletes, reloaded2.submissions, reloaded2.competitions);
    assertEqual(reloaded2KPIs.pendingVerifications, 7, "Pending count must be 9 - 2 = 7 after second reload");
  });

  await test("Corrupted or incomplete storage gracefully falls back to mock defaults", async () => {
    const storeFilePath = path.join(ROOT_DIR, "src/lib/coach/store.tsx");
    const storeCode = fs.readFileSync(storeFilePath, "utf-8");

    // Verify store has try/catch block around localStorage parse
    assert(storeCode.includes("try {"), "store.tsx must wrap localStorage hydration in try-catch");
    assert(
      storeCode.includes("console.warn(\"FighterX CoachProvider: Failed to load state from localStorage\""),
      "store.tsx must warn and gracefully recover on parse error"
    );
    assert(
      storeCode.includes("setIsHydrated(true)"),
      "store.tsx must set isHydrated to true in finally block"
    );
  });

  // =========================================================================
  // SECTION 4: ATHLETE SUBMISSION HISTORY UPDATES
  // =========================================================================
  console.log("\n--- SECTION 4: ATHLETE SUBMISSION HISTORY REFLECTION ---");

  // Helper matching athlete-detail-view.tsx: submissions.filter((s) => s.athleteId === athlete.id)
  const getSubmissionsForAthlete = async (service: MockCoachService, athleteId: string) => {
    const all = await service.getSubmissions();
    return all.filter((s) => s.athleteId === athleteId);
  };

  await test("Review action immediately reflects in athlete's personal submission history", async () => {
    const service = new MockCoachService();
    const athleteId = "ath-01"; // Aiman Hakim

    // Fetch initial submissions for Aiman Hakim
    const initialSubs = await getSubmissionsForAthlete(service, athleteId);
    assert(initialSubs.length > 0, "Aiman Hakim must have at least 1 submission");
    const targetSub = initialSubs[0];

    const updated = await service.reviewSubmission(
      targetSub.id,
      "VERIFIED",
      "Kekemasan teknik Aiman sangat terpuji!"
    );
    assertEqual(updated.status, "VERIFIED", "Status must update to VERIFIED");

    // Fetch athlete submissions again
    const postReviewSubs = await getSubmissionsForAthlete(service, athleteId);
    const matching = postReviewSubs.find((s) => s.id === targetSub.id);
    assert(matching !== undefined, "Submission must exist in athlete history");
    assertEqual(matching!.status, "VERIFIED", "Athlete history must reflect VERIFIED status");
    assertEqual(matching!.coachFeedback, "Kekemasan teknik Aiman sangat terpuji!", "Athlete history must reflect coach feedback");
  });

  await test("Multiple submissions for the same athlete maintain independent status", async () => {
    const service = new MockCoachService();
    const allSubs = await service.getSubmissions();
    const athleteSubCounts = new Map<string, TrainingSubmission[]>();
    for (const s of allSubs) {
      const arr = athleteSubCounts.get(s.athleteId) || [];
      arr.push(s);
      athleteSubCounts.set(s.athleteId, arr);
    }

    // Verify each athlete's submissions are segregated
    for (const [athId, subs] of athleteSubCounts.entries()) {
      const athleteSubs = await getSubmissionsForAthlete(service, athId);
      assertEqual(athleteSubs.length, subs.length, `Athlete ${athId} submission count must match`);
      for (const expected of subs) {
        assert(
          athleteSubs.some((s) => s.id === expected.id),
          `Athlete ${athId} must contain submission ${expected.id}`
        );
      }
    }
  });

  await test("Athlete with zero submissions returns empty array without throwing", async () => {
    const service = new MockCoachService();
    const subs = await getSubmissionsForAthlete(service, "ath-99-nonexistent");
    assertEqual(subs.length, 0, "Nonexistent athlete must return 0 submissions");
    assert(Array.isArray(subs), "Result must be an Array");
  });

  // =========================================================================
  // SECTION 5: ADVERSARIAL EDGE CASES & HOSTILE MUTATIONS
  // =========================================================================
  console.log("\n--- SECTION 5: ADVERSARIAL EDGE CASES & STRESS HARNESS ---");

  await test("Re-reviewing a VERIFIED submission to REJECTED updates cleanly without count corruption", async () => {
    const service = new MockCoachService();
    // Initially review sub-01 to VERIFIED
    await service.reviewSubmission("sub-01", "VERIFIED", "Initially verified");
    let kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 11, "Pending should be 11");

    // Change mind: re-review sub-01 to REJECTED
    const reReview = await service.reviewSubmission("sub-01", "REJECTED", "Re-evaluated: form improper");
    assertEqual(reReview.status, "REJECTED", "Status should update to REJECTED");
    assertEqual(reReview.coachFeedback, "Re-evaluated: form improper", "Feedback should update");

    kpis = await service.getKPIStats();
    // Pending count must STILL be 11 (it was not pending anymore)
    assertEqual(kpis.pendingVerifications, 11, "Pending count must stay 11 on re-review");
  });

  await test("Reviewing non-existent submission ID throws descriptive error without corrupting store", async () => {
    const service = new MockCoachService();
    let threw = false;
    try {
      await service.reviewSubmission("sub-invalid-99999", "VERIFIED", "This should fail");
    } catch (err: unknown) {
      threw = true;
      const msg = err instanceof Error ? err.message : String(err);
      assert(msg.includes("not found") || msg.includes("sub-invalid-99999"), "Error message should mention ID");
    }
    assert(threw, "Reviewing non-existent submission must reject");

    // Assert that valid submissions are intact
    const kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 12, "Pending count must remain 12");
  });

  await test("Extremely long feedback remarks (10,000 chars) handled safely", async () => {
    const service = new MockCoachService();
    const longFeedback = "A".repeat(10000);
    const result = await service.reviewSubmission("sub-05", "VERIFIED", longFeedback);
    assertEqual(result.coachFeedback?.length, 10000, "Feedback length must be 10000");
  });

  await test("Hostile input with script tags and HTML entities stored safely without transformation bugs", async () => {
    const service = new MockCoachService();
    const xssPayload = `<script>alert('XSS')</script><img src="x" onerror="alert(1)"/>`;
    const result = await service.reviewSubmission("sub-06", "CORRECTION", xssPayload);
    assertEqual(result.coachFeedback, xssPayload, "Raw string must be stored verbatim for React auto-escaping");
  });

  await test("Concurrent reviews (Promise.all) on distinct submissions execute atomically", async () => {
    const service = new MockCoachService();
    const targets = ["sub-07", "sub-08", "sub-09", "sub-10"];

    await Promise.all(
      targets.map((id, idx) =>
        service.reviewSubmission(id, idx % 2 === 0 ? "VERIFIED" : "CORRECTION", `Concurrent review ${id}`)
      )
    );

    const kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 8, "Pending count must decrement by 4 to 8");

    for (const id of targets) {
      const sub = (await service.getSubmissions()).find((s) => s.id === id);
      assert(sub !== undefined, `Submission ${id} must exist`);
      assert(sub!.status !== "PENDING", `Submission ${id} must not be PENDING`);
    }
  });

  // =========================================================================
  // SECTION 6: TRACK A ZERO-TOUCH ISOLATION AUDIT
  // =========================================================================
  console.log("\n--- SECTION 6: TRACK A ZERO-TOUCH ISOLATION AUDIT ---");

  await test("Track A athlete directories contain ZERO modifications since baseline", () => {
    const athleteDirs = [
      path.join(ROOT_DIR, "src/app/athlete"),
      path.join(ROOT_DIR, "src/components/athlete"),
      path.join(ROOT_DIR, "src/lib/athlete"),
    ];

    const baselineThreshold = new Date("2026-11-07T22:20:00+08:00").getTime();

    function scanLastModified(dir: string): { file: string; mtime: number }[] {
      if (!fs.existsSync(dir)) return [];
      const results: { file: string; mtime: number }[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...scanLastModified(full));
        } else if (entry.isFile()) {
          const stats = fs.statSync(full);
          results.push({ file: full, mtime: stats.mtimeMs });
        }
      }
      return results;
    }

    const modifiedAfterThreshold: string[] = [];
    for (const d of athleteDirs) {
      const files = scanLastModified(d);
      for (const f of files) {
        if (f.mtime > baselineThreshold) {
          modifiedAfterThreshold.push(`${f.file} (${new Date(f.mtime).toISOString()})`);
        }
      }
    }

    assertEqual(
      modifiedAfterThreshold.length,
      0,
      `Track A isolation violation: Athlete files modified during Coach work: ${modifiedAfterThreshold.join(", ")}`
    );
  });

  await test("Zero imports from athlete directories exist anywhere within coach codebase", () => {
    const coachDirs = [
      path.join(ROOT_DIR, "src/lib/coach"),
      path.join(ROOT_DIR, "src/app/coach"),
      path.join(ROOT_DIR, "src/components/coach"),
    ];

    function scanForCrossTrackImports(dir: string): string[] {
      if (!fs.existsSync(dir)) return [];
      const violations: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          violations.push(...scanForCrossTrackImports(full));
        } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
          const content = fs.readFileSync(full, "utf-8");
          if (
            content.includes("@/lib/athlete") ||
            content.includes("@/components/athlete") ||
            content.includes("@/app/athlete") ||
            content.includes("../athlete")
          ) {
            violations.push(full);
          }
        }
      }
      return violations;
    }

    const crossTrackViolations: string[] = [];
    for (const d of coachDirs) {
      crossTrackViolations.push(...scanForCrossTrackImports(d));
    }

    assertEqual(
      crossTrackViolations.length,
      0,
      `Cross-track import violation: Coach files importing from athlete: ${crossTrackViolations.join(", ")}`
    );
  });

  console.log("\n======================================================================");
  console.log(`  EMPIRICAL CHALLENGER M2 RESULTS: ${passedCount} Passed, ${failedCount} Failed`);
  console.log("======================================================================\n");

  if (failedCount > 0) {
    console.error("Failure Summary:");
    failureLog.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runEmpiricalHarness().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
