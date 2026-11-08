#!/usr/bin/env node
/**
 * Master Unified Public E2E Test Runner for FighterX
 * 
 * Usage:
 *   npx tsx tests/public/run-public-e2e.ts
 *   npx tsx tests/public/run-public-e2e.ts --tier=1
 *   npx tsx tests/public/run-public-e2e.ts --tier=2
 *   npx tsx tests/public/run-public-e2e.ts --tier=3
 *   npx tsx tests/public/run-public-e2e.ts --tier=4
 */

import { performance } from "perf_hooks";
import {
  TestCase,
  TestResult,
  green,
  red,
  yellow,
  cyan,
  dim,
  bold,
} from "./types";

import { tier1Tests } from "./tier1-features";
import { tier2Tests } from "./tier2-boundary";
import { tier3Tests } from "./tier3-combinations";
import { tier4Tests } from "./tier4-scenarios";

// Parse CLI flags
const args = process.argv.slice(2);
const tierArg = args.find((arg) => arg.startsWith("--tier="));
const requestedTier = tierArg ? parseInt(tierArg.split("=")[1], 10) : null;

async function runTestSuite() {
  console.log("");
  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("   FIGHTERX PUBLIC WEBSITE EXPANSION — 4-TIER E2E TEST SUITE")));
  console.log(bold(cyan("================================================================================")));
  console.log(dim(`Execution Time: ${new Date().toISOString()}`));
  if (requestedTier) {
    console.log(yellow(`Filtering: Tier ${requestedTier} only`));
  } else {
    console.log(dim("Mode: Full Suite (Tiers 1 through 4)"));
  }
  console.log("");

  const allTests: TestCase[] = [
    ...tier1Tests,
    ...tier2Tests,
    ...tier3Tests,
    ...tier4Tests,
  ];

  const testsToRun = requestedTier
    ? allTests.filter((t) => t.tier === requestedTier)
    : allTests;

  if (testsToRun.length === 0) {
    console.log(red(`No tests found matching criteria (tier=${requestedTier})`));
    process.exit(1);
  }

  const results: TestResult[] = [];
  const suiteStartTime = performance.now();

  let currentTier: number | null = null;

  for (const test of testsToRun) {
    if (test.tier !== currentTier) {
      currentTier = test.tier;
      console.log("");
      const tierHeadings: Record<number, string> = {
        1: "TIER 1: FEATURE COVERAGE (HOMEPAGE, HEADER, DIRECTORY, RULES, REGISTRATION)",
        2: "TIER 2: BOUNDARY & CORNER CASES (ZERO/NEG, 5S GRAPPLE, DQ, SANITIZATION, MYKAD)",
        3: "TIER 3: CROSS-FEATURE INTERACTIONS (AFFILIATIONS MAPPING, NAVIGATION, MULTI-STEP)",
        4: "TIER 4: REAL-WORLD SCENARIOS & ZERO-REGRESSION FORENSIC AUDIT",
      };
      console.log(bold(yellow(`--- ${tierHeadings[currentTier] || `TIER ${currentTier}`} ---`)));
    }

    const testStartTime = performance.now();
    try {
      await test.run();
      const durationMs = Math.round((performance.now() - testStartTime) * 100) / 100;
      results.push({
        id: test.id,
        name: test.name,
        tier: test.tier,
        status: "PASS",
        durationMs,
      });
      console.log(`  ${green("✓ PASS")} [${bold(test.id)}] ${test.name} ${dim(`(${durationMs}ms)`)}`);
    } catch (err: unknown) {
      const durationMs = Math.round((performance.now() - testStartTime) * 100) / 100;
      const errorMessage = err instanceof Error ? err.message : String(err);
      results.push({
        id: test.id,
        name: test.name,
        tier: test.tier,
        status: "FAIL",
        durationMs,
        error: errorMessage,
      });
      console.log(`  ${red("✗ FAIL")} [${bold(test.id)}] ${test.name} ${dim(`(${durationMs}ms)`)}`);
      console.log(red(`         Error: ${errorMessage}`));
      if (err instanceof Error && err.stack) {
        const stackLines = err.stack.split("\n").slice(1, 4).join("\n         ");
        console.log(dim(`         ${stackLines}`));
      }
    }
  }

  const suiteDurationMs = Math.round((performance.now() - suiteStartTime) * 10) / 10;
  const passedCount = results.filter((r) => r.status === "PASS").length;
  const failedCount = results.filter((r) => r.status === "FAIL").length;
  const totalCount = results.length;
  const passRate = Math.round((passedCount / totalCount) * 1000) / 10;

  console.log("");
  console.log(bold(cyan("================================================================================")));
  console.log(bold(cyan("                           EXECUTION SUMMARY")));
  console.log(bold(cyan("================================================================================")));
  console.log(`  Total Tests Run: ${bold(String(totalCount))}`);
  console.log(`  Passed:          ${green(`${passedCount} (${passRate}%)`)}`);
  console.log(`  Failed:          ${failedCount > 0 ? red(String(failedCount)) : dim("0 (0%)")}`);
  console.log(`  Total Duration:  ${dim(`${suiteDurationMs}ms`)}`);
  console.log("");

  console.log(bold("  BREAKDOWN BY TIER:"));
  for (const tier of [1, 2, 3, 4] as const) {
    const tierResults = results.filter((r) => r.tier === tier);
    if (tierResults.length === 0) continue;
    const tierPassed = tierResults.filter((r) => r.status === "PASS").length;
    const tierTotal = tierResults.length;
    const tierRate = Math.round((tierPassed / tierTotal) * 100);
    const label = `  Tier ${tier}:`;
    const countStr = `${tierPassed}/${tierTotal} passed (${tierRate}%)`;
    if (tierPassed === tierTotal) {
      console.log(`    ${label.padEnd(12)} ${green(countStr)}`);
    } else {
      console.log(`    ${label.padEnd(12)} ${red(countStr)}`);
    }
  }

  console.log(bold(cyan("================================================================================")));

  if (failedCount > 0) {
    console.log(red(`\n❌ TEST SUITE FAILED: ${failedCount} test(s) failed.`));
    process.exit(1);
  } else {
    console.log(green(`\n✅ TEST SUITE SUCCESS: All ${totalCount} tests passed cleanly!`));
    process.exit(0);
  }
}

runTestSuite().catch((fatalErr) => {
  console.error(red("Fatal test runner exception:"), fatalErr);
  process.exit(1);
});
