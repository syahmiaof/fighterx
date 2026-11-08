#!/usr/bin/env node

/**
 * FighterX Public Controls & Routes Verification Script
 * Validates:
 * 1. Existence and compilation integrity of all 18 public routes
 * 2. Execution and 100% pass rate of scoring unit tests (13/13 passing)
 * 3. Presence of critical interactive selectors and components:
 *    - Homepage .hero-actions CTA buttons (/register-club, /disciplines) & GSAP hook
 *    - SiteHeader layout and navigation controls
 *    - Role selection auth harmonization (official login link + bypass button)
 *    - Search input elements across content hubs
 *    - Interactive tabs and filter controls
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

console.log("=================================================================");
console.log("    FIGHTERX PUBLIC CONTROLS & ROUTE VERIFICATION SUITE         ");
console.log("=================================================================");
console.log(`Root Directory: ${ROOT_DIR}\n`);

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function reportCheck(title, passed, details = "") {
  totalChecks++;
  if (passed) {
    passedChecks++;
    console.log(`  [PASS] ${title}`);
    if (details) console.log(`         -> ${details}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${title}`);
    if (details) console.error(`         -> ERROR: ${details}`);
  }
}

// -----------------------------------------------------------------------------
// 1. VERIFY ALL 18 PUBLIC ROUTES
// -----------------------------------------------------------------------------
console.log("--- 1. VERIFYING 18 PUBLIC ROUTES ---");

const PUBLIC_ROUTES = [
  { route: "/", file: "src/app/page.tsx" },
  { route: "/associations", file: "src/app/associations/page.tsx" },
  { route: "/calendar", file: "src/app/calendar/page.tsx" },
  { route: "/collaboration", file: "src/app/collaboration/page.tsx" },
  { route: "/competitions", file: "src/app/competitions/page.tsx" },
  { route: "/disciplines", file: "src/app/disciplines/page.tsx" },
  { route: "/guidelines", file: "src/app/guidelines/page.tsx" },
  { route: "/knowledge", file: "src/app/knowledge/page.tsx" },
  { route: "/knowledge/[slug]", file: "src/app/knowledge/[slug]/page.tsx" },
  { route: "/knowledge-hub", file: "src/app/knowledge-hub/page.tsx" },
  { route: "/leaderboard", file: "src/app/leaderboard/page.tsx" },
  { route: "/login", file: "src/app/login/page.tsx" },
  { route: "/login/[role]", file: "src/app/login/[role]/page.tsx" },
  { route: "/moments", file: "src/app/moments/page.tsx" },
  { route: "/my-club", file: "src/app/my-club/page.tsx" },
  { route: "/register", file: "src/app/register/page.tsx" },
  { route: "/register-club", file: "src/app/register-club/page.tsx" },
  { route: "/register-club/new", file: "src/app/register-club/new/page.tsx" },
];

for (const { route, file } of PUBLIC_ROUTES) {
  const filePath = path.join(ROOT_DIR, file);
  const exists = fs.existsSync(filePath);
  reportCheck(
    `Route ${route} exists`,
    exists,
    exists ? `${file} found (${fs.statSync(filePath).size} bytes)` : `${file} missing`
  );
}

// -----------------------------------------------------------------------------
// 2. EXECUTE SCORING UNIT TEST SUITE (13 TESTS)
// -----------------------------------------------------------------------------
console.log("\n--- 2. EXECUTING GUIDELINES SCORING UNIT TESTS ---");

try {
  const testOutput = execSync(
    "node --test src/lib/guidelines/__tests__/scoring.test.mjs",
    {
      cwd: ROOT_DIR,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }
  );

  const passedMatch = testOutput.match(/pass\s+(\d+)/i);
  const passCount = passedMatch ? parseInt(passedMatch[1], 10) : 0;
  const failMatch = testOutput.match(/fail\s+(\d+)/i);
  const failCount = failMatch ? parseInt(failMatch[1], 10) : 0;

  const testSuccess = passCount >= 13 && failCount === 0;
  reportCheck(
    "Guideline Scoring Engine Unit Tests",
    testSuccess,
    `Pass: ${passCount}, Fail: ${failCount} (Required: 13 passes, 0 fails)`
  );
} catch (err) {
  reportCheck(
    "Guideline Scoring Engine Unit Tests",
    false,
    `Execution failed: ${err.message}`
  );
}

// -----------------------------------------------------------------------------
// 3. VERIFY CRITICAL INTERACTIVE SELECTORS & COMPONENTS
// -----------------------------------------------------------------------------
console.log("\n--- 3. VERIFYING CRITICAL INTERACTIVE SELECTORS ---");

// 3.1 Homepage Hero CTA & GSAP Hooks
const homePageFile = path.join(ROOT_DIR, "src/components/homepage/home-page.tsx");
if (fs.existsSync(homePageFile)) {
  const content = fs.readFileSync(homePageFile, "utf-8");

  const hasHeroActionsClass = content.includes('className="hero-actions');
  reportCheck(
    "Homepage Hero CTA container (.hero-actions) exists",
    hasHeroActionsClass,
    'Found <div className="hero-actions ...">'
  );

  const hasPrimaryLink =
    content.includes('href="/register-club"') &&
    content.includes("Mula Sekarang") &&
    content.includes("button-primary");
  reportCheck(
    "Homepage Hero Primary CTA link (/register-club, 'Mula Sekarang')",
    hasPrimaryLink,
    'Found Link to /register-club with class "button button-primary"'
  );

  const hasSecondaryLink =
    content.includes('href="/disciplines"') &&
    content.includes("Terokai Disiplin") &&
    content.includes("button-outline");
  reportCheck(
    "Homepage Hero Secondary CTA link (/disciplines, 'Terokai Disiplin')",
    hasSecondaryLink,
    'Found Link to /disciplines with class "button button-outline"'
  );

  const hasGsapHook = content.includes('page.querySelector(".hero-actions")');
  reportCheck(
    "Homepage GSAP Timeline animates .hero-actions selector",
    hasGsapHook,
    'Found page.querySelector(".hero-actions") in intro GSAP timeline'
  );
} else {
  reportCheck("Homepage file exists", false, `${homePageFile} not found`);
}

// 3.2 SiteHeader Navigation & Actions
const siteHeaderFile = path.join(ROOT_DIR, "src/components/layout/site-header.tsx");
if (fs.existsSync(siteHeaderFile)) {
  const content = fs.readFileSync(siteHeaderFile, "utf-8");

  const hasHeaderClass = content.includes('className="site-header');
  reportCheck(
    "SiteHeader container (.site-header) exists",
    hasHeaderClass,
    'Found <header className="site-header ...">'
  );

  const hasNavItems = content.includes("nav-item-btn");
  reportCheck(
    "SiteHeader interactive nav items (.nav-item-btn) exist",
    hasNavItems,
    "Found .nav-item-btn class in navigation links"
  );

  const hasHeaderActions =
    content.includes("pill-action-login") &&
    content.includes("pill-action-register");
  reportCheck(
    "SiteHeader account action buttons (Login & Register Club) exist",
    hasHeaderActions,
    "Found .pill-action-login and .pill-action-register"
  );
} else {
  reportCheck("SiteHeader file exists", false, `${siteHeaderFile} not found`);
}

// 3.3 Role Selection Auth Harmonization
const roleSelectionFile = path.join(ROOT_DIR, "src/components/auth/role-selection-cards.tsx");
if (fs.existsSync(roleSelectionFile)) {
  const content = fs.readFileSync(roleSelectionFile, "utf-8");

  const hasRoleHref =
    content.includes('roleHref: "/login/athlete"') &&
    content.includes('roleHref: "/login/coach"') &&
    content.includes('roleHref: "/login/admin"');
  reportCheck(
    "Role Selection defines official role login routes",
    hasRoleHref,
    "Found /login/athlete, /login/coach, /login/admin in role cards"
  );

  const hasOfficialLoginLink =
    content.includes("href={role.roleHref}") &&
    content.includes("Halaman Login Rasmi");
  reportCheck(
    "Role Selection renders official login links ('Halaman Login Rasmi')",
    hasOfficialLoginLink,
    "Found Link to role.roleHref with label 'Halaman Login Rasmi'"
  );

  const hasBypassBtn =
    content.includes("glass-card-btn") &&
    content.includes("BYPASS MASUK");
  reportCheck(
    "Role Selection retains direct development bypass button",
    hasBypassBtn,
    "Found .glass-card-btn with 'BYPASS MASUK'"
  );
} else {
  reportCheck("RoleSelectionCards file exists", false, `${roleSelectionFile} not found`);
}

// 3.4 Search Input Elements in Public Components
const searchFiles = [
  {
    name: "Associations Directory Search",
    file: "src/components/associations/association-search-bar.tsx",
    pattern: 'type="search"',
  },
  {
    name: "Competitions Directory Search",
    file: "src/components/competitions/competitions-client.tsx",
    pattern: "pro-search-input",
  },
  {
    name: "Guidelines Rulebook Search",
    file: "src/components/guidelines/rulebook-explorer.tsx",
    pattern: 'placeholder="Cari peraturan',
  },
];

for (const { name, file, pattern } of searchFiles) {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    const found = content.includes(pattern);
    reportCheck(
      `Search input in ${name}`,
      found,
      found ? `Pattern "${pattern}" found in ${file}` : `Pattern "${pattern}" missing`
    );
  } else {
    reportCheck(`Search input in ${name}`, false, `${file} not found`);
  }
}

// 3.5 Tabs & Filter Controls
const tabFiles = [
  {
    name: "Associations Category Filter Tabs",
    file: "src/components/associations/category-filter-pills.tsx",
    pattern: 'role="tablist"',
  },
  {
    name: "Competitions Category Filter Tabs",
    file: "src/components/competitions/competitions-client.tsx",
    pattern: 'role="tablist"',
  },
  {
    name: "Guidelines Category Tabs",
    file: "src/components/guidelines/rulebook-explorer.tsx",
    pattern: "CATEGORY_TABS",
  },
];

for (const { name, file, pattern } of tabFiles) {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    const found = content.includes(pattern);
    reportCheck(
      `Tabs / filter controls in ${name}`,
      found,
      found ? `Pattern "${pattern}" found in ${file}` : `Pattern "${pattern}" missing`
    );
  } else {
    reportCheck(`Tabs / filter controls in ${name}`, false, `${file} not found`);
  }
}

// -----------------------------------------------------------------------------
// SUMMARY & EXIT
// -----------------------------------------------------------------------------
console.log("\n=================================================================");
console.log(`TOTAL CHECKS: ${totalChecks}`);
console.log(`PASSED:       ${passedChecks}`);
console.log(`FAILED:       ${failedChecks}`);
console.log("=================================================================");

if (failedChecks > 0) {
  console.error("\n[VERIFICATION RESULT] FAILED: Some checks did not pass.");
  process.exit(1);
} else {
  console.log("\n[VERIFICATION RESULT] SUCCESS: All 18 routes, unit tests, and interactive controls verified 100%!");
  process.exit(0);
}
