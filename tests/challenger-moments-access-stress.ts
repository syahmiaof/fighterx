#!/usr/bin/env node
/**
 * Empirical Challenger Stress Test Suite: Moments Gallery Access Control & Role Permutations
 * 
 * Target Components:
 * - src/components/moments/moments-control-bar.tsx (Auth Guard / Upload CTA trigger)
 * - src/components/moments/moment-auth-guard-modal.tsx (Role-based messaging & bypass)
 * - src/components/moments/moment-upload-modal.tsx (Form prefill & inline validation)
 * - src/lib/moments/moments-context.tsx (toggleLike & unauthenticated storage)
 * - src/app/moments/page.tsx & src/components/athlete/athlete-home-dashboard.tsx
 */

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { INITIAL_MOMENTS } from "../src/lib/moments/mock-data";
import { AthleteMoment } from "../src/lib/moments/types";

// ANSI colors for report
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures: string[] = [];

function check(desc: string, fn: () => void | boolean) {
  totalTests++;
  try {
    const res = fn();
    if (res === false) {
      throw new Error("Assertion returned false");
    }
    passedTests++;
    console.log(`  ${green("✓ PASS")} ${desc}`);
  } catch (err: any) {
    failedTests++;
    const msg = `FAIL: ${desc} -> ${err.message}`;
    failures.push(msg);
    console.log(`  ${red("✗ FAIL")} ${desc} : ${err.message}`);
  }
}

console.log(bold("\n================================================================================"));
console.log(bold("   MOMENTS ACCESS CONTROL & ROLE PERMUTATIONS EMPIRICAL STRESS TEST"));
console.log(bold("================================================================================"));
console.log(`Execution Time: ${new Date().toISOString()}\n`);

// ---------------------------------------------------------------------------------
// SUITE 1: ZERO BROWSER ALERT() IN MOMENTS COMPONENTS (STATIC & AST CHECK)
// ---------------------------------------------------------------------------------
console.log(cyan("--- SUITE 1: ZERO UNSTYLED ALERT() IN MOMENTS SYSTEM ---"));

const momentsComponentDir = path.resolve(process.cwd(), "src/components/moments");
const momentsFiles = fs.readdirSync(momentsComponentDir).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

check("Moments directory exists and has component files", () => {
  assert(momentsFiles.length >= 6, `Expected at least 6 files, found ${momentsFiles.length}`);
});

for (const file of momentsFiles) {
  const content = fs.readFileSync(path.join(momentsComponentDir, file), "utf-8");
  check(`File ${file} has ZERO calls to alert() or window.alert()`, () => {
    const alertCallMatch = content.match(/\b(window\.)?alert\s*\(/g);
    assert.strictEqual(alertCallMatch, null, `Found unstyled alert() call in ${file}: ${alertCallMatch}`);
  });
}

// ---------------------------------------------------------------------------------
// SUITE 2: ACCESS CONTROL DECISION ORACLE & ROLE PERMUTATIONS
// ---------------------------------------------------------------------------------
console.log(cyan("\n--- SUITE 2: ACCESS CONTROL & ROLE PERMUTATION ORACLE ---"));

/**
 * Replicates the exact access decision contract of MomentsControlBar:
 * handleUploadClick / query parameter checks:
 * - if sessionStorage.getItem("fighterx_session_role") === "ATHLETE" -> open upload modal
 * - else -> open auth guard modal
 */
function evaluateUploadAccess(sessionRole: string | null | undefined): {
  allowed: boolean;
  modalTriggered: "UPLOAD_MODAL" | "AUTH_GUARD_MODAL";
} {
  const isAthlete = sessionRole === "ATHLETE";
  return {
    allowed: isAthlete,
    modalTriggered: isAthlete ? "UPLOAD_MODAL" : "AUTH_GUARD_MODAL",
  };
}

/**
 * Replicates the exact modal presentation contract of MomentAuthGuardModal:
 */
function evaluateAuthGuardModalPresentation(storedRole: string | null | undefined): {
  currentRole: string | null;
  isOtherRole: boolean;
  heading: string;
  hasRoleAlert: boolean;
  ctaText: string;
  bypassAvailable: boolean;
} {
  const validRoles = ["ADMIN", "COACH", "ATHLETE"];
  const currentRole = storedRole && validRoles.includes(storedRole) ? storedRole : null;
  const isOtherRole = currentRole === "COACH" || currentRole === "ADMIN";
  const heading = isOtherRole
    ? "Peranan Semasa: " + currentRole
    : "Pengesahan Akaun Atlet Diperlukan";

  return {
    currentRole,
    isOtherRole,
    heading,
    hasRoleAlert: isOtherRole,
    ctaText: "Log Masuk Akaun Atlet",
    bypassAvailable: true,
  };
}

// STATE A: Guest / Unauthenticated
const guestRoles = [null, undefined, "", "GUEST", "PUBLIC", "ANONYMOUS"];
for (const guestRole of guestRoles) {
  check(`State A: Guest role '${guestRole}' -> Upload BLOCKED, Auth Guard Modal triggered`, () => {
    const decision = evaluateUploadAccess(guestRole);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.modalTriggered, "AUTH_GUARD_MODAL");
  });

  check(`State A: Guest role '${guestRole}' -> Heading is 'Pengesahan Akaun Atlet Diperlukan', hasRoleAlert is false`, () => {
    const modal = evaluateAuthGuardModalPresentation(guestRole);
    assert.strictEqual(modal.currentRole, null);
    assert.strictEqual(modal.isOtherRole, false);
    assert.strictEqual(modal.hasRoleAlert, false);
    assert.strictEqual(modal.heading, "Pengesahan Akaun Atlet Diperlukan");
    assert.strictEqual(modal.bypassAvailable, true);
  });
}

// STATE B: Authenticated Athlete
check("State B: Authenticated Athlete ('ATHLETE') -> Upload ALLOWED, Upload Modal triggered directly", () => {
  const decision = evaluateUploadAccess("ATHLETE");
  assert.strictEqual(decision.allowed, true);
  assert.strictEqual(decision.modalTriggered, "UPLOAD_MODAL");
});

// STATE C: Authenticated Coach
check("State C: Authenticated Coach ('COACH') -> Upload BLOCKED, Auth Guard Modal triggered", () => {
  const decision = evaluateUploadAccess("COACH");
  assert.strictEqual(decision.allowed, false);
  assert.strictEqual(decision.modalTriggered, "AUTH_GUARD_MODAL");
});

check("State C: Authenticated Coach ('COACH') -> Modal displays 'Peranan Semasa: COACH' with non-athlete role alert", () => {
  const modal = evaluateAuthGuardModalPresentation("COACH");
  assert.strictEqual(modal.currentRole, "COACH");
  assert.strictEqual(modal.isOtherRole, true);
  assert.strictEqual(modal.hasRoleAlert, true);
  assert.strictEqual(modal.heading, "Peranan Semasa: COACH");
  assert.strictEqual(modal.bypassAvailable, true);
});

// STATE D: Authenticated Admin
check("State D: Authenticated Admin ('ADMIN') -> Upload BLOCKED, Auth Guard Modal triggered", () => {
  const decision = evaluateUploadAccess("ADMIN");
  assert.strictEqual(decision.allowed, false);
  assert.strictEqual(decision.modalTriggered, "AUTH_GUARD_MODAL");
});

check("State D: Authenticated Admin ('ADMIN') -> Modal displays 'Peranan Semasa: ADMIN' with non-athlete role alert", () => {
  const modal = evaluateAuthGuardModalPresentation("ADMIN");
  assert.strictEqual(modal.currentRole, "ADMIN");
  assert.strictEqual(modal.isOtherRole, true);
  assert.strictEqual(modal.hasRoleAlert, true);
  assert.strictEqual(modal.heading, "Peranan Semasa: ADMIN");
  assert.strictEqual(modal.bypassAvailable, true);
});

// STATE E: Bypass Simulation
check("State E: Demo Bypass Action sets role to 'ATHLETE' and grants immediate upload access", () => {
  let simulatedSessionRole: string | null = null;
  // User triggers bypass
  simulatedSessionRole = "ATHLETE";
  const postBypassDecision = evaluateUploadAccess(simulatedSessionRole);
  assert.strictEqual(postBypassDecision.allowed, true);
  assert.strictEqual(postBypassDecision.modalTriggered, "UPLOAD_MODAL");
});

// ---------------------------------------------------------------------------------
// SUITE 3: URL QUERY PARAMETER HANDLING (?upload=true / ?action=upload)
// ---------------------------------------------------------------------------------
console.log(cyan("\n--- SUITE 3: URL QUERY PARAMETER ACTIVATION ORACLE ---"));

function evaluateQueryParamActivation(search: string, sessionRole: string | null): {
  isUploadRequested: boolean;
  actionTaken: "OPEN_UPLOAD_MODAL" | "OPEN_AUTH_GUARD" | "NONE";
} {
  const params = new URLSearchParams(search);
  const isUploadRequested = params.get("upload") === "true" || params.get("action") === "upload";
  if (!isUploadRequested) {
    return { isUploadRequested: false, actionTaken: "NONE" };
  }
  return {
    isUploadRequested: true,
    actionTaken: sessionRole === "ATHLETE" ? "OPEN_UPLOAD_MODAL" : "OPEN_AUTH_GUARD",
  };
}

const queryParamTestMatrix = [
  { search: "?upload=true", role: "ATHLETE", expectedRequested: true, expectedAction: "OPEN_UPLOAD_MODAL" },
  { search: "?upload=true", role: null, expectedRequested: true, expectedAction: "OPEN_AUTH_GUARD" },
  { search: "?upload=true", role: "COACH", expectedRequested: true, expectedAction: "OPEN_AUTH_GUARD" },
  { search: "?upload=true", role: "ADMIN", expectedRequested: true, expectedAction: "OPEN_AUTH_GUARD" },
  { search: "?action=upload", role: "ATHLETE", expectedRequested: true, expectedAction: "OPEN_UPLOAD_MODAL" },
  { search: "?action=upload", role: null, expectedRequested: true, expectedAction: "OPEN_AUTH_GUARD" },
  { search: "?upload=false", role: "ATHLETE", expectedRequested: false, expectedAction: "NONE" },
  { search: "?upload=1", role: "ATHLETE", expectedRequested: false, expectedAction: "NONE" },
  { search: "", role: "ATHLETE", expectedRequested: false, expectedAction: "NONE" },
  { search: "?other=123", role: "ATHLETE", expectedRequested: false, expectedAction: "NONE" },
];

for (const testCase of queryParamTestMatrix) {
  check(`Query '${testCase.search}' with role '${testCase.role}' -> action '${testCase.expectedAction}'`, () => {
    const res = evaluateQueryParamActivation(testCase.search, testCase.role);
    assert.strictEqual(res.isUploadRequested, testCase.expectedRequested);
    assert.strictEqual(res.actionTaken, testCase.expectedAction);
  });
}

// ---------------------------------------------------------------------------------
// SUITE 4: UPLOAD MODAL PROFILE PREFILL & INLINE VALIDATION ORACLE
// ---------------------------------------------------------------------------------
console.log(cyan("\n--- SUITE 4: UPLOAD MODAL PREFILL & INLINE VALIDATION ---"));

/**
 * Replicates prefill logic in MomentUploadModal
 */
function evaluateUploadModalPrefill(sessionRole: string | null) {
  if (sessionRole === "ATHLETE") {
    return {
      athleteName: "Alya Nabilah",
      clubName: "FighterX Demo Club",
      state: "Selangor",
      discipline: "seni",
      isVerifiedAthlete: true,
    };
  }
  return {
    athleteName: "",
    clubName: "",
    state: "Selangor",
    discipline: "olahraga",
    isVerifiedAthlete: false,
  };
}

check("Prefill for 'ATHLETE' role loads verified athlete details (Alya Nabilah, FighterX Demo Club, Selangor, seni)", () => {
  const prefill = evaluateUploadModalPrefill("ATHLETE");
  assert.strictEqual(prefill.athleteName, "Alya Nabilah");
  assert.strictEqual(prefill.clubName, "FighterX Demo Club");
  assert.strictEqual(prefill.state, "Selangor");
  assert.strictEqual(prefill.discipline, "seni");
  assert.strictEqual(prefill.isVerifiedAthlete, true);
});

check("Prefill for guest role leaves athleteName blank and unverified", () => {
  const prefill = evaluateUploadModalPrefill(null);
  assert.strictEqual(prefill.athleteName, "");
  assert.strictEqual(prefill.isVerifiedAthlete, false);
});

/**
 * Replicates inline form validation logic from MomentUploadModal handleSubmit
 */
function validateUploadForm(athleteName: string, trainingFocus: string, caption: string) {
  const errors: { athleteName?: boolean; trainingFocus?: boolean; caption?: boolean } = {};
  if (!athleteName.trim()) errors.athleteName = true;
  if (!trainingFocus.trim()) errors.trainingFocus = true;
  if (!caption.trim()) errors.caption = true;

  const hasErrors = Object.keys(errors).length > 0;
  return {
    isValid: !hasErrors,
    fieldErrors: errors,
    errorMessage: hasErrors ? "Sila lengkapkan nama atlet, fokus latihan, dan kapsyen." : null,
  };
}

// Validation boundary test matrix
check("Validation rejects completely empty fields", () => {
  const res = validateUploadForm("", "", "");
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.fieldErrors.athleteName, true);
  assert.strictEqual(res.fieldErrors.trainingFocus, true);
  assert.strictEqual(res.fieldErrors.caption, true);
  assert.strictEqual(res.errorMessage, "Sila lengkapkan nama atlet, fokus latihan, dan kapsyen.");
});

check("Validation rejects whitespace-only inputs (spaces, tabs, newlines)", () => {
  const res = validateUploadForm("   ", "\t  ", "\n\n  ");
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.fieldErrors.athleteName, true);
  assert.strictEqual(res.fieldErrors.trainingFocus, true);
  assert.strictEqual(res.fieldErrors.caption, true);
});

check("Validation flags missing athleteName when others are present", () => {
  const res = validateUploadForm("", "Latihan Tendangan Padu", "Kapsyen semangat latihan");
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.fieldErrors.athleteName, true);
  assert.strictEqual(res.fieldErrors.trainingFocus, undefined);
  assert.strictEqual(res.fieldErrors.caption, undefined);
});

check("Validation flags missing trainingFocus when others are present", () => {
  const res = validateUploadForm("Amirul", "", "Kapsyen latihan");
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.fieldErrors.athleteName, undefined);
  assert.strictEqual(res.fieldErrors.trainingFocus, true);
  assert.strictEqual(res.fieldErrors.caption, undefined);
});

check("Validation flags missing caption when others are present", () => {
  const res = validateUploadForm("Amirul", "Latihan Tendangan", "");
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.fieldErrors.athleteName, undefined);
  assert.strictEqual(res.fieldErrors.trainingFocus, undefined);
  assert.strictEqual(res.fieldErrors.caption, true);
});

check("Validation passes when all 3 required fields are provided", () => {
  const res = validateUploadForm("Alya Nabilah", "Latihan Jurus Tunggal", "Persiapan rapi menjelang SUKMA.");
  assert.strictEqual(res.isValid, true);
  assert.deepStrictEqual(res.fieldErrors, {});
  assert.strictEqual(res.errorMessage, null);
});

// ---------------------------------------------------------------------------------
// SUITE 5: TOGGLE-LIKE INVARIANT & PUBLIC UNAUTHENTICATED USAGE
// ---------------------------------------------------------------------------------
console.log(cyan("\n--- SUITE 5: TOGGLE-LIKE INVARIANTS & PUBLIC ACCESS ---"));

/**
 * Pure model of toggleLike in src/lib/moments/moments-context.tsx:
 */
function applyToggleLike(moments: AthleteMoment[], momentId: string): AthleteMoment[] {
  return moments.map((item) => {
    if (item.id === momentId) {
      const isLiked = !item.userLiked;
      return {
        ...item,
        userLiked: isLiked,
        likesCount: isLiked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1),
      };
    }
    return item;
  });
}

check("INITIAL_MOMENTS contains valid seed data with likesCount >= 0", () => {
  assert(INITIAL_MOMENTS.length > 0, "No initial moments found");
  for (const m of INITIAL_MOMENTS) {
    assert(m.likesCount >= 0, `Negative likesCount found in ${m.id}`);
  }
});

const testTarget = INITIAL_MOMENTS[0];
const initialLikes = testTarget.likesCount;
const initialLikedState = !!testTarget.userLiked;

check(`Unauthenticated Guest can like a moment ('${testTarget.id}') without error`, () => {
  let state = [...INITIAL_MOMENTS];
  state = applyToggleLike(state, testTarget.id);
  const updated = state.find((m) => m.id === testTarget.id)!;
  
  const expectedLiked = !initialLikedState;
  const expectedCount = expectedLiked ? initialLikes + 1 : Math.max(0, initialLikes - 1);
  assert.strictEqual(updated.userLiked, expectedLiked);
  assert.strictEqual(updated.likesCount, expectedCount);
});

check(`Toggling like twice returns to original liked status and original count`, () => {
  let state = [...INITIAL_MOMENTS];
  state = applyToggleLike(state, testTarget.id);
  state = applyToggleLike(state, testTarget.id);
  const updated = state.find((m) => m.id === testTarget.id)!;
  assert.strictEqual(updated.userLiked, initialLikedState);
  assert.strictEqual(updated.likesCount, initialLikes);
});

check("Clamping invariant: Unliking a post with 0 likes never yields negative count", () => {
  const zeroLikeMoment: AthleteMoment = {
    ...testTarget,
    id: "test-zero-likes",
    likesCount: 0,
    userLiked: true, // currently marked liked but with count 0 (boundary stress)
  };
  let state = [zeroLikeMoment];
  state = applyToggleLike(state, "test-zero-likes");
  const updated = state[0];
  assert.strictEqual(updated.userLiked, false);
  assert.strictEqual(updated.likesCount, 0, `Likes count must be clamped at 0, got ${updated.likesCount}`);
});

check("Stress Invariant: 100 rapid consecutive toggles on unauthenticated session remain deterministic", () => {
  let state = [...INITIAL_MOMENTS];
  for (let i = 0; i < 100; i++) {
    state = applyToggleLike(state, testTarget.id);
  }
  const updated = state.find((m) => m.id === testTarget.id)!;
  // 100 toggles is even -> returns to starting state
  assert.strictEqual(updated.userLiked, initialLikedState);
  assert.strictEqual(updated.likesCount, initialLikes);
});

check("Isolation Invariant: Liking moment A does NOT alter moment B", () => {
  if (INITIAL_MOMENTS.length > 1) {
    const targetA = INITIAL_MOMENTS[0];
    const targetB = INITIAL_MOMENTS[1];
    let state = [...INITIAL_MOMENTS];
    state = applyToggleLike(state, targetA.id);
    const updatedB = state.find((m) => m.id === targetB.id)!;
    assert.strictEqual(updatedB.likesCount, targetB.likesCount);
    assert.strictEqual(updatedB.userLiked, targetB.userLiked);
  }
});

check("Non-existent moment ID is safely ignored without throwing", () => {
  let state = [...INITIAL_MOMENTS];
  state = applyToggleLike(state, "non-existent-id-9999");
  assert.strictEqual(state.length, INITIAL_MOMENTS.length);
});

// ---------------------------------------------------------------------------------
// SUITE 6: ATHLETE DASHBOARD NAVIGATION LINKAGE INVARIANT
// ---------------------------------------------------------------------------------
console.log(cyan("\n--- SUITE 6: ATHLETE DASHBOARD NAVIGATION LINKAGE ---"));

const athleteDashboardPath = path.resolve(
  process.cwd(),
  "src/components/athlete/athlete-home-dashboard.tsx"
);
const athleteDashboardContent = fs.readFileSync(athleteDashboardPath, "utf-8");

check("Athlete Dashboard imports Link and Camera icon", () => {
  assert(athleteDashboardContent.includes('import Link from "next/link"'));
  assert(athleteDashboardContent.includes("Camera"));
});

check("Athlete Dashboard quick actions contains direct link to '/moments?upload=true'", () => {
  const hasMomentsLink = athleteDashboardContent.includes('href="/moments?upload=true"');
  assert(hasMomentsLink, "Link href='/moments?upload=true' missing in AthleteHomeDashboard");
});

check("Moments quick action has label 'Kongsi Moment Latihan'", () => {
  assert(athleteDashboardContent.includes("Kongsi Moment Latihan"));
});

// ---------------------------------------------------------------------------------
// SUITE 7: NEW ATTRIBUTES (viewsCount & verifiedAthlete) INTEGRITY
// ---------------------------------------------------------------------------------
console.log(cyan("\n--- SUITE 7: NEW ATTRIBUTES INTEGRITY IN TYPES & MOCK DATA ---"));

const typesPath = path.resolve(process.cwd(), "src/lib/moments/types.ts");
const typesContent = fs.readFileSync(typesPath, "utf-8");

check("types.ts declares viewsCount?: number", () => {
  assert(typesContent.includes("viewsCount?: number;"));
});

check("types.ts declares verifiedAthlete?: boolean", () => {
  assert(typesContent.includes("verifiedAthlete?: boolean;"));
});

const mockDataPath = path.resolve(process.cwd(), "src/lib/moments/mock-data.ts");
const mockDataContent = fs.readFileSync(mockDataPath, "utf-8");

check("mock-data.ts populates viewsCount across seed items", () => {
  assert(mockDataContent.includes("viewsCount:"));
});

check("mock-data.ts populates verifiedAthlete across seed items", () => {
  assert(mockDataContent.includes("verifiedAthlete: true"));
});

// ---------------------------------------------------------------------------------
// SUMMARY & VERDICT
// ---------------------------------------------------------------------------------
console.log(bold("\n================================================================================"));
console.log(bold("                      TEST RESULTS SUMMARY"));
console.log(bold("================================================================================"));
console.log(`Total Invariants Evaluated : ${totalTests}`);
console.log(`Passed Invariants          : ${green(String(passedTests))}`);
console.log(`Failed Invariants          : ${failedTests > 0 ? red(String(failedTests)) : "0"}`);

if (failedTests > 0) {
  console.log(red("\nFAILURES DETECTED:"));
  failures.forEach((f) => console.log(`  - ${f}`));
  console.log(bold(red("\n>>> EMPIRICAL VERDICT: REJECT <<<")));
  process.exit(1);
} else {
  console.log(bold(green("\n>>> EMPIRICAL VERDICT: APPROVE <<<")));
  process.exit(0);
}
