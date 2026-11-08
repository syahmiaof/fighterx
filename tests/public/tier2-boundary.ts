/**
 * FighterX Public E2E Test Suite — Tier 2: Boundary & Corner Cases
 * 
 * Verifies edge cases, boundary conditions, and adversarial inputs:
 * - Zero and negative scoring inputs
 * - 5-second grapple timeout rule
 * - Cumulative and direct disqualification triggers
 * - Empty, whitespace, special-character and script search queries
 * - Malaysian phone number formatting boundary matrix
 * - Malaysian postal code (5-digit) boundary matrix
 * - Malaysian MyKad (12-digit) and Passport validation boundary matrix
 * - Password security complexity boundary (12 chars + 4 classes)
 * - Jurus scoring deductions discrete clamping and invariants
 */

import {
  TestCase,
  assert,
  assertEqual,
} from "./types";

import {
  searchAssociations,
} from "../../src/lib/associations";

import {
  calculateTandingScore,
  calculateJurusScore,
} from "../../src/lib/guidelines";

import {
  isValidMalaysianPhone,
  isValidPostalCode,
  isValidIdentityNumber,
  hasSecurePassword,
} from "../../src/lib/club-registration/validation";

export const tier2Tests: TestCase[] = [
  // --------------------------------------------------------------------------
  // T2-BOUND-01: Zero & Negative Scoring Inputs Handled Safely
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-01",
    tier: 2,
    name: "Zero & Negative Scoring: Clamp negative counts to zero and handle zero strikes with penalties",
    run: () => {
      // 1. Negative strike counts must be clamped to 0
      const negativeStrikes = calculateTandingScore(-10, -5, -3, []);
      assertEqual(negativeStrikes.punches, 0, "Negative punches must be clamped to 0");
      assertEqual(negativeStrikes.kicks, 0, "Negative kicks must be clamped to 0");
      assertEqual(negativeStrikes.takedowns, 0, "Negative takedowns must be clamped to 0");
      assertEqual(negativeStrikes.totalScore, 0, "Zero strikes must yield 0 total points");
      assertEqual(negativeStrikes.isDisqualified, false);

      // 2. Zero strikes with penalty deductions yields negative total score without runtime error
      const zeroStrikesWithPenalty = calculateTandingScore(0, 0, 0, ["TEGURAN_1"]);
      assertEqual(zeroStrikesWithPenalty.totalScore, -1, "0 strikes - 1 pt penalty must equal -1");

      const zeroStrikesHeavyPenalty = calculateTandingScore(0, 0, 0, ["PERINGATAN_1", "PERINGATAN_2"]);
      assertEqual(zeroStrikesHeavyPenalty.totalScore, -15, "0 strikes - 15 pts penalty must equal -15");

      // 3. Floating-point strike counts floored
      const floatStrikes = calculateTandingScore(3.9, 2.1, 1.8, []);
      assertEqual(floatStrikes.punches, 3, "Floating-point punches must be floored");
      assertEqual(floatStrikes.kicks, 2, "Floating-point kicks must be floored");
      assertEqual(floatStrikes.takedowns, 1, "Floating-point takedowns must be floored");
      assertEqual(floatStrikes.totalScore, 10, "3*1 + 2*2 + 1*3 = 10");
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-02: 5-Second Grapple (Tangkapan) Timeout Rule
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-02",
    tier: 2,
    name: "5-Second Grapple Rule: Tangkapan executed <= 5.0s scores 3 pts; > 5.0s yields 0 pts",
    run: () => {
      /**
       * Models PERSILAT 2026 5-second grapple rule:
       * When an incoming strike is caught, a counter-takedown must be finalized within 5.0s.
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

      // Exact boundary tests
      assertEqual(evaluateGrappleTakedown(0.5).awardedPoints, 3, "0.5s rapid sweep is legal (3 pts)");
      assertEqual(evaluateGrappleTakedown(4.99).awardedPoints, 3, "4.99s grapple is legal (3 pts)");
      assertEqual(evaluateGrappleTakedown(5.0).awardedPoints, 3, "Exact 5.0s boundary is legal (3 pts)");
      assertEqual(evaluateGrappleTakedown(5.0).decision, "LEGAL_TAKEDOWN");

      // Exceeded threshold
      assertEqual(evaluateGrappleTakedown(5.01).awardedPoints, 0, "5.01s exceeds timeout -> 0 pts");
      assertEqual(evaluateGrappleTakedown(5.01).decision, "TIMEOUT_HENTI");
      assertEqual(evaluateGrappleTakedown(7.5).awardedPoints, 0, "7.5s prolonged grapple -> 0 pts");
      assertEqual(evaluateGrappleTakedown(7.5).decision, "TIMEOUT_HENTI");
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-03: Disqualification Triggers: Cumulative vs Direct DQ
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-03",
    tier: 2,
    name: "Disqualification Triggers: Cumulative Peringatan 3 and Direct DQ conditions",
    run: () => {
      // 1. Peringatan ladder without DQ
      const round1 = calculateTandingScore(5, 2, 0, ["PERINGATAN_1"]);
      assertEqual(round1.isDisqualified, false, "Peringatan 1 does not trigger DQ");

      const round2 = calculateTandingScore(5, 2, 0, ["PERINGATAN_1", "PERINGATAN_2"]);
      assertEqual(round2.isDisqualified, false, "Peringatan 2 does not trigger DQ");

      // 2. Peringatan 3 triggers cumulative DQ
      const round3DQ = calculateTandingScore(5, 2, 0, ["PERINGATAN_1", "PERINGATAN_2", "PERINGATAN_3_DQ"]);
      assertEqual(round3DQ.isDisqualified, true, "Peringatan 3 must trigger Disqualification");

      // 3. Direct DQ (severe illegal strike, e.g. neck piledriver or morning weigh-in failure)
      const instantDQ = calculateTandingScore(10, 5, 2, ["DIRECT_DQ"]);
      assertEqual(instantDQ.isDisqualified, true, "Direct DQ must immediately disqualify fighter");

      // 4. Weigh-in Zero Tolerance Rule Model
      function checkWeighInEligibility(actualWeightKg: number, maxWeightKg: number): boolean {
        // Zero tolerance: not even 0.05kg allowed over limit
        return actualWeightKg <= maxWeightKg;
      }

      assert(checkWeighInEligibility(65.0, 65.0), "65.0kg on 65.0kg class is eligible");
      assert(!checkWeighInEligibility(65.05, 65.0), "+0.05kg over limit is disqualified");
      assert(!checkWeighInEligibility(65.1, 65.0), "+0.1kg over limit is disqualified");
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-04: Association Search Sanitization & Corner Queries
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-04",
    tier: 2,
    name: "Search Sanitization: Empty queries, whitespace, special chars, and XSS patterns",
    run: () => {
      // 1. Empty string returns full directory (27)
      const emptyResults = searchAssociations("");
      assertEqual(emptyResults.length, 27, "Empty search query must return all 27 associations");

      // 2. Spaces-only returns full directory (27)
      const spacesResults = searchAssociations("     ");
      assertEqual(spacesResults.length, 27, "Whitespace-only query must return all 27 associations");

      // 3. Special characters must not crash the search engine
      const specialResults = searchAssociations("!@#$%^&*()_+{}|:\"<>?~`-=[]\\;',./");
      assertEqual(specialResults.length, 0, "Special symbols should safely return 0 results");

      // 4. Potential XSS payload safely treated as literal text
      const xssResults = searchAssociations("<script>alert('pwn')</script>");
      assertEqual(xssResults.length, 0, "Script tags must not execute or cause crash");

      // 5. Unicode / Arabic calligraphy query safely handled
      const arabicResults = searchAssociations("بِسْمِ");
      assertEqual(arabicResults.length, 0, "Arabic query must not throw uncaught exception");

      // 6. Extremely long input query (1000 characters)
      const longQuery = "gayong".repeat(200);
      const longResults = searchAssociations(longQuery);
      assertEqual(longResults.length, 0, "Super-long query must return 0 results quickly");
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-05: Malaysian Phone Number Validation Boundary Matrix
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-05",
    tier: 2,
    name: "Phone Number Validation: Malaysian mobile formats (+60 1X, 01X) vs invalid strings",
    run: () => {
      // Valid Malaysian mobile numbers
      const validNumbers = [
        "0123456789",
        "012-345 6789",
        "012-3456789",
        "+60123456789",
        "+60 12-345 6789",
        "+60 13-987 6543",
        "+60 14-123 4567",
        "+60 16-222 3333",
        "+60 17-444 5555",
        "+60 18-666 7777",
        "+60 19-888 9999",
        "01112345678",        // 11 digits (011 prefix)
        "+601112345678",
        "+60 11-1234 5678",
      ];

      for (const phone of validNumbers) {
        assert(isValidMalaysianPhone(phone), `Phone "${phone}" should be valid Malaysian format`);
      }

      // Invalid phone numbers
      const invalidNumbers = [
        "",
        "   ",
        "12345",              // too short
        "01234567",           // 8 digits (too short)
        "01234567890123",     // too long
        "03-79812345",        // landline prefix 03
        "04-1234567",         // landline prefix 04
        "+1 555-123-4567",    // US code
        "012-CALL-NOW",       // letters
        "+60 22-123 4567",    // invalid mobile prefix 02
      ];

      for (const phone of invalidNumbers) {
        assert(!isValidMalaysianPhone(phone), `Phone "${phone}" should be marked INVALID`);
      }
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-06: Malaysian Poskod (Postal Code) 5-Digit Boundary Matrix
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-06",
    tier: 2,
    name: "Postal Code Validation: Exactly 5 numeric digits vs malformed codes",
    run: () => {
      // Valid 5-digit Malaysian poskod
      const validPoskod = ["50480", "43000", "08000", "93050", "88000", "10000", "99999"];
      for (const code of validPoskod) {
        assert(isValidPostalCode(code), `Poskod "${code}" must be valid`);
      }

      // Invalid poskod
      const invalidPoskod = [
        "",
        " ",
        "5048",        // 4 digits
        "504800",      // 6 digits
        "5048A",       // alpha char
        "50 48",       // spaces
        "-5048",       // negative
        "ABCDE",       // letters
        "5048!",       // symbol
      ];
      for (const code of invalidPoskod) {
        assert(!isValidPostalCode(code), `Poskod "${code}" must be marked INVALID`);
      }
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-07: Malaysian MyKad & Passport Format Boundary Matrix
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-07",
    tier: 2,
    name: "Identity Validation: 12-digit MyKad (with/without hyphens) and Passport formats",
    run: () => {
      // Valid MyKad (12 digits)
      assert(isValidIdentityNumber("901231-14-5567"), "901231-14-5567 must be valid MyKad");
      assert(isValidIdentityNumber("901231145567"), "901231145567 must be valid MyKad");
      assert(isValidIdentityNumber("000101-01-1234"), "000101-01-1234 must be valid MyKad");

      // Valid Passport (6-15 alphanumeric)
      assert(isValidIdentityNumber("A12345678"), "A12345678 must be valid Passport");
      assert(isValidIdentityNumber("H9876543"), "H9876543 must be valid Passport");

      // Invalid ID numbers (too short < 6 chars, too long > 15 chars, empty, or forbidden characters)
      assert(!isValidIdentityNumber(""), "Empty ID must be invalid");
      assert(!isValidIdentityNumber("   "), "Whitespace ID must be invalid");
      assert(!isValidIdentityNumber("123"), "3-char ID (< 6 chars) must be invalid");
      assert(!isValidIdentityNumber("ABC"), "3-char alphanumeric ID must be invalid");
      assert(!isValidIdentityNumber("12345"), "5-char ID (< 6 chars) must be invalid");
      assert(!isValidIdentityNumber("A1234567890123456"), "16-char string (> 15 chars) must be invalid");
      assert(!isValidIdentityNumber("901231-14-556!"), "Special characters must be invalid");
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-08: Password Complexity Boundary (12 Chars + 4 Character Classes)
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-08",
    tier: 2,
    name: "Password Complexity: Minimum 12 chars and required character classes",
    run: () => {
      // Valid strong passwords (>=12 chars, upper, lower, number, symbol)
      assert(hasSecurePassword("PahlawanSilat2026!"), "18 chars, all 4 classes must pass");
      assert(hasSecurePassword("Gayong#Wira99"), "13 chars, all 4 classes must pass");
      assert(hasSecurePassword("A1b!C2d#E3f$"), "Exact 12 chars boundary must pass");

      // Invalid passwords
      assert(!hasSecurePassword(""), "Empty password must fail");
      assert(!hasSecurePassword("Short1!Aa"), "9 chars (< 12) must fail");
      assert(!hasSecurePassword("pahlawansilat2026!"), "Missing uppercase must fail");
      assert(!hasSecurePassword("PAHLAWANSILAT2026!"), "Missing lowercase must fail");
      assert(!hasSecurePassword("PahlawanSilat!"), "Missing digit must fail");
      assert(!hasSecurePassword("PahlawanSilat2026"), "Missing symbol must fail");
    },
  },

  // --------------------------------------------------------------------------
  // T2-BOUND-09: Jurus Scoring Deductions Discrete Clamping & Invariants
  // --------------------------------------------------------------------------
  {
    id: "T2-BOUND-09",
    tier: 2,
    name: "Jurus Scoring Invariants: Clamping to zero, discrete 5-second step, and deduction math",
    run: () => {
      // 1. Deductions exceeding gross score clamps net score to 0.00
      const heavyPenaltyJurus = calculateJurusScore({
        category: "TUNGGAL",
        accuracyScore: 9.0,
        expressionScore: 0.0,
        deductions: {
          timeOverUnderSeconds: 120, // 24 * 0.05 = 1.20
          weaponDrops: 20,           // 20 * 0.50 = 10.00
          boundaryViolations: 10,    // 10 * 0.05 = 0.50
        },
      });
      assertEqual(heavyPenaltyJurus.netScore, 0, "Net score must not become negative; clamps to 0");
      assert(heavyPenaltyJurus.totalDeductions > 9.0, "Total deductions exceed gross score");

      // 2. Discrete 5s time deduction steps
      assertEqual(calculateJurusScore({ deductions: { timeOverUnderSeconds: 0 } }).timeDeduction, 0.0);
      assertEqual(calculateJurusScore({ deductions: { timeOverUnderSeconds: 4 } }).timeDeduction, 0.0);
      assertEqual(calculateJurusScore({ deductions: { timeOverUnderSeconds: 5 } }).timeDeduction, 0.05);
      assertEqual(calculateJurusScore({ deductions: { timeOverUnderSeconds: 9 } }).timeDeduction, 0.05);
      assertEqual(calculateJurusScore({ deductions: { timeOverUnderSeconds: 10 } }).timeDeduction, 0.1);
      assertEqual(calculateJurusScore({ deductions: { timeOverUnderSeconds: 14 } }).timeDeduction, 0.1);
      assertEqual(calculateJurusScore({ deductions: { timeOverUnderSeconds: 15 } }).timeDeduction, 0.15);
    },
  },
];
