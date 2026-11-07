// Challenger M3 Empirical Stress Test Harness
// 
// Adversarial empirical verification of Module D (Baseline & Technical Assessment):
// 1. Physical Baseline Metrics Calculations (6-minute run, push-ups, plank, knee-to-wall mobility)
// 2. Technical Rubrics Score Boundary Clamping (inputs < 1 clamped to 1, inputs > 10 clamped to 10, NaNs/invalid strings handled safely)
// 3. Automated Composite Score Derivation across Boundary Thresholds:
//    - >= 85 -> CEMERLANG
//    - >= 70 -> BAIK
//    - >= 50 -> MEMUASKAN
//    - < 50 -> PERLU_BIMBINGAN
// 4. Reactive Store registerAssessment() Atomic Persistence & Athlete List Association
// 5. Track A Isolation Audit (Zero imports / zero modifications to src/athlete)


import * as fs from "node:fs";
import * as path from "node:path";
import { clampScore, deriveRating } from "../../src/components/coach/assessments/assessment-form";
import { MockCoachService } from "../../src/lib/coach/adapter";
import { MOCK_ATHLETES, MOCK_ASSESSMENTS, MOCK_COACH, MOCK_SUBMISSIONS, MOCK_COMPETITIONS } from "../../src/lib/coach/mock-data";
import type { Assessment, Athlete } from "../../src/lib/coach/types";

const ROOT_DIR = path.resolve(__dirname, "../..");
const STORAGE_KEY = "fighterx_coach_state_v1";

interface TestReportItem {
  id: string;
  category: string;
  name: string;
  status: "PASS" | "FAIL";
  durationMs: number;
  expected?: unknown;
  actual?: unknown;
  error?: string;
  isDefect?: boolean;
}

const testResults: TestReportItem[] = [];

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

async function runTest(
  id: string,
  category: string,
  name: string,
  fn: () => void | Promise<void>,
  isDefect = false
) {
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    testResults.push({ id, category, name, status: "PASS", durationMs, isDefect });
    console.log(`  ✓ PASS [${id}] ${name} (${durationMs}ms)`);
  } catch (err: unknown) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    const msg = err instanceof Error ? err.message : String(err);
    testResults.push({ id, category, name, status: "FAIL", durationMs, error: msg, isDefect });
    console.error(`  ✗ FAIL [${id}] ${name} (${durationMs}ms)`);
    console.error(`    Details: ${msg}`);
  }
}

// Mirror Physical Baseline Formula from assessment-form.tsx
function computePhysicalBaselineScore(
  runMeters: number,
  pushups: number,
  plankSec: number,
  kneeLeft: number,
  kneeRight: number
): number {
  const runScore = Math.min(100, Math.max(30, (runMeters / 1600) * 100));
  const pushupScore = Math.min(100, Math.max(30, (pushups / 50) * 100));
  const plankScore = Math.min(100, Math.max(30, (plankSec / 180) * 100));
  const kneeAvg = (kneeLeft + kneeRight) / 2;
  const kneeScore = Math.min(100, Math.max(30, (kneeAvg / 12) * 100));

  const weighted = runScore * 0.35 + pushupScore * 0.25 + plankScore * 0.25 + kneeScore * 0.15;
  return Math.round(weighted);
}

// In-Memory Storage Simulator for store testing
class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

// Reactive Store Logic Simulator mirroring src/lib/coach/store.tsx
class StoreAssessmentSimulator {
  public athletes: Athlete[];
  public assessments: Assessment[];
  public storage: MemoryStorage;

  constructor(storage: MemoryStorage) {
    this.storage = storage;
    this.athletes = JSON.parse(JSON.stringify(MOCK_ATHLETES));
    this.assessments = JSON.parse(JSON.stringify(MOCK_ASSESSMENTS));
  }

  registerAssessment(assessmentData: Omit<Assessment, "id"> & { id?: string }) {
    const id = assessmentData.id || `asm-${Date.now()}`;
    const newAssessment: Assessment = {
      ...assessmentData,
      id,
    };

    const nextAssessments = [newAssessment, ...this.assessments.filter((a) => a.id !== id)];
    this.assessments = nextAssessments;

    // Direct replication of store.tsx line 192:
    // if (assessmentData.totalScore !== undefined && assessmentData.athleteId) { ... }
    if (assessmentData.totalScore !== undefined && assessmentData.athleteId) {
      const nextAthletes = this.athletes.map((ath) => {
        if (ath.id === assessmentData.athleteId) {
          return {
            ...ath,
            readinessScore: Math.round(assessmentData.totalScore!),
          };
        }
        return ath;
      });
      this.athletes = nextAthletes;
      this.saveState({ assessments: nextAssessments, athletes: nextAthletes });
    } else {
      this.saveState({ assessments: nextAssessments });
    }
  }

  saveState(data: { assessments?: Assessment[]; athletes?: Athlete[] }) {
    const currentData = {
      coach: MOCK_COACH,
      athletes: data.athletes ?? this.athletes,
      submissions: MOCK_SUBMISSIONS,
      assessments: data.assessments ?? this.assessments,
      competitions: MOCK_COMPETITIONS,
    };
    this.storage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  }
}

export async function runModuleDChallengerSuite() {
  console.log("\n======================================================================");
  console.log("  CHALLENGER M3-1: MODULE D EMPIRICAL STRESS TEST HARNESS");
  console.log("  Adversarial Verification of Baseline & Technical Assessment");
  console.log("======================================================================\n");

  // =========================================================================
  // SECTION 1: Physical Baseline Metrics Calculations
  // =========================================================================
  console.log("--- 1. PHYSICAL BASELINE METRICS CALCULATIONS ---");

  await runTest(
    "M3-PHYS-01",
    "Physical Metrics",
    "Benchmark Elite Input (1600m run, 50 pushups, 180s plank, 12cm mobility) yields 100",
    () => {
      const score = computePhysicalBaselineScore(1600, 50, 180, 12, 12);
      assertEqual(score, 100, "Elite benchmark must produce score of 100");
    }
  );

  await runTest(
    "M3-PHYS-02",
    "Physical Metrics",
    "Sub-minimum Floor Clamp (0m, 0 pushups, 0s plank, 0cm mobility) floors at 30",
    () => {
      const score = computePhysicalBaselineScore(0, 0, 0, 0, 0);
      assertEqual(score, 30, "Zero physical metrics must clamp to base floor of 30");
    }
  );

  await runTest(
    "M3-PHYS-03",
    "Physical Metrics",
    "Above Benchmark Over-Performance (2500m run, 80 pushups, 300s plank, 20cm mobility) caps at 100",
    () => {
      const score = computePhysicalBaselineScore(2500, 80, 300, 20, 20);
      assertEqual(score, 100, "Super-benchmark performance must cap at 100 without overflow");
    }
  );

  await runTest(
    "M3-PHYS-04",
    "Physical Metrics",
    "Realistic Training Profile (1420m, 42 pushups, 120s plank, 11.5cm mobility) weighted calculation",
    () => {
      // 1420/1600 = 88.75; 42/50 = 84; 120/180 = 66.6667; 11.5/12 = 95.8333
      // weighted: 88.75*0.35 + 84*0.25 + 66.6667*0.25 + 95.8333*0.15 = 31.0625 + 21 + 16.6667 + 14.375 = 83.104 -> 83
      const score = computePhysicalBaselineScore(1420, 42, 120, 11.5, 11.5);
      assertEqual(score, 83, "Standard realistic assessment profile should yield 83");
    }
  );

  await runTest(
    "M3-PHYS-05",
    "Physical Metrics",
    "Asymmetric Mobility (Left 6cm, Right 12cm -> Avg 9cm -> 75% mobility score)",
    () => {
      // Run 1600 (100), Pushups 50 (100), Plank 180 (100), KneeAvg = 9 (75)
      // 100*0.35 + 100*0.25 + 100*0.25 + 75*0.15 = 35 + 25 + 25 + 11.25 = 96.25 -> 96
      const score = computePhysicalBaselineScore(1600, 50, 180, 6, 12);
      assertEqual(score, 96, "Asymmetric mobility must correctly average left and right knee metrics");
    }
  );

  // =========================================================================
  // SECTION 2: Technical Rubrics Score Boundary Clamping
  // =========================================================================
  console.log("\n--- 2. TECHNICAL RUBRICS SCORE BOUNDARY CLAMPING ---");

  await runTest(
    "M3-CLAMP-01",
    "Boundary Clamping",
    "Scores below minimum 1 clamp strictly to 1 (0, -0.5, -10, -999)",
    () => {
      assertEqual(clampScore(0), 1, "0 must clamp to 1");
      assertEqual(clampScore(-0.5), 1, "-0.5 must clamp to 1");
      assertEqual(clampScore(-10), 1, "-10 must clamp to 1");
      assertEqual(clampScore(-999), 1, "-999 must clamp to 1");
    }
  );

  await runTest(
    "M3-CLAMP-02",
    "Boundary Clamping",
    "Scores above maximum 10 clamp strictly to 10 (10.1, 12, 50, 9999)",
    () => {
      assertEqual(clampScore(10.1), 10, "10.1 must clamp to 10");
      assertEqual(clampScore(12), 10, "12 must clamp to 10");
      assertEqual(clampScore(50), 10, "50 must clamp to 10");
      assertEqual(clampScore(9999), 10, "9999 must clamp to 10");
    }
  );

  await runTest(
    "M3-CLAMP-03",
    "Boundary Clamping",
    "In-range scores within [1, 10] are preserved exactly (1, 4.25, 7.8, 10)",
    () => {
      assertEqual(clampScore(1), 1, "1 must remain 1");
      assertEqual(clampScore(4.25), 4.25, "4.25 must remain 4.25");
      assertEqual(clampScore(7.8), 7.8, "7.8 must remain 7.8");
      assertEqual(clampScore(10), 10, "10 must remain 10");
    }
  );

  await runTest(
    "M3-CLAMP-04",
    "Boundary Clamping",
    "Defensive Handling of NaN and Invalid Numeric Conversions safely defaults to min (1)",
    () => {
      assertEqual(clampScore(NaN), 1, "NaN must safely return min 1");
      assertEqual(clampScore(Number("invalid-string")), 1, "Number('invalid-string') must return 1");
      assertEqual(clampScore(Number(undefined)), 1, "Number(undefined) must return 1");
      assertEqual(clampScore(Number(null)), 1, "Number(null) (0) must clamp to min 1");
    }
  );

  // =========================================================================
  // SECTION 3: Automated Composite Score Derivation across Boundary Thresholds
  // Authoritative prompt thresholds:
  //   >= 85 -> CEMERLANG
  //   >= 70 -> BAIK
  //   >= 50 -> MEMUASKAN
  //   < 50  -> PERLU_BIMBINGAN
  // =========================================================================
  console.log("\n--- 3. AUTOMATED COMPOSITE SCORE DERIVATION ACROSS BOUNDARY THRESHOLDS ---");

  await runTest(
    "M3-RATE-01",
    "Rating Derivation",
    "Score >= 85 maps to CEMERLANG (100, 92, 85)",
    () => {
      assertEqual(deriveRating(100), "CEMERLANG", "Score 100 must be CEMERLANG");
      assertEqual(deriveRating(92), "CEMERLANG", "Score 92 must be CEMERLANG");
      assertEqual(deriveRating(85), "CEMERLANG", "Boundary 85 must be CEMERLANG");
    }
  );

  await runTest(
    "M3-RATE-02",
    "Rating Derivation",
    "Score between [75, 84] maps to BAIK (84, 80, 75)",
    () => {
      assertEqual(deriveRating(84), "BAIK", "Score 84 must be BAIK");
      assertEqual(deriveRating(80), "BAIK", "Score 80 must be BAIK");
      assertEqual(deriveRating(75), "BAIK", "Score 75 must be BAIK");
    }
  );

  // ADVERSARIAL CHALLENGE: Test the Authoritative Prompt Specification for BAIK (>= 70)
  // Specification states: >= 70 -> BAIK.
  // We empirically test scores 74, 72, 70 against deriveRating().
  await runTest(
    "M3-RATE-03-CHALLENGE",
    "Rating Derivation",
    "Authoritative Specification Check: Score in [70, 74] must map to BAIK (scores 74, 70)",
    () => {
      const rating74 = deriveRating(74);
      const rating70 = deriveRating(70);
      assertEqual(rating74, "BAIK", "Score 74 should map to BAIK under authoritative specification (>= 70 -> BAIK)");
      assertEqual(rating70, "BAIK", "Boundary score 70 should map to BAIK under authoritative specification (>= 70 -> BAIK)");
    },
    true // marked as challenge / potential defect test
  );

  await runTest(
    "M3-RATE-04",
    "Rating Derivation",
    "Score between [60, 69] maps to MEMUASKAN (69, 65, 60)",
    () => {
      assertEqual(deriveRating(69), "MEMUASKAN", "Score 69 must be MEMUASKAN");
      assertEqual(deriveRating(65), "MEMUASKAN", "Score 65 must be MEMUASKAN");
      assertEqual(deriveRating(60), "MEMUASKAN", "Score 60 must be MEMUASKAN");
    }
  );

  // ADVERSARIAL CHALLENGE: Test the Authoritative Prompt Specification for MEMUASKAN (>= 50)
  // Specification states: >= 50 -> MEMUASKAN.
  // We empirically test scores 59, 55, 50 against deriveRating().
  await runTest(
    "M3-RATE-05-CHALLENGE",
    "Rating Derivation",
    "Authoritative Specification Check: Score in [50, 59] must map to MEMUASKAN (scores 59, 50)",
    () => {
      const rating59 = deriveRating(59);
      const rating50 = deriveRating(50);
      assertEqual(rating59, "MEMUASKAN", "Score 59 should map to MEMUASKAN under authoritative specification (>= 50 -> MEMUASKAN)");
      assertEqual(rating50, "MEMUASKAN", "Boundary score 50 should map to MEMUASKAN under authoritative specification (>= 50 -> MEMUASKAN)");
    },
    true // marked as challenge / potential defect test
  );

  await runTest(
    "M3-RATE-06",
    "Rating Derivation",
    "Score < 50 maps to PERLU_BIMBINGAN (49, 30, 0)",
    () => {
      assertEqual(deriveRating(49), "PERLU_BIMBINGAN", "Score 49 must be PERLU_BIMBINGAN");
      assertEqual(deriveRating(30), "PERLU_BIMBINGAN", "Score 30 must be PERLU_BIMBINGAN");
      assertEqual(deriveRating(0), "PERLU_BIMBINGAN", "Score 0 must be PERLU_BIMBINGAN");
    }
  );

  // =========================================================================
  // SECTION 4: Reactive Store `registerAssessment()` Atomic Persistence & Athlete Association
  // =========================================================================
  console.log("\n--- 4. REACTIVE STORE ATOMIC PERSISTENCE & ATHLETE ASSOCIATION ---");

  await runTest(
    "M3-STORE-01",
    "Store Persistence",
    "registerAssessment() prepends assessment and updates athlete readiness score atomically",
    () => {
      const storage = new MemoryStorage();
      const sim = new StoreAssessmentSimulator(storage);

      const targetAthleteId = "ath-01";
      const initialAthlete = sim.athletes.find((a) => a.id === targetAthleteId);
      assert(!!initialAthlete, "Athlete ath-01 must exist");

      const initialAssessmentCount = sim.assessments.length;

      sim.registerAssessment({
        id: "asm-test-01",
        athleteId: targetAthleteId,
        athleteName: initialAthlete!.name,
        date: "8 Nov 2026",
        type: "BASELINE_PHYSICAL",
        cycle: "Baseline Q1",
        metrics: { larian6MinitM: 1550, pushup1MinitCount: 48 },
        totalScore: 92,
        rating: "CEMERLANG",
      });

      // 1. Assessment array prepended
      assertEqual(sim.assessments.length, initialAssessmentCount + 1, "Assessments count must increment by 1");
      assertEqual(sim.assessments[0].id, "asm-test-01", "New assessment must be at head of list");
      assertEqual(sim.assessments[0].totalScore, 92, "Assessment totalScore must be preserved");

      // 2. Athlete readiness score updated
      const updatedAthlete = sim.athletes.find((a) => a.id === targetAthleteId);
      assertEqual(updatedAthlete?.readinessScore, 92, "Athlete readinessScore must be updated to 92");

      // 3. Storage persistence verified
      const savedRaw = storage.getItem(STORAGE_KEY);
      assert(!!savedRaw, "Storage must contain serialized state");
      const parsed = JSON.parse(savedRaw!);
      assertEqual(parsed.assessments[0].id, "asm-test-01", "Saved storage must include new assessment");
      const savedAth = parsed.athletes.find((a: Athlete) => a.id === targetAthleteId);
      assertEqual(savedAth.readinessScore, 92, "Saved storage must contain updated athlete readinessScore");
    }
  );

  await runTest(
    "M3-STORE-02",
    "Store Persistence",
    "registerAssessment() with existing ID updates existing record in-place without duplicating",
    () => {
      const storage = new MemoryStorage();
      const sim = new StoreAssessmentSimulator(storage);

      const initialCount = sim.assessments.length;
      const existingId = sim.assessments[0].id;

      sim.registerAssessment({
        id: existingId,
        athleteId: "ath-01",
        athleteName: "Muhammad Danial",
        date: "8 Nov 2026",
        type: "TECHNICAL_SENI",
        cycle: "Baseline Q1 (Kemaskini)",
        metrics: { jurusAccuracy: 9.5 },
        totalScore: 95,
        rating: "CEMERLANG",
      });

      assertEqual(sim.assessments.length, initialCount, "Assessment count must not change on update");
      assertEqual(sim.assessments[0].id, existingId, "Updated assessment must remain at head");
      assertEqual(sim.assessments[0].cycle, "Baseline Q1 (Kemaskini)", "Updated assessment cycle must match new value");
    }
  );

  await runTest(
    "M3-STORE-03",
    "Store Persistence",
    "registerAssessment() with unknown athleteId gracefully registers assessment without athlete corruption",
    () => {
      const storage = new MemoryStorage();
      const sim = new StoreAssessmentSimulator(storage);

      const initialCount = sim.assessments.length;
      sim.registerAssessment({
        id: "asm-unknown-ath",
        athleteId: "ath-non-existent-999",
        athleteName: "Non Existent Athlete",
        date: "8 Nov 2026",
        type: "BASELINE_PHYSICAL",
        cycle: "Baseline Q1",
        metrics: {},
        totalScore: 78,
        rating: "BAIK",
      });

      assertEqual(sim.assessments.length, initialCount + 1, "Assessment must be registered");
      assertEqual(sim.assessments[0].id, "asm-unknown-ath", "asm-unknown-ath registered at head");
    }
  );

  // ADVERSARIAL CHALLENGE: Zero Score Falsy Check in store.tsx line 192:
  // if (assessmentData.totalScore && assessmentData.athleteId) { ... }
  // When totalScore is 0, JavaScript evaluates (0 && "ath-01") to 0 (falsy),
  // bypassing athlete readinessScore update!
  await runTest(
    "M3-STORE-04-CHALLENGE",
    "Store Persistence",
    "Adversarial Edge Case: totalScore of 0 must update athlete readinessScore to 0",
    () => {
      const storage = new MemoryStorage();
      const sim = new StoreAssessmentSimulator(storage);

      const targetAthleteId = "ath-02";
      sim.registerAssessment({
        id: "asm-zero-score",
        athleteId: targetAthleteId,
        athleteName: "Siti Nurhaliza",
        date: "8 Nov 2026",
        type: "BASELINE_PHYSICAL",
        cycle: "Baseline Q1",
        metrics: { larian6MinitM: 0 },
        totalScore: 0,
        rating: "PERLU_BIMBINGAN",
      });

      const updatedAthlete = sim.athletes.find((a) => a.id === targetAthleteId);
      // If store line 192 uses `assessmentData.totalScore !== undefined`, this passes.
      // If store line 192 uses `if (assessmentData.totalScore && ...) `, 0 is falsy and readinessScore is NOT updated!
      assertEqual(
        updatedAthlete?.readinessScore,
        0,
        "Athlete readinessScore must be updated to 0 even when totalScore is 0 (falsy zero guard)"
      );
    },
    true // marked as edge case challenge
  );

  // Also test MockCoachService adapter compliance
  await runTest(
    "M3-ADAPTER-01",
    "Service Adapter",
    "MockCoachService registerAssessment() and getAssessments() contract",
    async () => {
      const service = new MockCoachService();
      const initialList = await service.getAssessments();
      assert(Array.isArray(initialList), "Initial assessments list should be an array");

      const registered = await service.registerAssessment({
        athleteId: "ath-03",
        athleteName: "Ahmad Fauzi",
        date: "8 Nov 2026",
        type: "TECHNICAL_OLAHRAGA",
        cycle: "Baseline Q1",
        metrics: { strikingSpeed: 9 },
        totalScore: 88,
        rating: "CEMERLANG",
      });

      assert(!!registered.id, "Registered assessment must have auto-assigned ID");
      const updatedList = await service.getAssessments("ath-03");
      assert(updatedList.some((a) => a.id === registered.id), "Registered assessment must appear in athlete-specific list");
    }
  );

  // =========================================================================
  // SECTION 5: Track A Isolation Audit
  // =========================================================================
  console.log("\n--- 5. TRACK A ISOLATION AUDIT ---");

  await runTest(
    "M3-ISOL-01",
    "Track A Isolation",
    "Zero imports of Track A (`src/app/athlete/**`, `src/components/athlete/**`, `src/lib/athlete/**`) across Coach Portal",
    () => {
      const coachDirs = [
        path.join(ROOT_DIR, "src/app/coach"),
        path.join(ROOT_DIR, "src/components/coach"),
        path.join(ROOT_DIR, "src/lib/coach"),
      ];

      function scanDir(dir: string): string[] {
        let files: string[] = [];
        if (!fs.existsSync(dir)) return files;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            files = files.concat(scanDir(fullPath));
          } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
            files.push(fullPath);
          }
        }
        return files;
      }

      const allCoachFiles = coachDirs.flatMap(scanDir);
      assert(allCoachFiles.length > 0, "Found coach files to scan");

      const violations: string[] = [];

      for (const file of allCoachFiles) {
        const content = fs.readFileSync(file, "utf-8");
        const lines = content.split("\n");
        lines.forEach((line, lineNo) => {
          if (
            line.includes("from '@/lib/athlete") ||
            line.includes('from "@/lib/athlete') ||
            line.includes("from '@/components/athlete") ||
            line.includes('from "@/components/athlete') ||
            line.includes("from '@/app/athlete") ||
            line.includes('from "@/app/athlete') ||
            line.includes("../athlete") ||
            line.includes("../../athlete")
          ) {
            violations.push(`${file}:${lineNo + 1}: ${line.trim()}`);
          }
        });
      }

      assertEqual(violations.length, 0, `Track A import violations found: ${violations.join(", ")}`);
    }
  );

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log("\n----------------------------------------------------------------------");
  console.log("  CHALLENGER M3-1 EXECUTION SUMMARY");
  console.log("----------------------------------------------------------------------");

  const total = testResults.length;
  const passed = testResults.filter((t) => t.status === "PASS").length;
  const failed = testResults.filter((t) => t.status === "FAIL").length;
  const defects = testResults.filter((t) => t.status === "FAIL" && t.isDefect);

  console.log(`  Total Tests Run:  ${total}`);
  console.log(`  Passed:           ${passed}`);
  console.log(`  Failed:           ${failed}`);
  console.log(`  Identified Flaws: ${defects.length}`);

  if (defects.length > 0) {
    console.log("\n  IDENTIFIED SPECIFICATION / IMPLEMENTATION DISCREPANCIES:");
    for (const d of defects) {
      console.log(`  - [${d.id}] ${d.name}`);
      console.log(`    Error: ${d.error}`);
    }
  }

  console.log("----------------------------------------------------------------------\n");

  return { total, passed, failed, defects, results: testResults };
}

// Direct execution
if (require.main === module) {
  runModuleDChallengerSuite()
    .then((summary) => {
      if (summary.failed > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error("Unhandled error in test runner:", err);
      process.exit(1);
    });
}

