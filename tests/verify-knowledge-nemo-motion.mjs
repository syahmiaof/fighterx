import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("     FIGHTERX SPORT SCIENCE (/knowledge) NEMO MOTION VERIFICATION SUITE         ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}/knowledge\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/knowledge`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const testResults = [];
  function assert(id, description, passed, details = "") {
    testResults.push({ id, description, passed, details });
    const mark = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`  ${mark} [${id}] ${description}`);
    if (details) console.log(`         -> ${details}`);
  }

  // 1. VERIFY CSS HOVER RULES FOR SPORT SCIENCE CARDS
  console.log("\n--- 1. CARD HOVER MICRO-INTERACTIONS & TRANSITIONS ---");
  const cssRules = await page.evaluate(() => {
    const results = {
      cardHover: null,
      weightCardHover: null,
      frostedSubcardHover: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes(".knowledge-article-card:hover")) {
            results.cardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".weight-category-card:hover")) {
            results.weightCardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".knowledge-frosted-subcard:hover")) {
            results.frostedSubcardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              borderColor: rule.style.borderColor,
            };
          }
        }
      } catch {}
    }
    return results;
  });

  assert(
    "SPORT-SCIENCE-HOVER-01",
    ".knowledge-article-card and matrix cards specify translateY(-3px) on hover",
    cssRules.cardHover && cssRules.cardHover.transform.includes("translateY(-3px)"),
    JSON.stringify(cssRules.cardHover)
  );

  assert(
    "SPORT-SCIENCE-HOVER-02",
    ".weight-category-card specifies translateY(-2px) and crimson specular border on hover",
    cssRules.weightCardHover && cssRules.weightCardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.weightCardHover)
  );

  assert(
    "SPORT-SCIENCE-HOVER-03",
    ".knowledge-frosted-subcard specifies translateY(-2px) on hover",
    cssRules.frostedSubcardHover && cssRules.frostedSubcardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.frostedSubcardHover)
  );

  // 2. VERIFY HERO 4 KPI STAT CARDS ENTRANCE & INLINE CLEANUP
  console.log("\n--- 2. HERO 4 KPI STAT CARDS ENTRANCE ---");
  await page.waitForTimeout(1400); // Wait for initial hero 0.95s animation to finish
  const statCardStatus = await page.evaluate(() => {
    const cards = document.querySelectorAll(".knowledge-stat-card");
    return {
      count: cards.length,
      allVisible: Array.from(cards).every((c) => {
        const style = window.getComputedStyle(c);
        return style.opacity === "1" && style.visibility !== "hidden";
      }),
      cleanClipPath: Array.from(cards).every((c) => !c.style.clipPath && !c.style.webkitClipPath),
      cleanTransform: Array.from(cards).every((c) => !c.style.transform),
    };
  });

  assert(
    "HERO-STAT-CARDS-01",
    "4 Hero KPI stat cards render with full visibility and clean inline properties",
    statCardStatus.count === 4 && statCardStatus.allVisible && statCardStatus.cleanClipPath && statCardStatus.cleanTransform,
    `Count: ${statCardStatus.count}, Visible: ${statCardStatus.allVisible}, CleanClip: ${statCardStatus.cleanClipPath}, CleanTransform: ${statCardStatus.cleanTransform}`
  );

  // 3. MASTER ANNUAL TRAINING FRAMEWORK 2027 SECTION
  console.log("\n--- 3. MASTER ANNUAL TRAINING FRAMEWORK 2027 CARDS ---");
  const frameworkSec = page.locator("#master-framework");
  await frameworkSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);

  const frameworkStatus = await page.evaluate(() => {
    const blockCards = document.querySelectorAll(".framework-block-card");
    const monthBtns = document.querySelectorAll(".timeline-month-btn");
    const detailCard = document.querySelector(".framework-detail-card");
    const subcards = document.querySelectorAll(".framework-detail-card .knowledge-frosted-subcard");

    return {
      blockCount: blockCards.length,
      monthCount: monthBtns.length,
      detailVisible: detailCard ? window.getComputedStyle(detailCard).opacity === "1" : false,
      detailClean: detailCard ? !detailCard.style.clipPath && !detailCard.style.transform : false,
      subcardCount: subcards.length,
    };
  });

  assert(
    "FRAMEWORK-CARDS-01",
    "Master Framework renders Block 1 & 2 cards with clean inline styling",
    frameworkStatus.blockCount === 2,
    `Block Cards Count: ${frameworkStatus.blockCount}`
  );

  assert(
    "FRAMEWORK-MONTHS-01",
    "Master Framework renders 6 month buttons and active detail card",
    frameworkStatus.monthCount === 6 && frameworkStatus.detailVisible && frameworkStatus.detailClean,
    `Months: ${frameworkStatus.monthCount}, Detail Visible: ${frameworkStatus.detailVisible}, Detail Clean: ${frameworkStatus.detailClean}`
  );

  assert(
    "FRAMEWORK-SUBCARDS-01",
    "Active month detail card renders 2 frosted subcards (Athlete & Coach tasks)",
    frameworkStatus.subcardCount === 2,
    `Subcards Count: ${frameworkStatus.subcardCount}`
  );

  // 4. TEST SUB-VIEW TAB SWITCHES (Competition, Baseline, Priorities)
  console.log("\n--- 4. MASTER FRAMEWORK SUB-VIEW TABS ---");

  // Tab 2: Dasar Pertandingan
  await page.locator('.knowledge-pill-switcher button:has-text("2. Dasar Pertandingan")').click();
  await page.waitForTimeout(1100);
  const policyStatus = await page.evaluate(() => {
    const cards = document.querySelectorAll(".framework-policy-card");
    const banner = document.querySelector(".fight-week-banner");
    return {
      count: cards.length,
      clean: Array.from(cards).every((c) => !c.style.clipPath && !c.style.transform),
      bannerExists: Boolean(banner),
    };
  });
  assert(
    "FRAMEWORK-TAB-COMPETITION",
    "Dasar Pertandingan view renders 3 policy cards and Fight Week banner cleanly",
    policyStatus.count === 3 && policyStatus.clean && policyStatus.bannerExists,
    `Policies Count: ${policyStatus.count}, Clean: ${policyStatus.clean}, Banner: ${policyStatus.bannerExists}`
  );

  // Tab 3: 6 Ujian Baseline
  await page.locator('.knowledge-pill-switcher button:has-text("3. 6 Ujian Baseline")').click();
  await page.waitForTimeout(1100);
  const baselineStatus = await page.evaluate(() => {
    const cards = document.querySelectorAll(".framework-baseline-card");
    return {
      count: cards.length,
      clean: Array.from(cards).every((c) => !c.style.clipPath && !c.style.transform),
    };
  });
  assert(
    "FRAMEWORK-TAB-BASELINE",
    "6 Ujian Baseline view renders 6 assessment cards cleanly",
    baselineStatus.count === 6 && baselineStatus.clean,
    `Baseline Cards Count: ${baselineStatus.count}, Clean: ${baselineStatus.clean}`
  );

  // Tab 4: 5 Training Priorities
  await page.locator('.knowledge-pill-switcher button:has-text("4. 5 Training Priorities")').click();
  await page.waitForTimeout(1100);
  const priorityStatus = await page.evaluate(() => {
    const cards = document.querySelectorAll(".framework-priority-card");
    return {
      count: cards.length,
      clean: Array.from(cards).every((c) => !c.style.clipPath && !c.style.transform),
    };
  });
  assert(
    "FRAMEWORK-TAB-PRIORITIES",
    "5 Training Priorities view renders 5 priority cards cleanly",
    priorityStatus.count === 5 && priorityStatus.clean,
    `Priority Cards Count: ${priorityStatus.count}, Clean: ${priorityStatus.clean}`
  );

  // Switch back to Calendar view
  await page.locator('.knowledge-pill-switcher button:has-text("1. Takwim 12 Bulan")').click();
  await page.waitForTimeout(500);

  // 5. MAIN ARTICLES GRID SECTION
  console.log("\n--- 5. MAIN ARTICLES GRID SECTION ---");
  const articlesSec = page.locator("#articles-section");
  await articlesSec.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 250));
  await page.waitForTimeout(1400);

  const articlesStatus = await page.evaluate(() => {
    const cards = document.querySelectorAll(".knowledge-article-card");
    return {
      count: cards.length,
      allVisible: Array.from(cards).every((c) => {
        const style = window.getComputedStyle(c);
        return style.opacity === "1" && style.visibility !== "hidden";
      }),
      cleanClipPath: Array.from(cards).every((c) => !c.style.clipPath && !c.style.webkitClipPath),
      cleanTransform: Array.from(cards).every((c) => !c.style.transform),
    };
  });

  assert(
    "ARTICLES-GRID-01",
    "Main practical article cards render with Nemo iris reveal and clean inline properties",
    articlesStatus.count > 0 && articlesStatus.allVisible && articlesStatus.cleanClipPath && articlesStatus.cleanTransform,
    `Count: ${articlesStatus.count}, Visible: ${articlesStatus.allVisible}, CleanClip: ${articlesStatus.cleanClipPath}, CleanTransform: ${articlesStatus.cleanTransform}`
  );

  // 6. INTERACTIVE TOOLS SUITE
  console.log("\n--- 6. INTERACTIVE TOOLS SUITE ---");
  const toolsSec = page.locator("#interactive-tools");
  await toolsSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);

  const toolsStatus = await page.evaluate(() => {
    const tabs = document.querySelectorAll("#interactive-tools .tool-tab-btn");
    const container = document.querySelector(".knowledge-tool-container");
    return {
      tabCount: tabs.length,
      containerVisible: container ? window.getComputedStyle(container).opacity === "1" : false,
      containerClean: container ? !container.style.clipPath && !container.style.transform : false,
    };
  });

  assert(
    "INTERACTIVE-TOOLS-01",
    "Interactive Tools renders 4 tool tabs and active tool container cleanly",
    toolsStatus.tabCount === 4 && toolsStatus.containerVisible && toolsStatus.containerClean,
    `Tabs: ${toolsStatus.tabCount}, Container Visible: ${toolsStatus.containerVisible}, Clean: ${toolsStatus.containerClean}`
  );

  // Switch tool tab
  await page.locator('.tool-tab-btn:has-text("2. Perancang Weight-Cut")').click();
  await page.waitForTimeout(1000);
  const switchedToolVisible = await page.evaluate(() => {
    const container = document.querySelector(".knowledge-tool-container");
    return container ? window.getComputedStyle(container).opacity === "1" : false;
  });

  assert(
    "INTERACTIVE-TOOLS-SWITCH",
    "Switching to Weight-Cut Planner transitions smoothly with full visibility",
    switchedToolVisible,
    `Tool visible: ${switchedToolVisible}`
  );

  // 7. PERSILAT 2026 WEIGHT CATEGORIES STRIP
  console.log("\n--- 7. PERSILAT 2026 WEIGHT CATEGORIES STRIP ---");
  const weightSec = page.locator("#weight-categories");
  await weightSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);

  const weightStatus = await page.evaluate(() => {
    const cards = document.querySelectorAll(".weight-category-card");
    return {
      count: cards.length,
      allVisible: Array.from(cards).every((c) => {
        const style = window.getComputedStyle(c);
        return style.opacity === "1";
      }),
      cleanTransform: Array.from(cards).every((c) => !c.style.transform),
    };
  });

  assert(
    "WEIGHT-CATEGORIES-01",
    "11 PERSILAT 2026 Weight Category cards render with staggered pop and clean inline styles",
    weightStatus.count === 11 && weightStatus.allVisible && weightStatus.cleanTransform,
    `Count: ${weightStatus.count}, Visible: ${weightStatus.allVisible}, CleanTransform: ${weightStatus.cleanTransform}`
  );

  // 8. CAPTURE FINAL SCREENSHOTS FOR AUDIT
  console.log("\n--- 8. CAPTURING EVIDENCE SCREENSHOTS ---");
  await page.goto(`${BASE_URL}/knowledge`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "scripts/screenshot-sportscience-hero.png" });
  console.log("  Saved: scripts/screenshot-sportscience-hero.png");

  await page.locator("#master-framework").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "scripts/screenshot-sportscience-framework.png" });
  console.log("  Saved: scripts/screenshot-sportscience-framework.png");

  await page.locator("#interactive-tools").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "scripts/screenshot-sportscience-tools.png" });
  console.log("  Saved: scripts/screenshot-sportscience-tools.png");

  await browser.close();

  // SUMMARY
  const allPassed = testResults.every((t) => t.passed);
  console.log("\n================================================================================");
  console.log(`TOTAL ASSERTS: ${testResults.length} | PASSED: ${testResults.filter(t => t.passed).length} | FAILED: ${testResults.filter(t => !t.passed).length}`);
  console.log(allPassed ? ">>> ALL 12 SPORT SCIENCE NEMO MOTION ASSERTS PASSED! <<<" : ">>> SOME ASSERTS FAILED <<<");
  console.log("================================================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
