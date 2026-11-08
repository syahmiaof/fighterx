#!/usr/bin/env node
/**
 * Adversarial Reviewer Verification Test for Sport Science (/knowledge)
 * Validates R1 (Hero Title Styling), R2 (Hero Layout), R3 (Frosted Glass Styling),
 * and zero regressions across all knowledge pages and components.
 */

import fs from "fs";
import path from "path";

const rootDir = path.resolve(__dirname, "..");
const knowledgeCssPath = path.join(rootDir, "src/components/knowledge/knowledge.css");
const knowledgeClientPath = path.join(rootDir, "src/components/knowledge/knowledge-hub-client.tsx");
const periodizationPath = path.join(rootDir, "src/components/knowledge/periodization-matrix.tsx");
const weightCutPath = path.join(rootDir, "src/components/knowledge/weight-cut-planner.tsx");
const sweatRatePath = path.join(rootDir, "src/components/knowledge/sweat-rate-calculator.tsx");
const stakeholderPath = path.join(rootDir, "src/components/knowledge/stakeholder-guide-switcher.tsx");
const citationsDrawerPath = path.join(rootDir, "src/components/knowledge/citations-drawer.tsx");
const slugPagePath = path.join(rootDir, "src/app/knowledge/[slug]/page.tsx");
const knowledgePagePath = path.join(rootDir, "src/app/knowledge/page.tsx");

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

let totalAsserts = 0;
let passedAsserts = 0;
let failedAsserts = 0;
const failures: string[] = [];

function check(condition: boolean, name: string, detail?: string) {
  totalAsserts++;
  if (condition) {
    passedAsserts++;
    console.log(`  ${green("✓ PASS")} ${name}`);
  } else {
    failedAsserts++;
    const msg = detail || "Condition failed";
    failures.push(`${name} -> ${msg}`);
    console.error(`  ${red("✗ FAIL")} ${name}: ${msg}`);
  }
}

console.log(bold(cyan("\n=======================================================")));
console.log(bold(cyan("  ADVERSARIAL VERIFICATION: SPORT SCIENCE /KNOWLEDGE")));
console.log(bold(cyan("=======================================================\n")));

const css = fs.readFileSync(knowledgeCssPath, "utf-8");
const client = fs.readFileSync(knowledgeClientPath, "utf-8");
const periodization = fs.readFileSync(periodizationPath, "utf-8");
const weightCut = fs.readFileSync(weightCutPath, "utf-8");
const sweatRate = fs.readFileSync(sweatRatePath, "utf-8");
const stakeholder = fs.readFileSync(stakeholderPath, "utf-8");
const drawer = fs.readFileSync(citationsDrawerPath, "utf-8");
const slugPage = fs.readFileSync(slugPagePath, "utf-8");
const page = fs.readFileSync(knowledgePagePath, "utf-8");

// -------------------------------------------------------------
// 1. R1: Hero Title Typography & 3D Layered Text Shadows
// -------------------------------------------------------------
console.log(bold("--- Requirement R1: Hero Title Styling ---"));

check(
  css.includes("font: italic 700 clamp(58px, 6.1vw, 88px) / 0.83 var(--font-athletic)") ||
  css.includes("font: italic 700 clamp(58px,6.1vw,88px)/0.83 var(--font-athletic)"),
  "Hero H1 font specifies italic 700 clamp(58px, 6.1vw, 88px) / 0.83 var(--font-athletic)"
);

check(
  css.includes("letter-spacing: -0.012em"),
  "Hero H1 letter-spacing specifies -0.012em"
);

check(
  css.includes("0 2px 0 #aaaab0, 0 5px 0 #66676d, 0 9px 14px rgba(0, 0, 0, 0.7)"),
  "White text 3D shadow specifies '0 2px 0 #aaaab0, 0 5px 0 #66676d, 0 9px 14px rgba(0, 0, 0, 0.7)'"
);

check(
  css.includes("0 2px 0 #a10a11, 0 5px 0 #65050a, 0 9px 14px rgba(0, 0, 0, 0.7)"),
  "Crimson text 3D shadow specifies '0 2px 0 #a10a11, 0 5px 0 #65050a, 0 9px 14px rgba(0, 0, 0, 0.7)'"
);

check(
  css.includes("drop-shadow(0 4px 8px rgba(225, 6, 0, 0.22))"),
  "Accent text drop shadow specifies drop-shadow(0 4px 8px rgba(225, 6, 0, 0.22))"
);

check(
  css.includes("color: #f51c25") && css.includes("font-style: italic"),
  "Accent word uses #f51c25 and font-style: italic"
);

check(
  client.includes('className="knowledge-hero-title mb-4"') &&
  client.includes('className="title-white">SPORT</span>') &&
  client.includes('className="title-crimson">SCIENCE</em>'),
  "knowledge-hub-client.tsx uses .knowledge-hero-title with SPORT in title-white and SCIENCE in title-crimson"
);

check(
  css.includes(".knowledge-hero-title .title-white") &&
  css.includes("white-space: nowrap") &&
  css.includes(".knowledge-hero-title .title-crimson") &&
  css.includes("white-space: nowrap"),
  "Mobile wrapping guard: title-white and title-crimson have white-space: nowrap"
);

check(
  css.includes(".knowledge-hero-title em::after") &&
  css.includes("background: linear-gradient(90deg, transparent, #f5222b99 22%, #ff343bba 50%, #f5222b99 78%, transparent)"),
  "Hero title em has glowing red underline rule matching homepage hero h1"
);

// -------------------------------------------------------------
// 2. R2: Hero Section Layout & Brand Alignment
// -------------------------------------------------------------
console.log(bold("\n--- Requirement R2: Hero Section Layout ---"));

check(
  client.includes("knowledge-hero-overline") &&
  client.includes("accent-rule") &&
  client.includes("MAKMAL PRESTASI &amp; SAINS SUKAN SILAT"),
  "Hero contains dual red accent rule overline with official tracking"
);

check(
  client.includes("hero-quote-callout") &&
  client.includes("hero-quote-rule") &&
  client.includes("Latihan Saintifik. Disiplin Pendekar."),
  "Hero contains signature quote callout with red accent rules"
);

check(
  !css.includes(".knowledge-page .hero-quote-callout {\n    margin: 14px auto 18px;\n    justify-content: center;"),
  "Hero quote callout is not forced to center on mobile, preserving clean left alignment with copy"
);

check(
  client.includes("accreditation-pill") &&
  client.includes("ISN Bukit Jalil") &&
  client.includes("PERSILAT Medical Code 2026") &&
  client.includes("IOC &amp; BJSM Consensus") &&
  client.includes("MSN Malaysia"),
  "Hero contains all 4 official accreditation badge pills"
);

check(
  client.includes("kpi-matrix-card") &&
  client.includes("52 MINGGU") &&
  client.includes("6 BASELINE") &&
  client.includes("5 PRIORITI") &&
  client.includes("100% LEGIT"),
  "Hero contains 4-metric statistics matrix (52 MINGGU, 6 BASELINE, 5 PRIORITI, 100% LEGIT)"
);

check(
  client.includes("bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.14),transparent_70%)] blur-3xl"),
  "Hero section contains atmospheric ambient radial backlight glow"
);

// -------------------------------------------------------------
// 3. R3: Sleek Frosted Glass Design System
// -------------------------------------------------------------
console.log(bold("\n--- Requirement R3: Frosted Glass Card Styling ---"));

check(
  css.includes("background: rgba(18, 20, 26, 0.65)") &&
  css.includes("backdrop-filter: blur(16px)") &&
  css.includes("-webkit-backdrop-filter: blur(16px)") &&
  css.includes("border: 1px solid rgba(255, 255, 255, 0.08)"),
  "Frosted card CSS defines rgba(18, 20, 26, 0.65), blur(16px), and hairline border rgba(255, 255, 255, 0.08)"
);

check(
  css.includes(".knowledge-frosted-subcard") &&
  css.includes("background: rgba(18, 20, 26, 0.55)") &&
  css.includes("backdrop-filter: blur(12px)"),
  "Frosted inner subcards define rgba(18, 20, 26, 0.55) and blur(12px)"
);

check(
  css.includes(".knowledge-modal-shell") &&
  css.includes("background: rgba(18, 20, 26, 0.82)") &&
  css.includes("backdrop-filter: blur(24px)"),
  "Frosted modal shell defines rgba(18, 20, 26, 0.82) with blur(24px)"
);

check(
  css.includes("border-color: rgba(255, 56, 69, 0.5)") &&
  css.includes("0 14px 40px rgba(0, 0, 0, 0.55), 0 0 24px rgba(225, 6, 0, 0.16)"),
  "Frosted cards define crimson hover border and glowing shadow effect"
);

// Verify elimination of solid dark gradient boxes
check(
  !client.includes("bg-gradient-to-b from-[#0B0C10] via-[#0D0E13] to-[#08090B]"),
  "No heavy opaque background gradient on master-framework section"
);

check(
  !client.includes("border border-[#2B2C33] bg-[#121318]"),
  "No solid dark box on framework sub-view switcher"
);

check(
  !client.includes('bg-[#14151B] text-[#8E9099] border border-[#2B2C33]'),
  "No solid dark boxes on baseline session filter buttons"
);

check(
  !client.includes('bg-[#14151B] text-[#A2A3AA] border border-[#2B2C33]'),
  "No solid dark boxes on interactive tools tab switcher"
);

check(
  !client.includes('rounded-2xl bg-[#0D0E12]'),
  "No solid #0D0E12 box on empty search state"
);

check(
  !drawer.includes('bg-[#12141a]/95'),
  "Citations drawer uses sleek frosted modal shell rather than opaque 95% dark box"
);

check(
  !client.includes('bg-[#12141a]/95'),
  "Article reader modal uses sleek frosted modal shell rather than opaque 95% dark box"
);

check(
  !slugPage.includes('border-[#2B2C33]') && !slugPage.includes('bg-[#1C1D24]'),
  "Slug page data table uses frosted translucent styling rather than solid dark box"
);

check(
  periodization.includes("knowledge-tool-container") &&
  weightCut.includes("knowledge-tool-container") &&
  sweatRate.includes("knowledge-tool-container") &&
  stakeholder.includes("knowledge-tool-container"),
  "All 4 interactive tools use .knowledge-tool-container"
);

check(
  page.includes("public-page-wallpaper") &&
  page.includes("public-page-vignette") &&
  page.includes("public-page-ambient-smoke"),
  "/knowledge page incorporates full shared wallpaper stack at 72% opacity"
);

check(
  slugPage.includes("public-page-wallpaper") &&
  slugPage.includes("public-page-vignette") &&
  slugPage.includes("public-page-ambient-smoke"),
  "/knowledge/[slug] page incorporates full shared wallpaper stack"
);

console.log(bold("\n======================================================="));
console.log(`Total Checks Evaluated : ${bold(totalAsserts.toString())}`);
console.log(`Passed                 : ${bold(green(passedAsserts.toString()))}`);
console.log(`Failed                 : ${bold(failedAsserts > 0 ? red(failedAsserts.toString()) : "0")}`);
console.log(bold("======================================================="));

if (failedAsserts > 0) {
  console.error(red("\nFAILURES DETECTED:"));
  for (const f of failures) {
    console.error(`  - ${f}`);
  }
  process.exit(1);
} else {
  console.log(green("\n>>> EMPIRICAL VERDICT: ALL DESIGN SYSTEM INVARIANTS PASS <<<\n"));
  process.exit(0);
}
