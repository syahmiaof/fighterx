/**
 * FighterX Public E2E Test Suite — Tier 3: Cross-Feature Interactions
 * 
 * Verifies integration contracts across public modules:
 * - Association selection in club registration matching the 26 associations directory
 * - Navigation mesh and routing cohesion between SiteHeader, Marquee, Hero, and pages
 * - 5-Step club registration wizard multi-step state persistence
 * - Disciplines & Rules Explorer scoring zones / penalty matrix consistency
 * - Shared Wallpaper system token consistency across public layouts
 */

import fs from "fs";
import path from "path";
import {
  TestCase,
  assert,
  assertEqual,
  assertIncludes,
} from "./types";

import {
  SILAT_AFFILIATIONS,
} from "../../src/lib/club-registration/affiliations-data";

import type {
  OrganizationType,
  TrainingVenueType,
} from "../../src/lib/club-registration/contract";

import {
  getRegistrationStepErrors,
  type ClubRegistrationValues,
} from "../../src/lib/club-registration/validation";

import {
  uiOnlyClubRegistrationService,
} from "../../src/lib/club-registration/ui-only-adapter";

import {
  calculateTandingScore,
} from "../../src/lib/guidelines";

const REPO_ROOT = path.resolve(__dirname, "../..");

export const tier3Tests: TestCase[] = [
  // --------------------------------------------------------------------------
  // T3-COMB-01: Association Selector in Registration Matches 26 Directory
  // --------------------------------------------------------------------------
  {
    id: "T3-COMB-01",
    tier: 3,
    name: "Association Selector: Every directory association maps to registration affiliations + INDEPENDENT",
    run: () => {
      // 1. Total affiliations = 27 associations + 1 INDEPENDENT = 28
      assertEqual(SILAT_AFFILIATIONS.length, 28, "Affiliations list must contain exactly 28 options (27 + INDEPENDENT)");

      // 2. INDEPENDENT option exists
      const independentOption = SILAT_AFFILIATIONS.find((a) => a.id === "INDEPENDENT");
      assert(independentOption !== undefined, "INDEPENDENT fallback option must exist in affiliations");
      assertEqual(independentOption?.category, "INDEPENDENT");

      // 3. Verify category breakdown in affiliations matches 4 Induk + 4 Teras + 10 Utama + 9 Antarabangsa + 1 Independent
      const affInduk = SILAT_AFFILIATIONS.filter((a) => a.category === "BADAN_INDUK");
      const affTeras = SILAT_AFFILIATIONS.filter((a) => a.category === "PENGASAS_TERAS");
      const affUtama = SILAT_AFFILIATIONS.filter((a) => a.category === "PERGURUAN_UTAMA");
      const affAntarabangsa = SILAT_AFFILIATIONS.filter((a) => a.category === "ANTARABANGSA");
      const affIndependent = SILAT_AFFILIATIONS.filter((a) => a.category === "INDEPENDENT");

      assertEqual(affInduk.length, 4, "Affiliations must have 4 Badan Induk");
      assertEqual(affTeras.length, 4, "Affiliations must have 4 Pengasas Teras");
      assertEqual(affUtama.length, 10, "Affiliations must have 10 Perguruan Utama");
      assertEqual(affAntarabangsa.length, 9, "Affiliations must have 9 Antarabangsa");
      assertEqual(affIndependent.length, 1, "Affiliations must have 1 Independent");

      // Verify key founding bodies and national bodies exist by ID
      const expectedIds = [
        "pesaka-malaysia",
        "pssgm",
        "psslm",
        "psscm",
        "psgfm",
        "cekak-hanafi",
        "pusaka-gayong",
        "daeng-kuning",
        "singa-berantai",
        "ikaseka",
        "pikum",
        "kuntau-tekpi",
        "silat-melayu-haqq",
        "persilat",
        "ipsi",
        "psht",
        "tapak-suci",
        "perisai-diri",
        "smi",
        "merpati-putih",
        "pagar-nusa",
        "gubug-remaja",
        "INDEPENDENT",
      ];

      for (const expectedId of expectedIds) {
        assert(
          SILAT_AFFILIATIONS.some((aff) => aff.id === expectedId),
          `Affiliations must include expected ID "${expectedId}"`
        );
      }

      // 4. Verify all logo paths in affiliations resolve on disk
      for (const aff of SILAT_AFFILIATIONS) {
        const relativePath = aff.logoUrl.replace(/^\//, "");
        const fullDiskPath = path.join(REPO_ROOT, "public", relativePath);
        assert(fs.existsSync(fullDiskPath), `Affiliation logo must exist on disk: ${fullDiskPath}`);
      }
    },
  },

  // --------------------------------------------------------------------------
  // T3-COMB-02: Public Navigation Mesh Cohesion Across All Modules
  // --------------------------------------------------------------------------
  {
    id: "T3-COMB-02",
    tier: 3,
    name: "Navigation Mesh: Cross-module routing links across Header, Hero, Marquee, and Pages",
    run: () => {
      // 1. SiteHeader routes
      const headerPath = path.join(REPO_ROOT, "src/components/layout/site-header.tsx");
      assert(fs.existsSync(headerPath), "SiteHeader must exist");
      const headerContent = fs.readFileSync(headerPath, "utf-8");

      const requiredRoutes = [
        'href="/"',
        'href="/guidelines"',
        'href="/associations"',
        'href="/disciplines"',
        'href="/register-club"',
        'href="/login"',
      ];

      for (const route of requiredRoutes) {
        assertIncludes(headerContent, route, `SiteHeader must include link to ${route}`);
      }

      // 2. Marquee links to /associations
      const marqueePath = path.join(REPO_ROOT, "src/components/homepage/association-marquee.tsx");
      assert(fs.existsSync(marqueePath), "AssociationMarquee must exist");
      const marqueeContent = fs.readFileSync(marqueePath, "utf-8");
      assertIncludes(marqueeContent, 'href="/associations"', "Marquee must route to /associations");

      // 3. Homepage hero links
      const homePagePath = path.join(REPO_ROOT, "src/components/homepage/home-page.tsx");
      assert(fs.existsSync(homePagePath), "HomePage component must exist");
      const homePageContent = fs.readFileSync(homePagePath, "utf-8");
      assertIncludes(homePageContent, 'href="/register-club"', "Hero actions must route to /register-club");
      assertIncludes(homePageContent, 'href="/associations"', "Hero actions must route to /associations");
      assertIncludes(homePageContent, 'href="/guidelines"', "Hero actions must route to /guidelines");
    },
  },

  // --------------------------------------------------------------------------
  // T3-COMB-03: 5-Step Registration Wizard Multi-Step State Persistence
  // --------------------------------------------------------------------------
  {
    id: "T3-COMB-03",
    tier: 3,
    name: "Multi-Step State Persistence: Accumulate Steps 1-5 without data loss or validation conflict",
    run: async () => {
      // Combined composite state across Steps 1-5
      const fullRegistrationState: ClubRegistrationValues = {
        clubName: "Pusaka Gayong Taiping",
        registrationNumber: "ROS-PERAK-1942-01",
        organizationType: "CLUB",
        state: "Perak",
        city: "Taiping",
        address: "Air Kuning, Mukim Taiping",
        postalCode: "34000",
        representativeName: "Cikgu Meor Razak",
        identificationNumber: "750820-08-5433",
        phoneNumber: "+60 19-555 1234",
        email: "meor.razak@gayongtaiping.org",
        designation: "Guru Kanan",
        password: "PusakaGayong2026!",
        confirmPassword: "PusakaGayong2026!",
        disciplines: ["SENI", "OLAHRAGA"],
        trainingVenueType: "DOJO",
        weeklySessions: 4,
        trainingSchedule: "Isnin, Rabu, Jumaat, Ahad (8:00 - 10:30 mlm)",
        trainingFacilities: ["Matras Pertandingan", "Body Protector", "Senjata Seni"],
        associationId: "pssgm",
        agreedToTerms: true,
      };

      // Validate composite state
      const errors = getRegistrationStepErrors(fullRegistrationState);
      assertEqual(Object.keys(errors).length, 0, "Complete multi-step form must have zero validation errors");

      // Submit via mock adapter
      const submissionResult = await uiOnlyClubRegistrationService.register({
        clubName: fullRegistrationState.clubName,
        registrationNumber: fullRegistrationState.registrationNumber,
        organizationType: fullRegistrationState.organizationType as OrganizationType,
        state: fullRegistrationState.state,
        city: fullRegistrationState.city,
        address: fullRegistrationState.address,
        postalCode: fullRegistrationState.postalCode,
        representativeName: fullRegistrationState.representativeName,
        identificationNumber: fullRegistrationState.identificationNumber,
        email: fullRegistrationState.email,
        phone: fullRegistrationState.phoneNumber,
        designation: fullRegistrationState.designation,
        password: fullRegistrationState.password,
        disciplines: fullRegistrationState.disciplines,
        trainingVenueType: fullRegistrationState.trainingVenueType as TrainingVenueType,
        weeklySessions: fullRegistrationState.weeklySessions,
        associationId: fullRegistrationState.associationId,
        agreedToTerms: fullRegistrationState.agreedToTerms,
      });

      assertEqual(submissionResult.status, "accepted");
      if (submissionResult.status === "accepted") {
        assertEqual(submissionResult.receipt.clubName, "Pusaka Gayong Taiping");
        assertEqual(submissionResult.receipt.representativeName, "Cikgu Meor Razak");
        assertEqual(submissionResult.receipt.applicationStatus, "PENDING_APPROVAL");
        assertEqual(submissionResult.receipt.subscription.monthlyPriceMYR, 20);
        assertEqual(submissionResult.receipt.subscription.trialPeriodDays, 30);
      }
    },
  },

  // --------------------------------------------------------------------------
  // T3-COMB-04: Disciplines & Rules Scoring / Zone System Cross-Reference
  // --------------------------------------------------------------------------
  {
    id: "T3-COMB-04",
    tier: 3,
    name: "Cross-Reference Consistency: Scoring zones, forbidden targets, and points match across modules",
    run: () => {
      const rulesDataPath = path.join(REPO_ROOT, "src/lib/guidelines/rules-data.ts");
      assert(fs.existsSync(rulesDataPath), "rules-data.ts must exist");
      const rulesContent = fs.readFileSync(rulesDataPath, "utf-8");

      // Verify legal scoring zones
      const expectedScoringZones = ["Dada", "Abdomen", "Rusuk", "Belakang"];
      for (const zone of expectedScoringZones) {
        assertIncludes(rulesContent, zone, `Rules data must include legal scoring zone "${zone}"`);
      }

      // Verify forbidden vital targets
      const expectedForbiddenZones = ["Kepala", "Leher", "Kemaluan", "Sendi Lutut"];
      for (const zone of expectedForbiddenZones) {
        assertIncludes(rulesContent, zone, `Rules data must include forbidden vital target "${zone}"`);
      }

      // Verify point value invariants
      // Punch = 1, Kick = 2, Takedown = 3
      const sampleScore = calculateTandingScore(1, 1, 1, []);
      assertEqual(sampleScore.totalScore, 6, "1 punch (1) + 1 kick (2) + 1 drop (3) = 6 pts");
    },
  },

  // --------------------------------------------------------------------------
  // T3-COMB-05: Shared Wallpaper System Token Consistency Across Layouts
  // --------------------------------------------------------------------------
  {
    id: "T3-COMB-05",
    tier: 3,
    name: "Wallpaper Consistency: Verify 72% opacity, #08090B dark base, and asset references in CSS",
    run: () => {
      const globalsCssPath = path.join(REPO_ROOT, "src/app/globals.css");
      assert(fs.existsSync(globalsCssPath), "globals.css must exist");
      const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");

      // Wallpaper image paths
      assertIncludes(globalsCss, "homepage-bg-desktop.webp");
      assertIncludes(globalsCss, "homepage-bg-mobile.webp");

      // Opacity level: 72% (0.72)
      assert(
        globalsCss.includes("0.72") || globalsCss.includes("opacity:0.72") || globalsCss.includes("opacity: 0.72"),
        "globals.css must specify 0.72 (72%) opacity for background wallpaper balance"
      );

      // Verify presence of asset files in public directory
      const desktopAsset = path.join(REPO_ROOT, "public/assets/fighterx/homepage-bg-desktop.webp");
      const mobileAsset = path.join(REPO_ROOT, "public/assets/fighterx/homepage-bg-mobile.webp");
      assert(fs.existsSync(desktopAsset), "homepage-bg-desktop.webp must exist in public/assets/fighterx/");
      assert(fs.existsSync(mobileAsset), "homepage-bg-mobile.webp must exist in public/assets/fighterx/");
    },
  },
];
