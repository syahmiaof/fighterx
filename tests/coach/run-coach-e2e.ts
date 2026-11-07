#!/usr/bin/env node
/**
 * Master E2E Opaque-Box Test Runner for FighterX Coach Portal V1.
 * Executes tests across Tiers 1 through 4 with high-precision timing,
 * progressive testability, and ANSI-formatted reporting.
 */

import { performance } from "node:perf_hooks";
import { TestCase, TestResult, colors } from "./types";
import { tier1Tests } from "./tier1-features";
import { tier2Tests } from "./tier2-boundary";
import { tier3Tests } from "./tier3-combinations";
import { tier4Tests } from "./tier4-scenarios";

interface RunnerOptions {
  tier?: number;
  verbose: boolean;
}

function parseArgs(): RunnerOptions {
  const args = process.argv.slice(2);
  const options: RunnerOptions = {
    verbose: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--tier=")) {
      options.tier = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    }
  }

  return options;
}

export async function runSuite() {
  const options = parseArgs();
  const startTime = performance.now();

  console.log(`\n${colors.bold}${colors.red}======================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.white}  FIGHTERX COACH PORTAL V1 // E2E OPAQUE-BOX TEST RUNNER${colors.reset}`);
  console.log(`${colors.dim}  Authoritative Specification & Contract Verification Suite${colors.reset}`);
  console.log(`${colors.bold}${colors.red}======================================================================${colors.reset}\n`);

  let allTests: TestCase[] = [];

  if (options.tier) {
    console.log(`${colors.cyan}>> Filtered Execution: Running Tier ${options.tier} Tests Only${colors.reset}\n`);
    switch (options.tier) {
      case 1:
        allTests = tier1Tests;
        break;
      case 2:
        allTests = tier2Tests;
        break;
      case 3:
        allTests = tier3Tests;
        break;
      case 4:
        allTests = tier4Tests;
        break;
      default:
        console.error(`${colors.red}Error: Invalid tier ${options.tier}. Must be 1, 2, 3, or 4.${colors.reset}`);
        process.exit(1);
    }
  } else {
    allTests = [
      ...tier1Tests,
      ...tier2Tests,
      ...tier3Tests,
      ...tier4Tests,
    ];
  }

  const results: TestResult[] = [];
  let currentTier: number | null = null;

  for (const test of allTests) {
    if (test.tier !== currentTier) {
      currentTier = test.tier;
      const tierTitles: Record<number, string> = {
        1: "TIER 1: FEATURE COVERAGE (MODULES A-F, CONTRACTS, SHELL)",
        2: "TIER 2: BOUNDARY & CORNER CASES (EMPTY STATES, ZERO MATH, RESPONSIVE)",
        3: "TIER 3: CROSS-FEATURE COMBINATIONS (REACTIVE STATE PROPAGATION)",
        4: "TIER 4: REAL-WORLD COACH SCENARIOS (JOURNEYS & TRACK A ISOLATION)",
      };
      console.log(`${colors.bold}${colors.yellow}--- ${tierTitles[currentTier]} ---${colors.reset}`);
    }

    const tStart = performance.now();
    try {
      await test.run();
      const durationMs = Math.round((performance.now() - tStart) * 100) / 100;
      results.push({
        id: test.id,
        name: test.name,
        tier: test.tier,
        category: test.category,
        status: "PASS",
        durationMs,
      });

      console.log(
        `  ${colors.green}✓ PASS${colors.reset} ${colors.bold}[${test.id}]${colors.reset} ${test.name} ${colors.dim}(${durationMs}ms)${colors.reset}`
      );
    } catch (err) {
      const durationMs = Math.round((performance.now() - tStart) * 100) / 100;
      results.push({
        id: test.id,
        name: test.name,
        tier: test.tier,
        category: test.category,
        status: "FAIL",
        durationMs,
        error: err instanceof Error ? err : new Error(String(err)),
      });

      console.log(
        `  ${colors.red}✕ FAIL${colors.reset} ${colors.bold}[${test.id}]${colors.reset} ${test.name} ${colors.dim}(${durationMs}ms)${colors.reset}`
      );

      if (options.verbose && err instanceof Error) {
        console.log(`    ${colors.red}${err.message}${colors.reset}`);
        if (err.stack) {
          console.log(`    ${colors.dim}${err.stack.split("\n").slice(1, 4).join("\n    ")}${colors.reset}`);
        }
      }
    }
  }

  const totalDuration = Math.round((performance.now() - startTime) * 10) / 10;
  const passedCount = results.filter((r) => r.status === "PASS").length;
  const failedCount = results.filter((r) => r.status === "FAIL").length;

  console.log(`\n${colors.bold}${colors.white}----------------------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}EXECUTION SUMMARY:${colors.reset}`);
  console.log(`  Total Tests Run: ${results.length}`);
  console.log(`  Passed:          ${colors.green}${passedCount}${colors.reset}`);
  console.log(`  Failed:          ${failedCount > 0 ? colors.red + failedCount + colors.reset : "0"}`);
  console.log(`  Execution Time:  ${totalDuration}ms`);

  // Tier breakdown
  console.log(`\n${colors.bold}BREAKDOWN BY TIER:${colors.reset}`);
  for (const t of [1, 2, 3, 4]) {
    const tierResults = results.filter((r) => r.tier === t);
    if (tierResults.length === 0) continue;
    const tierPassed = tierResults.filter((r) => r.status === "PASS").length;
    const tierFailed = tierResults.filter((r) => r.status === "FAIL").length;
    const statusColor = tierFailed === 0 ? colors.green : colors.red;
    console.log(
      `  Tier ${t}: ${statusColor}${tierPassed}/${tierResults.length} passed${colors.reset}`
    );
  }

  if (failedCount > 0) {
    console.log(`\n${colors.bgRed}${colors.white}${colors.bold} TEST SUITE FAILED (${failedCount} errors) ${colors.reset}\n`);
    for (const failed of results.filter((r) => r.status === "FAIL")) {
      console.log(`  ${colors.red}✕ [${failed.id}] ${failed.name}${colors.reset}`);
      if (failed.error) {
        console.log(`    Error: ${failed.error.message}`);
      }
    }
    console.log("");
    process.exit(1);
  } else {
    console.log(`\n${colors.bgGreen}${colors.white}${colors.bold} ALL TESTS PASSED SUCCESSFULLY! ${colors.reset}\n`);
    process.exit(0);
  }
}

// Execute runner if invoked directly
runSuite().catch((err) => {
  console.error("Unhandled Runner Error:", err);
  process.exit(1);
});
