import type {
  JurusCategory,
  JurusDeductions,
  JurusScoreCalculation,
  PenaltyType,
  ScoreCalculation,
} from "./types";

/**
 * Returns point deduction value for a given penalty type.
 */
export function getPenaltyDeduction(penalty: PenaltyType): number {
  switch (penalty) {
    case "TEGURAN_1":
      return 1;
    case "TEGURAN_2":
      return 2;
    case "PERINGATAN_1":
      return 5;
    case "PERINGATAN_2":
      return 10;
    case "PERINGATAN_3_DQ":
    case "DIRECT_DQ":
      return 0;
    default:
      return 0;
  }
}

/**
 * Determines whether a penalty type triggers instant or cumulative Disqualification.
 */
export function isDisqualifyingPenalty(penalty: PenaltyType): boolean {
  return penalty === "PERINGATAN_3_DQ" || penalty === "DIRECT_DQ";
}

/**
 * Calculates raw strike points, penalty deductions, net score, and disqualification status.
 * Punches: 1 pt each
 * Kicks: 2 pts each
 * Takedowns: 3 pts each (subject to 5s grapple rule)
 * Penalties: Teguran 1 (-1), Teguran 2 (-2), Peringatan 1 (-5), Peringatan 2 (-10), Peringatan 3 / Direct DQ (DQ)
 */
export function calculateTandingScore(
  punches: number,
  kicks: number,
  takedowns: number,
  penalties: PenaltyType[] = []
): ScoreCalculation {
  const safePunches = Math.max(0, Math.floor(punches || 0));
  const safeKicks = Math.max(0, Math.floor(kicks || 0));
  const safeTakedowns = Math.max(0, Math.floor(takedowns || 0));

  const strikePoints = safePunches * 1 + safeKicks * 2 + safeTakedowns * 3;

  let totalDeductions = 0;
  let isDisqualified = false;

  for (const penalty of penalties) {
    totalDeductions += getPenaltyDeduction(penalty);
    if (isDisqualifyingPenalty(penalty)) {
      isDisqualified = true;
    }
  }

  const totalScore = strikePoints - totalDeductions;

  return {
    punches: safePunches,
    kicks: safeKicks,
    takedowns: safeTakedowns,
    penalties: [...penalties],
    totalScore,
    isDisqualified,
  };
}

/**
 * Computes Jurus / Seni score according to PERSILAT 2026 rubric:
 * - Nilai Kebenaran (Accuracy)
 * - Nilai Kemantapan (Power, Rhythm, Expression)
 * - Deductions:
 *    * Time deviation: -0.05 pts per 5 seconds over or under standard duration (180s)
 *    * Dropped weapon: -0.50 pts per occurrence
 *    * Boundary violation: -0.05 pts per exit
 *    * Costume fault: -0.05 pts per fault (loose tengkolok, samping)
 *    * Movement fault: -0.01 pts per movement error / miss
 */
export function calculateJurusScore({
  category = "TUNGGAL",
  accuracyScore = 9.9,
  expressionScore = 0.0,
  deductions = {
    timeOverUnderSeconds: 0,
    weaponDrops: 0,
    boundaryViolations: 0,
    costumeFaults: 0,
    movementFaults: 0,
  },
}: {
  category?: JurusCategory;
  accuracyScore?: number;
  expressionScore?: number;
  deductions?: Partial<JurusDeductions>;
}): JurusScoreCalculation {
  const safeAccuracy = Math.max(0, Number(accuracyScore) || 0);
  const safeExpression = Math.max(0, Number(expressionScore) || 0);

  const safeDeductions: JurusDeductions = {
    timeOverUnderSeconds: Math.abs(deductions.timeOverUnderSeconds || 0),
    weaponDrops: Math.max(0, Math.floor(deductions.weaponDrops || 0)),
    boundaryViolations: Math.max(0, Math.floor(deductions.boundaryViolations || 0)),
    costumeFaults: Math.max(0, Math.floor(deductions.costumeFaults || 0)),
    movementFaults: Math.max(0, Math.floor(deductions.movementFaults || 0)),
  };

  // Time penalty: -0.05 per 5s over or under
  const timeBlocks = Math.floor(safeDeductions.timeOverUnderSeconds / 5);
  const timeDeduction = Number((timeBlocks * 0.05).toFixed(2));

  // Weapon drop: -0.50 per drop
  const weaponDeduction = Number((safeDeductions.weaponDrops * 0.5).toFixed(2));

  // Boundary violation: -0.05 per exit
  const boundaryDeduction = Number((safeDeductions.boundaryViolations * 0.05).toFixed(2));

  // Costume fault: -0.05 per fault
  const costumeDeduction = Number((safeDeductions.costumeFaults * 0.05).toFixed(2));

  // Movement fault: -0.01 per accuracy error
  const movementDeduction = Number((safeDeductions.movementFaults * 0.01).toFixed(2));

  const totalDeductions = Number(
    (
      timeDeduction +
      weaponDeduction +
      boundaryDeduction +
      costumeDeduction +
      movementDeduction
    ).toFixed(2)
  );

  const grossScore = safeAccuracy + safeExpression;
  const netScore = Math.max(0, Number((grossScore - totalDeductions).toFixed(2)));

  return {
    category,
    accuracyScore: safeAccuracy,
    expressionScore: safeExpression,
    deductions: safeDeductions,
    timeDeduction,
    weaponDeduction,
    boundaryDeduction,
    costumeDeduction,
    movementDeduction,
    totalDeductions,
    netScore,
  };
}
