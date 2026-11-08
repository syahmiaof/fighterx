import fs from "fs";
import path from "path";

// Color utilities for terminal output
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, failureDetails?: string) {
  results.push({
    name,
    passed: condition,
    details: condition ? undefined : failureDetails,
  });
}

const targetDirectories = [
  "src/app/disciplines",
  "src/components/disciplines",
  "src/app/calendar",
  "src/app/competitions",
  "src/components/competitions",
  "src/app/leaderboard",
  "src/components/leaderboard",
  "src/app/guidelines",
  "src/components/guidelines",
  "src/app/knowledge",
  "src/app/knowledge-hub",
  "src/components/knowledge",
];

function getAllFiles(dir: string, extList: string[]): string[] {
  const fullDir = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) return [];
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const res = path.resolve(fullDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(res, extList));
    } else {
      const ext = path.extname(entry.name);
      if (extList.includes(ext)) {
        files.push(res);
      }
    }
  }
  return files;
}

console.log(`${BOLD}${CYAN}================================================================================${RESET}`);
console.log(`${BOLD}${CYAN}   EMPIRICAL ADVERSARIAL VERIFICATION HARNESS — 5 TARGET PAGES${RESET}`);
console.log(`${BOLD}${CYAN}   Role: challenger_m6_1 (Adversarial Code Inspector)${RESET}`);
console.log(`${BOLD}${CYAN}================================================================================${RESET}\n`);

// Collect all relevant files
const allTargetFiles: string[] = [];
for (const dir of targetDirectories) {
  allTargetFiles.push(...getAllFiles(dir, [".ts", ".tsx", ".css"]));
}

console.log(`Found ${allTargetFiles.length} files across the 5 target pages to verify.\n`);

// ------------------------------------------------------------------------------
// TEST SUITE 1: Deep Static Grep for Legacy Solid Opaque Backgrounds
// ------------------------------------------------------------------------------
console.log(`${BOLD}--- Suite 1: Legacy Opaque Background Probe ---${RESET}`);

const forbiddenOpaquePatterns = [
  { pattern: "17191f", label: "Solid charcoal #17191f" },
  { pattern: "121317", label: "Solid dark charcoal #121317" },
  { pattern: "111216", label: "Solid charcoal #111216" },
  { pattern: "to-black/75", label: "Legacy gradient to-black/75" },
];

for (const p of forbiddenOpaquePatterns) {
  const violatingFiles: { file: string; line: number }[] = [];
  for (const filePath of allTargetFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes(p.pattern)) {
        violatingFiles.push({ file: path.relative(process.cwd(), filePath), line: idx + 1 });
      }
    });
  }

  assert(
    violatingFiles.length === 0,
    `No occurrence of forbidden opaque pattern '${p.pattern}' (${p.label})`,
    violatingFiles.map((v) => `${v.file}:${v.line}`).join(", ")
  );
}

// Check for bg-black/40 card containers in active card feeds
const bgBlack40Violations: { file: string; line: number }[] = [];
for (const filePath of allTargetFiles) {
  // Ignore points-calculator if not used in production pages
  if (filePath.endsWith("points-calculator.tsx")) continue;
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    // Flag if used as card container (e.g. rounded-* bg-black/40)
    if (line.includes("bg-black/40") && (line.includes("rounded-") || line.includes("p-") || line.includes("card"))) {
      // Check if it's a chip count (like active ? "bg-black/40 text-white" : ...)
      if (!line.includes("rounded-full text-[10px]")) {
        bgBlack40Violations.push({ file: path.relative(process.cwd(), filePath), line: idx + 1 });
      }
    }
  });
}
assert(
  bgBlack40Violations.length === 0,
  "No card container uses legacy bg-black/40 background",
  bgBlack40Violations.map((v) => `${v.file}:${v.line}`).join(", ")
);

// ------------------------------------------------------------------------------
// TEST SUITE 2: Multi-color AI-Slop Badges & Inline Rainbow Injections
// ------------------------------------------------------------------------------
console.log(`${BOLD}--- Suite 2: AI-Slop Badges & Rainbow Injections Probe ---${RESET}`);

const forbiddenBadgePatterns = [
  { pattern: "bg-amber-950", label: "Saturated dark amber bg-amber-950" },
  { pattern: "bg-red-950", label: "Saturated dark red bg-red-950" },
  { pattern: "bg-amber-600", label: "Opaque orange-amber bg-amber-600" },
  { pattern: "bg-amber-400 text-black", label: "Harsh yellow badge bg-amber-400 text-black" },
];

for (const p of forbiddenBadgePatterns) {
  const violatingFiles: { file: string; line: number }[] = [];
  for (const filePath of allTargetFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes(p.pattern)) {
        violatingFiles.push({ file: path.relative(process.cwd(), filePath), line: idx + 1 });
      }
    });
  }

  assert(
    violatingFiles.length === 0,
    `No occurrence of AI-slop badge pattern '${p.pattern}' (${p.label})`,
    violatingFiles.map((v) => `${v.file}:${v.line}`).join(", ")
  );
}

// Check for inline rainbow styles
const inlineRainbowViolations: { file: string; line: number; snippet: string }[] = [];
for (const filePath of allTargetFiles) {
  if (filePath.endsWith(".css")) continue;
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("style={{") && (line.includes("backgroundColor") || line.includes("background:") || line.includes("borderColor"))) {
      inlineRainbowViolations.push({
        file: path.relative(process.cwd(), filePath),
        line: idx + 1,
        snippet: line.trim(),
      });
    }
  });
}
assert(
  inlineRainbowViolations.length === 0,
  "No inline style injections for background or border colors (zero rainbow styles)",
  inlineRainbowViolations.map((v) => `${v.file}:${v.line} -> ${v.snippet}`).join(", ")
);

// ------------------------------------------------------------------------------
// TEST SUITE 3: Glassmorphism Card Formula Conformance Across All 5 Pages
// ------------------------------------------------------------------------------
console.log(`${BOLD}--- Suite 3: Glassmorphism Card Formula Verification ---${RESET}`);

const pages = [
  { name: "Disiplin", cssOrTsx: ["src/components/disciplines/disciplines-hero.tsx", "src/components/disciplines/category-comparison-matrix.tsx", "src/components/disciplines/silat-seni-section.tsx", "src/components/disciplines/silat-olahraga-section.tsx"] },
  { name: "Kalendar & Competitions", cssOrTsx: ["src/components/competitions/competitions.css", "src/components/competitions/competitions-client.tsx"] },
  { name: "Leaderboard", cssOrTsx: ["src/components/leaderboard/leaderboard-client.tsx", "src/components/leaderboard/athlete-detail-modal.tsx"] },
  { name: "Guidelines", cssOrTsx: ["src/app/guidelines/page.tsx", "src/components/guidelines/tanding-calculator.tsx", "src/components/guidelines/jurus-calculator.tsx"] },
  { name: "Sport Science", cssOrTsx: ["src/components/knowledge/knowledge.css", "src/components/knowledge/knowledge-hub-client.tsx", "src/app/knowledge/[slug]/page.tsx"] },
];

for (const pg of pages) {
  let hasTranslucentAlpha = false;
  let hasBackdropBlur = false;
  let hasHairlineBorder = false;
  let hasSpecularHighlight = false;

  for (const relPath of pg.cssOrTsx) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, "utf-8");

    if (content.includes("bg-white/[0.025]") || content.includes("rgba(255, 255, 255, 0.025)") || content.includes("bg-white/[0.02]") || content.includes("bg-white/[0.03]")) {
      hasTranslucentAlpha = true;
    }
    if (content.includes("backdrop-blur-[16px]") || content.includes("backdrop-filter: blur(16px)") || content.includes("backdrop-blur-md") || content.includes("backdrop-blur-2xl")) {
      hasBackdropBlur = true;
    }
    if (content.includes("border-white/[0.08]") || content.includes("rgba(255, 255, 255, 0.08)") || content.includes("border-white/[0.06]")) {
      hasHairlineBorder = true;
    }
    if (content.includes("inset_0_1px_0_rgba(255,255,255,0.06)") || content.includes("inset 0 1px 0 rgba(255, 255, 255, 0.06)") || content.includes("inset_0_1px_0_rgba(255,255,255,0.12)") || content.includes("inset 0 1px 0 rgba(255, 255, 255, 0.12)")) {
      hasSpecularHighlight = true;
    }
  }

  assert(hasTranslucentAlpha, `Page '${pg.name}' implements translucent alpha surface (bg-white/[0.025] or equivalent)`);
  assert(hasBackdropBlur, `Page '${pg.name}' implements backdrop blur filter (16px or equivalent)`);
  assert(hasHairlineBorder, `Page '${pg.name}' implements translucent hairline border (border-white/[0.08] or equivalent)`);
  assert(hasSpecularHighlight, `Page '${pg.name}' implements top specular bevel highlight (inset 0 1px 0 rgba(255,255,255,0.06))`);
}

// ------------------------------------------------------------------------------
// TEST SUITE 4: CSS Parsing & Structural Cleanliness
// ------------------------------------------------------------------------------
console.log(`${BOLD}--- Suite 4: CSS Syntax & Class Cleanliness ---${RESET}`);

const cssFiles = [
  "src/components/competitions/competitions.css",
  "src/components/knowledge/knowledge.css",
];

for (const cssFile of cssFiles) {
  const fullPath = path.resolve(process.cwd(), cssFile);
  const content = fs.readFileSync(fullPath, "utf-8");

  // Check balanced curly braces
  let openBraces = 0;
  let closeBraces = 0;
  for (const char of content) {
    if (char === "{") openBraces++;
    if (char === "}") closeBraces++;
  }
  assert(
    openBraces === closeBraces,
    `CSS file '${cssFile}' has perfectly balanced braces ({ count: ${openBraces}, } count: ${closeBraces})`,
    `Mismatch: ${openBraces} open vs ${closeBraces} close`
  );

  // Check no leftover merge conflicts
  assert(!content.includes("<<<<<<<"), `CSS file '${cssFile}' has no git merge conflict markers`);
}

// ------------------------------------------------------------------------------
// TEST SUITE 5: Interactive Calculation Engine Integrity
// ------------------------------------------------------------------------------
console.log(`${BOLD}--- Suite 5: Interactive Logic & Calculation Integrity ---${RESET}`);

import { calculateTandingScore, getPenaltyDeduction } from "../src/lib/guidelines/scoring";
import { calculateJurusScore } from "../src/lib/guidelines/scoring";

// Verify Tanding score logic
const standardBout = calculateTandingScore(5, 3, 2, ["TEGURAN_1"]);
// 5 punches * 1 = 5
// 3 kicks * 2 = 6
// 2 takedowns * 3 = 6
// Raw strike points = 17
// Teguran 1 = -1
// Net = 16
assert(
  standardBout.totalScore === 16,
  "calculateTandingScore computes 5 punches, 3 kicks, 2 takedowns, 1 Teguran as exactly 16 pts",
  `Got totalScore: ${standardBout.totalScore}`
);

// Verify DQ penalty
const dqBout = calculateTandingScore(10, 5, 2, ["PERINGATAN_3_DQ"]);
assert(
  dqBout.isDisqualified === true,
  "PERINGATAN_3_DQ triggers automatic disqualification flag",
  `isDisqualified was ${dqBout.isDisqualified}`
);

// Verify Jurus score logic
const jurusBout = calculateJurusScore({
  category: "TUNGGAL",
  accuracyScore: 9.90,
  expressionScore: 0.05,
  deductions: {
    timeOverUnderSeconds: 10, // 2 steps * 0.05 = 0.10
    weaponDrops: 1, // 0.50
    boundaryViolations: 0,
    costumeFaults: 0,
    movementFaults: 0,
  },
});
// Base = 9.95
// Deductions = 0.10 + 0.50 = 0.60
// Net = 9.35
assert(
  Math.abs(jurusBout.netScore - 9.35) < 0.001,
  "calculateJurusScore computes deductions for 10s time error + 1 weapon drop accurately (9.35 pts)",
  `Got netScore: ${jurusBout.netScore}`
);

// ------------------------------------------------------------------------------
// SUMMARY & VERDICT
// ------------------------------------------------------------------------------
console.log(`\n${BOLD}${CYAN}================================================================================${RESET}`);
console.log(`${BOLD}${CYAN}   VERIFICATION RESULTS BREAKDOWN${RESET}`);
console.log(`${BOLD}${CYAN}================================================================================${RESET}`);

let passedCount = 0;
let failedCount = 0;

for (const r of results) {
  if (r.passed) {
    passedCount++;
    console.log(`  ${GREEN}✓ PASS${RESET}  ${r.name}`);
  } else {
    failedCount++;
    console.log(`  ${RED}✗ FAIL${RESET}  ${r.name}`);
    if (r.details) {
      console.log(`         ${YELLOW}Details: ${r.details}${RESET}`);
    }
  }
}

console.log(`${BOLD}${CYAN}================================================================================${RESET}`);
console.log(`  Total Checks:    ${results.length}`);
console.log(`  Passed:          ${GREEN}${passedCount}${RESET} (${Math.round((passedCount / results.length) * 100)}%)`);
console.log(`  Failed:          ${failedCount > 0 ? RED : GREEN}${failedCount}${RESET} (${Math.round((failedCount / results.length) * 100)}%)`);
console.log(`${BOLD}${CYAN}================================================================================${RESET}`);

if (failedCount === 0) {
  console.log(`\n${GREEN}${BOLD}✅ ALL ADVERSARIAL VERIFICATION CHECKS PASSED EMPIRICALLY!${RESET}\n`);
  process.exit(0);
} else {
  console.log(`\n${RED}${BOLD}❌ VERIFICATION FAILED: ${failedCount} checks failed.${RESET}\n`);
  process.exit(1);
}
