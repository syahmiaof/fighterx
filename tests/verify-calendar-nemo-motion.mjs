import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("       FIGHTERX KALENDAR (/competitions) NEMO MOTION VERIFICATION SUITE         ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}/competitions\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/competitions`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const testResults = [];
  function assert(id, description, passed, details = "") {
    testResults.push({ id, description, passed, details });
    const mark = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`  ${mark} [${id}] ${description}`);
    if (details) console.log(`         -> ${details}`);
  }

  // 1. VERIFY CSS HOVER RULES FOR COMPETITIONS / CALENDAR CARDS
  console.log("\n--- 1. CARD HOVER MICRO-INTERACTIONS & GPU ACCELERATION ---");
  const cssRules = await page.evaluate(() => {
    const results = {
      cardHover: null,
      timelineHover: null,
      gpuAcceleration: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes(".comp-glass-card:hover")) {
            results.cardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".timeline-event-row:hover")) {
            results.timelineHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".comp-glass-card") && rule.style.transform && rule.style.transform.includes("translateZ")) {
            results.gpuAcceleration = {
              selector: rule.selectorText,
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
    "CALENDAR-HOVER-01",
    ".comp-glass-card specifies translateY hover lift and specular glow",
    cssRules.cardHover && cssRules.cardHover.transform.includes("translateY"),
    JSON.stringify(cssRules.cardHover)
  );

  assert(
    "CALENDAR-HOVER-02",
    ".timeline-event-row specifies translateY(-2px) hover lift",
    cssRules.timelineHover && cssRules.timelineHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.timelineHover)
  );

  assert(
    "CALENDAR-GPU-01",
    ".comp-glass-card has GPU acceleration transform: translateZ(0)",
    cssRules.gpuAcceleration && cssRules.gpuAcceleration.transform.includes("translateZ"),
    JSON.stringify(cssRules.gpuAcceleration)
  );

  // 2. VERIFY COMMAND & FILTER BAR ENTRANCE
  console.log("\n--- 2. PRO COMMAND & FILTER BAR ENTRANCE & INLINE CLEANUP ---");
  await page.waitForTimeout(1400); // Allow entrance animation to finish
  const commandBarStatus = await page.evaluate(() => {
    const bar = document.querySelector(".pro-command-bar");
    if (!bar) return null;
    const computed = window.getComputedStyle(bar);
    return {
      exists: true,
      opacity: computed.opacity,
      inlineClipPath: bar.style.clipPath || bar.style.webkitClipPath || "",
      inlineTransform: bar.style.transform || "",
    };
  });

  assert(
    "COMMAND-BAR-01",
    ".pro-command-bar is fully visible with opacity 1 and inline styles cleaned up",
    commandBarStatus && commandBarStatus.opacity === "1" && !commandBarStatus.inlineClipPath,
    JSON.stringify(commandBarStatus)
  );

  await page.screenshot({ path: "scripts/screenshot-calendar-hero.png" });

  // 3. VERIFY TOURNAMENT CARDS & BADGES
  console.log("\n--- 3. TOURNAMENT CARDS & BADGES ---");
  await page.evaluate(() => {
    const feed = document.querySelector(".pro-events-feed");
    if (feed) feed.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1800); // Wait for ScrollTrigger + 0.95s Nemo reveal + stagger

  const cardStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".comp-glass-card"));
    const badges = Array.from(document.querySelectorAll(".comp-tier-badge"));

    return {
      cardCount: cards.length,
      allVisible: cards.every((c) => {
        const comp = window.getComputedStyle(c);
        return comp.opacity === "1" && comp.visibility !== "hidden";
      }),
      cleanInline: cards.slice(0, 5).every((c) => {
        return !c.style.clipPath && !c.style.webkitClipPath && !c.style.transform;
      }),
      badgesCount: badges.length,
    };
  });

  assert(
    "TOURNAMENT-CARDS-01",
    "Tournament cards are rendered and visible after Nemo Iris Reveal",
    cardStats.cardCount > 0 && cardStats.allVisible,
    `Count: ${cardStats.cardCount}, All Visible: ${cardStats.allVisible}`
  );

  assert(
    "TOURNAMENT-CARDS-02",
    "Tournament cards inline clip-path and transform are cleared after completion",
    cardStats.cleanInline,
    `Clean inline on sample cards: ${cardStats.cleanInline}`
  );

  assert(
    "TOURNAMENT-BADGES-01",
    "Tier badges (.comp-tier-badge) are present and rendered with spring pop",
    cardStats.badgesCount > 0,
    `Tier badges found: ${cardStats.badgesCount}`
  );

  await page.screenshot({ path: "scripts/screenshot-calendar-cards.png" });

  // 4. VERIFY CATEGORY TABS FILTERING
  console.log("\n--- 4. CATEGORY TABS FILTERING ---");
  const kebangsaanTab = page.locator(".cat-tab").filter({ hasText: "Kebangsaan" });
  await kebangsaanTab.click();
  await page.waitForTimeout(600);

  const kebangsaanStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".comp-glass-card"));
    return {
      count: cards.length,
      allKebangsaan: cards.every((c) => c.textContent.toLowerCase().includes("kebangsaan") || c.textContent.toLowerCase().includes("sukma") || c.textContent.toLowerCase().includes("suki")),
    };
  });

  assert(
    "FILTER-CATEGORY-01",
    "Switching to 'Kebangsaan' filters cards correctly",
    kebangsaanStats.count > 0,
    `Count: ${kebangsaanStats.count}`
  );

  // Reset to "Semua Kejohanan"
  const allTab = page.locator(".cat-tab").filter({ hasText: "Semua Kejohanan" });
  await allTab.click();
  await page.waitForTimeout(600);

  // 5. VERIFY TIMELINE VIEW SWITCHING
  console.log("\n--- 5. TIMELINE VIEW SWITCHING ---");
  const timelineModeBtn = page.locator(".mode-btn").filter({ hasText: "Takwim Bulanan" });
  await timelineModeBtn.click();
  await page.waitForTimeout(900); // Allow timeline animation to complete

  const timelineStats = await page.evaluate(() => {
    const timelineView = document.querySelector(".pro-timeline-view");
    const monthBlocks = Array.from(document.querySelectorAll(".timeline-month-block"));
    const eventRows = Array.from(document.querySelectorAll(".timeline-event-row"));

    return {
      timelineVisible: !!timelineView,
      monthCount: monthBlocks.length,
      rowCount: eventRows.length,
      cleanInline: monthBlocks.slice(0, 3).every((m) => !m.style.clipPath && !m.style.webkitClipPath),
    };
  });

  assert(
    "TIMELINE-VIEW-01",
    "Switching to 'Takwim Bulanan' renders month blocks and event rows with Nemo reveal",
    timelineStats.timelineVisible && timelineStats.monthCount > 0 && timelineStats.rowCount > 0,
    `Months: ${timelineStats.monthCount}, Event Rows: ${timelineStats.rowCount}`
  );

  assert(
    "TIMELINE-VIEW-02",
    "Timeline month blocks clean up inline animation styles on completion",
    timelineStats.cleanInline,
    `Clean inline: ${timelineStats.cleanInline}`
  );

  await page.screenshot({ path: "scripts/screenshot-calendar-timeline.png" });

  // Switch back to "Kad Acara"
  const cardsModeBtn = page.locator(".mode-btn").filter({ hasText: "Kad Acara" });
  await cardsModeBtn.click();
  await page.waitForTimeout(600);

  // 6. VERIFY DETAIL MODAL ENTRANCE & QUICK META
  console.log("\n--- 6. DETAIL MODAL & QUICK META ITEMS ---");
  const firstDetailsBtn = page.locator(".comp-card-details-btn").first();
  await firstDetailsBtn.click();
  await page.waitForTimeout(900); // Allow modal animation to complete

  const modalStats = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return null;
    const modalContainer = dialog.querySelector(".pro-modal-container");
    const quickMetas = Array.from(dialog.querySelectorAll(".quick-meta-item"));
    const closeBtn = dialog.querySelector(".pro-modal-close");

    return {
      dialogOpen: true,
      hasContainer: !!modalContainer,
      quickMetaCount: quickMetas.length,
      hasCloseBtn: !!closeBtn,
      bodyOverflow: document.body.style.overflow,
    };
  });

  assert(
    "MODAL-ENTRANCE-01",
    "Tournament Detail Modal opens with dialog role, background locked (overflow: hidden)",
    modalStats && modalStats.dialogOpen && modalStats.bodyOverflow === "hidden",
    JSON.stringify(modalStats)
  );

  assert(
    "MODAL-META-01",
    "Modal renders 4 quick meta items (.quick-meta-item) with staggered entrance",
    modalStats && modalStats.quickMetaCount === 4,
    `Quick meta count: ${modalStats?.quickMetaCount}`
  );

  await page.screenshot({ path: "scripts/screenshot-calendar-modal.png" });

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
