/**
 * PERSILAT 2026 Rules Explorer & Calculator Engine Types
 * Conforms to PROJECT.md § Interface Contracts
 */

export type StrikeType = "PUNCH" | "KICK" | "TAKEDOWN";

export type PenaltyType =
  | "TEGURAN_1"
  | "TEGURAN_2"
  | "PERINGATAN_1"
  | "PERINGATAN_2"
  | "PERINGATAN_3_DQ"
  | "DIRECT_DQ";

export interface ScoreCalculation {
  punches: number;      // 1 pt each
  kicks: number;        // 2 pts each
  takedowns: number;    // 3 pts each
  penalties: PenaltyType[];
  totalScore: number;
  isDisqualified: boolean;
}

export type JurusCategory = "TUNGGAL" | "GANDA" | "REGU" | "SOLO_BEBAS";

export interface JurusDeductions {
  timeOverUnderSeconds: number; // -0.05 pts per 5s over/under 180s
  weaponDrops: number;          // -0.50 pts per dropped weapon
  boundaryViolations: number;   // -0.05 pts per arena line exit
  costumeFaults: number;        // -0.05 pts per attire defect (tengkolok, samping)
  movementFaults: number;       // -0.01 pts per accuracy deviation
}

export interface JurusScoreCalculation {
  category: JurusCategory;
  accuracyScore: number;       // Nilai Kebenaran (base 0-100 or 9.90 max)
  expressionScore: number;     // Nilai Kemantapan (power, stamina, rhythm 0-10)
  deductions: JurusDeductions;
  timeDeduction: number;
  weaponDeduction: number;
  boundaryDeduction: number;
  costumeDeduction: number;
  movementDeduction: number;
  totalDeductions: number;
  netScore: number;
}

export type RuleCategory =
  | "ALL"
  | "TANDING_SCORING"
  | "JURUS_RUBRICS"
  | "TARGET_ZONES_FOULS"
  | "VAR_PROTOCOL"
  | "WEIGHT_AGE_CLASSES";

export interface RuleEntry {
  id: string;
  category: Exclude<RuleCategory, "ALL">;
  title: string;
  titleEn?: string;
  summary: string;
  details: string[];
  citation: string;
  severity?: "info" | "warning" | "danger" | "critical";
  tags: string[];
}

export interface WeightDivision {
  classLetter: string;
  name: string;
  maleRange: string;
  femaleRange?: string;
  notes?: string;
}

export interface AgeDivision {
  division: string;
  ageSpan: string;
  roundFormat: string;
  notes: string;
}
