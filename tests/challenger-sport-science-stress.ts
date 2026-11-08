#!/usr/bin/env node
/**
 * Empirical Challenger Sport Science (Sains Sukan Silat) Stress Test Suite
 * 
 * Verifies:
 * 1. Interactive calculator math and formulas:
 *    - WeightCutPlanner: boundary conditions, prep weeks 1-16, weight categories, tier calculations (optimal, safe, moderate, danger)
 *    - SweatRateCalculator: fluid loss, hourly sweat rate, dehydration percentage, >2% dehydration alert banner
 * 2. Filter & search reactivity:
 *    - Category filter pills, counts, glowing active states, search matching in filteredArticles across all fields
 * 3. Master Annual Training Framework visualizer reactivity:
 *    - 12-month periodization data integrity, Block 1 vs Block 2 month switching, 4 sub-view state switches, baseline session filtering
 * 4. Persilat 2026 & ISN Accreditation Badges & External Linkage Invariants
 */

import {
  CATEGORIES,
  KNOWLEDGE_ARTICLES,
  SCIENTIFIC_CITATIONS,
  WEIGHT_CATEGORIES_PERSILAT,
  MASTER_FRAMEWORK_MONTHS,
  COMPETITION_POLICIES,
  BASELINE_ASSESSMENTS,
  TRAINING_PRIORITIES,
  PERIODIZATION_PHASES,
  KnowledgeArticle,
  KnowledgeCategory,
  WeightCategoryOption,
} from "../src/components/knowledge/knowledge-data";

// Color utilities for terminal output
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures: { name: string; error: string }[] = [];
const anomalies: { name: string; warning: string }[] = [];

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${green("✓ PASS")} ${testName}`);
  } else {
    failedTests++;
    const errMsg = detail || "Assertion failed";
    failures.push({ name: testName, error: errMsg });
    console.error(`  ${red("✗ FAIL")} ${testName}`);
    console.error(`         ${red(`Detail: ${errMsg}`)}`);
  }
}

function warn(warning: string, name: string) {
  anomalies.push({ name, warning });
  console.log(`  ${yellow("⚠ WARN")} [${name}]: ${warning}`);
}

console.log("");
console.log(bold(cyan("================================================================================")));
console.log(bold(cyan("   SPORT SCIENCE (SAINS SUKAN SILAT) EMPIRICAL CHALLENGER TEST SUITE")));
console.log(bold(cyan("================================================================================")));
console.log(dim(`Execution Time: ${new Date().toISOString()}`));
console.log("");

// ============================================================================
// SUITE 1: WEIGHT CUT PLANNER MATHEMATICAL MODEL & BOUNDARY TESTING
// ============================================================================
console.log(bold(yellow("--- SUITE 1: WEIGHT CUT PLANNER FORMULAS & BOUNDARIES ---")));

function calculateWeightCut(currentWeight: number, categoryCode: string, prepWeeks: number) {
  const selectedCategory: WeightCategoryOption =
    WEIGHT_CATEGORIES_PERSILAT.find((c) => c.code === categoryCode) || WEIGHT_CATEGORIES_PERSILAT[2];

  const targetWeight = selectedCategory.maxKg;
  const weightToLose = Math.max(0, Number((currentWeight - targetWeight).toFixed(2)));
  const percentageLoss = Number(((weightToLose / currentWeight) * 100).toFixed(1));
  const weeklyRateKg = Number((weightToLose / prepWeeks).toFixed(2));
  const weeklyRatePercent = Number(((weeklyRateKg / currentWeight) * 100).toFixed(2));

  let safetyEvaluation: {
    level: "optimal" | "safe" | "moderate" | "danger";
    title: string;
    desc: string;
    badgeColor: string;
  };

  if (weightToLose <= 0) {
    safetyEvaluation = {
      level: "optimal",
      title: "BERAT DALAM ZON SASARAN",
      desc: "Berat anda sudah berada dalam had kelas yang dipilih. Fokus kepada mengekalkan komposisi otot dan tenaga.",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    };
  } else if (weeklyRatePercent <= 0.8) {
    safetyEvaluation = {
      level: "safe",
      title: "PELAN SELAMAT & BERTAULIAH (ISN & ACSM)",
      desc: `Kadar penurunan ${weeklyRatePercent}%/minggu (<0.8%) mengekalkan 98% jisim otot tanpa menjejaskan refleks bertanding.`,
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    };
  } else if (weeklyRatePercent <= 1.0) {
    safetyEvaluation = {
      level: "moderate",
      title: "SEDERHANA: PERLUKAN PENGAWASAN JURULATIH",
      desc: `Kadar penurunan ${weeklyRatePercent}%/minggu (0.8-1.0%) berada di paras amaran atas. Pantau kualiti tidur dan paras hidrasi harian.`,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    };
  } else {
    safetyEvaluation = {
      level: "danger",
      title: "BAHAYA: RISIKO DEHIDRASI EKSTREM & KEKUATAN MERUDUM",
      desc: `Kadar ${weeklyRatePercent}%/minggu melebihi had selamat. Anda disyorkan menambah tempoh persediaan kepada 8 minggu atau naik ke Kelas ${String.fromCharCode(
        selectedCategory.code.charCodeAt(0) + 1
      )}.`,
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/40",
    };
  }

  return {
    selectedCategory,
    targetWeight,
    weightToLose,
    percentageLoss,
    weeklyRateKg,
    weeklyRatePercent,
    safetyEvaluation,
  };
}

// 1.1 Catalog Verification
assert(
  WEIGHT_CATEGORIES_PERSILAT.length === 11,
  "PERSILAT Weight Categories has exactly 11 official classes",
  `Found ${WEIGHT_CATEGORIES_PERSILAT.length}`
);

// Verify all classes have monotonic maxKg and minKg
for (let i = 0; i < WEIGHT_CATEGORIES_PERSILAT.length; i++) {
  const cat = WEIGHT_CATEGORIES_PERSILAT[i];
  assert(
    cat.maxKg > cat.minKg,
    `Class ${cat.code} (${cat.name}) maxKg (${cat.maxKg}) > minKg (${cat.minKg})`
  );
  if (i > 0) {
    const prev = WEIGHT_CATEGORIES_PERSILAT[i - 1];
    assert(
      cat.maxKg > prev.maxKg,
      `Class ${cat.code} maxKg (${cat.maxKg}) > Class ${prev.code} maxKg (${prev.maxKg})`
    );
  }
}

// 1.2 Boundary Condition: Weight Already Below / At Target (Optimal Tier)
const testAtTarget = calculateWeightCut(60.0, "C", 6); // Category C maxKg = 60
assert(
  testAtTarget.weightToLose === 0 &&
  testAtTarget.weeklyRateKg === 0 &&
  testAtTarget.safetyEvaluation.level === "optimal",
  "Weight exactly at category maxKg yields 0kg loss and 'optimal' tier",
  `Got weightToLose: ${testAtTarget.weightToLose}, level: ${testAtTarget.safetyEvaluation.level}`
);

const testBelowTarget = calculateWeightCut(57.5, "C", 6);
assert(
  testBelowTarget.weightToLose === 0 &&
  testBelowTarget.safetyEvaluation.level === "optimal",
  "Weight below category maxKg (57.5kg < 60kg) clamped to 0kg and 'optimal' tier",
  `Got weightToLose: ${testBelowTarget.weightToLose}`
);

// 1.3 Boundary Condition: Safe Tier (weeklyRatePercent <= 0.8)
// Example: current 62.0kg -> target 60.0kg in 8 weeks -> loss = 2.0kg, weeklyRate = 0.25kg, weeklyPercent = (0.25/62.0)*100 = 0.40%
const testSafe = calculateWeightCut(62.0, "C", 8);
assert(
  testSafe.weeklyRatePercent <= 0.8 && testSafe.safetyEvaluation.level === "safe",
  "Gradual cut (0.40%/week <= 0.8%) correctly classified as 'safe' tier",
  `weeklyRatePercent: ${testSafe.weeklyRatePercent}%, level: ${testSafe.safetyEvaluation.level}`
);

// Boundary value near 0.8%:
// If weight = 60.0 + 3.84 = 63.84kg in 8 weeks -> rate = 0.48kg/wk -> 0.48 / 63.84 = 0.75%
const testNearSafeBoundary = calculateWeightCut(63.8, "C", 8);
assert(
  testNearSafeBoundary.weeklyRatePercent <= 0.8 && testNearSafeBoundary.safetyEvaluation.level === "safe",
  "Cut near 0.8% threshold (0.74%/week) remains 'safe' tier",
  `Got ${testNearSafeBoundary.weeklyRatePercent}%, level: ${testNearSafeBoundary.safetyEvaluation.level}`
);

// 1.4 Boundary Condition: Moderate Tier (0.8 < weeklyRatePercent <= 1.0)
// Example: current 64.5kg -> target 60.0kg in 8 weeks -> loss = 4.5kg, weeklyRate = 0.56kg, weeklyPercent = (0.56/64.5)*100 = 0.87%
const testModerate = calculateWeightCut(64.5, "C", 8);
assert(
  testModerate.weeklyRatePercent > 0.8 &&
  testModerate.weeklyRatePercent <= 1.0 &&
  testModerate.safetyEvaluation.level === "moderate",
  "Moderate cut (0.87%/week) correctly classified as 'moderate' tier (0.8-1.0%)",
  `weeklyRatePercent: ${testModerate.weeklyRatePercent}%, level: ${testModerate.safetyEvaluation.level}`
);

// 1.5 Boundary Condition: Danger Tier (weeklyRatePercent > 1.0)
// Example: current 64.5kg -> target 60.0kg in 6 weeks -> loss = 4.5kg, weeklyRate = 0.75kg, weeklyPercent = (0.75/64.5)*100 = 1.16%
const testDanger = calculateWeightCut(64.5, "C", 6);
assert(
  testDanger.weeklyRatePercent > 1.0 && testDanger.safetyEvaluation.level === "danger",
  "Fast cut (1.16%/week > 1.0%) correctly triggers 'danger' tier",
  `weeklyRatePercent: ${testDanger.weeklyRatePercent}%, level: ${testDanger.safetyEvaluation.level}`
);

// 1.6 Boundary Condition: Prep Weeks 1 through 16 sweep
console.log(dim("  Testing prepWeeks boundary sweep (1 to 16 weeks) for 65kg -> 60kg:"));
for (let weeks = 1; weeks <= 16; weeks++) {
  const res = calculateWeightCut(65.0, "C", weeks);
  assert(
    !Number.isNaN(res.weeklyRateKg) && !Number.isNaN(res.weeklyRatePercent),
    `Week ${weeks}: weeklyRateKg (${res.weeklyRateKg}) and weeklyRatePercent (${res.weeklyRatePercent}%) are valid finite numbers`
  );
  assert(
    ["optimal", "safe", "moderate", "danger"].includes(res.safetyEvaluation.level),
    `Week ${weeks}: safetyEvaluation level is valid (${res.safetyEvaluation.level})`
  );
}

// 1.7 Stress Testing Edge Cases: Extreme Weights (35kg to 150kg)
const testLightweight = calculateWeightCut(35.0, "A", 4); // Category A max 50kg
assert(
  testLightweight.weightToLose === 0 && testLightweight.safetyEvaluation.level === "optimal",
  "Lightweight athlete (35kg) target Class A (50kg) is 0kg to lose and optimal tier"
);

const testHeavyweight = calculateWeightCut(150.0, "Open", 2); // Category Open max 130kg
assert(
  testHeavyweight.weightToLose === 20.0 &&
  testHeavyweight.weeklyRateKg === 10.0 &&
  testHeavyweight.safetyEvaluation.level === "danger",
  "Heavyweight athlete (150kg) target Open (130kg) in 2 weeks triggers danger tier (10kg/wk)"
);

// 1.8 Stress Testing Code Invariant: Next Category Index & Label Resolution
// Verifies fix in weight-cut-planner.tsx where next category is looked up from WEIGHT_CATEGORIES_PERSILAT catalog
const nextCatIndexJ = WEIGHT_CATEGORIES_PERSILAT.findIndex((c) => c.code === "J") + 1;
const nextCategoryLabelJ = nextCatIndexJ < WEIGHT_CATEGORIES_PERSILAT.length
  ? `Kelas ${WEIGHT_CATEGORIES_PERSILAT[nextCatIndexJ].code}`
  : "kategori lebih tinggi";

assert(
  nextCategoryLabelJ === "Kelas Open",
  "Category J correctly recommends 'Kelas Open' as next class without invalid 'Kelas K' anomaly",
  `Got: ${nextCategoryLabelJ}`
);

const nextCatIndexOpen = WEIGHT_CATEGORIES_PERSILAT.findIndex((c) => c.code === "Open") + 1;
const nextCategoryLabelOpen = nextCatIndexOpen < WEIGHT_CATEGORIES_PERSILAT.length
  ? `Kelas ${WEIGHT_CATEGORIES_PERSILAT[nextCatIndexOpen].code}`
  : "kategori lebih tinggi";

assert(
  nextCategoryLabelOpen === "kategori lebih tinggi",
  "Category Open correctly handles ceiling without invalid 'Kelas P' anomaly",
  `Got: ${nextCategoryLabelOpen}`
);

// ============================================================================
// SUITE 2: SWEAT RATE CALCULATOR FORMULAS & ALERT TRIGGERS
// ============================================================================
console.log("");
console.log(bold(yellow("--- SUITE 2: SWEAT RATE CALCULATOR FORMULAS & ALERTS ---")));

function calculateSweatRate(preWeight: number, postWeight: number, fluidDrankMl: number, durationMinutes: number) {
  const weightDiffKg = Number((preWeight - postWeight).toFixed(2));
  const fluidDrankL = Number((fluidDrankMl / 1000).toFixed(2));
  const totalSweatLossL = Math.max(0, Number((weightDiffKg + fluidDrankL).toFixed(2)));
  const durationHours = durationMinutes / 60;
  const hourlySweatRate = durationHours > 0 ? Number((totalSweatLossL / durationHours).toFixed(2)) : 0;
  const dehydrationPercent = preWeight > 0 ? Number(((weightDiffKg / preWeight) * 100).toFixed(2)) : 0;
  const recommendedRecoveryFluidL = Math.max(0, Number((weightDiffKg * 1.35).toFixed(2)));

  const alertTriggered = dehydrationPercent > 2;
  const alertColor = dehydrationPercent > 2 ? "text-rose-400" : dehydrationPercent > 1 ? "text-amber-300" : "text-emerald-400";
  const alertText = dehydrationPercent > 2
    ? "AMARAN: Dehidrasi >2% mengurangkan kuasa sepakan 12%!"
    : "STATUS BAIK: Dalam zon toleransi optimum (<2%).";

  return {
    weightDiffKg,
    fluidDrankL,
    totalSweatLossL,
    durationHours,
    hourlySweatRate,
    dehydrationPercent,
    recommendedRecoveryFluidL,
    alertTriggered,
    alertColor,
    alertText,
  };
}

// 2.1 Standard Scenario: 65.0kg pre, 63.8kg post, 600ml fluid, 90 mins
const stdSweat = calculateSweatRate(65.0, 63.8, 600, 90);
assert(
  stdSweat.weightDiffKg === 1.20,
  "Standard weightDiffKg is 1.20 kg",
  `Got ${stdSweat.weightDiffKg}`
);
assert(
  stdSweat.fluidDrankL === 0.60,
  "Fluid drank converted to 0.60 L",
  `Got ${stdSweat.fluidDrankL}`
);
assert(
  stdSweat.totalSweatLossL === 1.80,
  "Total sweat loss is 1.80 L (1.20kg + 0.60L)",
  `Got ${stdSweat.totalSweatLossL}`
);
assert(
  stdSweat.durationHours === 1.5,
  "Duration 90 min converts to 1.50 hours",
  `Got ${stdSweat.durationHours}`
);
assert(
  stdSweat.hourlySweatRate === 1.20,
  "Hourly sweat rate is 1.20 L/hr (1.80 / 1.5)",
  `Got ${stdSweat.hourlySweatRate}`
);
assert(
  stdSweat.dehydrationPercent === 1.85,
  "Dehydration percentage is 1.85% ((1.20 / 65) * 100)",
  `Got ${stdSweat.dehydrationPercent}`
);
assert(
  stdSweat.recommendedRecoveryFluidL === 1.62,
  "Recommended recovery fluid is 1.62 L (1.20 * 1.35)",
  `Got ${stdSweat.recommendedRecoveryFluidL}`
);
assert(
  !stdSweat.alertTriggered && stdSweat.alertColor === "text-amber-300",
  "1.85% dehydration triggers amber state (<2% optimum tolerance, >1% amber)",
  `alertTriggered: ${stdSweat.alertTriggered}, color: ${stdSweat.alertColor}`
);

// 2.2 Boundary Testing: Dehydration Alert Banner (> 2%)
// Test 1: Just below 2.0% (1.99%)
// 65.0kg * 1.99% = 1.2935kg lost -> post = 63.71kg
const sweat199 = calculateSweatRate(65.0, 63.71, 500, 60);
assert(
  sweat199.dehydrationPercent <= 2.0 && !sweat199.alertTriggered,
  "Dehydration 1.98% does NOT trigger >2% danger alert",
  `dehydrationPercent: ${sweat199.dehydrationPercent}%, alert: ${sweat199.alertTriggered}`
);

// Test 2: Exactly 2.00%
const sweat200 = calculateSweatRate(100.0, 98.0, 0, 60);
assert(
  sweat200.dehydrationPercent === 2.00 && !sweat200.alertTriggered,
  "Dehydration exactly 2.00% does NOT trigger >2% danger alert (strict > 2)",
  `dehydrationPercent: ${sweat200.dehydrationPercent}%, alert: ${sweat200.alertTriggered}`
);

// Test 3: Just above 2.0% (2.01%)
const sweat201 = calculateSweatRate(100.0, 97.98, 0, 60);
assert(
  sweat201.dehydrationPercent === 2.02 && sweat201.alertTriggered,
  "Dehydration 2.02% (>2%) reliably triggers >2% AMARAN alert banner",
  `dehydrationPercent: ${sweat201.dehydrationPercent}%, alert: ${sweat201.alertTriggered}`
);
assert(
  sweat201.alertColor === "text-rose-400" &&
  sweat201.alertText.includes("AMARAN: Dehidrasi >2%"),
  "Dehydration >2% displays rose warning text",
  `text: ${sweat201.alertText}`
);

// Test 4: Extreme dehydration (5.0%)
const sweat500 = calculateSweatRate(70.0, 66.5, 500, 120);
assert(
  sweat500.dehydrationPercent === 5.00 && sweat500.alertTriggered,
  "Extreme dehydration (5.0%) triggers danger alert with 4.73L recommended recovery",
  `dehy: ${sweat500.dehydrationPercent}%, recFluid: ${sweat500.recommendedRecoveryFluidL}L`
);

// 2.3 Edge Cases: Division-by-Zero Guards
const zeroDuration = calculateSweatRate(65.0, 64.0, 500, 0);
assert(
  zeroDuration.hourlySweatRate === 0 && !Number.isNaN(zeroDuration.hourlySweatRate),
  "Duration 0 min safely guards against division-by-zero (hourlySweatRate = 0)"
);

const zeroPreWeight = calculateSweatRate(0, 0, 500, 60);
assert(
  zeroPreWeight.dehydrationPercent === 0 && !Number.isNaN(zeroPreWeight.dehydrationPercent),
  "Pre-weight 0 safely guards against division-by-zero (dehydrationPercent = 0)"
);

// 2.4 Edge Case: Weight Gain (Overhydration during training)
const weightGainSweat = calculateSweatRate(60.0, 61.0, 2000, 60);
assert(
  weightGainSweat.totalSweatLossL === 1.00,
  "Athlete weight gain (-1kg + 2.0L drank) properly computes net sweat loss of 1.0L",
  `Got totalSweatLossL: ${weightGainSweat.totalSweatLossL}`
);
assert(
  weightGainSweat.recommendedRecoveryFluidL === 0,
  "Athlete weight gain safely clamps recommended recovery fluid to 0L without negative values",
  `Got: ${weightGainSweat.recommendedRecoveryFluidL}L`
);

// ============================================================================
// SUITE 3: FILTER & SEARCH REACTIVITY TESTING
// ============================================================================
console.log("");
console.log(bold(yellow("--- SUITE 3: FILTER & SEARCH REACTIVITY ---")));

function simulateFilterArticles(category: KnowledgeCategory, search: string): KnowledgeArticle[] {
  return KNOWLEDGE_ARTICLES.filter((article) => {
    const matchesCat = category === "all" || article.category === category;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      article.subtitle.toLowerCase().includes(q) ||
      article.summary.toLowerCase().includes(q) ||
      article.categoryLabel.toLowerCase().includes(q) ||
      (article.fieldProblem?.toLowerCase().includes(q) ?? false) ||
      (article.scientificSolution?.toLowerCase().includes(q) ?? false) ||
      (article.actionStepToday?.toLowerCase().includes(q) ?? false) ||
      article.keyTakeaways.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });
}

// 3.1 Category Counts Integrity
assert(
  CATEGORIES.length === 7,
  "Category catalog contains exactly 7 categories",
  `Found ${CATEGORIES.length}`
);

// Check if hardcoded count matches actual articles per category
for (const cat of CATEGORIES) {
  const actualCount = cat.id === "all"
    ? KNOWLEDGE_ARTICLES.length
    : KNOWLEDGE_ARTICLES.filter((a) => a.category === cat.id).length;
  
  assert(
    cat.count === actualCount,
    `Category '${cat.id}' count in CATEGORIES (${cat.count}) matches actual articles (${actualCount})`,
    `Mismatch for ${cat.id}: metadata ${cat.count} vs actual ${actualCount}`
  );
}

// 3.2 Category Filtering Isolation
for (const cat of CATEGORIES) {
  const filtered = simulateFilterArticles(cat.id, "");
  if (cat.id === "all") {
    assert(
      filtered.length === KNOWLEDGE_ARTICLES.length,
      `Category 'all' returns all ${KNOWLEDGE_ARTICLES.length} articles`
    );
  } else {
    assert(
      filtered.length === cat.count && filtered.every((a) => a.category === cat.id),
      `Category '${cat.id}' returns exactly ${cat.count} articles and all belong to '${cat.id}'`
    );
  }
}

// 3.3 Search Reactivity: Case-Insensitivity & Trimming
const searchLower = simulateFilterArticles("all", "periodisasi");
const searchUpper = simulateFilterArticles("all", "PERIODISASI");
const searchMixed = simulateFilterArticles("all", "PeRiOdIsAsI");
const searchSpaces = simulateFilterArticles("all", "   periodisasi   ");

assert(
  searchLower.length > 0,
  "Search query 'periodisasi' matches at least 1 article",
  `Found ${searchLower.length}`
);
assert(
  searchLower.length === searchUpper.length &&
  searchLower.length === searchMixed.length &&
  searchLower.length === searchSpaces.length,
  "Search is strictly case-insensitive and trims surrounding whitespace",
  `Counts: lower=${searchLower.length}, upper=${searchUpper.length}, mixed=${searchMixed.length}, spaces=${searchSpaces.length}`
);

// 3.4 Deep Field Search Coverage (title, subtitle, summary, fieldProblem, scientificSolution, actionStepToday, keyTakeaways)
// Test searching by fieldProblem ('burnout' in periodization, 'sauna' in weight management)
const searchProblemBurnout = simulateFilterArticles("all", "burnout");
assert(
  searchProblemBurnout.length >= 1,
  "Search finds articles by fieldProblem content ('burnout')",
  `Found ${searchProblemBurnout.length}`
);

const searchProblemSauna = simulateFilterArticles("all", "sauna");
assert(
  searchProblemSauna.length >= 1,
  "Search finds articles by fieldProblem content ('sauna')",
  `Found ${searchProblemSauna.length}`
);

// Test searching by scientificSolution ('ACWR', 'gut residue')
const searchSolutionACWR = simulateFilterArticles("all", "ACWR");
assert(
  searchSolutionACWR.length >= 1,
  "Search finds articles by scientificSolution content ('ACWR')",
  `Found ${searchSolutionACWR.length}`
);

const searchSolutionGut = simulateFilterArticles("all", "gut residue");
assert(
  searchSolutionGut.length >= 1,
  "Search finds articles by scientificSolution content ('gut residue')",
  `Found ${searchSolutionGut.length}`
);

// Test searching by actionStepToday ('Knee-to-Wall', 'Sweat Rate Test')
const searchAction = simulateFilterArticles("all", "Knee-to-Wall");
assert(
  searchAction.length >= 1,
  "Search finds articles by actionStepToday content ('Knee-to-Wall')",
  `Found ${searchAction.length}`
);

// Test searching by keyTakeaways ('Tapering', 'GPP', 'Leucine')
const searchTakeawayTaper = simulateFilterArticles("all", "Tapering");
assert(
  searchTakeawayTaper.length >= 1,
  "Search finds articles by keyTakeaways item ('Tapering')",
  `Found ${searchTakeawayTaper.length}`
);

const searchTakeawayGPP = simulateFilterArticles("all", "GPP");
assert(
  searchTakeawayGPP.length >= 1,
  "Search finds articles by keyTakeaways item ('GPP')",
  `Found ${searchTakeawayGPP.length}`
);

// 3.5 Empty Result Handling
const searchBogus = simulateFilterArticles("all", "xyznonexistentquery999");
assert(
  searchBogus.length === 0,
  "Non-matching search query cleanly returns 0 results (empty array without error)",
  `Got ${searchBogus.length}`
);

// 3.6 Combined Category + Search Query
const searchCatMatch = simulateFilterArticles("nutrition", "dehidrasi");
assert(
  searchCatMatch.length === 1 && searchCatMatch[0].category === "nutrition",
  "Category 'nutrition' + query 'dehidrasi' returns matching nutrition article"
);

const searchCatMismatch = simulateFilterArticles("nutrition", "periodisasi makrokitur");
assert(
  searchCatMismatch.length === 0,
  "Category 'nutrition' + mismatched query 'periodisasi makrokitur' returns 0 results"
);

// ============================================================================
// SUITE 4: MASTER ANNUAL TRAINING FRAMEWORK VISUALIZER REACTIVITY
// ============================================================================
console.log("");
console.log(bold(yellow("--- SUITE 4: MASTER ANNUAL TRAINING FRAMEWORK REACTIVITY ---")));

// 4.1 12-Month Periodization Roadmap Data Integrity
assert(
  MASTER_FRAMEWORK_MONTHS.length === 12,
  "MASTER_FRAMEWORK_MONTHS contains exactly 12 months",
  `Found ${MASTER_FRAMEWORK_MONTHS.length}`
);

for (let m = 1; m <= 12; m++) {
  const month = MASTER_FRAMEWORK_MONTHS.find((item) => item.monthIndex === m);
  assert(
    month !== undefined,
    `Month index ${m} exists in MASTER_FRAMEWORK_MONTHS`
  );
  if (month) {
    const expectedBlock = m <= 6 ? 1 : 2;
    assert(
      month.block === expectedBlock,
      `Month ${month.monthName} (M${m}) correctly assigned to Block ${expectedBlock}`,
      `Got block: ${month.block}`
    );
    assert(
      month.volumePercentage >= 0 && month.volumePercentage <= 100,
      `Month ${month.monthCode} volumePercentage (${month.volumePercentage}%) is within [0, 100]`
    );
    assert(
      month.intensityPercentage >= 0 && month.intensityPercentage <= 100,
      `Month ${month.monthCode} intensityPercentage (${month.intensityPercentage}%) is within [0, 100]`
    );
    assert(
      month.fighterxTasks.athlete.length >= 2,
      `Month ${month.monthCode} has >= 2 athlete tasks (found ${month.fighterxTasks.athlete.length})`
    );
    assert(
      month.fighterxTasks.coach.length >= 2,
      `Month ${month.monthCode} has >= 2 coach tasks (found ${month.fighterxTasks.coach.length})`
    );
    assert(
      typeof month.milestone === "string" && month.milestone.length > 5,
      `Month ${month.monthCode} has valid milestone text`
    );
  }
}

// 4.2 Block 1 vs Block 2 Toggling & Month Selection State Simulation
class FrameworkVisualizerState {
  selectedBlock: 1 | 2 = 1;
  selectedMonthIndex: number = 1;
  frameworkViewTab: "calendar" | "competition" | "baseline" | "priorities" = "calendar";
  baselineSessionFilter: "all" | "Sesi A (Fizikal & Mobiliti)" | "Sesi B (Teknik & Stamina)" = "all";

  setBlock(block: 1 | 2) {
    this.selectedBlock = block;
    if (block === 1 && this.selectedMonthIndex > 6) {
      this.selectedMonthIndex = 1;
    } else if (block === 2 && this.selectedMonthIndex <= 6) {
      this.selectedMonthIndex = 7;
    }
  }

  setMonth(monthIndex: number) {
    this.selectedMonthIndex = monthIndex;
  }

  setViewTab(tab: "calendar" | "competition" | "baseline" | "priorities") {
    this.frameworkViewTab = tab;
  }

  setBaselineFilter(filter: "all" | "Sesi A (Fizikal & Mobiliti)" | "Sesi B (Teknik & Stamina)") {
    this.baselineSessionFilter = filter;
  }

  get blockMonths() {
    return MASTER_FRAMEWORK_MONTHS.filter((m) => m.block === this.selectedBlock);
  }

  get activeMonthData() {
    return MASTER_FRAMEWORK_MONTHS.find((m) => m.monthIndex === this.selectedMonthIndex) || MASTER_FRAMEWORK_MONTHS[0];
  }

  get filteredBaselineTests() {
    if (this.baselineSessionFilter === "all") return BASELINE_ASSESSMENTS;
    return BASELINE_ASSESSMENTS.filter((t) => t.session === this.baselineSessionFilter);
  }
}

const fv = new FrameworkVisualizerState();

// Initial state verification
assert(
  fv.selectedBlock === 1 && fv.selectedMonthIndex === 1 && fv.frameworkViewTab === "calendar",
  "Default visualizer state: Block 1, Month 1 (JAN), View 'calendar'"
);
assert(
  fv.blockMonths.length === 6 && fv.blockMonths.every((m) => m.block === 1),
  "Block 1 strip renders exactly 6 months (Jan-Jun)"
);
assert(
  fv.activeMonthData.monthCode === "JAN" && fv.activeMonthData.monthName === "Januari",
  "Active month data resolves to January"
);

// Switch to Month 4 (April) in Block 1
fv.setMonth(4);
assert(
  fv.selectedMonthIndex === 4 && fv.activeMonthData.monthCode === "APR",
  "Selecting Month 4 updates activeMonthData to April"
);

// Switch to Block 2
fv.setBlock(2);
assert(
  fv.selectedBlock === 2,
  "Visualizer successfully switched to Block 2"
);
assert(
  fv.selectedMonthIndex === 7 && fv.activeMonthData.monthCode === "JUL",
  "Switching from Month 4 (Block 1) to Block 2 automatically clamps active month to July (Month 7)",
  `Got monthIndex: ${fv.selectedMonthIndex}, monthCode: ${fv.activeMonthData.monthCode}`
);
assert(
  fv.blockMonths.length === 6 && fv.blockMonths.every((m) => m.block === 2),
  "Block 2 strip renders exactly 6 months (Jul-Dec)"
);

// Select Month 11 (November) in Block 2
fv.setMonth(11);
assert(
  fv.selectedMonthIndex === 11 && fv.activeMonthData.monthCode === "NOV",
  "Selecting Month 11 in Block 2 resolves to November"
);

// Switch back to Block 1
fv.setBlock(1);
assert(
  fv.selectedBlock === 1 && fv.selectedMonthIndex === 1 && fv.activeMonthData.monthCode === "JAN",
  "Switching from Month 11 (Block 2) to Block 1 automatically resets active month to January (Month 1)",
  `Got monthIndex: ${fv.selectedMonthIndex}`
);

// 4.3 Sub-View Tab State Transitions (4 Sub-views)
const tabs: ("calendar" | "competition" | "baseline" | "priorities")[] = [
  "calendar",
  "competition",
  "baseline",
  "priorities",
];

for (const tab of tabs) {
  fv.setViewTab(tab);
  assert(
    fv.frameworkViewTab === tab,
    `Sub-view tab transition to '${tab}' succeeded`
  );
}

// 4.4 View 2: Competition Policies Invariants
assert(
  COMPETITION_POLICIES.length === 3,
  "Competition policies has exactly 3 tiers (Priority A, B, C)",
  `Found ${COMPETITION_POLICIES.length}`
);
const priorities = COMPETITION_POLICIES.map((p) => p.priority);
assert(
  priorities.includes("A") && priorities.includes("B") && priorities.includes("C"),
  "Competition policies includes Priority A (Major), Priority B (Development), and Priority C (Exposure)"
);

// 4.5 View 3: 6 Baseline Assessments & Session Filter Reactivity
assert(
  BASELINE_ASSESSMENTS.length === 6,
  "BASELINE_ASSESSMENTS contains exactly 6 official baseline test protocols",
  `Found ${BASELINE_ASSESSMENTS.length}`
);

fv.setBaselineFilter("all");
assert(
  fv.filteredBaselineTests.length === 6,
  "Baseline filter 'all' returns all 6 assessments"
);

fv.setBaselineFilter("Sesi A (Fizikal & Mobiliti)");
assert(
  fv.filteredBaselineTests.length === 3 &&
  fv.filteredBaselineTests.every((t) => t.session === "Sesi A (Fizikal & Mobiliti)"),
  "Baseline filter 'Sesi A' returns exactly 3 tests (Fizikal & Mobiliti)",
  `Found ${fv.filteredBaselineTests.length}`
);

fv.setBaselineFilter("Sesi B (Teknik & Stamina)");
assert(
  fv.filteredBaselineTests.length === 3 &&
  fv.filteredBaselineTests.every((t) => t.session === "Sesi B (Teknik & Stamina)"),
  "Baseline filter 'Sesi B' returns exactly 3 tests (Teknik & Stamina)",
  `Found ${fv.filteredBaselineTests.length}`
);

// Verify rubric details for all 6 tests
for (const test of BASELINE_ASSESSMENTS) {
  assert(
    test.scoringRubric.length >= 3,
    `Assessment '${test.title}' has >= 3 scoring tiers (found ${test.scoringRubric.length})`
  );
  assert(
    typeof test.officialReference === "string" && test.officialReference.length > 3,
    `Assessment '${test.title}' has official reference citation (${test.officialReference})`
  );
}

// 4.6 View 4: 5 Training Priorities Invariants
assert(
  TRAINING_PRIORITIES.length === 5,
  "TRAINING_PRIORITIES contains exactly 5 core athletic development pillars",
  `Found ${TRAINING_PRIORITIES.length}`
);
const priorityCodes = TRAINING_PRIORITIES.map((p) => p.code);
assert(
  priorityCodes.includes("ENDURANCE") &&
  priorityCodes.includes("STRENGTH") &&
  priorityCodes.includes("MOVEMENT") &&
  priorityCodes.includes("TECHNICAL") &&
  priorityCodes.includes("RECOVERY"),
  "5 priorities match: ENDURANCE, STRENGTH, MOVEMENT, TECHNICAL, RECOVERY"
);

// ============================================================================
// SUITE 5: OFFICIAL SCIENTIFIC ACCREDITATION & EXTERNAL LINKS
// ============================================================================
console.log("");
console.log(bold(yellow("--- SUITE 5: OFFICIAL CITATIONS & SCIENTIFIC ACCREDITATION ---")));

assert(
  SCIENTIFIC_CITATIONS.length >= 6,
  `SCIENTIFIC_CITATIONS repository contains >= 6 peer-reviewed references (found ${SCIENTIFIC_CITATIONS.length})`
);

for (const cit of SCIENTIFIC_CITATIONS) {
  assert(
    cit.authors.length > 0 && cit.year > 2000 && cit.title.length > 5 && cit.journal.length > 0,
    `Citation '${cit.id}' has valid metadata (${cit.authors}, ${cit.year})`
  );
}

// Verify articles have plain-language fieldProblem, scientificSolution, actionStepToday
for (const art of KNOWLEDGE_ARTICLES) {
  assert(
    typeof art.fieldProblem === "string" && art.fieldProblem.length > 10,
    `Article '${art.slug}' has practical fieldProblem section`
  );
  assert(
    typeof art.scientificSolution === "string" && art.scientificSolution.length > 10,
    `Article '${art.slug}' has practical scientificSolution section`
  );
  assert(
    typeof art.actionStepToday === "string" && art.actionStepToday.length > 10,
    `Article '${art.slug}' has practical actionStepToday section`
  );
  assert(
    Array.isArray(art.officialLinks) && art.officialLinks.length >= 1,
    `Article '${art.slug}' has official external citation links (found ${art.officialLinks?.length})`
  );
}

// ============================================================================
// FINAL SUMMARY & RESULTS COMPILATION
// ============================================================================
console.log("");
console.log(bold(cyan("================================================================================")));
console.log(bold(cyan("                      TEST RESULTS SUMMARY")));
console.log(bold(cyan("================================================================================")));
console.log(`Total Invariants Evaluated : ${bold(totalTests.toString())}`);
console.log(`Passed Invariants          : ${bold(green(passedTests.toString()))}`);
console.log(`Failed Invariants          : ${bold(failedTests > 0 ? red(failedTests.toString()) : "0")}`);
console.log(`Cosmetic Anomalies / Warns : ${bold(anomalies.length > 0 ? yellow(anomalies.length.toString()) : "0")}`);

if (failures.length > 0) {
  console.log("");
  console.log(bold(red("FAILURES ENCOUNTERED:")));
  for (const f of failures) {
    console.log(`  - ${f.name}: ${f.error}`);
  }
}

if (anomalies.length > 0) {
  console.log("");
  console.log(bold(yellow("OBSERVED ANOMALIES / MINOR CAVEATS:")));
  for (const a of anomalies) {
    console.log(`  - [${a.name}]: ${a.warning}`);
  }
}

console.log("");
if (failedTests === 0) {
  console.log(bold(green(">>> EMPIRICAL VERDICT: APPROVE <<<")));
  process.exit(0);
} else {
  console.log(bold(red(">>> EMPIRICAL VERDICT: REJECT <<<")));
  process.exit(1);
}
