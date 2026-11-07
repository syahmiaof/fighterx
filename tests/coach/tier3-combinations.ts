/**
 * Tier 3: Cross-Feature Combinations Test Suite
 * Tests pairwise interactions and reactive state propagation:
 * - Reviewing a submission updates dashboard KPIs, queue count, and athlete profile
 * - Registering an assessment updates athlete composite score and history
 * - Competition roster selection updates squad count and weight status
 * - Demo state reset restores initial seed state
 */

import {
  TestCase,
  assert,
  assertEqual,
} from "./types";
import { MockCoachService } from "../../src/lib/coach/adapter";

export const tier3Tests: TestCase[] = [
  {
    id: "T3-COMB-01",
    name: "Verification -> KPI & Queue Sync: Reviewing submission updates pending count and KPIs",
    tier: 3,
    category: "Cross-Feature Propagation",
    run: async () => {
      const service = new MockCoachService();

      // Check initial KPIs
      const initialKPIs = await service.getKPIStats();
      assertEqual(initialKPIs.pendingVerifications, 12, "Initial pending verifications must be 12");
      assertEqual(initialKPIs.totalAthletes, 28, "Total athletes must be 28");

      // Verify submission sub-01 (Aiman Hakim - Push-up)
      const reviewed = await service.reviewSubmission(
        "sub-01",
        "VERIFIED",
        "Bagus, kedalaman push-up penuh dan siku rapat."
      );

      assertEqual(reviewed.id, "sub-01", "Reviewed submission ID must match");
      assertEqual(reviewed.status, "VERIFIED", "Status must update to VERIFIED");
      assertEqual(
        reviewed.coachFeedback,
        "Bagus, kedalaman push-up penuh dan siku rapat.",
        "Coach feedback must be recorded"
      );
      assert(reviewed.reviewedAt !== undefined, "reviewedAt timestamp must be recorded");

      // Check updated KPIs
      const updatedKPIs = await service.getKPIStats();
      assertEqual(
        updatedKPIs.pendingVerifications,
        11,
        "Pending verifications must decrement to 11 after 1 verification"
      );

      // Verify queue filtering reflects update
      const pendingSubmissions = await service.getSubmissions("PENDING");
      assertEqual(pendingSubmissions.length, 11, "Pending submissions query must return 11 items");

      const verifiedSubmissions = await service.getSubmissions("VERIFIED");
      const foundVerified = verifiedSubmissions.find((s) => s.id === "sub-01");
      assert(foundVerified !== undefined, "Verified submission must be found in VERIFIED query");
    },
  },

  {
    id: "T3-COMB-02",
    name: "Multi-Status Reviews: Correction & Rejection state propagation",
    tier: 3,
    category: "Cross-Feature Propagation",
    run: async () => {
      const service = new MockCoachService();

      // Review sub-02 (Nur Alya) to CORRECTION
      const sub2 = await service.reviewSubmission(
        "sub-02",
        "CORRECTION",
        "Sila muat naik video larian penuh 6 minit, bukan klip 30 saat."
      );
      assertEqual(sub2.status, "CORRECTION", "sub-02 must be in CORRECTION status");
      assertEqual(
        sub2.coachFeedback,
        "Sila muat naik video larian penuh 6 minit, bukan klip 30 saat.",
        "Correction feedback must be saved"
      );

      // Review sub-03 (Faiz Irfan) to REJECTED
      const sub3 = await service.reviewSubmission(
        "sub-03",
        "REJECTED",
        "Punggung terlalu tinggi, tidak memenuhi piawaian plank standard."
      );
      assertEqual(sub3.status, "REJECTED", "sub-03 must be in REJECTED status");

      // Pending count should drop by 2 (12 -> 10)
      const kpis = await service.getKPIStats();
      assertEqual(kpis.pendingVerifications, 10, "Pending verifications must drop to 10");

      // Filter verification
      const corrections = await service.getSubmissions("CORRECTION");
      assert(
        corrections.some((s) => s.id === "sub-02"),
        "Correction query must include sub-02"
      );

      const rejected = await service.getSubmissions("REJECTED");
      assert(
        rejected.some((s) => s.id === "sub-03"),
        "Rejected query must include sub-03"
      );
    },
  },

  {
    id: "T3-COMB-03",
    name: "Assessment Registration -> History & Score propagation",
    tier: 3,
    category: "Cross-Feature Propagation",
    run: async () => {
      const service = new MockCoachService();

      const newAssessment = {
        athleteId: "ath-01",
        athleteName: "Aiman Hakim bin Rosli",
        date: "11 Mac 2027",
        type: "BASELINE_PHYSICAL" as const,
        metrics: {
          run6MinMeters: 1480,
          pushups1Min: 46,
          plankSec: 135,
          kneeToWallLeftCm: 11.5,
          kneeToWallRightCm: 12.0,
        },
        totalScore: 92,
        rating: "CEMERLANG" as const,
        notes: "Peningkatan cemerlang dalam ujian ketahanan aerobik dan teras.",
      };

      const registered = await service.registerAssessment(newAssessment);
      assert(registered.id.length > 0, "Registered assessment must have an ID");
      assertEqual(registered.athleteId, "ath-01", "Athlete ID must match");
      assertEqual(registered.totalScore, 92, "Total score must match");
      assertEqual(registered.rating, "CEMERLANG", "Rating must match");

      // Verify assessment is retrievable by athlete ID
      const athleteAssessments = await service.getAssessments("ath-01");
      const found = athleteAssessments.find((a) => a.id === registered.id);
      assert(found !== undefined, "Registered assessment must be retrievable via getAssessments(athleteId)");
    },
  },

  {
    id: "T3-COMB-04",
    name: "Competition Roster: Athlete selection & squad roster update",
    tier: 3,
    category: "Cross-Feature Propagation",
    run: async () => {
      const service = new MockCoachService();

      const competitions = await service.getCompetitions();
      assert(competitions.length > 0, "Competitions must not be empty");
      const targetComp = competitions[0];

      // Find an unselected athlete in the roster (isSelected === false)
      const unselectedAthlete = targetComp.roster.find((item) => !item.isSelected);
      assert(unselectedAthlete !== undefined, "At least one athlete in roster must initially be unselected");
      const targetAthleteId = unselectedAthlete!.athleteId;

      // Toggle selection to true
      const updatedComp = await service.updateRosterSelection(targetComp.id, targetAthleteId, true);
      const updatedItem = updatedComp.roster.find((item) => item.athleteId === targetAthleteId);
      assertEqual(updatedItem?.isSelected, true, `${targetAthleteId} must now be selected`);

      // Verify selected count increased
      const initialSelectedCount = targetComp.roster.filter((i) => i.isSelected).length;
      const updatedSelectedCount = updatedComp.roster.filter((i) => i.isSelected).length;
      assertEqual(
        updatedSelectedCount,
        initialSelectedCount + 1,
        "Selected count must increase by 1"
      );
    },
  },

  {
    id: "T3-COMB-05",
    name: "Demo State Reset: Full rollback to initial mock seed state",
    tier: 3,
    category: "Cross-Feature Propagation",
    run: async () => {
      const service = new MockCoachService();

      // Mutate state by reviewing a submission
      await service.reviewSubmission("sub-01", "VERIFIED", "Temporary review");
      let kpis = await service.getKPIStats();
      assertEqual(kpis.pendingVerifications, 11, "Pending must be 11 before reset");

      // Reset state
      await service.resetDemoState();

      // Verify rollback
      kpis = await service.getKPIStats();
      assertEqual(kpis.pendingVerifications, 12, "Pending must restore to 12 after reset");

      const sub1 = await service.getSubmissionById("sub-01");
      assertEqual(sub1?.status, "PENDING", "sub-01 status must rollback to PENDING");
    },
  },
];
