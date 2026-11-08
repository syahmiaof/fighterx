/**
 * FighterX SiteHeader Navigation & Universal QA Test Suite
 * 
 * Validates:
 * 1. Universal public route coverage across desktop navigation and mobile drawer
 * 2. Sliding red pill active indicator implementation and bounding-box calculation
 * 3. Mobile navigation drawer accessibility (ARIA attributes, touch targets, ESC handler)
 * 4. Active state resolution across all public routes (including route aliases)
 * 5. Inter-page routing integrity across all public modules
 * 6. Dual-export compatibility (src/components/layout/site-header.tsx & src/components/site-header.tsx)
 */

import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(__dirname, "..");

// ANSI formatting helpers
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string): void {
  totalTests++;
  if (!condition) {
    failedTests++;
    console.error(`  ${red("✗ FAIL")}: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`  ${green("✓ PASS")}: ${message}`);
}

function assertIncludes(haystack: string, needle: string, message: string): void {
  assert(haystack.includes(needle), `${message} (Expected to find "${needle}")`);
}

async function runSiteHeaderTests() {
  console.log("");
  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("   FIGHTERX SITEHEADER NAVIGATION & UNIVERSAL QA TEST SUITE")));
  console.log(bold(cyan("================================================================================")));
  console.log("");

  const headerSourcePath = path.join(REPO_ROOT, "src/components/layout/site-header.tsx");
  const reexportSourcePath = path.join(REPO_ROOT, "src/components/site-header.tsx");

  assert(fs.existsSync(headerSourcePath), "Primary SiteHeader file exists at src/components/layout/site-header.tsx");
  assert(fs.existsSync(reexportSourcePath), "Re-export SiteHeader file exists at src/components/site-header.tsx");

  const headerContent = fs.readFileSync(headerSourcePath, "utf-8");
  const reexportContent = fs.readFileSync(reexportSourcePath, "utf-8");

  // --- SECTION 1: Dual Export Integrity ---
  console.log(bold("\n--- 1. Dual Export & Import Path Compatibility ---"));
  assertIncludes(
    reexportContent,
    'export { SiteHeader } from "@/components/layout/site-header"',
    "src/components/site-header.tsx correctly re-exports SiteHeader component"
  );
  assertIncludes(
    reexportContent,
    'export type { SiteHeaderProps, SiteHeaderPage } from "@/components/layout/site-header"',
    "src/components/site-header.tsx correctly re-exports SiteHeaderProps and SiteHeaderPage types"
  );

  // --- SECTION 2: Universal Public Routes in Desktop Navigation ---
  console.log(bold("\n--- 2. Universal Desktop Navigation Route Coverage ---"));
  const expectedPublicRoutes = [
    { name: "Utama / Home", href: 'href="/"', key: '"home"' },
    { name: "Guidelines / Rules", href: 'href="/guidelines"', key: '"guidelines"' },
    { name: "Knowledge Hub", href: 'href="/knowledge"', key: '"knowledge"' },
    { name: "Leaderboard Kebangsaan", href: 'href="/leaderboard"', key: '"leaderboard"' },
    { name: "Kalendar Kejohanan", href: 'href="/competitions"', key: '"competitions"' },
    { name: "Kolaborasi & Rakan", href: 'href="/collaboration"', key: '"collaboration"' },
    { name: "Direktori Persatuan", href: 'href="/associations"', key: '"associations"' },
    { name: "Disiplin Silat", href: 'href="/disciplines"', key: '"disciplines"' },
  ];

  for (const route of expectedPublicRoutes) {
    assertIncludes(
      headerContent,
      route.href,
      `Desktop header navigation contains link for ${route.name} (${route.href})`
    );
  }

  // --- SECTION 3: CTA Buttons in Header Actions ---
  console.log(bold("\n--- 3. Header Action CTA Buttons ---"));
  assertIncludes(headerContent, 'href="/login"', "Header contains Sign In action link (/login)");
  assertIncludes(headerContent, 'href="/register-club"', "Header contains Register Club primary button (/register-club)");
  assertIncludes(headerContent, "button-primary", "Register Club CTA uses button-primary class styling");

  // --- SECTION 4: Sliding Red Pill Indicator ---
  console.log(bold("\n--- 4. Sliding Red Pill Active Indicator ---"));
  assertIncludes(headerContent, "header-active-indicator", "Header renders .header-active-indicator element");
  assertIncludes(headerContent, "ResizeObserver", "Indicator recalculates bounds dynamically using ResizeObserver");
  assertIncludes(headerContent, "getBoundingClientRect", "Indicator uses getBoundingClientRect for precise pill placement");
  assertIncludes(headerContent, "linear-gradient(90deg, #ff3845", "Indicator uses glowing crimson gradient");
  assertIncludes(headerContent, "border-radius: 999px", "Indicator has rounded pill geometry");
  assertIncludes(headerContent, "hoveredHref", "Indicator tracks hovered link with smooth return to active link");

  // --- SECTION 5: Mobile Navigation Drawer & Accessibility ---
  console.log(bold("\n--- 5. Mobile Navigation Drawer & Accessibility ---"));
  assertIncludes(headerContent, "mobile-menu-toggle", "Mobile menu toggle button exists with proper class");
  assertIncludes(headerContent, 'aria-controls="mobile-nav"', "Mobile toggle has aria-controls referencing mobile-nav");
  assertIncludes(headerContent, "aria-expanded={menuOpen}", "Mobile toggle has dynamic aria-expanded attribute");
  assertIncludes(headerContent, 'id="mobile-nav"', "Mobile navigation element has id='mobile-nav'");
  assertIncludes(headerContent, "aria-hidden={!menuOpen}", "Mobile navigation element manages aria-hidden properly");
  assertIncludes(headerContent, 'e.key === "Escape"', "Mobile drawer closes cleanly on Escape key press");
  assertIncludes(headerContent, "handleClickOutside", "Mobile drawer closes on click outside header");

  // --- SECTION 6: Target Page File System Verification ---
  console.log(bold("\n--- 6. Target Page Route Integrity (Disk Inspection) ---"));
  const requiredPageFiles = [
    "src/app/page.tsx",
    "src/app/guidelines/page.tsx",
    "src/app/knowledge/page.tsx",
    "src/app/leaderboard/page.tsx",
    "src/app/competitions/page.tsx",
    "src/app/collaboration/page.tsx",
    "src/app/associations/page.tsx",
    "src/app/disciplines/page.tsx",
    "src/app/login/page.tsx",
    "src/app/register-club/page.tsx",
    "src/app/my-club/page.tsx",
    "src/app/calendar/page.tsx",
    "src/app/knowledge-hub/page.tsx",
  ];

  for (const relPath of requiredPageFiles) {
    const fullPath = path.join(REPO_ROOT, relPath);
    assert(fs.existsSync(fullPath), `Target route page file exists on disk: ${relPath}`);
  }

  // --- SECTION 7: Universal Homepage Inter-Page Navigation Mesh ---
  console.log(bold("\n--- 7. Universal Homepage Inter-Page Navigation Mesh ---"));
  const homePagePath = path.join(REPO_ROOT, "src/components/homepage/home-page.tsx");
  assert(fs.existsSync(homePagePath), "home-page.tsx exists");
  const homePageContent = fs.readFileSync(homePagePath, "utf-8");

  assertIncludes(homePageContent, 'href="/register-club"', "Homepage contains link to /register-club");
  assertIncludes(homePageContent, 'href="/associations"', "Homepage contains link to /associations");
  assertIncludes(homePageContent, 'href="/guidelines"', "Homepage contains link to /guidelines");
  assertIncludes(homePageContent, 'href="/disciplines"', "Homepage contains link to /disciplines");

  // Summary
  console.log("");
  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("                           TEST RUN SUMMARY")));
  console.log(bold(cyan("================================================================================")));
  console.log(`  Total Checks: ${bold(String(totalTests))}`);
  console.log(`  Passed:       ${green(String(passedTests))}`);
  console.log(`  Failed:       ${failedTests > 0 ? red(String(failedTests)) : dim("0")}`);
  console.log("");

  if (failedTests > 0) {
    console.error(red(`\n❌ SUITE FAILED: ${failedTests} assertion(s) failed.`));
    process.exit(1);
  } else {
    console.log(green(`\n✅ SUITE PASSED: All ${passedTests} SiteHeader & Universal QA checks passed cleanly!`));
    process.exit(0);
  }
}

runSiteHeaderTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
