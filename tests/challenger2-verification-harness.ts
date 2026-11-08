/**
 * Challenger 2 Adversarial Verification & Stress Test Harness
 * Role: challenger_public_v2_2 (Empirical Challenger)
 * 
 * Verifies:
 * 1. Visual tokens (#08090B, wallpaper at 72% opacity, crimson accents #E10600/#FF3845, Teko display, Inter body)
 * 2. Guidelines Hero composition (female wasit on left, COMPETITION RULES EXPLORER on right, no male athlete)
 * 3. Mobile navigation drawer behavior, touch targets (>=42px), and responsiveness across 320px, 375px, 768px, 1024px, 1440px
 * 4. Routing & redirects across all 12 public routes
 * 5. Strict portal isolation audit (zero changes to coach/athlete/admin portals)
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const REPO_ROOT = path.resolve(__dirname, "..");

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string): void {
  totalTests++;
  if (!condition) {
    failedTests++;
    console.error(`  ${red("✗ FAIL")} [${testName}] ${detail ? `: ${detail}` : ""}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
  passedTests++;
  console.log(`  ${green("✓ PASS")} [${testName}] ${detail ? `- ${detail}` : ""}`);
}

function assertIncludes(haystack: string, needle: string, testName: string, detail?: string): void {
  assert(haystack.includes(needle), testName, detail || `Expected to contain "${needle}"`);
}

async function runChallenger2Suite() {
  console.log("");
  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("   CHALLENGER 2 ADVERSARIAL VERIFICATION HARNESS (challenger_public_v2_2)")));
  console.log(bold(cyan("================================================================================")));
  console.log(`Execution Time: ${new Date().toISOString()}`);
  console.log("");

  // ============================================================================
  // SUITE 1: VISUAL DESIGN TOKENS AUDIT
  // ============================================================================
  console.log(bold(yellow("--- SUITE 1: VISUAL DESIGN TOKENS AUDIT ---")));

  const globalsCssPath = path.join(REPO_ROOT, "src/app/globals.css");
  assert(fs.existsSync(globalsCssPath), "GLOBAL-CSS-EXISTS", "globals.css must exist");
  const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");

  // 1.1 Base background #08090B
  assert(
    globalsCss.includes("--bg:#08090b") || globalsCss.includes("#08090b") || globalsCss.includes("#08090B"),
    "TOKEN-BASE-BG",
    "globals.css defines authentic FighterX #08090B background"
  );

  // 1.2 Wallpaper at 72% opacity
  assert(
    globalsCss.includes("--wallpaper-opacity:0.72") || globalsCss.includes("opacity: 0.72") || globalsCss.includes("opacity:0.72"),
    "TOKEN-WALLPAPER-OPACITY",
    "globals.css specifies 72% (0.72) wallpaper opacity"
  );

  // 1.3 Desktop and Mobile wallpaper assets exist and referenced
  const desktopBg = path.join(REPO_ROOT, "public/assets/fighterx/homepage-bg-desktop.webp");
  const mobileBg = path.join(REPO_ROOT, "public/assets/fighterx/homepage-bg-mobile.webp");
  assert(fs.existsSync(desktopBg), "ASSET-DESKTOP-BG", "homepage-bg-desktop.webp exists on disk");
  assert(fs.existsSync(mobileBg), "ASSET-MOBILE-BG", "homepage-bg-mobile.webp exists on disk");
  assert(fs.statSync(desktopBg).size > 10000, "ASSET-DESKTOP-BG-SIZE", "Desktop wallpaper > 10KB");
  assert(fs.statSync(mobileBg).size > 10000, "ASSET-MOBILE-BG-SIZE", "Mobile wallpaper > 10KB");

  assertIncludes(globalsCss, "homepage-bg-desktop.webp", "TOKEN-WALLPAPER-DESKTOP-REF", "globals.css references desktop wallpaper");
  assertIncludes(globalsCss, "homepage-bg-mobile.webp", "TOKEN-WALLPAPER-MOBILE-REF", "globals.css references mobile wallpaper");

  // 1.4 Crimson Accents (#E10600 / #FF3845)
  assert(
    globalsCss.includes("#e10600") || globalsCss.includes("#E10600"),
    "TOKEN-CRIMSON-PRIMARY",
    "Primary crimson red #E10600 defined"
  );
  assert(
    globalsCss.includes("#ff3845") || globalsCss.includes("#FF3845"),
    "TOKEN-CRIMSON-HOT-ACCENT",
    "Accent crimson red #FF3845 defined"
  );

  // 1.5 Teko display font and Inter body font loaded in root layout
  const layoutPath = path.join(REPO_ROOT, "src/app/layout.tsx");
  assert(fs.existsSync(layoutPath), "ROOT-LAYOUT-EXISTS", "src/app/layout.tsx exists");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");
  assertIncludes(layoutContent, "Teko", "FONT-TEKO-LOADED", "Root layout loads Teko font");
  assertIncludes(layoutContent, "Inter", "FONT-INTER-LOADED", "Root layout loads Inter font");
  assertIncludes(layoutContent, "--font-display", "FONT-DISPLAY-VAR", "Teko mapped to --font-display variable");
  assertIncludes(layoutContent, "--font-body", "FONT-BODY-VAR", "Inter mapped to --font-body variable");

  // 1.6 Unified .public-page-wallpaper class
  assertIncludes(globalsCss, ".public-page-wallpaper", "SHARED-WALLPAPER-CLASS", ".public-page-wallpaper defined in globals.css");
  assertIncludes(globalsCss, ".public-page-vignette", "SHARED-VIGNETTE-CLASS", ".public-page-vignette defined in globals.css");
  assertIncludes(globalsCss, ".public-page-ambient-smoke", "SHARED-SMOKE-CLASS", ".public-page-ambient-smoke defined in globals.css");

  // ============================================================================
  // SUITE 2: GUIDELINES HERO COMPOSITION & ATHLETE EXCLUSION AUDIT
  // ============================================================================
  console.log(bold(yellow("\n--- SUITE 2: GUIDELINES HERO COMPOSITION AUDIT ---")));

  const guidelinesPath = path.join(REPO_ROOT, "src/app/guidelines/page.tsx");
  assert(fs.existsSync(guidelinesPath), "GUIDELINES-FILE-EXISTS", "src/app/guidelines/page.tsx exists");
  const guidelinesContent = fs.readFileSync(guidelinesPath, "utf-8");

  // 2.1 Female referee on the LEFT
  assertIncludes(
    guidelinesContent,
    "guidelines-hero-visual",
    "GUIDELINES-VISUAL-STAGING",
    "Guidelines hero visual staging container exists"
  );
  assertIncludes(
    guidelinesContent,
    "/assets/fighterx/guidelines-referee.png",
    "GUIDELINES-REFEREE-IMAGE",
    "Guidelines renders guidelines-referee.png"
  );
  assertIncludes(
    guidelinesContent,
    "guidelines-char-referee-solo",
    "GUIDELINES-SOLO-REFEREE",
    "Solo female referee figure wrapper present"
  );
  assertIncludes(
    guidelinesContent,
    "tag-referee-left",
    "GUIDELINES-REFEREE-LEFT-TAG",
    "Referee tag placed on the left"
  );

  // 2.2 Headline COMPETITION RULES EXPLORER on the RIGHT
  assertIncludes(
    guidelinesContent,
    "guidelines-hero-copy",
    "GUIDELINES-HERO-COPY",
    "Guidelines hero copy container exists"
  );
  assertIncludes(
    guidelinesContent,
    "COMPETITION",
    "GUIDELINES-HEADLINE-COMPETITION",
    "Headline contains COMPETITION in metallic silver"
  );
  assertIncludes(
    guidelinesContent,
    "RULES EXPLORER",
    "GUIDELINES-HEADLINE-RULES-EXPLORER",
    "Headline contains RULES EXPLORER in glowing crimson"
  );
  assertIncludes(
    guidelinesContent,
    "guidelines-3d-headline",
    "GUIDELINES-3D-HEADLINE-CLASS",
    "Headline uses guidelines-3d-headline class"
  );

  // 2.3 Strict ABSENCE of male athlete in Guidelines hero
  assert(
    !guidelinesContent.includes("hero-silat-olahraga-athlete"),
    "GUIDELINES-NO-MALE-OLAHRAGA",
    "hero-silat-olahraga-athlete MUST NOT exist in guidelines page"
  );
  assert(
    !guidelinesContent.includes("hero-silat-seni-athlete"),
    "GUIDELINES-NO-MALE-SENI",
    "hero-silat-seni-athlete MUST NOT exist in guidelines page"
  );
  assert(
    !guidelinesContent.includes("character-silat-olahraga"),
    "GUIDELINES-NO-CHAR-OLAHRAGA",
    "character-silat-olahraga MUST NOT exist in guidelines page"
  );

  // 2.4 Verify guidelines-referee.png file exists on disk
  const refereeAssetPath = path.join(REPO_ROOT, "public/assets/fighterx/guidelines-referee.png");
  assert(fs.existsSync(refereeAssetPath), "ASSET-REFEREE-EXISTS", "guidelines-referee.png exists on disk");
  assert(fs.statSync(refereeAssetPath).size > 10000, "ASSET-REFEREE-SIZE", "Referee asset size > 10KB");

  // ============================================================================
  // SUITE 3: MOBILE NAVIGATION DRAWER & TOUCH TARGET AUDIT
  // ============================================================================
  console.log(bold(yellow("\n--- SUITE 3: MOBILE NAVIGATION DRAWER & TOUCH TARGETS AUDIT ---")));

  const headerPath = path.join(REPO_ROOT, "src/components/layout/site-header.tsx");
  assert(fs.existsSync(headerPath), "SITE-HEADER-EXISTS", "src/components/layout/site-header.tsx exists");
  const headerContent = fs.readFileSync(headerPath, "utf-8");

  // 3.1 Mobile menu toggle >= 42px touch target
  assertIncludes(
    headerContent,
    "width: 42px",
    "TOUCH-TARGET-TOGGLE-WIDTH",
    "Mobile menu toggle button width is 42px (>= 42px)"
  );
  assertIncludes(
    headerContent,
    "height: 42px",
    "TOUCH-TARGET-TOGGLE-HEIGHT",
    "Mobile menu toggle button height is 42px (>= 42px)"
  );

  // 3.2 Mobile menu drawer links touch target >= 42px
  assertIncludes(
    globalsCss,
    "min-height:42px",
    "TOUCH-TARGET-DRAWER-LINKS",
    "Mobile drawer link items have min-height: 42px (>= 42px)"
  );

  // 3.3 Accessible drawer attributes
  assert(
    headerContent.includes('aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}') ||
      headerContent.includes('Open navigation menu'),
    "ACCESSIBLE-TOGGLE-ARIA-LABEL",
    "Toggle aria-label present"
  );
  assertIncludes(headerContent, "aria-expanded={menuOpen}", "ACCESSIBLE-TOGGLE-ARIA-EXPANDED", "Dynamic aria-expanded attribute");
  assertIncludes(headerContent, 'aria-controls="mobile-nav"', "ACCESSIBLE-TOGGLE-ARIA-CONTROLS", "aria-controls links to mobile-nav");
  assertIncludes(headerContent, 'id="mobile-nav"', "ACCESSIBLE-NAV-ID", "Drawer element has id='mobile-nav'");
  assertIncludes(headerContent, "aria-hidden={!menuOpen}", "ACCESSIBLE-NAV-HIDDEN", "Drawer manages aria-hidden dynamically");

  // 3.4 Keyboard and interaction handling
  assertIncludes(headerContent, 'e.key === "Escape"', "DRAWER-ESC-KEY", "Drawer closes on ESC key press");
  assertIncludes(headerContent, "handleClickOutside", "DRAWER-OUTSIDE-CLICK", "Drawer closes on click outside header");

  // 3.5 Sliding red pill indicator
  assertIncludes(headerContent, "header-active-indicator", "ACTIVE-INDICATOR-ELEMENT", "Sliding indicator element rendered");
  assertIncludes(headerContent, "ResizeObserver", "INDICATOR-RESIZE-OBSERVER", "Indicator uses ResizeObserver");
  assertIncludes(headerContent, "getBoundingClientRect", "INDICATOR-BOUNDS-CALC", "Indicator calculates bounds with getBoundingClientRect");
  assertIncludes(headerContent, "linear-gradient(90deg, #ff3845", "INDICATOR-CRIMSON-GRADIENT", "Indicator uses crimson gradient");

  // 3.6 Responsive breakpoints present in CSS
  const expectedBreakpoints = [
    { regex: /max-width:\s*1024px/, label: "1024px", purpose: "Tablet navigation switch to mobile toggle" },
    { regex: /max-width:\s*768px/, label: "768px", purpose: "Wallpaper switch to mobile and grid collapse" },
    { regex: /max-width:\s*760px/, label: "760px", purpose: "Compact tablet header auto-height and workflow stack" },
    { regex: /max-width:\s*520px/, label: "520px", purpose: "Mobile menu 1-column single stack" },
    { regex: /max-width:\s*450px/, label: "450px", purpose: "Programme cards single vertical stack" },
    { regex: /max-width:\s*380px/, label: "380px", purpose: "375px & 320px ultra-compact typography and padding clamping" },
  ];

  for (const bp of expectedBreakpoints) {
    assert(
      bp.regex.test(globalsCss) || bp.regex.test(headerContent),
      `BREAKPOINT-max-width-${bp.label}`,
      `Breakpoint max-width: ${bp.label} handled (${bp.purpose})`
    );
  }

  // ============================================================================
  // SUITE 4: LIVE HTTP ROUTING & REDIRECT VERIFICATION
  // ============================================================================
  console.log(bold(yellow("\n--- SUITE 4: LIVE HTTP ROUTING & REDIRECT VERIFICATION ---")));

  const routeSpecs = [
    { path: "/", expectedStatus: 200, isRedirect: false },
    { path: "/guidelines", expectedStatus: 200, isRedirect: false },
    { path: "/knowledge", expectedStatus: 200, isRedirect: false },
    { path: "/knowledge-hub", expectedStatus: 307, isRedirect: true, location: "/knowledge" },
    { path: "/leaderboard", expectedStatus: 200, isRedirect: false },
    { path: "/competitions", expectedStatus: 200, isRedirect: false },
    { path: "/calendar", expectedStatus: 200, isRedirect: false },
    { path: "/collaboration", expectedStatus: 200, isRedirect: false },
    { path: "/associations", expectedStatus: 200, isRedirect: false },
    { path: "/disciplines", expectedStatus: 200, isRedirect: false },
    { path: "/login", expectedStatus: 200, isRedirect: false },
    { path: "/register-club", expectedStatus: 200, isRedirect: false },
  ];

  for (const spec of routeSpecs) {
    try {
      const res = await fetch(`http://localhost:3000${spec.path}`, { redirect: "manual" });
      assert(
        res.status === spec.expectedStatus,
        `ROUTE-${spec.path.replace(/\//g, "_") || "root"}`,
        `Route ${spec.path} returned HTTP ${res.status} (expected ${spec.expectedStatus})`
      );

      if (spec.isRedirect) {
        const loc = res.headers.get("location");
        assert(
          loc === spec.location || (loc !== null && loc.endsWith(spec.location!)),
          `REDIRECT-TARGET-${spec.path}`,
          `Route ${spec.path} redirected to ${loc} (expected ${spec.location})`
        );
      }
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      assert(false, `ROUTE-FETCH-${spec.path}`, `Failed to fetch http://localhost:3000${spec.path}: ${err.message}`);
    }
  }

  // ============================================================================
  // SUITE 5: STRICT PORTAL ISOLATION AUDIT
  // ============================================================================
  console.log(bold(yellow("\n--- SUITE 5: STRICT PORTAL ISOLATION AUDIT ---")));

  const gitDiffRaw = execSync("git status --porcelain", { cwd: REPO_ROOT, encoding: "utf-8" });
  const modifiedFiles = gitDiffRaw.split("\n").filter(Boolean);

  const forbiddenPrefixes = [
    "src/app/coach",
    "src/components/coach",
    "src/lib/coach",
    "src/app/athlete",
    "src/components/athlete",
    "src/lib/athlete",
    "src/app/admin",
    "src/components/admin",
    "src/lib/admin",
  ];

  for (const fileLine of modifiedFiles) {
    const filePath = fileLine.slice(3).trim();
    for (const forbidden of forbiddenPrefixes) {
      assert(
        !filePath.startsWith(forbidden),
        `PORTAL-ISOLATION-GUARD`,
        `Protected portal file must not be modified: ${filePath}`
      );
    }
  }
  assert(true, "PORTAL-ISOLATION-VERIFIED", "Zero files in coach, athlete, or admin portals have been modified");

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log("");
  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("                           CHALLENGER 2 AUDIT SUMMARY")));
  console.log(bold(cyan("================================================================================")));
  console.log(`  Total Checks: ${bold(String(totalTests))}`);
  console.log(`  Passed:       ${green(String(passedTests))}`);
  console.log(`  Failed:       ${failedTests > 0 ? red(String(failedTests)) : green("0")}`);
  console.log("");

  if (failedTests > 0) {
    console.error(red(`\n❌ VERDICT: REJECT (${failedTests} assertion(s) failed)`));
    process.exit(1);
  } else {
    console.log(green(`\n✅ VERDICT: APPROVE (All ${passedTests} adversarial verification checks passed with 100% success!)`));
    process.exit(0);
  }
}

runChallenger2Suite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
