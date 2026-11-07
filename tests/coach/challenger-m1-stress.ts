/**
 * Empirical Stress Test Harness - Challenger M1
 * 
 * Adversarial tests covering:
 * 1. Rapid sequential mutations & pending decrement
 * 2. Boundary & hostile inputs (invalid IDs, empty feedback, missing fields)
 * 3. State rollback integrity via resetDemoState()
 * 4. Service adapter contract compliance & defensive immutability
 * 5. Corner-case KPI mathematical invariants
 */

import { MockCoachService } from "../../src/lib/coach/adapter";
import { MOCK_ASSESSMENTS } from "../../src/lib/coach/mock-data";

let passedCount = 0;
let failedCount = 0;
const failureDetails: string[] = [];

function test(name: string, fn: () => void | Promise<void>) {
  return async () => {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passedCount++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    Error: ${msg}`);
      failureDetails.push(`${name}: ${msg}`);
      failedCount++;
    }
  };
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  if (actual !== expected) {
    throw new Error(`${msg} -> Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`);
  }
}

async function runAllChallengerTests() {
  console.log("======================================================================");
  console.log("  CHALLENGER M1: EMPIRICAL STRESS & ADVERSARIAL TEST HARNESS");
  console.log("======================================================================");

  // -------------------------------------------------------------------------
  // SUITE 1: RAPID SEQUENTIAL MUTATIONS & PENDING QUEUE DECREMENT
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 1: RAPID MUTATIONS & QUEUE DECREMENT ---");

  await test("Rapid sequential review of all 12 pending submissions decrements count monotonically to 0", async () => {
    const service = new MockCoachService();
    const initialKPIs = await service.getKPIStats();
    assertEqual(initialKPIs.pendingVerifications, 12, "Initial pending verifications must be 12");

    const pending = await service.getSubmissions("PENDING");
    assertEqual(pending.length, 12, "Must have exactly 12 pending submissions");

    const statuses: Array<"VERIFIED" | "CORRECTION" | "REJECTED"> = [
      "VERIFIED",
      "CORRECTION",
      "REJECTED",
    ];

    let expectedPending = 12;
    for (let i = 0; i < pending.length; i++) {
      const sub = pending[i];
      const targetStatus = statuses[i % 3];
      const feedback = `Stress feedback for ${sub.id} with status ${targetStatus}`;

      const reviewed = await service.reviewSubmission(sub.id, targetStatus, feedback);
      expectedPending--;

      assertEqual(reviewed.id, sub.id, `Submission ID must match ${sub.id}`);
      assertEqual(reviewed.status, targetStatus, `Status must be updated to ${targetStatus}`);
      assertEqual(reviewed.coachFeedback, feedback, "Feedback must match");
      assert(typeof reviewed.reviewedAt === "string" && reviewed.reviewedAt.length > 0, "reviewedAt timestamp must be non-empty string");

      // Verify KPI decremented monotonically
      const kpis = await service.getKPIStats();
      assertEqual(
        kpis.pendingVerifications,
        expectedPending,
        `Pending count must decrement to ${expectedPending} after reviewing ${sub.id}`
      );
    }

    // At the end, pending queue must be 0
    const finalPending = await service.getSubmissions("PENDING");
    assertEqual(finalPending.length, 0, "Pending submissions list must be empty after 12 reviews");

    const finalKPIs = await service.getKPIStats();
    assertEqual(finalKPIs.pendingVerifications, 0, "Final pending verification KPI must be 0");
  })();

  await test("Status breakdowns accurately reflect multi-status reviews", async () => {
    const service = new MockCoachService();
    // 12 pending: review 4 as VERIFIED, 4 as CORRECTION, 4 as REJECTED
    // initial verified = 3, initial correction = 1, initial rejected = 1
    for (let i = 1; i <= 4; i++) {
      await service.reviewSubmission(`sub-0${i}`, "VERIFIED", "Good");
    }
    for (let i = 5; i <= 8; i++) {
      const id = i < 10 ? `sub-0${i}` : `sub-${i}`;
      await service.reviewSubmission(id, "CORRECTION", "Fix form");
    }
    for (let i = 9; i <= 12; i++) {
      const id = i < 10 ? `sub-0${i}` : `sub-${i}`;
      await service.reviewSubmission(id, "REJECTED", "Incomplete");
    }

    const verified = await service.getSubmissions("VERIFIED");
    const correction = await service.getSubmissions("CORRECTION");
    const rejected = await service.getSubmissions("REJECTED");

    assertEqual(verified.length, 3 + 4, "Verified submissions count must be 7 (3 initial + 4 new)");
    assertEqual(correction.length, 1 + 4, "Correction submissions count must be 5 (1 initial + 4 new)");
    assertEqual(rejected.length, 1 + 4, "Rejected submissions count must be 5 (1 initial + 4 new)");
  })();

  await test("Concurrent reviews via Promise.all across multiple submissions succeed without lost updates", async () => {
    const service = new MockCoachService();
    const batch = ["sub-01", "sub-02", "sub-03", "sub-04", "sub-05"];

    // Execute 5 reviews concurrently
    await Promise.all(
      batch.map((id, idx) =>
        service.reviewSubmission(
          id,
          idx % 2 === 0 ? "VERIFIED" : "CORRECTION",
          `Concurrent review for ${id}`
        )
      )
    );

    const kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 7, "Pending count must decrement by exactly 5 to 7");

    for (let i = 0; i < batch.length; i++) {
      const id = batch[i];
      const sub = await service.getSubmissionById(id);
      assertEqual(
        sub?.status,
        i % 2 === 0 ? "VERIFIED" : "CORRECTION",
        `${id} must have received its concurrent update`
      );
    }
  })();

  await test("Re-reviewing an already VERIFIED submission to REJECTED does not decrement pending count again", async () => {
    const service = new MockCoachService();
    // sub-01 is PENDING -> review to VERIFIED
    await service.reviewSubmission("sub-01", "VERIFIED", "Initial verify");
    let kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 11, "Pending should be 11 after first review");

    // Re-review sub-01 from VERIFIED to REJECTED
    const reReviewed = await service.reviewSubmission("sub-01", "REJECTED", "Reconsidered, form was flawed");
    assertEqual(reReviewed.status, "REJECTED", "Status must update to REJECTED");

    kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 11, "Pending count must remain 11 (must NOT decrement again)");
  })();

  // -------------------------------------------------------------------------
  // SUITE 2: BOUNDARY & HOSTILE INPUTS
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 2: BOUNDARY & HOSTILE INPUTS ---");

  await test("Non-existent submission ID throws explicit Error and does NOT corrupt state", async () => {
    const service = new MockCoachService();
    const badIds = ["sub-nonexistent", "", "!@#$%", "   ", "undefined", "null"];

    for (const badId of badIds) {
      let threw = false;
      try {
        await service.reviewSubmission(badId, "VERIFIED", "Feedback");
      } catch (err: unknown) {
        threw = true;
        assert(
          err instanceof Error && err.message.includes("not found"),
          `Expected 'not found' in error message for ID '${badId}', got: ${String(err)}`
        );
      }
      assert(threw, `Expected reviewSubmission to throw for invalid ID '${badId}'`);
    }

    // Verify state was completely unaffected
    const kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 12, "Pending count must remain 12 after rejected operations");
  })();

  await test("Empty feedback or undefined feedback preserves or safely handles coachFeedback", async () => {
    const service = new MockCoachService();
    // Review with undefined feedback
    const sub1 = await service.reviewSubmission("sub-01", "VERIFIED", undefined);
    assertEqual(sub1.status, "VERIFIED", "Status must update even without feedback");

    // Review with empty string feedback
    const sub2 = await service.reviewSubmission("sub-02", "CORRECTION", "");
    assertEqual(sub2.status, "CORRECTION", "Status must update with empty feedback");

    // Review sub-13 which already had existing feedback, passing undefined
    const sub13Before = await service.getSubmissionById("sub-13");
    assert(sub13Before?.coachFeedback !== undefined, "sub-13 must have initial feedback");
    const sub13After = await service.reviewSubmission("sub-13", "VERIFIED", undefined);
    assertEqual(
      sub13After.coachFeedback,
      sub13Before?.coachFeedback,
      "Undefined feedback should not overwrite existing feedback"
    );
  })();

  await test("Non-existent competition ID throws explicit Error", async () => {
    const service = new MockCoachService();
    let threw = false;
    try {
      await service.updateRosterSelection("comp-invalid-999", "ath-01", true);
    } catch (err: unknown) {
      threw = true;
      assert(err instanceof Error && err.message.includes("not found"), "Must indicate competition not found");
    }
    assert(threw, "Expected error on invalid competition ID");
  })();

  await test("Updating roster for non-existent athlete ID in valid competition leaves other roster items intact", async () => {
    const service = new MockCoachService();
    const comp = await service.getCompetitionById("comp-01");
    assert(comp !== undefined, "comp-01 must exist");
    const originalCount = comp!.roster.length;

    const updated = await service.updateRosterSelection("comp-01", "ath-ghost-unknown", true);
    assertEqual(updated.roster.length, originalCount, "Roster length must remain unchanged");
    assert(!updated.roster.some((r) => r.athleteId === "ath-ghost-unknown"), "Ghost athlete must not be injected");
  })();

  await test("Assessment registration with missing optional fields handles gracefully", async () => {
    const service = new MockCoachService();
    const minimalAssessment = {
      athleteId: "ath-02",
      athleteName: "Nur Alya",
      date: "10 Mac 2027",
      type: "TECHNICAL_SENI" as const,
      metrics: {},
      totalScore: 80,
      rating: "BAIK" as const,
    };

    const res = await service.registerAssessment(minimalAssessment);
    assert(res.id.startsWith("asm-"), "Auto-generated ID must start with asm-");
    assertEqual(res.notes, undefined, "Notes should be undefined without crashing");
    assertEqual(res.cycle, undefined, "Cycle should be undefined without crashing");
  })();

  await test("Duplicate assessment ID registration in adapter prepends new record", async () => {
    const service = new MockCoachService();
    const explicitId = "asm-explicit-test-01";
    await service.registerAssessment({
      id: explicitId,
      athleteId: "ath-01",
      athleteName: "Aiman Hakim",
      date: "10 Mac 2027",
      type: "BASELINE_PHYSICAL",
      metrics: { score: 70 },
      totalScore: 70,
      rating: "BAIK",
    });

    // Re-register with same ID but updated score
    await service.registerAssessment({
      id: explicitId,
      athleteId: "ath-01",
      athleteName: "Aiman Hakim",
      date: "11 Mac 2027",
      type: "BASELINE_PHYSICAL",
      metrics: { score: 90 },
      totalScore: 90,
      rating: "CEMERLANG",
    });

    const asms = await service.getAssessments("ath-01");
    const matching = asms.filter((a) => a.id === explicitId);
    assert(matching.length >= 1, "Matching assessment must exist");
    // Latest record is at index 0
    assertEqual(matching[0].totalScore, 90, "First matching assessment must be the most recently registered");
  })();

  await test("Repeated review of same submission with identical status is idempotent", async () => {
    const service = new MockCoachService();
    await service.reviewSubmission("sub-01", "VERIFIED", "Feedback 1");
    const kpis1 = await service.getKPIStats();

    // Call again with same parameters
    await service.reviewSubmission("sub-01", "VERIFIED", "Feedback 1");
    const kpis2 = await service.getKPIStats();

    assertEqual(
      kpis2.pendingVerifications,
      kpis1.pendingVerifications,
      "Pending count must remain identical on repeated review"
    );
  })();

  // -------------------------------------------------------------------------
  // SUITE 3: STATE ROLLBACK INTEGRITY
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 3: STATE ROLLBACK VIA resetDemoState() ---");

  await test("Full state rollback restores all mutated collections and KPIs", async () => {
    const service = new MockCoachService();

    // 1. Mutate submissions
    await service.reviewSubmission("sub-01", "VERIFIED", "Mutated review");
    await service.reviewSubmission("sub-02", "REJECTED", "Mutated reject");
    await service.reviewSubmission("sub-03", "CORRECTION", "Mutated corr");

    // 2. Mutate assessments
    await service.registerAssessment({
      id: "asm-temporary-999",
      athleteId: "ath-01",
      athleteName: "Aiman Hakim",
      date: "15 Mac 2027",
      type: "BASELINE_PHYSICAL",
      metrics: { score: 99 },
      totalScore: 99,
      rating: "CEMERLANG",
    });

    // 3. Mutate roster (ath-10 is initially isSelected: false)
    const compBefore = await service.getCompetitionById("comp-01");
    const ath10Before = compBefore?.roster.find((r) => r.athleteId === "ath-10");
    assertEqual(ath10Before?.isSelected, false, "ath-10 must initially be false");

    await service.updateRosterSelection("comp-01", "ath-10", true);
    const compMutated = await service.getCompetitionById("comp-01");
    const ath10Mutated = compMutated?.roster.find((r) => r.athleteId === "ath-10");
    assertEqual(ath10Mutated?.isSelected, true, "ath-10 must be true after mutation");

    // Verify dirty state
    let kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 9, "Pending verifications must be 9 before reset");
    let asms = await service.getAssessments();
    assert(asms.some((a) => a.id === "asm-temporary-999"), "Temporary assessment must exist");

    // 4. Perform Reset
    await service.resetDemoState();

    // 5. Verify restored state
    kpis = await service.getKPIStats();
    assertEqual(kpis.pendingVerifications, 12, "Pending count must be restored to 12");
    assertEqual(kpis.totalAthletes, 28, "Total athletes must be restored to 28");

    const sub1 = await service.getSubmissionById("sub-01");
    assertEqual(sub1?.status, "PENDING", "sub-01 must be reset to PENDING");
    assertEqual(sub1?.coachFeedback, undefined, "sub-01 feedback must be cleared");

    const sub2 = await service.getSubmissionById("sub-02");
    assertEqual(sub2?.status, "PENDING", "sub-02 must be reset to PENDING");

    asms = await service.getAssessments();
    assert(!asms.some((a) => a.id === "asm-temporary-999"), "Temporary assessment must be removed");
    assertEqual(asms.length, MOCK_ASSESSMENTS.length, `Assessments count must match mock count (${MOCK_ASSESSMENTS.length})`);

    const comp = await service.getCompetitionById("comp-01");
    const item = comp?.roster.find((r) => r.athleteId === "ath-10");
    assertEqual(item?.isSelected, false, "ath-10 roster selection must be restored to false");
  })();

  // -------------------------------------------------------------------------
  // SUITE 4: SERVICE ADAPTER CONTRACT & DEFENSIVE COPYING
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 4: SERVICE ADAPTER CONTRACT & IMMUTABILITY ---");

  await test("coachService.getAthletes() filters accurately and handles unknown disciplines", async () => {
    const service = new MockCoachService();

    const all = await service.getAthletes();
    assertEqual(all.length, 28, "Total athletes must be 28");

    const olahraga = await service.getAthletes("Silat Olahraga");
    assert(olahraga.length > 0, "Must have Silat Olahraga athletes");
    assert(olahraga.every((a) => a.discipline === "Silat Olahraga"), "All filtered must be Silat Olahraga");

    const seni = await service.getAthletes("Silat Seni");
    assert(seni.length > 0, "Must have Silat Seni athletes");
    assert(seni.every((a) => a.discipline === "Silat Seni"), "All filtered must be Silat Seni");

    assertEqual(olahraga.length + seni.length, 28, "Sum of Olahraga and Seni athletes must equal 28");

    const unknown = await service.getAthletes("Silat Unknown");
    assertEqual(unknown.length, 0, "Unknown discipline must return empty array without error");
  })();

  await test("coachService.getAthleteById() returns athlete or undefined cleanly", async () => {
    const service = new MockCoachService();
    const athlete = await service.getAthleteById("ath-01");
    assert(athlete !== undefined, "ath-01 must exist");
    assertEqual(athlete?.name, "Aiman Hakim bin Rosli", "ath-01 name must match");

    const nonExistent = await service.getAthleteById("ath-nonexistent");
    assertEqual(nonExistent, undefined, "Non-existent athlete must return undefined");
  })();

  await test("coachService.getSubmissions() by status returns exact counts", async () => {
    const service = new MockCoachService();
    const pending = await service.getSubmissions("PENDING");
    const verified = await service.getSubmissions("VERIFIED");
    const correction = await service.getSubmissions("CORRECTION");
    const rejected = await service.getSubmissions("REJECTED");

    assertEqual(pending.length, 12, "Initial pending count must be 12");
    assertEqual(verified.length, 3, "Initial verified count must be 3");
    assertEqual(correction.length, 1, "Initial correction count must be 1");
    assertEqual(rejected.length, 1, "Initial rejected count must be 1");
    assertEqual(
      pending.length + verified.length + correction.length + rejected.length,
      17,
      "Total mock submissions must be 17"
    );
  })();

  await test("Defensive copying: mutating returned athlete array does NOT corrupt service internal state", async () => {
    const service = new MockCoachService();
    const athletes = await service.getAthletes();
    athletes.pop(); // Mutate returned array by removing last item
    assertEqual(athletes.length, 27, "Locally mutated array should have 27 items");

    const freshAthletes = await service.getAthletes();
    assertEqual(freshAthletes.length, 28, "Service internal state must still have 28 athletes");
  })();

  await test("Defensive copying: mutating returned submissions array does NOT corrupt service internal state", async () => {
    const service = new MockCoachService();
    const subs = await service.getSubmissions();
    subs.length = 0; // Clear returned array
    assertEqual(subs.length, 0, "Locally mutated array should have 0 items");

    const freshSubs = await service.getSubmissions();
    assertEqual(freshSubs.length, 17, "Service internal state must still have 17 submissions");
  })();

  // -------------------------------------------------------------------------
  // SUITE 5: KPI INVARIANTS & ACCURACY
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 5: KPI MATHEMATICAL INVARIANTS ---");

  await test("Consistency percentage breakdown sums to exactly 100% (28 athletes: 17 / 7 / 4)", async () => {
    const service = new MockCoachService();
    const kpis = await service.getKPIStats();
    assert(kpis.consistency !== undefined, "consistency breakdown must be present");

    const { konsistenCount, sederhanaCount, perluPerhatianCount, konsistenPercent, sederhanaPercent, perluPerhatianPercent } = kpis.consistency!;

    assertEqual(konsistenCount, 17, "Konsisten count must be 17");
    assertEqual(sederhanaCount, 7, "Sederhana count must be 7");
    assertEqual(perluPerhatianCount, 4, "Perlu Perhatian count must be 4");
    assertEqual(konsistenCount + sederhanaCount + perluPerhatianCount, 28, "Total must equal 28");

    assertEqual(konsistenPercent, 61, "Konsisten percent must be 61%");
    assertEqual(sederhanaPercent, 25, "Sederhana percent must be 25%");
    assertEqual(perluPerhatianPercent, 14, "Perlu Perhatian percent must be 14%");
    assertEqual(konsistenPercent + sederhanaPercent + perluPerhatianPercent, 100, "Percentages must sum to 100%");
  })();

  console.log("\n======================================================================");
  console.log(`SUMMARY: ${passedCount} Passed, ${failedCount} Failed out of ${passedCount + failedCount} tests.`);
  console.log("======================================================================");

  if (failedCount > 0) {
    console.error("\nFAILURES DETECTED:");
    failureDetails.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  }
}

runAllChallengerTests().catch((err) => {
  console.error("FATAL ERROR in stress test execution:", err);
  process.exit(1);
});
