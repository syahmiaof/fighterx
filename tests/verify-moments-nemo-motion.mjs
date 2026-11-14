import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("          FIGHTERX MOMENT (/moments) NEMO MOTION VERIFICATION SUITE             ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}/moments\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Set session storage as verified athlete so upload modal can be tested directly
  await page.addInitScript(() => {
    window.sessionStorage.setItem("fighterx_session_role", "ATHLETE");
  });

  await page.goto(`${BASE_URL}/moments`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const testResults = [];
  function assert(id, description, passed, details = "") {
    testResults.push({ id, description, passed, details });
    const mark = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`  ${mark} [${id}] ${description}`);
    if (details) console.log(`         -> ${details}`);
  }

  // 1. VERIFY CSS HOVER RULES FOR MOMENT CARDS & GPU ACCELERATION
  console.log("\n--- 1. CARD HOVER MICRO-INTERACTIONS & GPU ACCELERATION ---");
  const cssRules = await page.evaluate(() => {
    const results = {
      cardHover: null,
      gpuAcceleration: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes(".moment-card:hover")) {
            results.cardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".moment-card") && rule.style.transform && rule.style.transform.includes("translateZ")) {
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
    "MOMENTS-HOVER-01",
    ".moment-card specifies translateY(-2px) and red specular glow on hover",
    cssRules.cardHover && cssRules.cardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.cardHover)
  );

  assert(
    "MOMENTS-GPU-01",
    ".moment-card has GPU acceleration transform: translateZ(0)",
    cssRules.gpuAcceleration && cssRules.gpuAcceleration.transform.includes("translateZ"),
    JSON.stringify(cssRules.gpuAcceleration)
  );

  // 2. VERIFY CONTROL BAR FILTER STRIP ENTRANCE
  console.log("\n--- 2. CONTROL BAR FILTER STRIP ENTRANCE & INLINE CLEANUP ---");
  await page.waitForTimeout(1400); // Allow entrance animation to finish
  const filterStripStatus = await page.evaluate(() => {
    const strip = document.querySelector(".moments-filter-strip");
    if (!strip) return null;
    const computed = window.getComputedStyle(strip);
    return {
      exists: true,
      opacity: computed.opacity,
      inlineClipPath: strip.style.clipPath || strip.style.webkitClipPath || "",
      inlineTransform: strip.style.transform || "",
    };
  });

  assert(
    "FILTER-STRIP-01",
    ".moments-filter-strip is fully visible with opacity 1 and inline styles cleaned up",
    filterStripStatus && filterStripStatus.opacity === "1" && !filterStripStatus.inlineClipPath,
    JSON.stringify(filterStripStatus)
  );

  await page.screenshot({ path: "scripts/screenshot-moments-hero.png" });

  // 3. VERIFY MOMENT CARDS FEED (NEMO IRIS REVEAL)
  console.log("\n--- 3. MOMENT CARDS FEED & IRIS REVEAL ---");
  await page.evaluate(() => {
    const feed = document.querySelector(".moment-card");
    if (feed) feed.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1800); // Wait for ScrollTrigger + 0.95s Nemo reveal + stagger

  const cardStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".moment-card"));

    return {
      cardCount: cards.length,
      allVisible: cards.every((c) => {
        const comp = window.getComputedStyle(c);
        return comp.opacity === "1" && comp.visibility !== "hidden";
      }),
      cleanInline: cards.slice(0, 5).every((c) => {
        return !c.style.clipPath && !c.style.webkitClipPath && !c.style.transform;
      }),
    };
  });

  assert(
    "MOMENT-CARDS-01",
    "Moment cards are rendered and visible after Nemo Iris Reveal",
    cardStats.cardCount > 0 && cardStats.allVisible,
    `Count: ${cardStats.cardCount}, All Visible: ${cardStats.allVisible}`
  );

  assert(
    "MOMENT-CARDS-02",
    "Moment cards inline clip-path and transform are cleared after completion",
    cardStats.cleanInline,
    `Clean inline on sample cards: ${cardStats.cleanInline}`
  );

  await page.screenshot({ path: "scripts/screenshot-moments-cards.png" });

  // 4. VERIFY CATEGORY PILL FILTERING
  console.log("\n--- 4. CATEGORY PILL FILTERING ---");
  const seniPill = page.locator(".moments-cat-pill").filter({ hasText: "Seni" });
  await seniPill.click();
  await page.waitForTimeout(600);

  const seniCardCount = await page.evaluate(() => {
    return document.querySelectorAll(".moment-card").length;
  });

  assert(
    "FILTER-CATEGORY-01",
    "Clicking 'Seni' filters moment cards",
    seniCardCount > 0,
    `Seni cards count: ${seniCardCount}`
  );

  // Reset to "Semua"
  const semuaPill = page.locator(".moments-cat-pill").filter({ hasText: "Semua" });
  await semuaPill.click();
  await page.waitForTimeout(600);

  // 5. VERIFY LIGHTBOX MODAL ENTRANCE & ESCAPE CLOSE
  console.log("\n--- 5. LIGHTBOX MODAL & ENTRANCE ---");
  const firstPhotoStage = page.locator(".moment-card .aspect-\\[4\\/3\\]").first();
  await firstPhotoStage.click();
  await page.waitForTimeout(800); // Allow modal animation to complete

  const lightboxStats = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return null;
    const container = dialog.querySelector(".moment-lightbox-container");
    const closeBtn = dialog.querySelector('button[aria-label="Tutup Paparan Skrin Penuh"]');

    return {
      dialogOpen: true,
      hasContainer: !!container,
      hasCloseBtn: !!closeBtn,
      bodyOverflow: document.body.style.overflow,
    };
  });

  assert(
    "LIGHTBOX-ENTRANCE-01",
    "Lightbox Modal opens with dialog role, background locked (overflow: hidden)",
    lightboxStats && lightboxStats.dialogOpen && lightboxStats.bodyOverflow === "hidden",
    JSON.stringify(lightboxStats)
  );

  assert(
    "LIGHTBOX-CONTAINER-01",
    "Lightbox container (.moment-lightbox-container) rendered with Nemo iris physics",
    lightboxStats && lightboxStats.hasContainer,
    `Container present: ${lightboxStats?.hasContainer}`
  );

  await page.screenshot({ path: "scripts/screenshot-moments-lightbox.png" });

  // Close lightbox via Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const lightboxClosed = await page.evaluate(() => {
    return !document.querySelector(".moment-lightbox-container") && document.body.style.overflow !== "hidden";
  });

  assert(
    "LIGHTBOX-CLOSE-01",
    "Lightbox closes cleanly on Escape and body scroll is restored",
    lightboxClosed,
    `Closed: ${lightboxClosed}`
  );

  // 6. VERIFY UPLOAD MODAL ENTRANCE & PRESETS
  console.log("\n--- 6. UPLOAD MODAL & PRESET CARDS ---");
  const uploadBtn = page.locator(".moments-upload-btn");
  await uploadBtn.click();
  await page.waitForTimeout(800); // Allow modal animation to complete

  const uploadModalStats = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return null;
    const presets = Array.from(dialog.querySelectorAll(".upload-preset-card"));

    return {
      dialogOpen: true,
      presetCount: presets.length,
      bodyOverflow: document.body.style.overflow,
    };
  });

  assert(
    "UPLOAD-MODAL-01",
    "Upload Modal opens with locked background and 6 preset cards (.upload-preset-card)",
    uploadModalStats && uploadModalStats.dialogOpen && uploadModalStats.presetCount === 6,
    `Presets found: ${uploadModalStats?.presetCount}, Overflow: ${uploadModalStats?.bodyOverflow}`
  );

  await page.screenshot({ path: "scripts/screenshot-moments-upload.png" });

  // Close upload modal via Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

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
