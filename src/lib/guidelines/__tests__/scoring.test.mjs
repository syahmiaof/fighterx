import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateTandingScore,
  calculateJurusScore,
  getPenaltyDeduction,
  isDisqualifyingPenalty,
} from "../scoring.ts";

describe("Tanding Scoring Engine", () => {
  it("calculates basic strike points accurately", () => {
    // 3 punches (3 pts) + 2 kicks (4 pts) + 1 takedown (3 pts) = 10 pts
    const result = calculateTandingScore(3, 2, 1, []);
    assert.equal(result.punches, 3);
    assert.equal(result.kicks, 2);
    assert.equal(result.takedowns, 1);
    assert.equal(result.totalScore, 10);
    assert.equal(result.isDisqualified, false);
  });

  it("handles zero strikes correctly", () => {
    const result = calculateTandingScore(0, 0, 0, []);
    assert.equal(result.totalScore, 0);
    assert.equal(result.isDisqualified, false);
  });

  it("clamps negative values to zero", () => {
    const result = calculateTandingScore(-5, -2, -1, []);
    assert.equal(result.punches, 0);
    assert.equal(result.kicks, 0);
    assert.equal(result.takedowns, 0);
    assert.equal(result.totalScore, 0);
  });

  it("deducts points for Teguran and Peringatan penalties", () => {
    // 5 kicks = 10 pts; penalties: Teguran 1 (-1), Peringatan 1 (-5) => totalScore = 4
    const result = calculateTandingScore(0, 5, 0, ["TEGURAN_1", "PERINGATAN_1"]);
    assert.equal(result.totalScore, 4);
    assert.equal(result.isDisqualified, false);
  });

  it("handles cumulative penalty deductions correctly", () => {
    // 2 takedowns = 6 pts; penalties: Teguran 1 (-1), Teguran 2 (-2), Peringatan 2 (-10) => totalScore = -7
    const result = calculateTandingScore(0, 0, 2, [
      "TEGURAN_1",
      "TEGURAN_2",
      "PERINGATAN_2",
    ]);
    assert.equal(result.totalScore, -7);
    assert.equal(result.isDisqualified, false);
  });

  it("flags Disqualification when PERINGATAN_3_DQ is triggered", () => {
    const result = calculateTandingScore(5, 2, 1, ["PERINGATAN_3_DQ"]);
    assert.equal(result.isDisqualified, true);
  });

  it("flags Disqualification when DIRECT_DQ is triggered", () => {
    const result = calculateTandingScore(10, 5, 2, ["DIRECT_DQ"]);
    assert.equal(result.isDisqualified, true);
  });

  it("accurately reports penalty deduction values and DQ status", () => {
    assert.equal(getPenaltyDeduction("TEGURAN_1"), 1);
    assert.equal(getPenaltyDeduction("TEGURAN_2"), 2);
    assert.equal(getPenaltyDeduction("PERINGATAN_1"), 5);
    assert.equal(getPenaltyDeduction("PERINGATAN_2"), 10);
    assert.equal(getPenaltyDeduction("PERINGATAN_3_DQ"), 0);
    assert.equal(getPenaltyDeduction("DIRECT_DQ"), 0);

    assert.equal(isDisqualifyingPenalty("TEGURAN_1"), false);
    assert.equal(isDisqualifyingPenalty("PERINGATAN_2"), false);
    assert.equal(isDisqualifyingPenalty("PERINGATAN_3_DQ"), true);
    assert.equal(isDisqualifyingPenalty("DIRECT_DQ"), true);
  });
});

describe("Jurus / Seni Scoring Engine", () => {
  it("calculates clean jurus performance without deductions", () => {
    const result = calculateJurusScore({
      category: "TUNGGAL",
      accuracyScore: 9.9,
      expressionScore: 0.05,
      deductions: {
        timeOverUnderSeconds: 0,
        weaponDrops: 0,
        boundaryViolations: 0,
        costumeFaults: 0,
        movementFaults: 0,
      },
    });

    assert.equal(result.accuracyScore, 9.9);
    assert.equal(result.totalDeductions, 0);
    assert.equal(result.netScore, 9.95);
  });

  it("calculates dropped weapon deduction (-0.50 each)", () => {
    const result = calculateJurusScore({
      category: "TUNGGAL",
      accuracyScore: 9.9,
      expressionScore: 0,
      deductions: {
        weaponDrops: 1,
      },
    });

    assert.equal(result.weaponDeduction, 0.5);
    assert.equal(result.totalDeductions, 0.5);
    assert.equal(result.netScore, 9.4);
  });

  it("calculates time deviation deductions (-0.05 per 5 seconds)", () => {
    // 12 seconds over/under => Math.floor(12/5) = 2 blocks => -0.10 pts
    const result = calculateJurusScore({
      category: "GANDA",
      accuracyScore: 9.8,
      expressionScore: 0.1,
      deductions: {
        timeOverUnderSeconds: 12,
      },
    });

    assert.equal(result.timeDeduction, 0.1);
    assert.equal(result.netScore, 9.8);
  });

  it("calculates boundary, costume, and movement accuracy deductions", () => {
    const result = calculateJurusScore({
      category: "REGU",
      accuracyScore: 9.9,
      expressionScore: 0.05,
      deductions: {
        boundaryViolations: 2, // 2 * 0.05 = 0.10
        costumeFaults: 1,      // 1 * 0.05 = 0.05
        movementFaults: 5,     // 5 * 0.01 = 0.05
      },
    });

    assert.equal(result.boundaryDeduction, 0.1);
    assert.equal(result.costumeDeduction, 0.05);
    assert.equal(result.movementDeduction, 0.05);
    assert.equal(result.totalDeductions, 0.2);
    assert.equal(result.netScore, 9.75);
  });

  it("clamps net score to zero if deductions exceed base score", () => {
    const result = calculateJurusScore({
      accuracyScore: 1.0,
      expressionScore: 0,
      deductions: {
        weaponDrops: 5, // -2.50 pts
      },
    });

    assert.equal(result.netScore, 0);
  });
});
