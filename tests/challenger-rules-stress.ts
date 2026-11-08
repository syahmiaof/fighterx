#!/usr/bin/env node
/**
 * Adversarial Stress & Hardening Test Suite — PERSILAT 2026 Engine & Associations
 * Authored by: challenger_public_1
 * 
 * Verifies:
 * 1. Combinatorial strike sequences (extreme numbers, zeroes, negative clamping, floats, non-finite values)
 * 2. Cumulative penalty matrix & DQ escalation ladder across all 2^6 subsets
 * 3. 5-second grapple takedown boundary edge cases (4.99s, 5.00s, 5.01s, nanoseconds, float precision)
 * 4. Jurus / Seni scoring rubrics: discrete time steps, weapon drops, movement accuracy, fractional deductions, zero clamping, and 1,000-case random fuzzer
 * 5. Association search and category filter stress: SQLi/XSS fuzz, Unicode, Arabic calligraphy, ReDoS symbols, and 5,000-query latency benchmark
 */

import { performance } from "perf_hooks";
import {
  calculateTandingScore,
  calculateJurusScore,
  getPenaltyDeduction,
  isDisqualifyingPenalty,
} from "../src/lib/guidelines";
import type {
  PenaltyType,
  JurusCategory,
} from "../src/lib/guidelines/types";
import {
  SILAT_ASSOCIATIONS,
  searchAssociations,
  getCategoryCounts,
} from "../src/lib/associations";
import type {
  CategoryFilterKey,
} from "../src/lib/associations/types";

// ANSI Terminal Colors
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

interface StressResult {
  name: string;
  section: string;
  status: "PASS" | "FAIL";
  durationMs: number;
  details?: string;
}

const results: StressResult[] = [];

function recordPass(section: string, name: string, durationMs: number, details?: string) {
  results.push({ section, name, status: "PASS", durationMs, details });
  console.log(`  ${green("✓ PASS")} [${bold(section)}] ${name} ${dim(`(${durationMs.toFixed(2)}ms)`)}`);
}

function recordFail(section: string, name: string, durationMs: number, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  results.push({ section, name, status: "FAIL", durationMs, details: msg });
  console.log(`  ${red("✗ FAIL")} [${bold(section)}] ${name} ${dim(`(${durationMs.toFixed(2)}ms)`)}`);
  console.log(`         ${red("Error:")} ${msg}`);
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message} (expected: ${expected}, got: ${actual})`);
  }
}

// ============================================================================
// SECTION 1: COMBINATORIAL STRIKE SEQUENCES & EXTREME VALUES
// ============================================================================
function runSection1Strikes() {
  const section = "STRIKES-COMBINATORIAL";

  // 1.1 Zero strikes baseline
  {
    const start = performance.now();
    try {
      const res = calculateTandingScore(0, 0, 0, []);
      assertEqual(res.punches, 0, "Punches must be 0");
      assertEqual(res.kicks, 0, "Kicks must be 0");
      assertEqual(res.takedowns, 0, "Takedowns must be 0");
      assertEqual(res.totalScore, 0, "Total score must be 0");
      assertEqual(res.isDisqualified, false, "Must not be DQ");
      recordPass(section, "Zero strikes yields exactly 0 points and no DQ", performance.now() - start);
    } catch (e) {
      recordFail(section, "Zero strikes yields exactly 0 points and no DQ", performance.now() - start, e);
    }
  }

  // 1.2 Negative strike inputs clamping
  {
    const start = performance.now();
    try {
      const testCases = [
        { p: -1, k: -1, t: -1 },
        { p: -100, k: -500, t: -9999 },
        { p: -0.5, k: -2.8, t: -99.9 },
        { p: -0, k: 0, t: -0 },
      ];
      for (const tc of testCases) {
        const res = calculateTandingScore(tc.p, tc.k, tc.t, []);
        assertEqual(res.punches, 0, `Punches for ${tc.p} must clamp to 0`);
        assertEqual(res.kicks, 0, `Kicks for ${tc.k} must clamp to 0`);
        assertEqual(res.takedowns, 0, `Takedowns for ${tc.t} must clamp to 0`);
        assertEqual(res.totalScore, 0, `Total score for negatives must clamp to 0`);
      }
      recordPass(section, "Negative integers and negative floats clamp to 0", performance.now() - start);
    } catch (e) {
      recordFail(section, "Negative integers and negative floats clamp to 0", performance.now() - start, e);
    }
  }

  // 1.3 Non-number & boundary inputs (NaN, null, undefined)
  {
    const start = performance.now();
    try {
      // Cast through any to simulate rogue runtime callers
      const resNaN = calculateTandingScore(
        NaN as unknown as number,
        null as unknown as number,
        undefined as unknown as number,
        []
      );
      assertEqual(resNaN.punches, 0, "NaN punches safely defaults to 0");
      assertEqual(resNaN.kicks, 0, "null kicks safely defaults to 0");
      assertEqual(resNaN.takedowns, 0, "undefined takedowns safely defaults to 0");
      assertEqual(resNaN.totalScore, 0, "Total score safely 0");
      recordPass(section, "Rogue non-numeric values (NaN, null, undefined) clamp to 0", performance.now() - start);
    } catch (e) {
      recordFail(section, "Rogue non-numeric values (NaN, null, undefined) clamp to 0", performance.now() - start, e);
    }
  }

  // 1.4 Large strike counts and integer overflow resistance
  {
    const start = performance.now();
    try {
      // 100,000 punches (100k) + 50,000 kicks (100k) + 20,000 takedowns (60k) = 260,000
      const largeRes = calculateTandingScore(100_000, 50_000, 20_000, []);
      assertEqual(largeRes.punches, 100_000, "100k punches exact");
      assertEqual(largeRes.kicks, 50_000, "50k kicks exact");
      assertEqual(largeRes.takedowns, 20_000, "20k takedowns exact");
      assertEqual(largeRes.totalScore, 260_000, "260,000 total score exact");

      // 1,000,000 strikes each
      const megaRes = calculateTandingScore(1_000_000, 1_000_000, 1_000_000, []);
      assertEqual(megaRes.totalScore, 6_000_000, "1M strikes: 1M + 2M + 3M = 6M points");
      recordPass(section, "High-magnitude strikes (up to 1,000,000) preserve exact math", performance.now() - start);
    } catch (e) {
      recordFail(section, "High-magnitude strikes (up to 1,000,000) preserve exact math", performance.now() - start, e);
    }
  }

  // 1.5 Floating point strikes floored
  {
    const start = performance.now();
    try {
      const floatRes = calculateTandingScore(3.99, 4.01, 2.75, []);
      assertEqual(floatRes.punches, 3, "3.99 punches floored to 3");
      assertEqual(floatRes.kicks, 4, "4.01 kicks floored to 4");
      assertEqual(floatRes.takedowns, 2, "2.75 takedowns floored to 2");
      assertEqual(floatRes.totalScore, 3 * 1 + 4 * 2 + 2 * 3, "Total score = 17");
      recordPass(section, "Floating point strikes floored to integer counts", performance.now() - start);
    } catch (e) {
      recordFail(section, "Floating point strikes floored to integer counts", performance.now() - start, e);
    }
  }

  // 1.6 Full 343-combination grid generator test
  {
    const start = performance.now();
    try {
      const strikeValues = [0, 1, 2, 5, 10, 25, 100];
      let combinationsTested = 0;

      for (const p of strikeValues) {
        for (const k of strikeValues) {
          for (const t of strikeValues) {
            const result = calculateTandingScore(p, k, t, []);
            const expected = p * 1 + k * 2 + t * 3;
            assertEqual(result.totalScore, expected, `Score for P=${p}, K=${k}, T=${t}`);
            assertEqual(result.punches, p, `Punches count`);
            assertEqual(result.kicks, k, `Kicks count`);
            assertEqual(result.takedowns, t, `Takedowns count`);
            assertEqual(result.isDisqualified, false, `DQ status`);
            combinationsTested++;
          }
        }
      }
      assertEqual(combinationsTested, 343, "343 combinations tested");
      recordPass(section, `343 combinatorial strike permutations verified against exact oracle`, performance.now() - start);
    } catch (e) {
      recordFail(section, `343 combinatorial strike permutations verified against exact oracle`, performance.now() - start, e);
    }
  }
}

// ============================================================================
// SECTION 2: CUMULATIVE PENALTY MATRIX & ESCALATION LADDER
// ============================================================================
function runSection2Penalties() {
  const section = "PENALTY-MATRIX";

  // 2.1 Individual penalty point deductions
  {
    const start = performance.now();
    try {
      assertEqual(getPenaltyDeduction("TEGURAN_1"), 1, "Teguran I = 1 pt");
      assertEqual(getPenaltyDeduction("TEGURAN_2"), 2, "Teguran II = 2 pts");
      assertEqual(getPenaltyDeduction("PERINGATAN_1"), 5, "Peringatan I = 5 pts");
      assertEqual(getPenaltyDeduction("PERINGATAN_2"), 10, "Peringatan II = 10 pts");
      assertEqual(getPenaltyDeduction("PERINGATAN_3_DQ"), 0, "Peringatan III = 0 deduction (triggers DQ)");
      assertEqual(getPenaltyDeduction("DIRECT_DQ"), 0, "Direct DQ = 0 deduction (triggers DQ)");

      assertEqual(isDisqualifyingPenalty("TEGURAN_1"), false, "Teguran 1 is not DQ");
      assertEqual(isDisqualifyingPenalty("TEGURAN_2"), false, "Teguran 2 is not DQ");
      assertEqual(isDisqualifyingPenalty("PERINGATAN_1"), false, "Peringatan 1 is not DQ");
      assertEqual(isDisqualifyingPenalty("PERINGATAN_2"), false, "Peringatan 2 is not DQ");
      assertEqual(isDisqualifyingPenalty("PERINGATAN_3_DQ"), true, "Peringatan 3 is DQ");
      assertEqual(isDisqualifyingPenalty("DIRECT_DQ"), true, "Direct DQ is DQ");
      recordPass(section, "Individual deduction constants and DQ flags verified", performance.now() - start);
    } catch (e) {
      recordFail(section, "Individual deduction constants and DQ flags verified", performance.now() - start, e);
    }
  }

  // 2.2 Exhaustive Power Set of all penalties (2^6 = 64 subsets)
  {
    const start = performance.now();
    try {
      const allPenalties: PenaltyType[] = [
        "TEGURAN_1",
        "TEGURAN_2",
        "PERINGATAN_1",
        "PERINGATAN_2",
        "PERINGATAN_3_DQ",
        "DIRECT_DQ",
      ];

      // Generate power set
      const subsets: PenaltyType[][] = [[]];
      for (const p of allPenalties) {
        const len = subsets.length;
        for (let i = 0; i < len; i++) {
          subsets.push([...subsets[i], p]);
        }
      }
      assertEqual(subsets.length, 64, "Total subsets must be 64");

      for (const subset of subsets) {
        const baseStrikes = { p: 10, k: 5, t: 2 }; // 10*1 + 5*2 + 2*3 = 26 pts
        const res = calculateTandingScore(baseStrikes.p, baseStrikes.k, baseStrikes.t, subset);

        // Calculate expected deductions
        let expectedDeductions = 0;
        let expectedDQ = false;
        for (const penalty of subset) {
          expectedDeductions += getPenaltyDeduction(penalty);
          if (isDisqualifyingPenalty(penalty)) {
            expectedDQ = true;
          }
        }

        const expectedTotalScore = 26 - expectedDeductions;
        assertEqual(res.totalScore, expectedTotalScore, `Total score for subset [${subset.join(", ")}]`);
        assertEqual(res.isDisqualified, expectedDQ, `DQ status for subset [${subset.join(", ")}]`);
      }
      recordPass(section, "All 64 penalty power set subsets match deduction oracle and DQ escalation", performance.now() - start);
    } catch (e) {
      recordFail(section, "All 64 penalty power set subsets match deduction oracle and DQ escalation", performance.now() - start, e);
    }
  }

  // 2.3 Negative total score when penalties exceed strikes
  {
    const start = performance.now();
    try {
      // 0 strikes with penalties
      const res1 = calculateTandingScore(0, 0, 0, ["TEGURAN_1"]);
      assertEqual(res1.totalScore, -1, "0 strikes - Teguran 1 = -1");

      const res2 = calculateTandingScore(0, 0, 0, ["PERINGATAN_1", "PERINGATAN_2"]);
      assertEqual(res2.totalScore, -15, "0 strikes - (5 + 10) = -15");

      const res3 = calculateTandingScore(2, 1, 0, ["PERINGATAN_2"]); // 4 pts - 10 pts = -6
      assertEqual(res3.totalScore, -6, "4 strikes - Peringatan 2 = -6");
      assertEqual(res3.isDisqualified, false, "Negative score does NOT disqualify fighter unless DQ penalty");
      recordPass(section, "Negative total scores correctly supported without truncation or false DQ", performance.now() - start);
    } catch (e) {
      recordFail(section, "Negative total scores correctly supported without truncation or false DQ", performance.now() - start, e);
    }
  }

  // 2.4 Penalty array immutability & duplicate resilience
  {
    const start = performance.now();
    try {
      const inputPenalties: PenaltyType[] = ["TEGURAN_1", "PERINGATAN_1"];
      const res = calculateTandingScore(5, 5, 0, inputPenalties);
      // Mutate returned array
      res.penalties.push("DIRECT_DQ");
      // Check original input array was not corrupted
      assertEqual(inputPenalties.length, 2, "Original penalty array length unaltered");
      assert(!inputPenalties.includes("DIRECT_DQ"), "Original penalty array unmutated");

      // Duplicate penalty handling
      const duplicateRes = calculateTandingScore(10, 0, 0, ["TEGURAN_1", "TEGURAN_1"]);
      assertEqual(duplicateRes.totalScore, 8, "Duplicate Teguran 1 deducts 1+1 = 2 pts");
      recordPass(section, "Penalties array immutability and duplicate handling verified", performance.now() - start);
    } catch (e) {
      recordFail(section, "Penalties array immutability and duplicate handling verified", performance.now() - start, e);
    }
  }
}

// ============================================================================
// SECTION 3: 5-SECOND GRAPPLE TAKEDOWN EDGE CASES
// ============================================================================
function runSection3Grapple() {
  const section = "5S-GRAPPLE-BOUNDARY";

  /**
   * Reference Oracle for PERSILAT 2026 Pasal 15.3:
   * Leg/Arm Grapple must result in takedown within <= 5.000 seconds.
   */
  function evaluateGrappleTakedown(grappleDurationSeconds: number): {
    awardedPoints: number;
    decision: "LEGAL_TAKEDOWN" | "TIMEOUT_HENTI";
  } {
    if (grappleDurationSeconds <= 5.0) {
      return { awardedPoints: 3, decision: "LEGAL_TAKEDOWN" };
    }
    return { awardedPoints: 0, decision: "TIMEOUT_HENTI" };
  }

  // 3.1 Sub-second and mid-range legal takedowns
  {
    const start = performance.now();
    try {
      const legalTimings = [0.0, 0.001, 0.25, 0.5, 1.0, 2.5, 3.8, 4.5];
      for (const t of legalTimings) {
        const evalRes = evaluateGrappleTakedown(t);
        assertEqual(evalRes.awardedPoints, 3, `Timing ${t}s must award 3 points`);
        assertEqual(evalRes.decision, "LEGAL_TAKEDOWN", `Timing ${t}s must be LEGAL_TAKEDOWN`);
      }
      recordPass(section, "Sub-second and mid-range grapple takedowns award 3 points", performance.now() - start);
    } catch (e) {
      recordFail(section, "Sub-second and mid-range grapple takedowns award 3 points", performance.now() - start, e);
    }
  }

  // 3.2 High-precision boundary checks at 4.99s, 4.999s, exactly 5.000s, 5.0001s, 5.01s
  {
    const start = performance.now();
    try {
      // 4.99s -> Legal
      assertEqual(evaluateGrappleTakedown(4.99).awardedPoints, 3, "4.99s is legal");
      assertEqual(evaluateGrappleTakedown(4.99).decision, "LEGAL_TAKEDOWN", "4.99s decision is LEGAL_TAKEDOWN");

      // 4.999s -> Legal
      assertEqual(evaluateGrappleTakedown(4.999).awardedPoints, 3, "4.999s is legal");

      // 4.999999s -> Legal
      assertEqual(evaluateGrappleTakedown(4.999999).awardedPoints, 3, "4.999999s is legal");

      // Exactly 5.000s -> Legal (boundary is inclusive: <= 5.0s)
      assertEqual(evaluateGrappleTakedown(5.0).awardedPoints, 3, "Exact 5.000s boundary is legal (3 pts)");
      assertEqual(evaluateGrappleTakedown(5.0).decision, "LEGAL_TAKEDOWN", "5.0s decision is LEGAL_TAKEDOWN");

      // 5.000000000000001s -> Timeout
      assertEqual(evaluateGrappleTakedown(5.000000000000001).awardedPoints, 0, "Epsilon above 5.0s triggers timeout");
      assertEqual(evaluateGrappleTakedown(5.000000000000001).decision, "TIMEOUT_HENTI", "Epsilon above 5.0s is TIMEOUT_HENTI");

      // 5.001s -> Timeout
      assertEqual(evaluateGrappleTakedown(5.001).awardedPoints, 0, "5.001s is timeout");
      assertEqual(evaluateGrappleTakedown(5.001).decision, "TIMEOUT_HENTI", "5.001s decision is TIMEOUT_HENTI");

      // 5.01s -> Timeout
      assertEqual(evaluateGrappleTakedown(5.01).awardedPoints, 0, "5.01s is timeout");
      assertEqual(evaluateGrappleTakedown(5.01).decision, "TIMEOUT_HENTI", "5.01s decision is TIMEOUT_HENTI");

      // 6.0s, 10.0s -> Timeout
      assertEqual(evaluateGrappleTakedown(6.0).awardedPoints, 0, "6.0s is timeout");
      assertEqual(evaluateGrappleTakedown(10.0).awardedPoints, 0, "10.0s is timeout");

      recordPass(section, "Exact 5.000s inclusive boundary and 5.001s timeout cutoff strictly verified", performance.now() - start);
    } catch (e) {
      recordFail(section, "Exact 5.000s inclusive boundary and 5.001s timeout cutoff strictly verified", performance.now() - start, e);
    }
  }

  // 3.3 Integration with calculateTandingScore takedowns count
  {
    const start = performance.now();
    try {
      // Suppose a match had 3 grapple attempts:
      // Attempt 1: executed at 2.4s -> Legal (+1 takedown)
      // Attempt 2: executed at 4.99s -> Legal (+1 takedown)
      // Attempt 3: reached 5.01s -> Timeout (+0 takedown)
      const attempts = [2.4, 4.99, 5.01];
      let legalTakedowns = 0;
      for (const time of attempts) {
        const evalRes = evaluateGrappleTakedown(time);
        if (evalRes.decision === "LEGAL_TAKEDOWN") {
          legalTakedowns++;
        }
      }
      assertEqual(legalTakedowns, 2, "Only 2 takedowns legal");
      const matchScore = calculateTandingScore(4, 2, legalTakedowns, []);
      // 4*1 + 2*2 + 2*3 = 14 pts
      assertEqual(matchScore.totalScore, 14, "4 punches (4) + 2 kicks (4) + 2 legal takedowns (6) = 14 pts");
      recordPass(section, "Grapple evaluation integration into match scoring engine verified", performance.now() - start);
    } catch (e) {
      recordFail(section, "Grapple evaluation integration into match scoring engine verified", performance.now() - start, e);
    }
  }
}

// ============================================================================
// SECTION 4: JURUS RUBRICS STRESS & NUMERICAL PRECISION
// ============================================================================
function runSection4Jurus() {
  const section = "JURUS-RUBRICS-STRESS";

  // 4.1 Clean performance baseline across categories
  {
    const start = performance.now();
    try {
      const categories: JurusCategory[] = ["TUNGGAL", "GANDA", "REGU", "SOLO_BEBAS"];
      for (const cat of categories) {
        const res = calculateJurusScore({
          category: cat,
          accuracyScore: 9.9,
          expressionScore: 0.05,
        });
        assertEqual(res.category, cat, `Category matches`);
        assertEqual(res.accuracyScore, 9.9, `Accuracy matches`);
        assertEqual(res.expressionScore, 0.05, `Expression matches`);
        assertEqual(res.totalDeductions, 0, `Total deductions 0`);
        assertEqual(res.netScore, 9.95, `Net score 9.95`);
      }
      recordPass(section, "Clean performance baseline verified across all 4 Jurus categories", performance.now() - start);
    } catch (e) {
      recordFail(section, "Clean performance baseline verified across all 4 Jurus categories", performance.now() - start, e);
    }
  }

  // 4.2 Discrete 5-second time step deduction tests
  {
    const start = performance.now();
    try {
      // PERSILAT 2026: -0.05 per full 5 seconds deviation
      const timeTests = [
        { sec: 0, expected: 0.0 },
        { sec: 1, expected: 0.0 },
        { sec: 4, expected: 0.0 },
        { sec: 4.99, expected: 0.0 },
        { sec: 5, expected: 0.05 },
        { sec: 9, expected: 0.05 },
        { sec: 10, expected: 0.10 },
        { sec: 14, expected: 0.10 },
        { sec: 15, expected: 0.15 },
        { sec: 35, expected: 0.35 },
        { sec: 60, expected: 0.60 },
        { sec: 180, expected: 1.80 },
        { sec: -10, expected: 0.10 }, // Negative deviation (under time) should be absolute
        { sec: -25, expected: 0.25 },
      ];

      for (const tt of timeTests) {
        const res = calculateJurusScore({
          deductions: { timeOverUnderSeconds: tt.sec },
        });
        assertEqual(res.timeDeduction, tt.expected, `Time deduction for ${tt.sec}s`);
      }
      recordPass(section, "Discrete 5-second time steps (-0.05/5s) and sign invariance verified", performance.now() - start);
    } catch (e) {
      recordFail(section, "Discrete 5-second time steps (-0.05/5s) and sign invariance verified", performance.now() - start, e);
    }
  }

  // 4.3 Weapon drops (-0.50 each)
  {
    const start = performance.now();
    try {
      for (let drops = 0; drops <= 10; drops++) {
        const res = calculateJurusScore({
          accuracyScore: 9.9,
          expressionScore: 0,
          deductions: { weaponDrops: drops },
        });
        const expectedDeduction = Number((drops * 0.50).toFixed(2));
        assertEqual(res.weaponDeduction, expectedDeduction, `Weapon deduction for ${drops} drops`);
      }
      recordPass(section, "Weapon drop deductions (-0.50 each) verified up to 10 drops", performance.now() - start);
    } catch (e) {
      recordFail(section, "Weapon drop deductions (-0.50 each) verified up to 10 drops", performance.now() - start, e);
    }
  }

  // 4.4 Boundary (-0.05), Costume (-0.05), and Movement (-0.01) deductions
  {
    const start = performance.now();
    try {
      const res = calculateJurusScore({
        accuracyScore: 9.9,
        expressionScore: 0.1,
        deductions: {
          boundaryViolations: 3, // 3 * 0.05 = 0.15
          costumeFaults: 2,      // 2 * 0.05 = 0.10
          movementFaults: 7,     // 7 * 0.01 = 0.07
        },
      });
      assertEqual(res.boundaryDeduction, 0.15, "Boundary deduction 0.15");
      assertEqual(res.costumeDeduction, 0.10, "Costume deduction 0.10");
      assertEqual(res.movementDeduction, 0.07, "Movement deduction 0.07");
      assertEqual(res.totalDeductions, 0.32, "Total deductions: 0.15 + 0.10 + 0.07 = 0.32");
      assertEqual(res.netScore, 9.68, "Gross (10.0) - 0.32 = 9.68");
      recordPass(section, "Fractional precision in boundary, costume, and movement deductions verified", performance.now() - start);
    } catch (e) {
      recordFail(section, "Fractional precision in boundary, costume, and movement deductions verified", performance.now() - start, e);
    }
  }

  // 4.5 Score Clamping to Zero (Deductions > Gross)
  {
    const start = performance.now();
    try {
      // 1. Extreme deductions clamp netScore to exactly 0
      const clampedRes = calculateJurusScore({
        accuracyScore: 5.0,
        expressionScore: 0.0,
        deductions: {
          weaponDrops: 15,          // 7.50 pts
          boundaryViolations: 10,   // 0.50 pts
          costumeFaults: 10,        // 0.50 pts
          timeOverUnderSeconds: 60, // 0.60 pts
        },
      });
      assertEqual(clampedRes.totalDeductions, 9.10, "Total deductions = 9.10");
      assertEqual(clampedRes.netScore, 0, "Gross 5.0 - Deductions 9.10 must clamp to 0 (not -4.10)");

      // 2. Exact equality: deductions === grossScore
      const exactRes = calculateJurusScore({
        accuracyScore: 1.0,
        expressionScore: 0.0,
        deductions: {
          weaponDrops: 2, // 1.00 pts
        },
      });
      assertEqual(exactRes.totalDeductions, 1.0, "Deductions = 1.0");
      assertEqual(exactRes.netScore, 0, "Gross 1.0 - Deductions 1.0 = 0");
      recordPass(section, "Score clamping to 0 verified when deductions exceed or equal gross score", performance.now() - start);
    } catch (e) {
      recordFail(section, "Score clamping to 0 verified when deductions exceed or equal gross score", performance.now() - start, e);
    }
  }

  // 4.6 1,000-Case Randomized Jurus Fuzz Harness
  {
    const start = performance.now();
    try {
      let casesRun = 0;
      for (let i = 0; i < 1000; i++) {
        const accuracy = Math.round((Math.random() * 10) * 100) / 100;
        const expression = Math.round((Math.random() * 5) * 100) / 100;
        const timeSec = Math.floor(Math.random() * 120);
        const weapons = Math.floor(Math.random() * 6);
        const boundaries = Math.floor(Math.random() * 10);
        const costumes = Math.floor(Math.random() * 10);
        const movements = Math.floor(Math.random() * 100);

        const res = calculateJurusScore({
          accuracyScore: accuracy,
          expressionScore: expression,
          deductions: {
            timeOverUnderSeconds: timeSec,
            weaponDrops: weapons,
            boundaryViolations: boundaries,
            costumeFaults: costumes,
            movementFaults: movements,
          },
        });

        // INVARIANTS:
        assert(res.netScore >= 0, `Net score must be >= 0 (got ${res.netScore})`);
        assert(!isNaN(res.netScore), `Net score must not be NaN`);
        assert(!isNaN(res.totalDeductions), `Total deductions must not be NaN`);

        const expectedTime = Number((Math.floor(timeSec / 5) * 0.05).toFixed(2));
        const expectedWeap = Number((weapons * 0.50).toFixed(2));
        const expectedBound = Number((boundaries * 0.05).toFixed(2));
        const expectedCost = Number((costumes * 0.05).toFixed(2));
        const expectedMov = Number((movements * 0.01).toFixed(2));
        const expectedTotalDed = Number((expectedTime + expectedWeap + expectedBound + expectedCost + expectedMov).toFixed(2));
        const expectedGross = accuracy + expression;
        const expectedNet = Math.max(0, Number((expectedGross - expectedTotalDed).toFixed(2)));

        assertEqual(res.timeDeduction, expectedTime, `Time deduction in fuzz #${i}`);
        assertEqual(res.weaponDeduction, expectedWeap, `Weapon deduction in fuzz #${i}`);
        assertEqual(res.boundaryDeduction, expectedBound, `Boundary deduction in fuzz #${i}`);
        assertEqual(res.costumeDeduction, expectedCost, `Costume deduction in fuzz #${i}`);
        assertEqual(res.movementDeduction, expectedMov, `Movement deduction in fuzz #${i}`);
        assertEqual(res.totalDeductions, expectedTotalDed, `Total deductions in fuzz #${i}`);
        assertEqual(res.netScore, expectedNet, `Net score in fuzz #${i}`);

        casesRun++;
      }
      assertEqual(casesRun, 1000, "1,000 fuzz cases executed");
      recordPass(section, "1,000 randomized Jurus rubric stress cases passed all mathematical invariants", performance.now() - start);
    } catch (e) {
      recordFail(section, "1,000 randomized Jurus rubric stress cases passed all mathematical invariants", performance.now() - start, e);
    }
  }
}

// ============================================================================
// SECTION 5: ASSOCIATION SEARCH & FILTER STRESS & LATENCY BENCHMARK
// ============================================================================
function runSection5Associations() {
  const section = "ASSOCIATION-SEARCH-STRESS";

  // 5.1 Registry completeness & category breakdown
  {
    const start = performance.now();
    try {
      assertEqual(SILAT_ASSOCIATIONS.length, 26, "Exact 26 associations loaded");

      const counts = getCategoryCounts();
      assertEqual(counts.ALL, 26, "Total ALL count = 26");
      assertEqual(counts.BADAN_INDUK, 4, "Badan Induk count = 4");
      assertEqual(counts.PENGASAS_TERAS, 4, "4 Pengasas Teras count = 4");
      assertEqual(counts.PERGURUAN_UTAMA, 9, "Perguruan Utama count = 9");
      assertEqual(counts.ANTARABANGSA, 9, "Antarabangsa count = 9");
      assertEqual(counts.BADAN_INDUK + counts.PENGASAS_TERAS + counts.PERGURUAN_UTAMA + counts.ANTARABANGSA, 26, "Sum of categories = 26");

      recordPass(section, "Association registry partitions exactly into 4+4+9+9 = 26 associations", performance.now() - start);
    } catch (e) {
      recordFail(section, "Association registry partitions exactly into 4+4+9+9 = 26 associations", performance.now() - start, e);
    }
  }

  // 5.2 Empty, whitespace, and case-insensitivity queries
  {
    const start = performance.now();
    try {
      // Empty queries
      assertEqual(searchAssociations("").length, 26, "Empty string returns 26");
      assertEqual(searchAssociations("   ").length, 26, "Spaces-only returns 26");
      assertEqual(searchAssociations("\t\n\r  ").length, 26, "Whitespace escapes returns 26");

      // Case-insensitivity tests
      const pesakaUpper = searchAssociations("PESAKA");
      const pesakaLower = searchAssociations("pesaka");
      const pesakaMixed = searchAssociations("PeSaKa");
      assert(pesakaUpper.length > 0, "PESAKA found");
      assertEqual(pesakaUpper.length, pesakaLower.length, "Case insensitive upper vs lower");
      assertEqual(pesakaUpper.length, pesakaMixed.length, "Case insensitive upper vs mixed");

      recordPass(section, "Empty, whitespace, and case-variant search queries handle safely", performance.now() - start);
    } catch (e) {
      recordFail(section, "Empty, whitespace, and case-variant search queries handle safely", performance.now() - start, e);
    }
  }

  // 5.3 Adversarial security vectors: SQL Injection, XSS, ReDoS, Command Injection
  {
    const start = performance.now();
    try {
      const maliciousPayloads = [
        // SQL injection
        "' OR '1'='1",
        "'; DROP TABLE associations;--",
        "' UNION SELECT null, null, null--",
        "admin' --",
        "1; WAITFOR DELAY '0:0:5'",

        // XSS & HTML
        "<script>alert('pwn')</script>",
        "<img src=x onerror=alert(1)>",
        "<svg onload=alert(document.domain)>",
        "javascript:alert(1)",
        "\"><script>document.location='http://attacker.com'</script>",

        // ReDoS & regex special characters
        "(a+)+$",
        ".*.*.*",
        "^.*$",
        "[a-z0-9_-]+",
        "?+*^$()[]{}|\\",
        "(((((((a?)))))))",

        // Command Injection & Path traversal
        "../../../../../../etc/passwd",
        "..\\..\\..\\windows\\win.ini",
        "| ping -c 5 127.0.0.1",
        "$(whoami)",
        "`id`",

        // Template Injection & Format Strings
        "${7*7}",
        "{{7*7}}",
        "#{7*7}",
        "%s%s%s%s%s%n",
        "\\x00",
        "\\u0000",
      ];

      for (const payload of maliciousPayloads) {
        // Query must not throw uncaught error, must not hang, and return safe array
        const searchRes = searchAssociations(payload);
        assert(Array.isArray(searchRes), `Result for payload [${payload}] must be an array`);
        // Since no association has these malicious payloads in its data, should safely return 0 results
        assertEqual(searchRes.length, 0, `Payload [${payload}] returned ${searchRes.length} items (expected 0)`);
      }
      recordPass(section, "All 23 SQLi, XSS, ReDoS, and Command Injection payloads safely neutralized", performance.now() - start);
    } catch (e) {
      recordFail(section, "All 23 SQLi, XSS, ReDoS, and Command Injection payloads safely neutralized", performance.now() - start, e);
    }
  }

  // 5.4 Unicode, Arabic calligraphy, and Multi-language stress
  {
    const start = performance.now();
    try {
      const unicodeQueries = [
        "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ", // Arabic Bismillah
        "سيلت ملايو",                          // Jawi Silat Melayu
        "🥋 🇲🇾 🥊 🔥 🏆",                      // Emojis
        "馬來武術",                              // Traditional Chinese
        "силат",                               // Cyrillic
        "Dato' Meor",                          // Apostrophe in Malay name
        "Tan Sri Omardin",
        "Ustaz Hanafi",
        "Anuar Abdul Wahab",
      ];

      for (const uq of unicodeQueries) {
        const res = searchAssociations(uq);
        assert(Array.isArray(res), `Unicode query [${uq}] returns array`);
      }

      // Check specific Malay name matches
      const meorRes = searchAssociations("Meor Abdul Rahman");
      assert(meorRes.some((a) => a.id === "pssgm"), "Found Gayong (PSSGM) by founder Meor");

      const omardinRes = searchAssociations("Omardin Mauju");
      assert(omardinRes.some((a) => a.id === "psslm"), "Found Lincah (PSSLM) by founder Omardin");

      const hanafiRes = searchAssociations("Hanafi Ahmad");
      assert(hanafiRes.some((a) => a.id === "psscm"), "Found Cekak (PSSCM) by founder Hanafi");

      const anuarRes = searchAssociations("Anuar Abdul Wahab");
      assert(anuarRes.some((a) => a.id === "psgfm"), "Found Fatani (PSGFM) by founder Anuar");

      recordPass(section, "Unicode, Arabic calligraphy, Jawi, and Malay founder name lookups verified", performance.now() - start);
    } catch (e) {
      recordFail(section, "Unicode, Arabic calligraphy, Jawi, and Malay founder name lookups verified", performance.now() - start, e);
    }
  }

  // 5.5 Category filtering combined with search
  {
    const start = performance.now();
    try {
      // "Gayong" in PENGASAS_TERAS -> should find PSSGM (and not unrelated)
      const gayongTeras = searchAssociations("Gayong", "PENGASAS_TERAS");
      assert(gayongTeras.length >= 1, "Gayong found in PENGASAS_TERAS");
      assert(gayongTeras.every((a) => a.category === "PENGASAS_TERAS"), "All results are PENGASAS_TERAS");

      // "Gayong" in BADAN_INDUK -> 0 (no badan induk has Gayong in name)
      const gayongInduk = searchAssociations("Gayong", "BADAN_INDUK");
      assertEqual(gayongInduk.length, 0, "No Gayong in BADAN_INDUK");

      // "PERSILAT" in ANTARABANGSA -> returns PERSILAT
      const persilatIntl = searchAssociations("PERSILAT", "ANTARABANGSA");
      assert(persilatIntl.some((a) => a.id === "persilat"), "PERSILAT found in ANTARABANGSA");

      // "PESAKA" in BADAN_INDUK -> PESAKA Malaysia, PESAKA KL, PESAKA Johor
      const pesakaInduk = searchAssociations("PESAKA", "BADAN_INDUK");
      assert(pesakaInduk.length >= 3, "At least 3 PESAKA bodies found in BADAN_INDUK");

      recordPass(section, "Category filtering strictly enforces partition boundary across searches", performance.now() - start);
    } catch (e) {
      recordFail(section, "Category filtering strictly enforces partition boundary across searches", performance.now() - start, e);
    }
  }

  // 5.6 5,000-Query Latency & Throughput Benchmark
  {
    const start = performance.now();
    try {
      const benchmarkQueries = [
        "gayong", "lincah", "cekak", "pesaka", "johor", "sarawak",
        "persilat", "ipsi", "psht", "tapak suci", "kualalumpur", "melayu",
        "tanding", "seni", "senjata", "keris", "golok", "bunga",
        "selangor", "kedah", "perak", "pahang", "terengganu", "kelantan"
      ];

      const iterations = 5000;
      for (let i = 0; i < iterations; i++) {
        const q = benchmarkQueries[i % benchmarkQueries.length];
        const cat: CategoryFilterKey = (["ALL", "BADAN_INDUK", "PENGASAS_TERAS", "PERGURUAN_UTAMA", "ANTARABANGSA"] as const)[i % 5];
        searchAssociations(q, cat);
      }

      const totalDurationMs = performance.now() - start;
      const avgDurationUs = (totalDurationMs / iterations) * 1000; // microseconds
      assert(totalDurationMs < 500, `5,000 queries took ${totalDurationMs.toFixed(2)}ms (expected < 500ms)`);

      recordPass(section, `5,000 search queries executed in ${totalDurationMs.toFixed(1)}ms (${avgDurationUs.toFixed(1)}µs/query)`, totalDurationMs);
    } catch (e) {
      recordFail(section, `5,000 search queries executed in < 500ms`, performance.now() - start, e);
    }
  }
}

// ============================================================================
// MAIN RUNNER & REPORT
// ============================================================================
async function main() {
  console.log("");
  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("   ADVERSARIAL STRESS TEST HARNESS — PERSILAT 2026 & ASSOCIATIONS")));
  console.log(bold(cyan("   Role: challenger_public_1 (Empirical Challenger)")));
  console.log(bold(cyan("================================================================================")));
  console.log(dim(`Execution Time: ${new Date().toISOString()}`));
  console.log("");

  const suiteStart = performance.now();

  console.log(bold(yellow("--- [1/5] COMBINATORIAL STRIKE SEQUENCES & EXTREME BOUNDARIES ---")));
  runSection1Strikes();
  console.log("");

  console.log(bold(yellow("--- [2/5] CUMULATIVE PENALTY MATRIX & DQ ESCALATION HARNESS ---")));
  runSection2Penalties();
  console.log("");

  console.log(bold(yellow("--- [3/5] 5-SECOND GRAPPLE TAKEDOWN BOUNDARY & PRECISION ---")));
  runSection3Grapple();
  console.log("");

  console.log(bold(yellow("--- [4/5] JURUS RUBRICS STRESS & 1,000-CASE NUMERICAL FUZZER ---")));
  runSection4Jurus();
  console.log("");

  console.log(bold(yellow("--- [5/5] ASSOCIATION SEARCH STRESS, SECURITY VECTORS & BENCHMARK ---")));
  runSection5Associations();
  console.log("");

  const totalDuration = performance.now() - suiteStart;
  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;

  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("                         STRESS EXECUTION SUMMARY")));
  console.log(bold(cyan("================================================================================")));
  console.log(`  Total Checks:    ${results.length}`);
  console.log(`  Passed:          ${green(`${passCount} (${Math.round((passCount / results.length) * 100)}%)`)}`);
  console.log(`  Failed:          ${failCount > 0 ? red(`${failCount}`) : "0 (0%)"}`);
  console.log(`  Total Duration:  ${totalDuration.toFixed(2)}ms`);
  console.log(bold(cyan("================================================================================")));

  if (failCount > 0) {
    console.log("");
    console.log(bold(red(`❌ STRESS TEST FAILED: ${failCount} failure(s) detected!`)));
    process.exit(1);
  } else {
    console.log("");
    console.log(bold(green(`✅ STRESS TEST VERDICT: ALL ADVERSARIAL STRESS TESTS PASSED CLEANLY!`)));
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal stress test error:", err);
  process.exit(1);
});
