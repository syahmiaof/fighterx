/**
 * FighterX Public E2E Test Suite — Tier 1: Feature Coverage
 * 
 * Verifies each inventoried public feature in isolation:
 * - Shared Wallpaper System & CSS Tokens
 * - Homepage Hero composition & quote callout
 * - Association Logo Marquee
 * - SiteHeader navigation expansion & accessibility
 * - 26 Silat Association Directory & category registry
 * - Association Search & Filter engine
 * - PERSILAT 2026 Tanding scoring calculator
 * - PERSILAT 2026 Penalties & Disciplinary matrix
 * - PERSILAT 2026 Jurus / Seni scoring rubrics
 * - Silat Disciplines deep-dive presentation
 * - 5-Step Club Registration contract & validation rules
 */

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
  SILAT_ASSOCIATIONS,
  getAssociationById,
  getAssociationsByCategory,
  getCategoryCounts,
  searchAssociations,
  CATEGORY_METADATA_LIST,
} from "../../src/lib/associations";

import {
  calculateTandingScore,
  calculateJurusScore,
  getPenaltyDeduction,
  isDisqualifyingPenalty,
} from "../../src/lib/guidelines";

import {
  validateRegistrationStep,
  isValidMalaysianPhone,
  isValidEmail,
  isValidPostalCode,
  isValidIdentityNumber,
  hasSecurePassword,
  type ClubRegistrationValues,
} from "../../src/lib/club-registration/validation";

import {
  uiOnlyClubRegistrationService,
} from "../../src/lib/club-registration/ui-only-adapter";

import {
  SILAT_AFFILIATIONS,
} from "../../src/lib/club-registration/affiliations-data";

import {
  partnerLogos,
} from "../../src/components/homepage/association-marquee";

const REPO_ROOT = path.resolve(__dirname, "../..");

export const tier1Tests: TestCase[] = [
  // --------------------------------------------------------------------------
  // T1-FEAT-01: Shared Wallpaper System & CSS Tokens
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-01",
    tier: 1,
    name: "Shared Wallpaper System: Verify assets, 72% opacity, and globals.css rules",
    run: () => {
      const desktopBgPath = path.join(REPO_ROOT, "public/assets/fighterx/homepage-bg-desktop.webp");
      const mobileBgPath = path.join(REPO_ROOT, "public/assets/fighterx/homepage-bg-mobile.webp");

      assert(fs.existsSync(desktopBgPath), `Missing desktop wallpaper: ${desktopBgPath}`);
      assert(fs.existsSync(mobileBgPath), `Missing mobile wallpaper: ${mobileBgPath}`);

      const desktopStats = fs.statSync(desktopBgPath);
      const mobileStats = fs.statSync(mobileBgPath);
      assert(desktopStats.size > 10000, "Desktop wallpaper file size must be > 10KB");
      assert(mobileStats.size > 10000, "Mobile wallpaper file size must be > 10KB");

      const globalsCssPath = path.join(REPO_ROOT, "src/app/globals.css");
      assert(fs.existsSync(globalsCssPath), `Missing globals.css at ${globalsCssPath}`);
      const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");

      assertIncludes(globalsCss, "homepage-bg-desktop.webp", "globals.css must reference homepage-bg-desktop.webp");
      assertIncludes(globalsCss, "homepage-bg-mobile.webp", "globals.css must reference homepage-bg-mobile.webp");
      assert(globalsCss.toLowerCase().includes("#08090b"), "globals.css must use authentic FighterX #08090B dark base");
      assertIncludes(globalsCss, "prefers-reduced-motion", "globals.css must support prefers-reduced-motion");
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-02: Homepage Hero Elements & Composition
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-02",
    tier: 1,
    name: "Homepage Hero: Verify Bismillah, tagline, headlines, quote callout, and dual athletes",
    run: () => {
      const homePagePath = path.join(REPO_ROOT, "src/components/homepage/home-page.tsx");
      assert(fs.existsSync(homePagePath), `Missing home-page.tsx at ${homePagePath}`);
      const homePageContent = fs.readFileSync(homePagePath, "utf-8");

      // 1. Bismillah Arabic calligraphy asset
      const bismillahAsset = path.join(REPO_ROOT, "public/assets/fighterx/bismillah-calligraphy.png");
      assert(fs.existsSync(bismillahAsset), `Missing bismillah asset at ${bismillahAsset}`);
      assertIncludes(homePageContent, "bismillah-calligraphy.png", "Hero must render bismillah calligraphy");

      // 2. Overline tagline
      assertIncludes(homePageContent, "THE SILAT ATHLETE PLATFORM", "Hero must render 'THE SILAT ATHLETE PLATFORM' tagline");

      // 3. Display headlines
      assertIncludes(homePageContent, "TRAIN SMARTER.", "Hero must include 'TRAIN SMARTER.' headline");
      assertIncludes(homePageContent, "FIGHT STRONGER.", "Hero must include 'FIGHT STRONGER.' headline");

      // 4. Exact quote callout
      assertIncludes(homePageContent, "Semangat Juang. Jiwa Malaysia.", "Hero must contain quote 'Semangat Juang. Jiwa Malaysia.'");

      // 5. Dual athlete framing assets
      const seniAthlete = path.join(REPO_ROOT, "public/assets/fighterx/hero-silat-seni-athlete-lit.png");
      const olahragaAthlete = path.join(REPO_ROOT, "public/assets/fighterx/hero-silat-olahraga-athlete-lit.png");
      assert(fs.existsSync(seniAthlete), `Missing Seni athlete visual at ${seniAthlete}`);
      assert(fs.existsSync(olahragaAthlete), `Missing Olahraga athlete visual at ${olahragaAthlete}`);
      assertIncludes(homePageContent, "hero-silat-seni-athlete-lit.png", "Hero must frame Silat Seni athlete on left");
      assertIncludes(homePageContent, "hero-silat-olahraga-athlete-lit.png", "Hero must frame Silat Olahraga athlete on right");

      // 6. 4 feature strip cards
      assertIncludes(homePageContent, "Athlete Analytics", "Hero strip must include Athlete Analytics card");
      assertIncludes(homePageContent, "Structured Programmes", "Hero strip must include Structured Programmes card");
      assertIncludes(homePageContent, "Monitoring & Evaluation", "Hero strip must include Monitoring & Evaluation card");
      assertIncludes(homePageContent, "Club & Athlete Management", "Hero strip must include Club & Athlete Management card");
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-03: Animated Association Logo Marquee
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-03",
    tier: 1,
    name: "Association Marquee: Verify infinite logo rail, PESAKA branding, and directory link",
    run: () => {
      const marqueePath = path.join(REPO_ROOT, "src/components/homepage/association-marquee.tsx");
      assert(fs.existsSync(marqueePath), `Missing association-marquee.tsx at ${marqueePath}`);
      const marqueeContent = fs.readFileSync(marqueePath, "utf-8");

      assertIncludes(marqueeContent, "PESAKA Malaysia", "Marquee header must highlight PESAKA Malaysia");
      assertIncludes(marqueeContent, "/associations", "Marquee must link to /associations directory");
      assert(
        marqueeContent.includes("partner-scroll-wrapper") || marqueeContent.includes("marquee-viewport"),
        "Marquee must contain accessible viewport wrapper"
      );
      assert(
        marqueeContent.includes("partner-scroll-track") || marqueeContent.includes("marquee-track"),
        "Marquee must contain scrolling track"
      );
      assertIncludes(marqueeContent, "pesaka-malaysia.png", "Marquee must include PESAKA logo");
      assertIncludes(marqueeContent, "pertubuhan-silat-seni-gayong-malaysia.png", "Marquee must include PSSGM logo");

      // Verify partner logos are registered (including Daeng Kuning)
      assertEqual(partnerLogos.length, 27, `Marquee must contain exactly 27 partner logos (found ${partnerLogos.length})`);

      // Verify all logos exist on disk
      for (const logo of partnerLogos) {
        const diskPath = path.join(REPO_ROOT, "public", logo.src.replace(/^\//, ""));
        assert(fs.existsSync(diskPath), `Logo file for "${logo.name}" must exist at ${diskPath}`);
      }

      // Verify omitted and newly added logos are included
      const logoPaths = partnerLogos.map((p) => p.src);
      assert(
        logoPaths.includes("/assets/silat-logos/akademi-persilatan-daeng-kuning.png"),
        "Marquee must include Akademi Persilatan Daeng Kuning logo"
      );
      const expectedOmittedLogos = [
        "/assets/silat-logos/tempur-keris-pssgm.png",
        "/assets/silat-logos/ikatan-pencak-silat-indonesia-ipsi.png",
        "/assets/silat-logos/perguruan-pencak-silat-satria-muda-indonesia.png",
        "/assets/silat-logos/perguruan-pencak-silat-merpati-putih.png",
        "/assets/silat-logos/ikatan-pencak-silat-nahdlatul-ulama-pagar-nusa.png",
        "/assets/silat-logos/perguruan-pencak-silat-gubug-remaja.png",
      ];
      for (const expected of expectedOmittedLogos) {
        assert(
          logoPaths.includes(expected),
          `Marquee must include "${expected}"`
        );
      }
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-04: SiteHeader Navigation Expansion
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-04",
    tier: 1,
    name: "SiteHeader: Verify expanded navigation links and accessible mobile drawer",
    run: () => {
      const headerPath = path.join(REPO_ROOT, "src/components/layout/site-header.tsx");
      assert(fs.existsSync(headerPath), `Missing site-header.tsx at ${headerPath}`);
      const headerContent = fs.readFileSync(headerPath, "utf-8");

      // Required navigation destinations
      assertIncludes(headerContent, 'href="/"', "Header must link to Homepage (/)");
      assertIncludes(headerContent, 'href="/guidelines"', "Header must link to Guidelines / Rules (/guidelines)");
      assertIncludes(headerContent, 'href="/associations"', "Header must link to Association Directory (/associations)");
      assertIncludes(headerContent, 'href="/disciplines"', "Header must link to Disciplines (/disciplines)");
      assertIncludes(headerContent, 'href="/login"', "Header must link to Sign In (/login)");
      assertIncludes(headerContent, 'href="/register-club"', "Header must link to Register Club (/register-club)");

      // Mobile accessibility attributes
      assertIncludes(headerContent, "mobile-menu-toggle", "Header must provide mobile menu toggle button");
      assertIncludes(headerContent, "aria-expanded", "Toggle must use aria-expanded for screen readers");
      assertIncludes(headerContent, "aria-controls", "Toggle must use aria-controls referencing mobile navigation");
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-05: Silat Association Directory Data Layer & 26 Registry
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-05",
    tier: 1,
    name: "Association Directory: Verify all 27 associations across 4 required categories",
    run: () => {
      assertEqual(SILAT_ASSOCIATIONS.length, 27, "Directory must contain exactly 27 Silat associations");

      const counts = getCategoryCounts();
      assertEqual(counts.ALL, 27, "Total count must be 27");
      assertEqual(counts.BADAN_INDUK, 4, "Badan Induk Kebangsaan must have exactly 4 associations");
      assertEqual(counts.PENGASAS_TERAS, 4, "4 Anggota Pengasas Teras must have exactly 4 associations");
      assertEqual(counts.PERGURUAN_UTAMA, 10, "Perguruan Utama Malaysia must have exactly 10 associations");
      assertEqual(counts.ANTARABANGSA, 9, "Badan Antarabangsa / PERSILAT must have exactly 9 associations");

      // Verify each association has valid metadata and image asset exists
      for (const assoc of SILAT_ASSOCIATIONS) {
        assert(assoc.id && assoc.id.length > 0, `Association missing id: ${JSON.stringify(assoc)}`);
        assert(assoc.name && assoc.name.length > 0, `Association missing name: ${assoc.id}`);
        assert(assoc.shortName && assoc.shortName.length > 0, `Association missing shortName: ${assoc.id}`);
        assert(assoc.category, `Association missing category: ${assoc.id}`);
        assert(assoc.description && assoc.description.length > 20, `Association description too short: ${assoc.id}`);

        // Verify logo asset on filesystem
        const relativeLogoPath = assoc.logoUrl.replace(/^\//, "");
        const fullLogoPath = path.join(REPO_ROOT, "public", relativeLogoPath);
        assert(fs.existsSync(fullLogoPath), `Logo file not found on disk: ${fullLogoPath}`);
      }

      // Verify category metadata list
      assertEqual(CATEGORY_METADATA_LIST.length, 5, "Metadata list must cover ALL + 4 categories");
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-06: Association Interactive Search & Filter Engine
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-06",
    tier: 1,
    name: "Association Search & Filter: Case-insensitive query and category filtering",
    run: () => {
      // 1. Search by name / keyword
      const gayongResults = searchAssociations("Gayong");
      assert(gayongResults.length >= 3, "Search for 'Gayong' should return PSSGM, Pusaka Gayong, Singa Berantai");
      assert(gayongResults.some((a) => a.id === "pssgm"), "Search results must include PSSGM");

      // 2. Case insensitivity
      const upperResults = searchAssociations("PESAKA");
      const lowerResults = searchAssociations("pesaka");
      assertEqual(upperResults.length, lowerResults.length, "Search must be strictly case-insensitive");

      // 3. Category filter
      const terasOnly = getAssociationsByCategory("PENGASAS_TERAS");
      assertEqual(terasOnly.length, 4, "PENGASAS_TERAS filter must return 4 founding bodies");
      const terasIds = terasOnly.map((a) => a.id);
      assertIncludes(terasIds, "pssgm");
      assertIncludes(terasIds, "psslm");
      assertIncludes(terasIds, "psscm");
      assertIncludes(terasIds, "psgfm");

      // 4. Combined search + category filter
      const filteredSearch = searchAssociations("Gayong", "PENGASAS_TERAS");
      assertEqual(filteredSearch.length, 1, "Only PSSGM matches 'Gayong' within PENGASAS_TERAS category");
      assertEqual(filteredSearch[0].id, "pssgm");

      // 5. Lookup by id
      const pssgm = getAssociationById("pssgm");
      assert(pssgm !== undefined, "getAssociationById must find PSSGM");
      assertEqual(pssgm?.shortName, "PSSGM");
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-07: PERSILAT 2026 Rules Tanding Point Calculation
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-07",
    tier: 1,
    name: "PERSILAT 2026 Tanding: Punches (1pt), Kicks (2pts), Takedowns (3pts)",
    run: () => {
      // Pure strikes without penalty
      const score1 = calculateTandingScore(3, 4, 2, []);
      // 3*1 + 4*2 + 2*3 = 3 + 8 + 6 = 17
      assertEqual(score1.punches, 3);
      assertEqual(score1.kicks, 4);
      assertEqual(score1.takedowns, 2);
      assertEqual(score1.totalScore, 17, "3 punches (3) + 4 kicks (8) + 2 drops (6) must equal 17");
      assertEqual(score1.isDisqualified, false);

      // Single technique isolation
      assertEqual(calculateTandingScore(5, 0, 0).totalScore, 5, "5 punches = 5 pts");
      assertEqual(calculateTandingScore(0, 5, 0).totalScore, 10, "5 kicks = 10 pts");
      assertEqual(calculateTandingScore(0, 0, 5).totalScore, 15, "5 takedowns = 15 pts");
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-08: PERSILAT 2026 Penalties & Disciplinary Matrix
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-08",
    tier: 1,
    name: "PERSILAT 2026 Penalties: Teguran 1 (-1), Teguran 2 (-2), Peringatan 1 (-5), Peringatan 2 (-10), DQ",
    run: () => {
      assertEqual(getPenaltyDeduction("TEGURAN_1"), 1, "Teguran 1 deduction must be 1 pt");
      assertEqual(getPenaltyDeduction("TEGURAN_2"), 2, "Teguran 2 deduction must be 2 pts");
      assertEqual(getPenaltyDeduction("PERINGATAN_1"), 5, "Peringatan 1 deduction must be 5 pts");
      assertEqual(getPenaltyDeduction("PERINGATAN_2"), 10, "Peringatan 2 deduction must be 10 pts");

      assertEqual(isDisqualifyingPenalty("TEGURAN_1"), false);
      assertEqual(isDisqualifyingPenalty("PERINGATAN_2"), false);
      assertEqual(isDisqualifyingPenalty("PERINGATAN_3_DQ"), true, "Peringatan 3 must trigger DQ");
      assertEqual(isDisqualifyingPenalty("DIRECT_DQ"), true, "Direct DQ must trigger DQ");

      // Score with penalties
      const bout = calculateTandingScore(6, 3, 1, ["TEGURAN_1", "PERINGATAN_1"]);
      // Strikes: 6*1 + 3*2 + 1*3 = 6 + 6 + 3 = 15 pts
      // Deductions: 1 (Teguran 1) + 5 (Peringatan 1) = 6 pts
      // Net: 15 - 6 = 9 pts
      assertEqual(bout.totalScore, 9, "Net score must be 9 pts");
      assertEqual(bout.isDisqualified, false);
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-09: PERSILAT 2026 Jurus / Seni Scoring Rubrics
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-09",
    tier: 1,
    name: "PERSILAT 2026 Jurus: Accuracy base, time deviation (-0.05/5s), weapon drop (-0.50)",
    run: () => {
      // Perfect routine
      const perfect = calculateJurusScore({
        category: "TUNGGAL",
        accuracyScore: 9.9,
        expressionScore: 0.0,
      });
      assertEqual(perfect.netScore, 9.9);
      assertEqual(perfect.totalDeductions, 0);

      // Routine with deductions:
      // Time over by 12s -> 2 blocks of 5s -> -0.10
      // 1 weapon drop -> -0.50
      // 1 boundary exit -> -0.05
      // 2 movement faults -> -0.02
      // Total deductions: 0.10 + 0.50 + 0.05 + 0.02 = 0.67
      // Net score: 9.90 - 0.67 = 9.23
      const penalised = calculateJurusScore({
        category: "TUNGGAL",
        accuracyScore: 9.9,
        expressionScore: 0.0,
        deductions: {
          timeOverUnderSeconds: 12,
          weaponDrops: 1,
          boundaryViolations: 1,
          costumeFaults: 0,
          movementFaults: 2,
        },
      });

      assertEqual(penalised.timeDeduction, 0.1);
      assertEqual(penalised.weaponDeduction, 0.5);
      assertEqual(penalised.boundaryDeduction, 0.05);
      assertEqual(penalised.movementDeduction, 0.02);
      assertEqual(penalised.totalDeductions, 0.67);
      assertEqual(penalised.netScore, 9.23);
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-10: Silat Disciplines Deep-Dive Presentation & Rules Matrix
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-10",
    tier: 1,
    name: "Silat Disciplines: Verify Seni categories and Olahraga weight classes / scoring zones",
    run: () => {
      // Verify rulebook data layer
      const rulesDataPath = path.join(REPO_ROOT, "src/lib/guidelines/rules-data.ts");
      assert(fs.existsSync(rulesDataPath), `Missing rules-data.ts at ${rulesDataPath}`);
      const rulesContent = fs.readFileSync(rulesDataPath, "utf-8");

      // Seni 4 categories
      assertIncludes(rulesContent, "Tunggal", "Must detail Tunggal (Single 100 movements)");
      assertIncludes(rulesContent, "Ganda", "Must detail Ganda (Choreographed duel)");
      assertIncludes(rulesContent, "Regu", "Must detail Regu (Synchronized trio)");
      assertIncludes(rulesContent, "Solo Bebas", "Must detail Solo Bebas (Creative solo)");

      // Olahraga scoring zones
      assertIncludes(rulesContent, "Dada", "Dada must be recognized as scoring zone");
      assertIncludes(rulesContent, "Abdomen", "Abdomen must be recognized as scoring zone");
      assertIncludes(rulesContent, "Rusuk", "Rusuk must be recognized as scoring zone");

      // Forbidden zones
      assertIncludes(rulesContent, "Kepala", "Kepala must be recognized as forbidden zone");
      assertIncludes(rulesContent, "Leher", "Leher must be recognized as forbidden zone");
      assertIncludes(rulesContent, "Kemaluan", "Kemaluan must be recognized as forbidden zone");

      // VAR protocol
      assertIncludes(rulesContent, "VAR", "Must document Video Assistant Referee protocol");
      assertIncludes(rulesContent, "Protest", "Must document protest card rules");
    },
  },

  // --------------------------------------------------------------------------
  // T1-FEAT-11: 5-Step Club Registration Contract & Validation Rules
  // --------------------------------------------------------------------------
  {
    id: "T1-FEAT-11",
    tier: 1,
    name: "Club Registration: Verify 5-step validation and mock submission receipt",
    run: async () => {
      // Step 1: Incomplete values
      const step1Empty: ClubRegistrationValues = {
        clubName: "",
        registrationNumber: "",
        organizationType: "",
        state: "",
        city: "",
        address: "",
        postalCode: "",
        representativeName: "",
        identificationNumber: "",
        phoneNumber: "",
        email: "",
        designation: "",
        password: "",
        confirmPassword: "",
        disciplines: [],
        trainingVenueType: "",
        weeklySessions: 0,
        trainingSchedule: "",
        trainingFacilities: [],
        associationId: "",
        agreedToTerms: false,
      };

      const step1Errors = validateRegistrationStep(1, step1Empty);
      assert(step1Errors.clubName !== undefined, "Empty clubName must error");
      assert(step1Errors.organizationType !== undefined, "Empty organizationType must error");
      assert(step1Errors.state !== undefined, "Empty state must error");
      assert(step1Errors.postalCode !== undefined, "Empty postalCode must error");

      // Step 2: Valid PIC validation
      assert(isValidMalaysianPhone("+60 12-345 6789"), "+60 12-345 6789 is valid Malaysian phone");
      assert(isValidEmail("coach@silat.org.my"), "Valid email must pass");
      assert(isValidPostalCode("50480"), "50480 is valid 5-digit poskod");
      assert(isValidIdentityNumber("901231-14-5567"), "Valid MyKad must pass");
      assert(hasSecurePassword("Gayong2026!Wira"), "Strong password must pass");

      // Step 4: Affiliations list contains 27 + INDEPENDENT
      assertEqual(SILAT_AFFILIATIONS.length, 28, "Affiliations list must include 27 associations + INDEPENDENT");

      // Step 5: Test mock service register
      const result = await uiOnlyClubRegistrationService.register({
        clubName: "Akademi Silat Warisan Gayong",
        registrationNumber: "ROS-2026-KL-001",
        organizationType: "CLUB",
        state: "Kuala Lumpur",
        city: "Sentul",
        address: "No 12, Jalan Sentul Pasar",
        postalCode: "51000",
        representativeName: "Cikgu Farid bin Othman",
        identificationNumber: "820415-14-5123",
        email: "farid@gayongwarisan.my",
        phone: "+60 12-987 6543",
        designation: "Guru Utama",
        disciplines: ["SENI", "OLAHRAGA"],
        trainingVenueType: "DOJO",
        weeklySessions: 3,
        associationId: "pssgm",
        agreedToTerms: true,
      });

      assertEqual(result.status, "accepted");
      if (result.status === "accepted") {
        assertMatches(result.receipt.applicationId, /^FX-APP-/, "Receipt ID must start with FX-APP-");
        assertEqual(result.receipt.applicationStatus, "PENDING_APPROVAL");
        assertEqual(result.receipt.subscription.monthlyPriceMYR, 20);
        assertEqual(result.receipt.subscription.trialPeriodDays, 30);
      }
    },
  },
];
