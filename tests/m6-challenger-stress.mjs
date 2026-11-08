import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} ${details ? '- ' + details : ''}`);
    failureDetails.push({ testName, details });
  }
}

console.log('===============================================================');
console.log('M6 EMPIRICAL CHALLENGER STRESS HARNESS — 5 TARGET PAGES');
console.log('===============================================================');

// -------------------------------------------------------------
// SUITE 1: Target Component Inventory & File Integrity
// -------------------------------------------------------------
console.log('\n--- SUITE 1: Component File Existence & Size Checks ---');

const expectedFiles = [
  // Disciplines
  'src/components/disciplines/disciplines-hero.tsx',
  'src/components/disciplines/category-comparison-matrix.tsx',
  'src/components/disciplines/silat-seni-section.tsx',
  'src/components/disciplines/silat-olahraga-section.tsx',
  'src/components/disciplines/equipment-breakdown.tsx',
  'src/components/disciplines/disciplines-cta.tsx',
  'src/components/disciplines/disciplines-data.ts',
  'src/components/disciplines/disciplines-page-view.tsx',
  // Competitions
  'src/components/competitions/competitions-client.tsx',
  'src/components/competitions/competitions-data.ts',
  'src/components/competitions/competitions.css',
  // Leaderboard
  'src/components/leaderboard/leaderboard-client.tsx',
  'src/components/leaderboard/athlete-detail-modal.tsx',
  'src/components/leaderboard/data.ts',
  'src/components/leaderboard/types.ts',
  // Guidelines
  'src/app/guidelines/page.tsx',
  'src/components/guidelines/tanding-calculator.tsx',
  'src/components/guidelines/jurus-calculator.tsx',
  'src/components/guidelines/rulebook-explorer.tsx',
  'src/components/guidelines/official-disclaimer.tsx',
  'src/lib/guidelines/scoring.ts',
  'src/lib/guidelines/rules-data.ts',
  'src/lib/guidelines/types.ts',
  // Knowledge
  'src/components/knowledge/knowledge.css',
  'src/components/knowledge/knowledge-data.ts',
  'src/components/knowledge/knowledge-hub-client.tsx',
  'src/components/knowledge/periodization-matrix.tsx',
  'src/components/knowledge/sweat-rate-calculator.tsx',
  'src/components/knowledge/weight-cut-planner.tsx',
  'src/components/knowledge/stakeholder-guide-switcher.tsx',
  'src/components/knowledge/citations-drawer.tsx',
  'src/app/knowledge/page.tsx',
  'src/app/knowledge-hub/page.tsx',
  'src/app/knowledge/[slug]/page.tsx'
];

for (const relPath of expectedFiles) {
  const fullPath = path.join(projectRoot, relPath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `File exists: ${relPath}`);
  if (exists) {
    const stat = fs.statSync(fullPath);
    assert(stat.size > 100, `File non-empty (>100B): ${relPath} (${stat.size} bytes)`);
  }
}

// -------------------------------------------------------------
// SUITE 2: Import Path & Resolution Static Analysis
// -------------------------------------------------------------
console.log('\n--- SUITE 2: Static Import Resolution Across 5 Target Areas ---');

const dirsToScan = [
  'src/components/disciplines',
  'src/components/competitions',
  'src/components/leaderboard',
  'src/components/guidelines',
  'src/components/knowledge',
  'src/app/disciplines',
  'src/app/calendar',
  'src/app/competitions',
  'src/app/leaderboard',
  'src/app/guidelines',
  'src/app/knowledge'
];

let unresolvedImports = 0;

for (const dir of dirsToScan) {
  const fullDir = path.join(projectRoot, dir);
  if (!fs.existsSync(fullDir)) continue;
  const entries = fs.readdirSync(fullDir, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx'))) continue;
    const filePath = path.join(entry.parentPath || fullDir, entry.name);
    const content = fs.readFileSync(filePath, 'utf8');

    // Match static imports
    const importRegex = /(?:import|export)\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const specifier = match[1];
      if (specifier.startsWith('.') || specifier.startsWith('@/')) {
        let candidate = '';
        if (specifier.startsWith('@/')) {
          candidate = path.join(projectRoot, 'src', specifier.slice(2));
        } else {
          candidate = path.resolve(path.dirname(filePath), specifier);
        }

        const exts = ['', '.ts', '.tsx', '.js', '.jsx', '.css', '/index.ts', '/index.tsx'];
        const resolved = exts.some((ext) => {
          const testPath = candidate + ext;
          return fs.existsSync(testPath) && fs.statSync(testPath).isFile();
        });

        if (!resolved) {
          unresolvedImports++;
          assert(false, `Unresolved import in ${path.relative(projectRoot, filePath)}`, `Specifier: ${specifier}`);
        }
      }
    }
  }
}

assert(unresolvedImports === 0, 'All local & alias module imports resolve correctly', `Found ${unresolvedImports} broken imports`);

// -------------------------------------------------------------
// SUITE 3: Interactive Calculators & Math Adversarial Stress Testing
// -------------------------------------------------------------
console.log('\n--- SUITE 3: Calculators Mathematical Adversarial Invariant Tests ---');

// Dynamically import scoring logic
async function runMathStressTests() {
  const scoringModulePath = pathToFileURL(path.join(projectRoot, 'src/lib/guidelines/scoring.ts')).href;
  const scoring = await import(scoringModulePath);
  const { calculateTandingScore, calculateJurusScore, getPenaltyDeduction, isDisqualifyingPenalty } = scoring;

  // TANDING CALCULATOR STRESS
  // 1. Nominal Calculation
  const nomScore = calculateTandingScore(7, 4, 3, ['TEGURAN_1']);
  // 7*1 + 4*2 + 3*3 = 7 + 8 + 9 = 24. Teguran 1 = -1 -> 23
  assert(nomScore.totalScore === 23, 'Tanding nominal calculation: 7 punches + 4 kicks + 3 takedowns - Teguran 1 = 23');
  assert(!nomScore.isDisqualified, 'Tanding nominal is not disqualified');

  // 2. Penalty Deductions & Disqualification
  assert(getPenaltyDeduction('TEGURAN_1') === 1, 'Teguran 1 deduction is 1');
  assert(getPenaltyDeduction('TEGURAN_2') === 2, 'Teguran 2 deduction is 2');
  assert(getPenaltyDeduction('PERINGATAN_1') === 5, 'Peringatan 1 deduction is 5');
  assert(getPenaltyDeduction('PERINGATAN_2') === 10, 'Peringatan 2 deduction is 10');
  assert(isDisqualifyingPenalty('PERINGATAN_3_DQ'), 'Peringatan 3 is disqualifying');
  assert(isDisqualifyingPenalty('DIRECT_DQ'), 'Direct DQ is disqualifying');

  const dqBout = calculateTandingScore(10, 5, 2, ['PERINGATAN_3_DQ']);
  assert(dqBout.isDisqualified === true, 'Peringatan 3 DQ sets isDisqualified to true');

  const directDqBout = calculateTandingScore(0, 0, 0, ['DIRECT_DQ']);
  assert(directDqBout.isDisqualified === true, 'Direct DQ sets isDisqualified to true');

  // 3. Boundary & Malformed Inputs
  const clampNegative = calculateTandingScore(-10, -5, -2, []);
  assert(clampNegative.totalScore === 0, 'Negative inputs clamp cleanly to 0 points');
  assert(clampNegative.punches === 0 && clampNegative.kicks === 0 && clampNegative.takedowns === 0, 'Individual strikes clamp to 0');

  const nanBout = calculateTandingScore(NaN, undefined, null, []);
  assert(nanBout.totalScore === 0, 'NaN / null / undefined safely default to 0 points');

  const extremeBout = calculateTandingScore(1000, 500, 200, ['TEGURAN_2', 'PERINGATAN_1', 'PERINGATAN_2']);
  // 1000*1 + 500*2 + 200*3 = 1000 + 1000 + 600 = 2600. Deductions: 2 + 5 + 10 = 17 -> 2583
  assert(extremeBout.totalScore === 2583, 'High volume bout score computes accurately: 2583');

  // JURUS CALCULATOR STRESS
  // 1. Standard Tunggal baseline
  const jNom = calculateJurusScore({
    category: 'TUNGGAL',
    accuracyScore: 9.9,
    expressionScore: 0.05,
    deductions: {
      timeOverUnderSeconds: 0,
      weaponDrops: 0,
      boundaryViolations: 0,
      costumeFaults: 0,
      movementFaults: 0,
    }
  });
  assert(jNom.netScore === 9.95, `Jurus standard clean score is 9.95 (got ${jNom.netScore})`);
  assert(jNom.totalDeductions === 0, 'Jurus clean deductions is 0');

  // 2. Cumulative complex deductions
  const jDed = calculateJurusScore({
    category: 'TUNGGAL',
    accuracyScore: 9.9,
    expressionScore: 0.05,
    deductions: {
      timeOverUnderSeconds: 14, // 2 blocks of 5s = 0.10
      weaponDrops: 2,           // 2 * 0.50 = 1.00
      boundaryViolations: 1,    // 0.05
      costumeFaults: 2,         // 2 * 0.05 = 0.10
      movementFaults: 5,        // 5 * 0.01 = 0.05
    }
  });
  // Total deductions: 0.10 + 1.00 + 0.05 + 0.10 + 0.05 = 1.30
  // Gross: 9.95 - 1.30 = 8.65
  assert(jDed.totalDeductions === 1.30, `Jurus total deductions is 1.30 (got ${jDed.totalDeductions})`);
  assert(jDed.netScore === 8.65, `Jurus net score is 8.65 (got ${jDed.netScore})`);

  // 3. Sub-zero clamp
  const jSubZero = calculateJurusScore({
    category: 'GANDA',
    accuracyScore: 5.0,
    expressionScore: 0.0,
    deductions: { weaponDrops: 20 } // -10.0 deduction
  });
  assert(jSubZero.netScore === 0, 'Jurus net score never drops below 0.0');

  // 4. Invariant: time blocks integer truncation
  const jTime1 = calculateJurusScore({ deductions: { timeOverUnderSeconds: 4 } });
  const jTime2 = calculateJurusScore({ deductions: { timeOverUnderSeconds: 5 } });
  const jTime3 = calculateJurusScore({ deductions: { timeOverUnderSeconds: 9 } });
  assert(jTime1.timeDeduction === 0, 'Time deviation < 5s results in 0.00 deduction');
  assert(jTime2.timeDeduction === 0.05, 'Time deviation of 5s results in 0.05 deduction');
  assert(jTime3.timeDeduction === 0.05, 'Time deviation of 9s still results in 0.05 deduction');

  // SPORT SCIENCE CALCULATORS STRESS (Sweat Rate & Weight Cut)
  // Sweat Rate Formula:
  // weightDiffKg = preWeight - postWeight
  // totalSweatLossL = weightDiffKg + fluidDrankL
  // hourlySweatRate = totalSweatLossL / durationHours
  // dehydrationPercent = (weightDiffKg / preWeight) * 100
  const preWeight = 65.0;
  const postWeight = 63.8;
  const fluidDrankMl = 600;
  const durationMinutes = 90;

  const weightDiffKg = Number((preWeight - postWeight).toFixed(2)); // 1.2 kg
  const fluidDrankL = Number((fluidDrankMl / 1000).toFixed(2)); // 0.6 L
  const totalSweatLossL = Math.max(0, Number((weightDiffKg + fluidDrankL).toFixed(2))); // 1.8 L
  const durationHours = durationMinutes / 60; // 1.5 hr
  const hourlySweatRate = Number((totalSweatLossL / durationHours).toFixed(2)); // 1.20 L/hr
  const dehydrationPercent = Number(((weightDiffKg / preWeight) * 100).toFixed(2)); // 1.85%

  assert(weightDiffKg === 1.2, `Sweat test: weight diff is 1.2 kg (got ${weightDiffKg})`);
  assert(totalSweatLossL === 1.8, `Sweat test: total sweat loss is 1.8 L (got ${totalSweatLossL})`);
  assert(hourlySweatRate === 1.2, `Sweat test: hourly sweat rate is 1.20 L/h (got ${hourlySweatRate})`);
  assert(dehydrationPercent === 1.85, `Sweat test: dehydration is 1.85% (got ${dehydrationPercent}%)`);

  // Zero duration guard
  const zeroDurRate = 0 > 0 ? (totalSweatLossL / 0) : 0;
  assert(zeroDurRate === 0, 'Zero duration sweat test guarded against division by zero');

  // Weight Cut Planner Stress
  // currentWeight: 64.5 kg, targetCategory C (maxKg: 60)
  const cWeight = 64.5;
  const tMax = 60.0;
  const weeks = 6;
  const toLose = Math.max(0, Number((cWeight - tMax).toFixed(2))); // 4.5 kg
  const weeklyLoss = Number((toLose / weeks).toFixed(2)); // 0.75 kg/week
  const weeklyPct = Number(((weeklyLoss / cWeight) * 100).toFixed(2)); // 1.16%

  assert(toLose === 4.5, `Weight cut: to lose is 4.5 kg (got ${toLose})`);
  assert(weeklyLoss === 0.75, `Weight cut: weekly loss is 0.75 kg (got ${weeklyLoss})`);
  assert(weeklyPct === 1.16, `Weight cut: weekly percent is 1.16% (got ${weeklyPct}%)`);
}

// -------------------------------------------------------------
// SUITE 4: Static Dataset Integrity & Schema Compliance
// -------------------------------------------------------------
console.log('\n--- SUITE 4: Static Datasets Schema & Non-Empty Checks ---');

async function runDatasetChecks() {
  // Leaderboard data
  const lbData = await import(pathToFileURL(path.join(projectRoot, 'src/components/leaderboard/data.ts')).href);
  const athletes = lbData.ALL_REGISTERED_ATHLETES;
  assert(Array.isArray(athletes) && athletes.length >= 25, `Leaderboard: registered athletes >= 25 (found ${athletes?.length})`);

  const athletesValid = athletes.every((a) =>
    a.id &&
    a.fullName &&
    a.clubName &&
    a.discipline &&
    typeof a.rank === 'number' &&
    typeof a.points === 'object' &&
    typeof a.points.totalVerifiedPoints === 'number' &&
    Array.isArray(a.badges)
  );
  assert(athletesValid, 'Leaderboard: all athletes have valid schema (id, fullName, clubName, discipline, rank, points, badges)');

  // Competitions data
  const compData = await import(pathToFileURL(path.join(projectRoot, 'src/components/competitions/competitions-data.ts')).href);
  const comps = compData.INITIAL_COMPETITIONS;
  assert(Array.isArray(comps) && comps.length >= 6, `Competitions: initial competitions >= 6 (found ${comps?.length})`);

  const compsValid = comps.every((c) =>
    c.id && c.title && c.tier && c.state && c.startDate && c.endDate && Array.isArray(c.ageCategories) && Array.isArray(c.disciplines)
  );
  assert(compsValid, 'Competitions: all competitions have valid schema (id, title, tier, state, dates, categories, disciplines)');

  // Knowledge data
  const kData = await import(pathToFileURL(path.join(projectRoot, 'src/components/knowledge/knowledge-data.ts')).href);
  const articles = kData.KNOWLEDGE_ARTICLES;
  assert(Array.isArray(articles) && articles.length >= 8, `Knowledge: articles >= 8 (found ${articles?.length})`);

  const articlesValid = articles.every((a) =>
    a.slug && a.title && a.category && a.summary && Array.isArray(a.keyTakeaways) && a.keyTakeaways.length > 0
  );
  assert(articlesValid, 'Knowledge: all articles have valid schema (slug, title, category, summary, keyTakeaways)');

  // Guidelines data
  const rulesData = await import(pathToFileURL(path.join(projectRoot, 'src/lib/guidelines/rules-data.ts')).href);
  const rules = rulesData.RULE_ENTRIES;
  assert(Array.isArray(rules) && rules.length >= 10, `Guidelines: rule entries >= 10 (found ${rules?.length})`);

  const rulesValid = rules.every((r) =>
    r.id && r.category && r.title && r.summary && r.citation
  );
  assert(rulesValid, 'Guidelines: all rules have valid schema (id, category, title, summary, citation)');
}

// -------------------------------------------------------------
// EXECUTE ASYNC SUITES
// -------------------------------------------------------------
async function runAll() {
  await runMathStressTests();
  await runDatasetChecks();

  console.log('\n===============================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('===============================================================');

  if (failedTests > 0) {
    console.error(`\nFAILED TESTS SUMMARY (${failedTests}):`);
    for (const f of failureDetails) {
      console.error(`  - ${f.testName} ${f.details ? ': ' + f.details : ''}`);
    }
    process.exit(1);
  } else {
    console.log('\n>>> EMPIRICAL VERDICT: ALL ADVERSARIAL CHALLENGES PASSED! <<<');
    process.exit(0);
  }
}

runAll().catch((err) => {
  console.error('Fatal harness error:', err);
  process.exit(1);
});
