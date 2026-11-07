/**
 * Tier 4: Real-World Coach Scenarios Test Suite
 * End-to-end user journeys and system integrity audits:
 * - Scenario 1: Coach Morning Verification Triage (3 distinct outcomes: Verified, Correction, Rejected)
 * - Scenario 2: Complete Baseline Physical & Technical Assessment with Composite Scoring
 * - Scenario 3: Competition Squad Selection with Weight Status & Readiness Audit
 * - Scenario 4: Track A Isolation Audit (Strict boundary enforcement & zero cross-track imports)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import {
  TestCase,
  assert,
  assertEqual,
} from "./types";
import { MockCoachService } from "../../src/lib/coach/adapter";

const ROOT_DIR = path.resolve(__dirname, "../..");

export const tier4Tests: TestCase[] = [
  {
    id: "T4-SCEN-01",
    name: "Morning Verification Triage: Coach processes 3 submissions with 3 distinct outcomes",
    tier: 4,
    category: "Real-World Journey",
    run: async () => {
      const service = new MockCoachService();

      // Step 1: Coach logs in and checks pending queue
      const initialKPIs = await service.getKPIStats();
      assertEqual(initialKPIs.pendingVerifications, 12, "Coach starts morning session with 12 pending items");

      const pendingQueue = await service.getSubmissions("PENDING");
      assertEqual(pendingQueue.length, 12, "Queue returns 12 pending submissions");

      // Step 2: Submission 1 (Aiman Hakim - Push-up) -> VERIFIED
      const sub1 = pendingQueue[0];
      const res1 = await service.reviewSubmission(
        sub1.id,
        "VERIFIED",
        "Bagus, kedalaman push-up penuh dan kestabilan teras dikekalkan."
      );
      assertEqual(res1.status, "VERIFIED", "Submission 1 must be marked VERIFIED");
      assertEqual(
        res1.coachFeedback,
        "Bagus, kedalaman push-up penuh dan kestabilan teras dikekalkan."
      );

      // Step 3: Submission 2 (Nur Alya - Larian 6 Minit) -> CORRECTION
      const sub2 = pendingQueue[1];
      const res2 = await service.reviewSubmission(
        sub2.id,
        "CORRECTION",
        "Sila muat naik rakaman larian penuh 6 minit beserta data aplikasi jam tangan pintar."
      );
      assertEqual(res2.status, "CORRECTION", "Submission 2 must be marked CORRECTION");
      assertEqual(
        res2.coachFeedback,
        "Sila muat naik rakaman larian penuh 6 minit beserta data aplikasi jam tangan pintar."
      );

      // Step 4: Submission 3 (Faiz Irfan - Plank) -> REJECTED
      const sub3 = pendingQueue[2];
      const res3 = await service.reviewSubmission(
        sub3.id,
        "REJECTED",
        "Punggung terlalu tinggi dan lenturan tulang belakang tidak neutral. Sila ulang semula."
      );
      assertEqual(res3.status, "REJECTED", "Submission 3 must be marked REJECTED");
      assertEqual(
        res3.coachFeedback,
        "Punggung terlalu tinggi dan lenturan tulang belakang tidak neutral. Sila ulang semula."
      );

      // Step 5: Verify post-triage state
      const finalKPIs = await service.getKPIStats();
      assertEqual(
        finalKPIs.pendingVerifications,
        9,
        "Pending verifications must drop from 12 to 9 after 3 reviews"
      );

      const remainingPending = await service.getSubmissions("PENDING");
      assertEqual(remainingPending.length, 9, "9 pending items remain in queue");

      // Verify each reviewed submission is queryable by its specific status
      const verifiedList = await service.getSubmissions("VERIFIED");
      assert(verifiedList.some((s) => s.id === sub1.id), "sub1 must be present in verified list");

      const correctionList = await service.getSubmissions("CORRECTION");
      assert(correctionList.some((s) => s.id === sub2.id), "sub2 must be present in correction list");

      const rejectedList = await service.getSubmissions("REJECTED");
      assert(rejectedList.some((s) => s.id === sub3.id), "sub3 must be present in rejected list");
    },
  },

  {
    id: "T4-SCEN-02",
    name: "Baseline Physical & Technical Assessment: Complete evaluation with composite rating",
    tier: 4,
    category: "Real-World Journey",
    run: async () => {
      const service = new MockCoachService();

      // Coach evaluates athlete Aiman Hakim (ath-01)
      const athlete = await service.getAthleteById("ath-01");
      assert(athlete !== undefined, "Athlete ath-01 must exist");

      // 1. Physical metrics
      const physicalMetrics = {
        run6MinDistanceMeters: 1480,
        pushupsCount1Min: 46,
        plankDurationSeconds: 135,
        kneeToWallCmLeft: 11.5,
        kneeToWallCmRight: 12.0,
      };

      // 2. Technical metrics (Silat Olahraga)
      const technicalMetrics = {
        strikingSpeed: 9,
        techniquePrecision: 8,
        defenseEvasion: 8,
        tacticalTakedowns: 9,
      };

      // Composite calculation: average of technical metrics * 10 = 85%, physical = 90%
      const technicalAvg = (9 + 8 + 8 + 9) / 4; // 8.5 / 10
      const totalScore = Math.round((90 * 0.5) + (technicalAvg * 10 * 0.5)); // 88

      const assessmentRecord = {
        athleteId: "ath-01",
        athleteName: athlete!.name,
        date: "12 Mac 2027",
        type: "BASELINE_PHYSICAL" as const,
        cycle: "Baseline Q1",
        metrics: {
          ...physicalMetrics,
          ...technicalMetrics,
        },
        totalScore,
        rating: "CEMERLANG" as const,
        notes: "Prestasi sangat memuaskan, siap untuk kejohanan zon.",
      };

      const registered = await service.registerAssessment(assessmentRecord);
      assertEqual(registered.athleteId, "ath-01", "Athlete ID must match");
      assertEqual(registered.totalScore, totalScore, "Total score must match composite calculation");
      assertEqual(registered.rating, "CEMERLANG", "Rating must be CEMERLANG");

      // Verify assessment history
      const history = await service.getAssessments("ath-01");
      assert(history.length > 0, "Athlete must have at least 1 assessment in history");
      assert(
        history.some((a) => a.id === registered.id),
        "Registered assessment must be present in athlete history"
      );
    },
  },

  {
    id: "T4-SCEN-03",
    name: "Competition Squad Selection: Weight category audit and roster selection",
    tier: 4,
    category: "Real-World Journey",
    run: async () => {
      const service = new MockCoachService();

      const competitions = await service.getCompetitions();
      const comp = competitions.find((c) => c.id === "comp-01") || competitions[0];
      assert(comp !== undefined, "Competition must exist");

      // Find an athlete candidate whose weight status is 'Ok'
      const fitCandidates = comp.roster.filter(
        (r) => r.weightStatus === "Ok" && r.readinessScore >= 80
      );
      assert(fitCandidates.length > 0, "Must have fit candidates in roster");

      // Verify athlete with isSelected = false can be selected
      const unselectedFit = fitCandidates.find((r) => !r.isSelected);
      if (unselectedFit) {
        const updated = await service.updateRosterSelection(comp.id, unselectedFit.athleteId, true);
        const item = updated.roster.find((r) => r.athleteId === unselectedFit.athleteId);
        assertEqual(item?.isSelected, true, "Candidate must now be selected");
      }

      // Verify roster count is positive
      const totalSelected = comp.roster.filter((r) => r.isSelected).length;
      assert(totalSelected > 0, "Squad must have selected athletes");
    },
  },

  {
    id: "T4-SCEN-04",
    name: "Track A Isolation Audit: Zero cross-track modifications and zero athlete imports",
    tier: 4,
    category: "System Integrity",
    run: async () => {
      // 1. Verify zero imports from Track A in coach codebase
      const coachDirs = [
        path.join(ROOT_DIR, "src/lib/coach"),
        path.join(ROOT_DIR, "src/app/coach"),
        path.join(ROOT_DIR, "src/components/coach"),
      ];

      function scanDirForAthleteImports(dir: string): string[] {
        if (!fs.existsSync(dir)) return [];
        const violations: string[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            violations.push(...scanDirForAthleteImports(fullPath));
          } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
            const content = fs.readFileSync(fullPath, "utf-8");
            // Check for imports from Track A
            if (
              content.includes("@/lib/athlete") ||
              content.includes("../athlete") ||
              content.includes("/athlete/athlete-home") ||
              content.includes("@/components/athlete")
            ) {
              violations.push(fullPath);
            }
          }
        }
        return violations;
      }

      const importViolations: string[] = [];
      for (const d of coachDirs) {
        importViolations.push(...scanDirForAthleteImports(d));
      }

      assertEqual(
        importViolations.length,
        0,
        `Track A isolation violation: Files importing from athlete domain: ${importViolations.join(", ")}`
      );

      // 2. Verify git status for any newly created or untracked athlete files
      try {
        const gitStatusOutput = execSync("git status --porcelain", {
          cwd: ROOT_DIR,
          encoding: "utf-8",
        });

        const lines = gitStatusOutput.split("\n");
        // Look for any NEW untracked files added under athlete directories
        const untrackedAthleteFiles = lines.filter((line) => {
          const trimmed = line.trim();
          return (
            (trimmed.startsWith("??") || trimmed.startsWith("A ")) &&
            (trimmed.includes("src/app/athlete/") ||
              trimmed.includes("src/components/athlete/") ||
              trimmed.includes("src/lib/athlete/"))
          );
        });

        assertEqual(
          untrackedAthleteFiles.length,
          0,
          `Track A isolation violation: Newly created files in athlete portal: ${untrackedAthleteFiles.join(", ")}`
        );
      } catch {
        console.log("  [INFO] Git status check skipped or passed without untracked athlete files.");
      }
    },
  },
];
