/**
 * FighterX Club Registration Adversarial Stress Harness
 * 
 * Challenger Agent: challenger_public_2
 * Focus: Empirically stress-test the 5-step Club Registration validation engine,
 *        step gating invariants, association affiliation picker mapping,
 *        and mock service adapter concurrency.
 */

import fs from "fs";
import path from "path";

import {
  isValidMalaysianPhone,
  isValidPostalCode,
  isValidIdentityNumber,
  hasSecurePassword,
  validateRegistrationStep,
  getRegistrationStepErrors,
  type ClubRegistrationValues,
} from "../src/lib/club-registration/validation";

import {
  SILAT_AFFILIATIONS,
} from "../src/lib/club-registration/affiliations-data";

import {
  SILAT_ASSOCIATIONS,
} from "../src/lib/associations/data";

import {
  uiOnlyClubRegistrationService,
} from "../src/lib/club-registration/ui-only-adapter";

import type {
  ClubRegistrationRequest,
  OrganizationType,
  TrainingVenueType,
} from "../src/lib/club-registration/contract";

const REPO_ROOT = path.resolve(__dirname, "..");

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  error?: string;
  details?: Record<string, unknown>;
}

const results: TestResult[] = [];

async function recordTest(name: string, category: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
    results.push({ name, category, passed: true });
  } catch (err: unknown) {
    results.push({
      name,
      category,
      passed: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

function expect(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message} — Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`);
  }
}

// ============================================================================
// BASELINE VALID VALUES FIXTURE
// ============================================================================
function getBaselineValidValues(): ClubRegistrationValues {
  return {
    // Step 1
    clubName: "Kelab Silat Seni Gayong Warisan",
    registrationNumber: "ROS-SEL-2024-9988",
    organizationType: "CLUB",
    state: "Selangor",
    city: "Shah Alam",
    district: "Shah Alam",
    address: "No. 12, Jalan Pahlawan 1/1, Seksyen 7",
    postalCode: "40000",

    // Step 2
    representativeName: "Pendekar Megat Danial",
    fullName: "Pendekar Megat Danial",
    identificationNumber: "880512-10-5431",
    phoneNumber: "+60 12-345 6789",
    email: "megat.danial@gayongwarisan.my",
    designation: "Guru Utama",
    position: "Guru Utama",
    password: "PusakaGayong2026!",
    confirmPassword: "PusakaGayong2026!",

    // Step 3
    disciplines: ["SENI", "OLAHRAGA"],
    trainingVenueType: "DOJO",
    weeklySessions: 3,
    trainingSchedule: "Selasa, Khamis & Sabtu (8.00 - 10.30 malam)",
    trainingFacilities: ["Matras Pertandingan (EVA Mat)", "Pelindung Badan (Body Protector)"],

    // Step 4
    associationId: "pssgm",
    customAffiliationName: "",

    // Step 5
    agreedToTerms: true,
    termsAccepted: true,
  };
}

// ============================================================================
// SUITE EXECUTION
// ============================================================================
async function runAllStressTests() {
  console.log("================================================================================");
  console.log("   FIGHTERX CLUB REGISTRATION ADVERSARIAL STRESS HARNESS");
  console.log("================================================================================");
  console.log(`Execution Time: ${new Date().toISOString()}`);
  console.log("Target Engine: src/lib/club-registration/* & step gating\n");

  // --------------------------------------------------------------------------
  // CATEGORY 1: PHONE VALIDATION BOUNDARIES
  // --------------------------------------------------------------------------
  await recordTest("Phone: Valid Malaysian Mobile Formats (+601X, 01X, 10/11 digits)", "Phone Validation", () => {
    const validPhones = [
      "+60123456789",
      "+60198765432",
      "0123456789",
      "0198765432",
      "01112345678",        // 11 digits (011)
      "+601112345678",      // 11 digits with +60
      "0102345678",         // 10 digits (010)
      "+60 12-345 6789",    // spaces and hyphens
      "(012) 345-6789",     // parentheses and hyphens
      "011-2345 6789",      // 011 with punctuation
      "+60 11 2345 6789",   // +60 with 011
      "014-9876543",        // 014 prefix
      "018-7654321",        // 018 prefix
    ];

    for (const phone of validPhones) {
      expect(isValidMalaysianPhone(phone), `Phone "${phone}" should be valid Malaysian mobile`);
    }
  });

  await recordTest("Phone: Rejection of Landlines, International, and Malformed Strings", "Phone Validation", () => {
    const invalidPhones = [
      "03-21234567",       // KL landline (03)
      "+60321234567",      // KL landline with +60
      "04-7654321",        // Penang landline (04)
      "07-2345678",        // Johor landline (07)
      "082-123456",        // Sarawak landline (082)
      "+65 9123 4567",     // Singapore
      "+62 812 3456 7890", // Indonesia
      "+1 555 123 4567",   // USA
      "01234567",          // Too short (8 digits)
      "012",               // Too short (3 digits)
      "01234567890123",    // Too long (14 digits)
      "012-ABC-DEFG",      // Alphabetic
      "0123456789<script>",// XSS
      "",                  // Empty
      "   ",               // Whitespace
      "++60123456789",     // Double plus
      "+60 012 345 6789",  // Redundant zero after +60
    ];

    for (const phone of invalidPhones) {
      expect(!isValidMalaysianPhone(phone), `Phone "${phone}" should be rejected`);
    }
  });

  // --------------------------------------------------------------------------
  // CATEGORY 2: POSTAL CODE BOUNDARIES
  // --------------------------------------------------------------------------
  await recordTest("Postal Code: Exact 5 Numeric Digits with Leading Zeroes", "Postal Code", () => {
    const validPostcodes = [
      "50480", // KL
      "40000", // Shah Alam
      "80000", // JB
      "93050", // Kuching
      "88450", // Kota Kinabalu
      "01000", // Kangar, Perlis (leading zero)
      "05000", // Alor Setar, Kedah (leading zero)
      "08000", // Sungai Petani (leading zero)
    ];

    for (const pc of validPostcodes) {
      expect(isValidPostalCode(pc), `Postal code "${pc}" should be valid 5-digit code`);
    }
  });

  await recordTest("Postal Code: Rejection of 4-digit, 6-digit, Alphanumeric, and Negative", "Postal Code", () => {
    const invalidPostcodes = [
      "4000",        // 4 digits (Australia / NZ style)
      "400",         // 3 digits
      "40",          // 2 digits
      "400000",      // 6 digits (Singapore / India style)
      "400001",      // 6 digits
      "40A00",       // Letter inside
      "SW1A 1AA",    // UK style
      "90210-1234",  // US ZIP+4
      "-40000",      // Negative
      "4000.0",      // Decimal
      "40 000",      // Internal space
      "",            // Empty
      "     ",       // Whitespace
      "<script>",    // XSS
    ];

    for (const pc of invalidPostcodes) {
      expect(!isValidPostalCode(pc), `Postal code "${pc}" should be rejected`);
    }

    // Verify whitespace trimming tolerance behavior:
    // Leading/trailing whitespace is trimmed by isValidPostalCode(v.trim())
    expect(isValidPostalCode(" 40000 "), "Leading/trailing whitespace is safely trimmed by validator");
  });

  // --------------------------------------------------------------------------
  // CATEGORY 3: IDENTITY (MYKAD & PASSPORT) BOUNDARIES
  // --------------------------------------------------------------------------
  await recordTest("Identity: 12-Digit MyKad Formats (Raw, Hyphenated, Spaced)", "Identity Validation", () => {
    const validMyKads = [
      "880512105431",     // 12 raw digits
      "880512-10-5431",   // Standard hyphenated format
      "880512 10 5431",   // Spaced format
      "010203040506",     // Born 2001 (leading zero)
      "010203-04-0506",   // Born 2001 hyphenated
      "991231-14-9999",   // Boundary date
    ];

    for (const mk of validMyKads) {
      expect(isValidIdentityNumber(mk), `MyKad "${mk}" should be valid`);
    }
  });

  await recordTest("Identity: Foreign Passport (6-15 Alphanumeric)", "Identity Validation", () => {
    const validPassports = [
      "A12345678",        // 9 chars
      "E12345678",        // 9 chars
      "P987654321",       // 10 chars
      "ABCDEF",           // Min length 6
      "123456",           // 6 numeric
      "A12345678901234",  // Max length 15
    ];

    for (const pass of validPassports) {
      expect(isValidIdentityNumber(pass), `Passport "${pass}" should be valid`);
    }
  });

  await recordTest("Identity: Malformed MyKad and Passports Rejection", "Identity Validation", () => {
    const strictlyInvalid = [
      "12345",              // 5 chars (too short for passport or MyKad)
      "A1234",              // 5 chars
      "A1234567890123456",  // 16 chars (too long for passport)
      "88051210543123456",  // 17 digits
      "880512-10-5431#",    // Special character
      "A123-4567#",         // Special character
      "",                   // Empty
      "   ",                // Whitespace
    ];

    for (const id of strictlyInvalid) {
      expect(!isValidIdentityNumber(id), `Identity "${id}" should be rejected`);
    }
  });

  // --------------------------------------------------------------------------
  // CATEGORY 4: PASSWORD COMPLEXITY BOUNDARIES
  // --------------------------------------------------------------------------
  await recordTest("Password: 12-char Minimum and All 4 Character Classes Required", "Password Complexity", () => {
    // Valid passwords
    const validPasswords = [
      "PusakaGayong2026!",
      "SilatMelayu#2026",
      "Aa1!Aa1!Aa1!", // Exact 12 chars
      "ComplexP@ssw0rd2026",
      "KuntauTekpi!9999",
    ];

    for (const pw of validPasswords) {
      expect(hasSecurePassword(pw), `Password "${pw}" should be valid`);
    }

    // Invalid passwords
    const invalidPasswords = [
      "Aa1!Aa1!Aa1",       // 11 chars (too short)
      "short1!Aa",         // 9 chars
      "pusakagayong2026!", // Missing uppercase
      "PUSAKAGAYONG2026!", // Missing lowercase
      "PusakaGayong!!!!",  // Missing digit
      "PusakaGayong2026",  // Missing symbol
      "123456789012!",     // Missing letters
      "abcdefghijkl!",     // Missing digit and uppercase
      "",                  // Empty
      "            ",      // Whitespace
    ];

    for (const pw of invalidPasswords) {
      expect(!hasSecurePassword(pw), `Password "${pw}" should be rejected`);
    }
  });

  // --------------------------------------------------------------------------
  // CATEGORY 5: STEP GATING INVARIANTS
  // --------------------------------------------------------------------------
  await recordTest("Step 1 Gating: Incomplete Step 1 Must Trigger Errors on All Required Fields", "Step Gating", () => {
    const emptyValues: ClubRegistrationValues = {
      ...getBaselineValidValues(),
      clubName: "",
      registrationNumber: "",
      organizationType: "" as OrganizationType,
      state: "",
      city: "",
      district: "", // clear alias
      address: "",
      postalCode: "",
    };

    const errors = validateRegistrationStep(1, emptyValues);
    expect(Boolean(errors.clubName), "clubName error must be present");
    expect(Boolean(errors.registrationNumber), "registrationNumber error must be present");
    expect(Boolean(errors.organizationType), "organizationType error must be present");
    expect(Boolean(errors.state), "state error must be present");
    expect(Boolean(errors.city), "city error must be present");
    expect(Boolean(errors.address), "address error must be present");
    expect(Boolean(errors.postalCode), "postalCode error must be present");
    expectEqual(Object.keys(errors).length, 7, "Step 1 must have exactly 7 errors when empty");
  });

  await recordTest("Step 2 Gating: Incomplete PIC Info Must Trigger Validation Errors", "Step Gating", () => {
    const invalidPicValues: ClubRegistrationValues = {
      ...getBaselineValidValues(),
      representativeName: "",
      fullName: "", // clear alias
      identificationNumber: "12345", // invalid (<6 chars)
      phoneNumber: "03-21234567",    // invalid landline
      email: "invalid-email",        // invalid email
      designation: "",               // missing
      position: "",                  // clear alias
      password: "weak",              // weak password
      confirmPassword: "mismatch",   // mismatch
    };

    const errors = validateRegistrationStep(2, invalidPicValues);
    expect(Boolean(errors.representativeName), "representativeName error must be present");
    expect(Boolean(errors.identificationNumber), "identificationNumber error must be present");
    expect(Boolean(errors.phoneNumber), "phoneNumber error must be present");
    expect(Boolean(errors.email), "email error must be present");
    expect(Boolean(errors.designation), "designation error must be present");
    expect(Boolean(errors.password), "password error must be present");
    expect(Boolean(errors.confirmPassword), "confirmPassword error must be present");
  });

  await recordTest("Step 3 Gating: Disciplines, Venue Type, and Weekly Sessions Boundaries", "Step Gating", () => {
    // Empty disciplines
    const noDisciplines = {
      ...getBaselineValidValues(),
      disciplines: [],
    };
    expect(Boolean(validateRegistrationStep(3, noDisciplines).disciplines), "Empty disciplines array must fail Step 3");

    // Missing venue
    const noVenue = {
      ...getBaselineValidValues(),
      trainingVenueType: "" as TrainingVenueType,
    };
    expect(Boolean(validateRegistrationStep(3, noVenue).trainingVenueType), "Missing venue type must fail Step 3");

    // Sessions < 1
    const zeroSessions = {
      ...getBaselineValidValues(),
      weeklySessions: 0,
    };
    expect(Boolean(validateRegistrationStep(3, zeroSessions).weeklySessions), "0 weekly sessions must fail Step 3");

    // Sessions > 14
    const excessiveSessions = {
      ...getBaselineValidValues(),
      weeklySessions: 15,
    };
    expect(Boolean(validateRegistrationStep(3, excessiveSessions).weeklySessions), "15 weekly sessions must fail Step 3");

    // Valid boundaries: 1 and 14
    const minSessions = { ...getBaselineValidValues(), weeklySessions: 1 };
    expectEqual(Object.keys(validateRegistrationStep(3, minSessions)).length, 0, "1 session should pass");

    const maxSessions = { ...getBaselineValidValues(), weeklySessions: 14 };
    expectEqual(Object.keys(validateRegistrationStep(3, maxSessions)).length, 0, "14 sessions should pass");
  });

  await recordTest("Step 4 Gating: Missing Association ID Must Fail Validation", "Step Gating", () => {
    const noAssoc = {
      ...getBaselineValidValues(),
      associationId: "",
    };
    const errors = validateRegistrationStep(4, noAssoc);
    expect(Boolean(errors.associationId), "Step 4 must fail when associationId is empty");

    // Valid with registered association
    const validAssoc = { ...getBaselineValidValues(), associationId: "pssgm" };
    expectEqual(Object.keys(validateRegistrationStep(4, validAssoc)).length, 0, "Step 4 must pass with pssgm");

    // Valid with INDEPENDENT
    const independentAssoc = { ...getBaselineValidValues(), associationId: "INDEPENDENT" };
    expectEqual(Object.keys(validateRegistrationStep(4, independentAssoc)).length, 0, "Step 4 must pass with INDEPENDENT");
  });

  await recordTest("Step 5 Gating: Terms Consent Invariant and Composite Submission Check", "Step Gating", () => {
    const noConsent = {
      ...getBaselineValidValues(),
      agreedToTerms: false,
      termsAccepted: false,
    };
    const errors = validateRegistrationStep(5, noConsent);
    expect(Boolean(errors.agreedToTerms), "Step 5 must fail when agreedToTerms is false");

    // When valid
    const withConsent = {
      ...getBaselineValidValues(),
      agreedToTerms: true,
      termsAccepted: true,
    };
    expectEqual(Object.keys(validateRegistrationStep(5, withConsent)).length, 0, "Step 5 must pass with consent");

    // If an earlier step is invalidated while at Step 5, getRegistrationStepErrors MUST catch it
    const corruptedEarlierStep = {
      ...withConsent,
      clubName: "X", // too short (Step 1 error)
    };
    const allErrors = getRegistrationStepErrors(corruptedEarlierStep);
    expect(Boolean(allErrors.clubName), "Composite validator must detect earlier step errors at final submission");
  });

  // --------------------------------------------------------------------------
  // CATEGORY 6: AFFILIATION SELECTOR & DIRECTORY ID RESOLUTION
  // --------------------------------------------------------------------------
  await recordTest("Affiliation: Verify All 26 Directory Associations & ID Matching", "Affiliation Mapping", async () => {
    expectEqual(SILAT_ASSOCIATIONS.length, 26, "Directory must have exactly 26 associations");
    expectEqual(SILAT_AFFILIATIONS.length, 27, "Affiliations list must have exactly 27 options (26 + INDEPENDENT)");

    // Check INDEPENDENT
    const indep = SILAT_AFFILIATIONS.find((a) => a.id === "INDEPENDENT");
    expect(Boolean(indep), "INDEPENDENT option must exist in affiliations");
    expectEqual(indep?.category, "INDEPENDENT", "INDEPENDENT category must be INDEPENDENT");

    // Compare IDs between SILAT_ASSOCIATIONS and SILAT_AFFILIATIONS
    const affiliationIds = SILAT_AFFILIATIONS.map((a) => a.id);

    const matchingIds: string[] = [];
    const divergingIds: { directoryId: string; directoryName: string }[] = [];

    for (const assoc of SILAT_ASSOCIATIONS) {
      if (affiliationIds.includes(assoc.id)) {
        matchingIds.push(assoc.id);
      } else {
        divergingIds.push({ directoryId: assoc.id, directoryName: assoc.name });
      }
    }

    console.log(`\n  [Affiliation Mapping Analysis]`);
    console.log(`    Matching Directory IDs: ${matchingIds.length} / 26`);
    console.log(`    Diverging Directory IDs: ${divergingIds.length} / 26`);

    if (divergingIds.length > 0) {
      console.log(`    Divergence details:`);
      for (const div of divergingIds) {
        console.log(`      - Directory ID "${div.directoryId}" (${div.directoryName}) not found verbatim in SILAT_AFFILIATIONS`);
      }
    }

    // Verify that every affiliation in SILAT_AFFILIATIONS resolves a logo on disk
    for (const aff of SILAT_AFFILIATIONS) {
      const diskPath = path.join(REPO_ROOT, "public", aff.logoUrl.replace(/^\//, ""));
      expect(fs.existsSync(diskPath), `Logo for affiliation "${aff.id}" must exist at ${diskPath}`);
    }

    // Verify mock adapter behavior for all 27 affiliations in parallel
    const registrationPromises = SILAT_AFFILIATIONS.map(async (aff) => {
      const res = await uiOnlyClubRegistrationService.register({
        clubName: "Test Club",
        organizationType: "CLUB",
        state: "Selangor",
        city: "Shah Alam",
        address: "Jalan 1",
        postalCode: "40000",
        representativeName: "Test Rep",
        identificationNumber: "880512105431",
        email: "rep@test.my",
        phone: "+60123456789",
        designation: "Coach",
        disciplines: ["SENI"],
        trainingVenueType: "DOJO",
        weeklySessions: 3,
        associationId: aff.id,
        agreedToTerms: true,
      });

      expectEqual(res.status, "accepted", `Registration with affiliation "${aff.id}" must be accepted`);
      if (res.status === "accepted") {
        if (aff.id === "INDEPENDENT") {
          expectEqual(res.receipt.associationName, "Bebas / Bebas Gabungan", "INDEPENDENT shortName should be resolved");
        } else {
          expectEqual(res.receipt.associationName, aff.shortName, `Receipt associationName must match affiliation shortName for ${aff.id}`);
        }
      }
    });

    await Promise.all(registrationPromises);
  });

  await recordTest("Affiliation: Directory ID Fallback Behavior (4 Diverging IDs Resolve to 'Kelab Bebas')", "Affiliation Mapping", async () => {
    // Test what happens when the 4 directory IDs are passed to the mock registration adapter
    const divergingDirectoryIds = [
      "persekutuan-silat-negeri-johor",
      "rumpun-silat-sarawak",
      "sendeng-malaysia",
      "tempur-keris",
    ];

    for (const dirId of divergingDirectoryIds) {
      const res = await uiOnlyClubRegistrationService.register({
        clubName: "Divergence Test Club",
        organizationType: "CLUB",
        state: "Selangor",
        city: "Shah Alam",
        address: "Jalan 1",
        postalCode: "40000",
        representativeName: "Test PIC",
        identificationNumber: "880512105431",
        email: "pic@test.my",
        phone: "+60123456789",
        designation: "Coach",
        disciplines: ["SENI"],
        trainingVenueType: "DOJO",
        weeklySessions: 2,
        associationId: dirId,
        agreedToTerms: true,
      });

      expectEqual(res.status, "accepted", "Must accept registration request");
      if (res.status === "accepted") {
        // Because dirId is not in SILAT_AFFILIATIONS, it gracefully falls back to "Kelab Bebas"
        expectEqual(
          res.receipt.associationName,
          "Kelab Bebas",
          `Directory ID "${dirId}" gracefully defaults to "Kelab Bebas" in mock adapter`
        );
      }
    }
  });

  // --------------------------------------------------------------------------
  // CATEGORY 7: MOCK ADAPTER CONCURRENCY & RECEIPT GENERATION
  // --------------------------------------------------------------------------
  await recordTest("Mock Adapter Concurrency: 50 Simultaneous Registrations & Receipt Invariants", "Mock Adapter Concurrency", async () => {
    const CONCURRENCY_COUNT = 50;
    const requests: ClubRegistrationRequest[] = Array.from({ length: CONCURRENCY_COUNT }, (_, i) => ({
      clubName: `Simulated Club ${i + 1}`,
      organizationType: "CLUB",
      state: "Selangor",
      city: "Shah Alam",
      address: `Lot ${i + 1}, Jalan Latihan`,
      postalCode: "40000",
      representativeName: `Coach ${i + 1}`,
      identificationNumber: "880512-10-5431",
      email: `coach${i + 1}@fighterx-test.com`,
      phone: "+60 12-345 6789",
      designation: "Ketua Jurulatih",
      disciplines: i % 2 === 0 ? ["SENI", "OLAHRAGA"] : ["SENI"],
      trainingVenueType: "DOJO",
      weeklySessions: 3,
      associationId: SILAT_AFFILIATIONS[i % SILAT_AFFILIATIONS.length].id,
      agreedToTerms: true,
    }));

    const startTime = Date.now();
    const responses = await Promise.all(
      requests.map((req) => uiOnlyClubRegistrationService.register(req))
    );
    const duration = Date.now() - startTime;

    console.log(`\n  [Mock Adapter Concurrency Analysis]`);
    console.log(`    Executed ${CONCURRENCY_COUNT} simultaneous simulated registrations in ${duration}ms`);

    // Invariant checks on every response
    const applicationIds = new Set<string>();
    const orgIds = new Set<string>();
    const accIds = new Set<string>();

    for (let i = 0; i < responses.length; i++) {
      const res = responses[i];
      expectEqual(res.status, "accepted", `Response #${i} status must be "accepted"`);
      if (res.status !== "accepted") continue;

      const receipt = res.receipt;
      expect(Boolean(receipt), `Receipt #${i} must exist`);

      // Pattern: FX-APP-2026-XXXXX
      const appMatch = /^FX-APP-2026-(\d{5})$/.exec(receipt.applicationId);
      expect(Boolean(appMatch), `Receipt #${i} applicationId "${receipt.applicationId}" must match FX-APP-2026-XXXXX`);

      // Pattern: org-mock-XXXXX
      expect(
        Boolean(/^org-mock-\d{5}$/.test(receipt.organizationId || "")),
        `Receipt #${i} organizationId "${receipt.organizationId}" must match org-mock-XXXXX`
      );

      // Pattern: acc-mock-XXXXX
      expect(
        Boolean(/^acc-mock-\d{5}$/.test(receipt.applicantAccountId || "")),
        `Receipt #${i} applicantAccountId "${receipt.applicantAccountId}" must match acc-mock-XXXXX`
      );

      // Status invariants
      expectEqual(receipt.applicationStatus, "PENDING_APPROVAL", `Receipt #${i} applicationStatus must be PENDING_APPROVAL`);
      expectEqual(receipt.applicantAccountStatus, "PENDING_ACTIVATION", `Receipt #${i} applicantAccountStatus must be PENDING_ACTIVATION`);

      // Subscription invariants
      expectEqual(receipt.subscription.status, "TRIAL_ACTIVE", `Receipt #${i} subscription.status must be TRIAL_ACTIVE`);
      expectEqual(receipt.subscription.monthlyPriceMYR, 20, `Receipt #${i} monthlyPriceMYR must be 20`);
      expectEqual(receipt.subscription.coveredClubCount, 1, `Receipt #${i} coveredClubCount must be 1`);
      expectEqual(receipt.subscription.trialPeriodDays, 30, `Receipt #${i} trialPeriodDays must be 30`);

      // Data consistency
      expectEqual(receipt.clubName, requests[i].clubName, `Receipt #${i} clubName must match request`);
      expectEqual(receipt.representativeName, requests[i].representativeName, `Receipt #${i} representativeName must match request`);

      applicationIds.add(receipt.applicationId);
      if (receipt.organizationId) orgIds.add(receipt.organizationId);
      if (receipt.applicantAccountId) accIds.add(receipt.applicantAccountId);
    }

    console.log(`    Unique Application IDs: ${applicationIds.size} / ${CONCURRENCY_COUNT}`);
    console.log(`    Unique Organization IDs: ${orgIds.size} / ${CONCURRENCY_COUNT}`);
    console.log(`    Unique Account IDs: ${accIds.size} / ${CONCURRENCY_COUNT}`);

    // If there is any collision due to 5-digit pseudo-random generation, record collision count
    const collisions = CONCURRENCY_COUNT - applicationIds.size;
    if (collisions > 0) {
      console.warn(`    ⚠️ Concurrency Observation: ${collisions} collision(s) detected in 5-digit random generator across ${CONCURRENCY_COUNT} calls`);
    } else {
      console.log(`    ✓ 100% collision-free in ${CONCURRENCY_COUNT} concurrent requests`);
    }
  });

  // --------------------------------------------------------------------------
  // CATEGORY 8: CUSTOM APPLICATION ID & LEGACY PAYLOAD RESILIENCE
  // --------------------------------------------------------------------------
  await recordTest("Mock Adapter: Custom Application ID Preservation & Legacy Payload Support", "Adapter Resilience", async () => {
    const customId = "FX-APP-2026-CUSTOM-999";
    const customResult = await uiOnlyClubRegistrationService.register({
      clubName: "Gayong Legacy",
      organizationType: "CLUB",
      state: "Kedah",
      city: "Alor Setar",
      address: "Gelanggang Utama",
      postalCode: "05000",
      representativeName: "Cikgu Zainal",
      identificationNumber: "700101-02-1234",
      email: "zainal@gayong.my",
      phone: "+60191234567",
      designation: "Guru Kanan",
      disciplines: ["SENI"],
      trainingVenueType: "DOJO",
      weeklySessions: 2,
      associationId: "pssgm",
      agreedToTerms: true,
      applicationId: customId,
    });

    expectEqual(customResult.status, "accepted", "Custom ID registration must be accepted");
    if (customResult.status === "accepted") {
      expectEqual(customResult.receipt.applicationId, customId, "Custom applicationId must be preserved exactly");
    }

    // Legacy nested structure
    const legacyResult = await uiOnlyClubRegistrationService.register({
      clubName: "",
      organizationType: "CLUB",
      state: "",
      city: "",
      address: "",
      postalCode: "40000",
      representativeName: "",
      identificationNumber: "880512105431",
      email: "legacy@test.my",
      phone: "+60123456789",
      designation: "",
      disciplines: ["SENI"],
      trainingVenueType: "DOJO",
      weeklySessions: 2,
      associationId: "pssgm",
      agreedToTerms: true,
      club: {
        name: "Legacy Nest Club",
        type: "ACADEMY",
        state: "Perak",
        district: "Taiping",
        address: "Air Kuning",
      },
      applicant: {
        fullName: "Legacy Nest Applicant",
        position: "Master",
        phoneNumber: "+60123456789",
        email: "legacy@test.my",
        password: "Password1234!",
      },
    });

    expectEqual(legacyResult.status, "accepted", "Legacy format must be accepted");
    if (legacyResult.status === "accepted") {
      expectEqual(legacyResult.receipt.clubName, "Legacy Nest Club", "Legacy club.name should be used as fallback");
      expectEqual(legacyResult.receipt.representativeName, "Legacy Nest Applicant", "Legacy applicant.fullName should be used as fallback");
    }
  });

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("                           ADVERSARIAL STRESS SUMMARY");
  console.log("================================================================================");

  let passedCount = 0;
  let failedCount = 0;

  for (const r of results) {
    if (r.passed) {
      passedCount++;
      console.log(`  ✓ PASS [${r.category}] ${r.name}`);
    } else {
      failedCount++;
      console.log(`  ✗ FAIL [${r.category}] ${r.name}`);
      console.log(`         Error: ${r.error}`);
    }
  }

  console.log("================================================================================");
  console.log(`  Total Tests Run: ${results.length}`);
  console.log(`  Passed:          ${passedCount} (${Math.round((passedCount / results.length) * 100)}%)`);
  console.log(`  Failed:          ${failedCount} (${Math.round((failedCount / results.length) * 100)}%)`);
  console.log("================================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllStressTests().catch((err) => {
  console.error("Fatal stress test error:", err);
  process.exit(1);
});
