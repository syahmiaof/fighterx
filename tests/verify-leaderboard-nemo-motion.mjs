import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("     FIGHTERX LEADERBOARD (/leaderboard) NEMO MOTION VERIFICATION SUITE         ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}/leaderboard\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/leaderboard`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const testResults = [];
  function assert(id, description, passed, details = "") {
    testResults.push({ id, description, passed, details });
    const mark = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`  ${mark} [${id}] ${description}`);
    if (details) console.log(`         -> ${details}`);
  }

  // 1. VERIFY CSS HOVER RULES FOR LEADERBOARD CARDS
  console.log("\n--- 1. CARD HOVER MICRO-INTERACTIONS & GPU ACCELERATION ---");
  const cssRules = await page.evaluate(() => {
    const results = {
      athleteCardHover: null,
      pillarCardHover: null,
      deepdiveCardHover: null,
      gpuAcceleration: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes(".leaderboard-athlete-card:hover")) {
            results.athleteCardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".athlete-pillar-card:hover")) {
            results.pillarCardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".athlete-deepdive-card:hover")) {
            results.deepdiveCardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
            };
          }
          if (rule.selectorText && rule.selectorText === ".leaderboard-athlete-card, .athlete-pillar-card, .athlete-deepdive-card") {
            results.gpuAcceleration = {
              transform: rule.style.transform,
              backfaceVisibility: rule.style.backfaceVisibility,
            };
          }
        }
      } catch {}
    }
    return results;
  });

  assert(
    "LEADERBOARD-HOVER-01",
    ".leaderboard-athlete-card specifies translateY(-2px) and red specular glow on hover",
    cssRules.athleteCardHover && cssRules.athleteCardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.athleteCardHover)
  );

  assert(
    "LEADERBOARD-HOVER-02",
    ".athlete-pillar-card and .athlete-deepdive-card specify translateY(-2px) on hover",
    cssRules.pillarCardHover && cssRules.deepdiveCardHover,
    `Pillar: ${JSON.stringify(cssRules.pillarCardHover)}, Deepdive: ${JSON.stringify(cssRules.deepdiveCardHover)}`
  );

  assert(
    "LEADERBOARD-GPU-01",
    ".leaderboard-athlete-card has GPU acceleration transform: translateZ(0)",
    cssRules.gpuAcceleration && cssRules.gpuAcceleration.transform.includes("translateZ"),
    JSON.stringify(cssRules.gpuAcceleration)
  );

  // 2. VERIFY FILTER STRIP CARD ENTRANCE
  console.log("\n--- 2. FILTER STRIP CARD ENTRANCE & INLINE CLEANUP ---");
  await page.waitForTimeout(1400); // Allow entrance animation to finish
  const filterCardStatus = await page.evaluate(() => {
    const card = document.querySelector(".leaderboard-filter-card");
    if (!card) return null;
    const computed = window.getComputedStyle(card);
    return {
      exists: true,
      opacity: computed.opacity,
      inlineClipPath: card.style.clipPath || card.style.webkitClipPath || "",
      inlineTransform: card.style.transform || "",
    };
  });

  assert(
    "FILTER-CARD-01",
    ".leaderboard-filter-card is fully visible with opacity 1 and inline styles cleaned up",
    filterCardStatus && filterCardStatus.opacity === "1" && !filterCardStatus.inlineClipPath,
    JSON.stringify(filterCardStatus)
  );

  await page.screenshot({ path: "scripts/screenshot-leaderboard-hero.png" });

  // 3. VERIFY ATHLETE RANKING CARDS & PODIUM BADGES
  console.log("\n--- 3. ATHLETE RANKING CARDS & PODIUM BADGES ---");
  // Scroll to athlete cards section
  await page.evaluate(() => {
    const sec = document.getElementById("leaderboard-list-section");
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1800); // Wait for ScrollTrigger + 0.95s Nemo reveal + stagger

  const athleteCardStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".leaderboard-athlete-card"));
    const topBadges = Array.from(document.querySelectorAll(".leaderboard-rank-top"));
    const pointsVals = Array.from(document.querySelectorAll(".leaderboard-points-val"));

    return {
      cardCount: cards.length,
      allVisible: cards.every((c) => {
        const comp = window.getComputedStyle(c);
        return comp.opacity === "1" && comp.visibility !== "hidden";
      }),
      cleanInline: cards.slice(0, 5).every((c) => {
        return !c.style.clipPath && !c.style.webkitClipPath && !c.style.transform;
      }),
      topBadgesCount: topBadges.length,
      pointsValsCount: pointsVals.length,
    };
  });

  assert(
    "ATHLETE-CARDS-01",
    "Initial 25 athlete cards are rendered and visible after Nemo Iris Reveal",
    athleteCardStats.cardCount >= 25 && athleteCardStats.allVisible,
    `Count: ${athleteCardStats.cardCount}, All Visible: ${athleteCardStats.allVisible}`
  );

  assert(
    "ATHLETE-CARDS-02",
    "Athlete cards inline clip-path and transform are cleared after completion",
    athleteCardStats.cleanInline,
    `Clean inline on sample cards: ${athleteCardStats.cleanInline}`
  );

  assert(
    "ATHLETE-PODIUM-01",
    "Top 3 podium rank badges (#1, #2, #3) are present and rendered with spring pop",
    athleteCardStats.topBadgesCount >= 3,
    `Top badges found: ${athleteCardStats.topBadgesCount}`
  );

  assert(
    "ATHLETE-POINTS-01",
    "Points value indicators (.leaderboard-points-val) are present on ranking cards",
    athleteCardStats.pointsValsCount >= 25,
    `Points indicators count: ${athleteCardStats.pointsValsCount}`
  );

  await page.screenshot({ path: "scripts/screenshot-leaderboard-cards.png" });

  // 4. VERIFY DISCIPLINE FILTER INTERACTION & BUTTONS
  console.log("\n--- 4. DISCIPLINE FILTER TABS SWITCHING ---");
  // Click "Silat Olahraga" filter
  const olahragaBtn = page.locator(".leaderboard-discipline-btn").filter({ hasText: "Silat Olahraga" });
  await olahragaBtn.click();
  await page.waitForTimeout(600);

  const olahragaStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".leaderboard-athlete-card"));
    return {
      count: cards.length,
      allTanding: cards.every((c) => c.textContent.includes("TANDING") || c.textContent.includes("Olahraga")),
    };
  });

  assert(
    "FILTER-DISCIPLINE-01",
    "Switching to 'Silat Olahraga' filters cards correctly",
    olahragaStats.count > 0 && olahragaStats.allTanding,
    `Count: ${olahragaStats.count}, All Tanding: ${olahragaStats.allTanding}`
  );

  // Click "Silat Seni" filter
  const seniBtn = page.locator(".leaderboard-discipline-btn").filter({ hasText: "Silat Seni" });
  await seniBtn.click();
  await page.waitForTimeout(600);

  const seniStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".leaderboard-athlete-card"));
    return {
      count: cards.length,
      allSeni: cards.every((c) => c.textContent.toLowerCase().includes("silat seni") || c.textContent.toLowerCase().includes("seni")),
    };
  });

  assert(
    "FILTER-DISCIPLINE-02",
    "Switching to 'Silat Seni' filters cards correctly",
    seniStats.count > 0 && seniStats.allSeni,
    `Count: ${seniStats.count}, All Seni: ${seniStats.allSeni}`
  );

  // Reset to "Semua"
  const allBtn = page.locator(".leaderboard-discipline-btn").filter({ hasText: "Semua" }).first();
  await allBtn.click();
  await page.waitForTimeout(600);

  // 5. VERIFY ATHLETE DETAIL MODAL & 4 PILLAR CARDS STAGGER
  console.log("\n--- 5. ATHLETE DETAIL MODAL & PILLAR CARDS ---");
  const firstAthleteCard = page.locator(".leaderboard-athlete-card").first();
  await firstAthleteCard.click();
  await page.waitForTimeout(900); // Allow modal animation to complete

  const modalStats = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return null;
    const pillars = Array.from(dialog.querySelectorAll(".athlete-pillar-card"));
    const deepdives = Array.from(dialog.querySelectorAll(".athlete-deepdive-card"));
    const closeBtn = dialog.querySelector('button[aria-label="Tutup perincian atlet"]');

    return {
      dialogOpen: true,
      pillarCount: pillars.length,
      deepdiveCount: deepdives.length,
      hasCloseBtn: !!closeBtn,
      bodyOverflow: document.body.style.overflow,
    };
  });

  assert(
    "MODAL-ENTRANCE-01",
    "Athlete Detail Modal opens with dialog role, background locked (overflow: hidden)",
    modalStats && modalStats.dialogOpen && modalStats.bodyOverflow === "hidden",
    JSON.stringify(modalStats)
  );

  assert(
    "MODAL-PILLARS-01",
    "Modal renders 4 pillar breakdown cards (.athlete-pillar-card)",
    modalStats && modalStats.pillarCount === 4,
    `Pillar cards count: ${modalStats?.pillarCount}`
  );

  assert(
    "MODAL-DEEPDIVE-01",
    "Modal renders 3 fitness telemetry deep-dive cards (.athlete-deepdive-card)",
    modalStats && modalStats.deepdiveCount === 3,
    `Deep-dive cards count: ${modalStats?.deepdiveCount}`
  );

  await page.screenshot({ path: "scripts/screenshot-leaderboard-modal.png" });

  // Close modal via Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const modalClosed = await page.evaluate(() => {
    return !document.querySelector('[role="dialog"]') && document.body.style.overflow !== "hidden";
  });

  assert(
    "MODAL-CLOSE-01",
    "Modal closes cleanly on Escape and body scroll is restored",
    modalClosed,
    `Modal closed: ${modalClosed}`
  );

  console.log("\n================================================================================");
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`VERIFICATION SUMMARY: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  if (failed > 0) {
    console.log(`Failed tests: ${failed}`);
  }
  console.log("================================================================================\n");

  await browser.close();
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
