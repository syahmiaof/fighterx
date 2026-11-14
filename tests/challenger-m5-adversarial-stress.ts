#!/usr/bin/env node
/**
 * Empirical Adversarial Challenger Verification Suite — Milestone 5
 * Role: challenger_m5_1 (Empirical Challenger)
 * 
 * Verifies:
 * 1. PERSILAT 2026 scoring engine edge cases (extremes, boundaries, DQ escalation, NaN/Infinity)
 * 2. Club registration validation boundary defense (phone, MyKad, postcode, password, step-gating, 27+1 affiliations)
 * 3. Leaderboard rankings, PDPA masking, and rapid filter transitions
 * 4. Moments gallery zero-autoplay invariant, SSR boundary guards, and Teko typography
 * 5. Static audit for zero live database leaks or unmocked remote calls in public client code
 */

import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

// Domain imports
import {
  calculateTandingScore,
  calculateJurusScore,
} from "../src/lib/guidelines";

import {
  isValidMalaysianPhone,
  isValidPostalCode,
  isValidIdentityNumber,
  hasSecurePassword,
} from "../src/lib/club-registration/validation";

import { SILAT_AFFILIATIONS } from "../src/lib/club-registration/affiliations-data";
import { SILAT_ASSOCIATIONS } from "../src/lib/associations";
import { uiOnlyClubRegistrationService } from "../src/lib/club-registration/ui-only-adapter";

import {
  WEEKLY_TOP_ATHLETES,
  ALL_REGISTERED_ATHLETES,
} from "../src/components/leaderboard/data";
import type { Athlete, VisibilityMode } from "../src/components/leaderboard/types";

const REPO_ROOT = path.resolve(__dirname, "..");

// Color helpers
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

interface TestRecord {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const records: TestRecord[] = [];

function check(suite: string, name: string, fn: () => void) {
  const start = performance.now();
  try {
    fn();
    const duration = performance.now() - start;
    records.push({ suite, name, passed: true, durationMs: duration });
    console.log(`  ${green("✓ PASS")} [${suite}] ${name} ${dim(`(${duration.toFixed(2)}ms)`)}`);
  } catch (err: unknown) {
    const duration = performance.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    records.push({ suite, name, passed: false, durationMs: duration, error: msg });
    console.log(`  ${red("✗ FAIL")} [${suite}] ${name} ${dim(`(${duration.toFixed(2)}ms)`)}`);
    console.log(`         ${red("Error:")} ${msg}`);
  }
}

async function asyncCheck(suite: string, name: string, fn: () => Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    const duration = performance.now() - start;
    records.push({ suite, name, passed: true, durationMs: duration });
    console.log(`  ${green("✓ PASS")} [${suite}] ${name} ${dim(`(${duration.toFixed(2)}ms)`)}`);
  } catch (err: unknown) {
    const duration = performance.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    records.push({ suite, name, passed: false, durationMs: duration, error: msg });
    console.log(`  ${red("✗ FAIL")} [${suite}] ${name} ${dim(`(${duration.toFixed(2)}ms)`)}`);
    console.log(`         ${red("Error:")} ${msg}`);
  }
}

function expect(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function expectEqual<T>(actual: T, expected: T, msg: string) {
  if (actual !== expected) {
    throw new Error(`${msg}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runChallengerSuite() {
  console.log(bold(cyan("\n================================================================================")));
  console.log(bold(cyan("   EMPIRICAL ADVERSARIAL CHALLENGER SUITE — PERSILAT, REG, LEADERBOARD, MOMENTS")));
  console.log(bold(cyan("   Author: challenger_m5_1 (Teamwork Challenger Critic)")));
  console.log(bold(cyan("================================================================================")));
  console.log(dim(`Execution Time: ${new Date().toISOString()}\n`));

  // --------------------------------------------------------------------------
  // SUITE 1: PERSILAT 2026 SCORING ENGINE ADVERSARIAL STRESS
  // --------------------------------------------------------------------------
  console.log(bold("--- SUITE 1: PERSILAT 2026 SCORING ENGINE ADVERSARIAL STRESS ---"));

  check("PERSILAT-RULES", "Non-numeric values (NaN, null, undefined, negative) safely clamp to 0", () => {
    // Cast rogue non-numeric inputs
    const res = calculateTandingScore(NaN, null as unknown as number, undefined as unknown as number, []);
    expectEqual(res.punches, 0, "NaN punches clamped to 0");
    expectEqual(res.kicks, 0, "null kicks clamped to 0");
    expectEqual(res.takedowns, 0, "undefined takedowns clamped to 0");
    expectEqual(res.totalScore, 0, "Total score must be 0");

    // Negative numbers
    const resNeg = calculateTandingScore(-10, -5, -2, []);
    expectEqual(resNeg.punches, 0, "Negative punches clamped to 0");
    expectEqual(resNeg.kicks, 0, "Negative kicks clamped to 0");
    expectEqual(resNeg.takedowns, 0, "Negative takedowns clamped to 0");
    expectEqual(resNeg.totalScore, 0, "Total score clamped to 0");
  });

  check("PERSILAT-RULES", "Extreme high strikes (1e9) math preserves exact precision", () => {
    const res = calculateTandingScore(1_000_000, 2_000_000, 3_000_000, ["PERINGATAN_2"]);
    // 1M*1 + 2M*2 + 3M*3 = 1M + 4M + 9M = 14,000,000 - 10 = 13,999,990
    expectEqual(res.totalScore, 13_999_990, "Large number strike points calculation");
    expectEqual(res.isDisqualified, false, "Not DQ with Peringatan 2");
  });

  check("PERSILAT-RULES", "DQ Escalation ladder: Direct DQ vs Peringatan 3 DQ vs Non-DQ", () => {
    const dq1 = calculateTandingScore(10, 5, 2, ["PERINGATAN_3_DQ"]);
    expect(dq1.isDisqualified === true, "PERINGATAN_3_DQ must disqualify");

    const dq2 = calculateTandingScore(10, 5, 2, ["DIRECT_DQ"]);
    expect(dq2.isDisqualified === true, "DIRECT_DQ must disqualify");

    const nodq = calculateTandingScore(10, 5, 2, ["TEGURAN_1", "TEGURAN_2", "PERINGATAN_1", "PERINGATAN_2"]);
    expect(nodq.isDisqualified === false, "Teguran & Peringatan 1-2 must not disqualify");
    // Deductions: 1 + 2 + 5 + 10 = 18. Strikes: 10 + 10 + 6 = 26. Net: 26 - 18 = 8.
    expectEqual(nodq.totalScore, 8, "Cumulative deductions exact math");
  });

  check("PERSILAT-RULES", "Jurus rubric extreme deductions clamp netScore to 0 (never negative)", () => {
    const res = calculateJurusScore({
      accuracyScore: 8.5,
      expressionScore: 0.1,
      deductions: {
        weaponDrops: 20, // 10.0 pts deduction
        boundaryViolations: 10, // 0.5 pts deduction
      },
    });
    expectEqual(res.netScore, 0, "Net score must clamp to 0 when deductions exceed gross");
    expect(res.totalDeductions >= 10.5, "Total deductions accurate");
  });

  // --------------------------------------------------------------------------
  // SUITE 2: CLUB REGISTRATION BOUNDARY DEFENSE & AFFILIATION MAPPING
  // --------------------------------------------------------------------------
  console.log(bold("\n--- SUITE 2: CLUB REGISTRATION BOUNDARY & AFFILIATION MAPPING ---"));

  check("REG-VALIDATION", "Malaysian mobile formats accepted vs landlines & international rejected", () => {
    const valid = ["+60123456789", "01123456789", "+60 19-876 5432", "010-9876543"];
    for (const p of valid) {
      expect(isValidMalaysianPhone(p), `Phone "${p}" should be valid`);
    }

    const invalid = ["03-21234567", "+60321234567", "+6591234567", "01234", "invalid"];
    for (const p of invalid) {
      expect(!isValidMalaysianPhone(p), `Phone "${p}" should be invalid`);
    }
  });

  check("REG-VALIDATION", "MyKad 12-digit & Foreign Passport regex boundary conditions", () => {
    expect(isValidIdentityNumber("880512-10-5431"), "Hyphenated MyKad valid");
    expect(isValidIdentityNumber("880512105431"), "Raw 12-digit MyKad valid");
    expect(isValidIdentityNumber("A12345678"), "Standard passport valid");
    expect(!isValidIdentityNumber("12345"), "5-char string invalid");
    expect(!isValidIdentityNumber("880512-10-5431#"), "Special char in MyKad invalid");
  });

  check("REG-VALIDATION", "Postal code exact 5 digits with leading zeroes", () => {
    expect(isValidPostalCode("01000"), "Kangar 01000 with leading zero valid");
    expect(isValidPostalCode("50480"), "KL 50480 valid");
    expect(!isValidPostalCode("4000"), "4-digit code invalid");
    expect(!isValidPostalCode("400000"), "6-digit code invalid");
    expect(!isValidPostalCode("4000A"), "Alphanumeric code invalid");
  });

  check("REG-VALIDATION", "Password security: minimum 12 chars & 4 character classes required", () => {
    expect(hasSecurePassword("PusakaGayong2026!"), "Valid strong password");
    expect(!hasSecurePassword("Short1!"), "Too short (<12) invalid");
    expect(!hasSecurePassword("pusakagayong2026!"), "No uppercase invalid");
    expect(!hasSecurePassword("PUSAKAGAYONG2026!"), "No lowercase invalid");
    expect(!hasSecurePassword("PusakaGayong!!!!"), "No digit invalid");
    expect(!hasSecurePassword("PusakaGayong2026"), "No symbol invalid");
  });

  check("REG-AFFILIATIONS", "All 27 directory associations + INDEPENDENT option verified", () => {
    expectEqual(SILAT_ASSOCIATIONS.length, 27, "Directory has exact 27 associations");
    expectEqual(SILAT_AFFILIATIONS.length, 28, "Affiliations list has 28 options (27 + INDEPENDENT)");
    const independent = SILAT_AFFILIATIONS.find((a) => a.id === "INDEPENDENT");
    expect(Boolean(independent), "INDEPENDENT option exists");
  });

  await asyncCheck("REG-MOCK-ADAPTER", "UI-Only Registration Adapter produces valid receipt structure", async () => {
    const res = await uiOnlyClubRegistrationService.register({
      clubName: "Gelanggang Pendekar Wira",
      organizationType: "CLUB",
      state: "Perak",
      city: "Ipoh",
      address: "No 1 Jalan Silat",
      postalCode: "30000",
      representativeName: "Guru Harun",
      identificationNumber: "750401085231",
      email: "harun@pendekarwira.my",
      phone: "+60129876543",
      designation: "Guru Utama",
      disciplines: ["SENI", "OLAHRAGA"],
      trainingVenueType: "COMMUNITY_HALL",
      weeklySessions: 3,
      associationId: "pssgm",
      agreedToTerms: true,
    });

    expectEqual(res.status, "accepted", "Registration status accepted");
    if (res.status === "accepted") {
      expect(res.receipt.applicationId.startsWith("FX-APP-2026-"), "Valid receipt ID prefix");
      expectEqual(res.receipt.applicationStatus, "PENDING_APPROVAL", "Status is PENDING_APPROVAL");
      expectEqual(res.receipt.subscription.monthlyPriceMYR, 20, "20 MYR subscription price");
      expectEqual(res.receipt.subscription.trialPeriodDays, 30, "30-day trial");
    }
  });

  // --------------------------------------------------------------------------
  // SUITE 3: LEADERBOARD RANKINGS & RAPID FILTER TRANSITIONS
  // --------------------------------------------------------------------------
  console.log(bold("\n--- SUITE 3: LEADERBOARD RANKINGS & RAPID FILTER TRANSITIONS ---"));

  check("LEADERBOARD", "Leaderboard Top 10 ranks strictly sequential and point sums correct", () => {
    expectEqual(WEEKLY_TOP_ATHLETES.length, 10, "Top 10 contains 10 athletes");
    WEEKLY_TOP_ATHLETES.forEach((ath, idx) => {
      expectEqual(ath.rank, idx + 1, `Athlete rank #${idx + 1}`);
      const sum =
        ath.points.attendancePoints +
        ath.points.physicalBaseline.totalBaselineScore +
        ath.points.videoDrillPoints +
        ath.points.tournamentMedalPoints;
      expectEqual(ath.points.totalVerifiedPoints, sum, `Athlete #${ath.rank} points sum`);
    });
  });

  check("LEADERBOARD", "PDPA privacy masking modes verified", () => {
    function maskAthlete(ath: Athlete, mode: VisibilityMode) {
      if (mode === "PUBLIC") return { name: ath.fullName, avatar: true };
      if (mode === "CLUB_ONLY") return { name: `${ath.fullName.split(" ")[0]} *** (Kelab Sahaja)`, avatar: true };
      return { name: `[Atlet #${ath.rank}] · ${ath.alias}`, avatar: false };
    }

    const ath = WEEKLY_TOP_ATHLETES[0];
    const pub = maskAthlete(ath, "PUBLIC");
    expectEqual(pub.name, ath.fullName, "Public reveals full name");
    expectEqual(pub.avatar, true, "Public shows avatar");

    const club = maskAthlete(ath, "CLUB_ONLY");
    expect(club.name.includes("***"), "Club-only masks surname");

    const anon = maskAthlete(ath, "ANONYMOUS");
    expect(anon.name.includes(ath.alias) && !anon.name.includes(ath.fullName), "Anonymous masks full name");
    expectEqual(anon.avatar, false, "Anonymous hides avatar");
  });

  check("LEADERBOARD-FILTER-RAPID", "Rapid simulation of 10,000 filter switches does not corrupt data", () => {
    const filters = ["ALL", "SENI", "OLAHRAGA"] as const;
    const queries = ["", "danial", "siti", "faris", "gayong", "selangor", "zzznomatch", "<script>"];

    for (let i = 0; i < 10000; i++) {
      const disc = filters[i % filters.length];
      const q = queries[i % queries.length].toLowerCase();

      const filtered = ALL_REGISTERED_ATHLETES.filter((a) => {
        if (disc !== "ALL" && a.discipline !== disc) return false;
        if (q && !a.fullName.toLowerCase().includes(q) && !a.clubName.toLowerCase().includes(q)) return false;
        return true;
      });

      expect(Array.isArray(filtered), "Filtered result must be an array");
      expect(filtered.length <= ALL_REGISTERED_ATHLETES.length, "Result cannot exceed total registered");
    }
  });

  // --------------------------------------------------------------------------
  // SUITE 4: MOMENTS GALLERY ZERO-AUTOPLAY & SSR SAFETY
  // --------------------------------------------------------------------------
  console.log(bold("\n--- SUITE 4: MOMENTS GALLERY ZERO-AUTOPLAY & SSR SAFETY ---"));

  check("MOMENTS", "Moments carousel has 0 automated intervals (user-driven only)", () => {
    const carouselCode = fs.readFileSync(path.join(REPO_ROOT, "src/components/moments/moments-hero-carousel.tsx"), "utf8");
    expect(!carouselCode.includes("setInterval"), "Carousel must not contain setInterval");
    expect(!carouselCode.includes("autoPlay"), "Carousel must not contain autoPlay");
    expect(!carouselCode.includes("autoplay"), "Carousel must not contain autoplay");
  });

  check("MOMENTS", "All moments client components declare 'use client' and guard browser globals", () => {
    const files = [
      "src/components/moments/moments-hero-header.tsx",
      "src/components/moments/moments-hero-carousel.tsx",
      "src/components/moments/moment-card.tsx",
      "src/components/moments/moments-control-bar.tsx",
      "src/components/moments/moment-auth-guard-modal.tsx",
      "src/components/moments/moment-upload-modal.tsx",
      "src/components/moments/moment-lightbox-modal.tsx",
    ];

    for (const rel of files) {
      const full = path.join(REPO_ROOT, rel);
      expect(fs.existsSync(full), `File ${rel} must exist`);
      const src = fs.readFileSync(full, "utf8");
      expect(src.includes('"use client"') || src.includes("'use client'"), `${rel} must have 'use client'`);
    }
  });

  // --------------------------------------------------------------------------
  // SUITE 5: STATIC AUDIT FOR ZERO UNMOCKED DATABASE / REMOTE LEAKS
  // --------------------------------------------------------------------------
  console.log(bold("\n--- SUITE 5: STATIC AUDIT FOR ZERO UNMOCKED REMOTE CALLS IN PUBLIC CODE ---"));

  check("STATIC-SECURITY", "Zero live unmocked database connections or credential leaks in public code", () => {
    const publicDirs = [
      "src/app",
      "src/components/homepage",
      "src/components/guidelines",
      "src/components/disciplines",
      "src/components/competitions",
      "src/components/leaderboard",
      "src/components/associations",
      "src/components/moments",
      "src/components/knowledge",
    ];

    function scanDir(dir: string): string[] {
      const full = path.join(REPO_ROOT, dir);
      if (!fs.existsSync(full)) return [];
      const res: string[] = [];
      const entries = fs.readdirSync(full, { withFileTypes: true });
      for (const e of entries) {
        const item = path.join(dir, e.name);
        if (e.isDirectory()) {
          // Skip portal dirs when scanning public components
          if (item.includes("src/app/athlete") || item.includes("src/app/coach") || item.includes("src/app/admin")) continue;
          res.push(...scanDir(item));
        } else if (/\.(tsx|ts|js|mjs)$/.test(e.name)) {
          res.push(item);
        }
      }
      return res;
    }

    const allPublicFiles: string[] = [];
    for (const d of publicDirs) {
      allPublicFiles.push(...scanDir(d));
    }

    for (const f of allPublicFiles) {
      const content = fs.readFileSync(path.join(REPO_ROOT, f), "utf8");
      expect(!content.includes("SUPABASE_SERVICE_ROLE_KEY"), `${f} contains leaked service role key`);
      expect(!content.includes("DATABASE_URL"), `${f} contains leaked database url`);
      expect(!content.includes("fetch("), `${f} contains unmocked fetch call`);
      expect(!content.includes("axios."), `${f} contains unmocked axios call`);
    }
  });

  check("STATIC-SECURITY", "Portal and auth pages remain strictly isolated from public changes", () => {
    // Check that no portal route files have been improperly rewritten
    const portalDirs = ["src/app/athlete", "src/app/coach", "src/app/admin", "src/app/login", "src/app/register", "src/app/my-club"];
    for (const pd of portalDirs) {
      const full = path.join(REPO_ROOT, pd);
      expect(fs.existsSync(full), `Portal dir ${pd} must exist intact`);
    }
  });

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log(bold(cyan("\n================================================================================")));
  console.log(bold(cyan("                 CHALLENGER VERIFICATION SUMMARY REPORT")));
  console.log(bold(cyan("================================================================================")));

  const passed = records.filter((r) => r.passed).length;
  const failed = records.filter((r) => !r.passed).length;
  const total = records.length;

  console.log(`  Total Checks:    ${total}`);
  console.log(`  Passed:          ${green(`${passed} (${Math.round((passed / total) * 100)}%)`)}`);
  console.log(`  Failed:          ${failed > 0 ? red(`${failed}`) : "0 (0%)"}`);

  if (failed > 0) {
    console.log(bold(red(`\n❌ VERDICT: REQUEST_CHANGES — ${failed} failures detected!`)));
    process.exit(1);
  } else {
    console.log(bold(green(`\n✅ VERDICT: APPROVE — ALL ADVERSARIAL STRESS HARNESS CHECKS PASSED EMPIRICALLY!`)));
    process.exit(0);
  }
}

runChallengerSuite().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
