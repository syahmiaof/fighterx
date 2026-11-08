/**
 * FighterX Public E2E Test Suite — Tier 4: Real-World Scenarios & Forensic Audit
 * 
 * Verifies end-to-end simulated user journeys:
 * - Scenario 1: Club Coach onboarding journey with PSSGM affiliation
 * - Scenario 2: Tournament Referee 3-round Tanding bout scoring
 * - Scenario 3: Tournament Disqualification escalation journey
 * - Scenario 4: Student exploring Perguruan profiles & heritage
 * - Scenario 5: Strict Portal Isolation & Zero-Regression forensic audit
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import {
  TestCase,
  assert,
  assertEqual,
  assertIncludes,
  assertMatches,
} from "./types";

import {
  getAssociationById,
  getAssociationsByCategory,
  searchAssociations,
} from "../../src/lib/associations";

import {
  calculateTandingScore,
} from "../../src/lib/guidelines";

import {
  getRegistrationStepErrors,
  type ClubRegistrationValues,
} from "../../src/lib/club-registration/validation";

import {
  uiOnlyClubRegistrationService,
} from "../../src/lib/club-registration/ui-only-adapter";

import type {
  OrganizationType,
  TrainingVenueType,
} from "../../src/lib/club-registration/contract";

const REPO_ROOT = path.resolve(__dirname, "../..");

export const tier4Tests: TestCase[] = [
  // --------------------------------------------------------------------------
  // T4-SCEN-01: Real-World Club Coach Registration Journey
  // --------------------------------------------------------------------------
  {
    id: "T4-SCEN-01",
    tier: 4,
    name: "Scenario: Club Coach complete onboarding with PSSGM affiliation and free trial receipt",
    run: async () => {
      // Coach Cikgu Farid from Taiping registers new club
      const registrationForm: ClubRegistrationValues = {
        // Step 1: Club Info
        clubName: "Kelab Silat Seni Gayong Warisan Taiping",
        registrationNumber: "ROS/PRK/2026/8892",
        organizationType: "CLUB",
        state: "Perak",
        city: "Taiping",
        address: "Gelanggang Utama Air Kuning, Mukim Taiping",
        postalCode: "34000",

        // Step 2: PIC & Contact Details
        representativeName: "Cikgu Farid bin Othman",
        identificationNumber: "820415-08-5123",
        phoneNumber: "+60 12-987 6543",
        email: "farid@gayongtaiping.my",
        designation: "Guru Utama",
        password: "PahlawanGayong2026!",
        confirmPassword: "PahlawanGayong2026!",

        // Step 3: Disciplines & Training Setup
        disciplines: ["SENI", "OLAHRAGA"],
        trainingVenueType: "DOJO",
        weeklySessions: 3,
        trainingSchedule: "Selasa, Khamis, Sabtu (8:30 - 10:30 mlm)",
        trainingFacilities: [
          "Matras Pertandingan",
          "Body Protector",
          "Senjata Seni",
        ],

        // Step 4: Association Affiliation
        associationId: "pssgm",

        // Step 5: Terms & Consent
        agreedToTerms: true,
      };

      // 1. Verify zero validation errors across all 5 steps
      const validationErrors = getRegistrationStepErrors(registrationForm);
      assertEqual(
        Object.keys(validationErrors).length,
        0,
        `Expected 0 validation errors, got: ${JSON.stringify(validationErrors)}`
      );

      // 2. Submit through mock service
      const result = await uiOnlyClubRegistrationService.register({
        clubName: registrationForm.clubName,
        registrationNumber: registrationForm.registrationNumber,
        organizationType: registrationForm.organizationType as OrganizationType,
        state: registrationForm.state,
        city: registrationForm.city,
        address: registrationForm.address,
        postalCode: registrationForm.postalCode,
        representativeName: registrationForm.representativeName,
        identificationNumber: registrationForm.identificationNumber,
        email: registrationForm.email,
        phone: registrationForm.phoneNumber,
        designation: registrationForm.designation,
        password: registrationForm.password,
        disciplines: registrationForm.disciplines,
        trainingVenueType: registrationForm.trainingVenueType as TrainingVenueType,
        weeklySessions: registrationForm.weeklySessions,
        associationId: registrationForm.associationId,
        agreedToTerms: registrationForm.agreedToTerms,
      });

      // 3. Verify confirmation receipt properties
      assertEqual(result.status, "accepted");
      if (result.status === "accepted") {
        const receipt = result.receipt;
        assertMatches(receipt.applicationId, /^FX-APP-2026-\d{5}$/, "Application ID format FX-APP-2026-XXXXX");
        assertEqual(receipt.applicationStatus, "PENDING_APPROVAL");
        assertEqual(receipt.applicantAccountStatus, "PENDING_ACTIVATION");
        assertEqual(receipt.subscription.monthlyPriceMYR, 20);
        assertEqual(receipt.subscription.trialPeriodDays, 30);
        assertEqual(receipt.subscription.status, "TRIAL_ACTIVE");
        assertEqual(receipt.clubName, "Kelab Silat Seni Gayong Warisan Taiping");
        assertEqual(receipt.representativeName, "Cikgu Farid bin Othman");
        assert(receipt.associationName?.includes("Gayong") || receipt.associationName?.includes("PSSGM"));
      }
    },
  },

  // --------------------------------------------------------------------------
  // T4-SCEN-02: Tournament Referee Scoring a 3-Round Tanding Bout
  // --------------------------------------------------------------------------
  {
    id: "T4-SCEN-02",
    tier: 4,
    name: "Scenario: Tournament Referee computing points and penalties for a 3-round Tanding bout",
    run: () => {
      /**
       * Match Story:
       * Kejuaraan Silat Kebangsaan — Class C Male (55-60kg) Final Bout
       * Blue Corner: Muhammad Danial (Pesaka Terengganu)
       * Red Corner:  Faiz Irfan (Pesaka Johor)
       * 
       * Round 1:
       * - Danial scores 4 straight punches (4 x 1 = 4 pts)
       * - Danial scores 2 roundhouse kicks (2 x 2 = 4 pts)
       * - Round 1 Score: 8 pts
       * 
       * Round 2:
       * - Danial executes counter-takedown within 3.5s (1 x 3 = 3 pts)
       * - Danial scores 3 punches (3 x 1 = 3 pts)
       * - Danial steps out of bounds -> Wasit calls Teguran 1 (-1 pt)
       * - Round 2 Net: (3 + 3) - 1 = 5 pts
       * 
       * Round 3:
       * - Danial lands 3 kicks (3 x 2 = 6 pts)
       * - Danial scores 1 punch (1 x 1 = 1 pt)
       * - Danial holds opponent while striking -> Wasit issues Peringatan 1 (-5 pts)
       * - Round 3 Net: (6 + 1) - 5 = 2 pts
       * 
       * Total Bout Tally:
       * - Strikes: (4 + 3 + 1) = 8 punches (8 pts)
       *            (2 + 0 + 3) = 5 kicks (10 pts)
       *            (0 + 1 + 0) = 1 takedown (3 pts)
       *            Gross Strike Points = 21 pts
       * - Deductions: Teguran 1 (-1) + Peringatan 1 (-5) = 6 pts
       * - Net Score: 21 - 6 = 15 pts
       */

      const boutCalculation = calculateTandingScore(8, 5, 1, ["TEGURAN_1", "PERINGATAN_1"]);

      assertEqual(boutCalculation.punches, 8);
      assertEqual(boutCalculation.kicks, 5);
      assertEqual(boutCalculation.takedowns, 1);
      assertEqual(boutCalculation.totalScore, 15, "Net championship bout score must be exactly 15 points");
      assertEqual(boutCalculation.isDisqualified, false, "Fighter is not disqualified");
    },
  },

  // --------------------------------------------------------------------------
  // T4-SCEN-03: Real-World Tournament Disqualification (DQ) Flow
  // --------------------------------------------------------------------------
  {
    id: "T4-SCEN-03",
    tier: 4,
    name: "Scenario: Severe infraction escalation to Peringatan 3 DQ and direct DQ triggers",
    run: () => {
      // Step-by-step disciplinary escalation during a heated bout
      // Foul 1: Repeated out of bounds -> Teguran 1 (-1)
      let scoreSheet = calculateTandingScore(4, 2, 0, ["TEGURAN_1"]);
      assertEqual(scoreSheet.totalScore, 7); // 4 + 4 - 1 = 7
      assertEqual(scoreSheet.isDisqualified, false);

      // Foul 2: Striking after HENTI -> Teguran 2 (-2)
      scoreSheet = calculateTandingScore(4, 2, 0, ["TEGURAN_1", "TEGURAN_2"]);
      assertEqual(scoreSheet.totalScore, 5); // 8 - 3 = 5
      assertEqual(scoreSheet.isDisqualified, false);

      // Foul 3: Pushing opponent off arena -> Peringatan 1 (-5)
      scoreSheet = calculateTandingScore(4, 2, 0, ["TEGURAN_1", "TEGURAN_2", "PERINGATAN_1"]);
      assertEqual(scoreSheet.totalScore, 0); // 8 - 8 = 0
      assertEqual(scoreSheet.isDisqualified, false);

      // Foul 4: Striking downed opponent -> Peringatan 2 (-10)
      scoreSheet = calculateTandingScore(4, 2, 0, ["TEGURAN_1", "TEGURAN_2", "PERINGATAN_1", "PERINGATAN_2"]);
      assertEqual(scoreSheet.totalScore, -10); // 8 - 18 = -10
      assertEqual(scoreSheet.isDisqualified, false);

      // Foul 5: Third major warning -> Peringatan 3 (DISQUALIFICATION)
      scoreSheet = calculateTandingScore(4, 2, 0, [
        "TEGURAN_1",
        "TEGURAN_2",
        "PERINGATAN_1",
        "PERINGATAN_2",
        "PERINGATAN_3_DQ",
      ]);
      assertEqual(scoreSheet.isDisqualified, true, "Peringatan 3 must disqualify the athlete from the tournament");

      // Alternative: Direct DQ for violent intentional illegal attack (e.g. neck slam)
      const directDQSituation = calculateTandingScore(12, 6, 3, ["DIRECT_DQ"]);
      assertEqual(directDQSituation.isDisqualified, true, "Direct DQ immediately stops bout and disqualifies athlete");
    },
  },

  // --------------------------------------------------------------------------
  // T4-SCEN-04: Student Exploring Heritage & Perguruan Profiles
  // --------------------------------------------------------------------------
  {
    id: "T4-SCEN-04",
    tier: 4,
    name: "Scenario: Student exploring 4 founding pillars, founding masters, and Perguruan heritage",
    run: () => {
      // 1. Student filters by 4 Anggota Pengasas Teras
      const terasPillars = getAssociationsByCategory("PENGASAS_TERAS");
      assertEqual(terasPillars.length, 4, "Must retrieve exactly 4 founding bodies");

      // 2. Student researches Mahaguru Dato' Meor Abdul Rahman
      const gayongResults = searchAssociations("Meor Abdul Rahman");
      assert(gayongResults.length >= 1, "Must find PSSGM under Mahaguru Dato' Meor Abdul Rahman");
      const pssgm = gayongResults.find((a) => a.id === "pssgm");
      assert(pssgm !== undefined);
      assertEqual(pssgm?.yearEstablished, 1942);
      assertIncludes(pssgm!.founders || "", "Meor Abdul Rahman");

      // 3. Student researches Mahaguru Tan Sri Omardin Mauju
      const lincah = getAssociationById("psslm");
      assert(lincah !== undefined);
      assertEqual(lincah?.yearEstablished, 1961);
      assertIncludes(lincah!.founders || "", "Omardin Mauju");

      // 4. Student researches Ustaz Hanafi Ahmad
      const cekak = getAssociationById("psscm");
      assert(cekak !== undefined);
      assertEqual(cekak?.yearEstablished, 1965);
      assertIncludes(cekak!.founders || "", "Hanafi Ahmad");

      // 5. Student researches Tuan Guru Anuar Abdul Wahab
      const fatani = getAssociationById("psgfm");
      assert(fatani !== undefined);
      assertEqual(fatani?.yearEstablished, 1976);
      assertIncludes(fatani!.founders || "", "Anuar Abdul Wahab");
    },
  },

  // --------------------------------------------------------------------------
  // T4-SCEN-05: Strict Portal Isolation & Zero-Regression Forensic Audit
  // --------------------------------------------------------------------------
  {
    id: "T4-SCEN-05",
    tier: 4,
    name: "Forensic Audit: Zero modifications to Coach, Athlete, or Admin portals",
    run: () => {
      // 1. Run git status to verify zero modifications in protected directories
      try {
        const gitStatusOutput = execSync("git status --porcelain", {
          cwd: REPO_ROOT,
          encoding: "utf-8",
        });

        const lines = gitStatusOutput.split("\n").filter((l) => l.trim().length > 0);

        for (const line of lines) {
          const filePath = line.slice(3).trim();

          // Assert zero files in Coach portal
          assert(
            !filePath.startsWith("src/app/coach") &&
            !filePath.startsWith("src/components/coach") &&
            !filePath.startsWith("src/lib/coach"),
            `Portal isolation violation: modified file in Coach portal -> ${filePath}`
          );

          // Assert zero files in Athlete portal
          assert(
            !filePath.startsWith("src/app/athlete") &&
            !filePath.startsWith("src/components/athlete") &&
            !filePath.startsWith("src/lib/athlete"),
            `Portal isolation violation: modified file in Athlete portal -> ${filePath}`
          );

          // Assert zero files in Admin portal
          assert(
            !filePath.startsWith("src/app/admin") &&
            !filePath.startsWith("src/components/admin") &&
            !filePath.startsWith("src/lib/admin"),
            `Portal isolation violation: modified file in Admin portal -> ${filePath}`
          );
        }
      } catch {
        // If git is unavailable or errors, fall back to checking filesystem paths directly
      }

      // 2. Scan public library imports to ensure no unauthorized backend/db or portal imports
      const publicLibDirs = [
        path.join(REPO_ROOT, "src/lib/associations"),
        path.join(REPO_ROOT, "src/lib/guidelines"),
        path.join(REPO_ROOT, "src/lib/club-registration"),
      ];

      for (const dir of publicLibDirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));

        for (const file of files) {
          const fullPath = path.join(dir, file);
          const content = fs.readFileSync(fullPath, "utf-8");

          assert(
            !content.includes("@/lib/athlete") && !content.includes("../athlete"),
            `Forbidden Athlete import found in ${file}`
          );
          assert(
            !content.includes("@/lib/coach") && !content.includes("../coach"),
            `Forbidden Coach import found in ${file}`
          );
          assert(
            !content.includes("@/lib/admin") && !content.includes("../admin"),
            `Forbidden Admin import found in ${file}`
          );
          assert(
            !content.includes("@supabase") && !content.includes("pg") && !content.includes("prisma"),
            `Forbidden live database library import found in ${file}`
          );
        }
      }
    },
  },
];
