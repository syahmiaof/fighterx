import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "375px (iPhone SE)", width: 375, height: 667 },
  { name: "390px (iPhone 14)", width: 390, height: 844 },
  { name: "768px (iPad Mini)", width: 768, height: 1024 },
  { name: "1280px (Desktop)", width: 1280, height: 800 },
];

async function run() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE });
  let totalFailures = 0;

  console.log("================================================================================");
  console.log("   MILESTONE 2: DISCIPLINES TABS MOBILE RESPONSIVENESS & GSAP PILL CONTINUITY   ");
  console.log("================================================================================");

  for (const vp of VIEWPORTS) {
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`--------------------------------------------------------------------------------`);

    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const locale of ["en", "bm"]) {
      console.log(`\n  Locale: ${locale.toUpperCase()}`);
      // Set cookie for locale
      await context.addCookies([
        { name: "NEXT_LOCALE", value: locale, domain: "localhost", path: "/" }
      ]);
      await page.goto(`${BASE_URL}/disciplines`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      // 1. Check Root-Level Page Overflow
      const overflow = await page.evaluate(() => {
        return {
          pageScrollW: document.documentElement.scrollWidth,
          pageClientW: document.documentElement.clientWidth,
          hasPageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      if (overflow.hasPageOverflow) {
        console.error(`  ❌ Root horizontal overflow detected: scrollW=${overflow.pageScrollW} clientW=${overflow.pageClientW}`);
        totalFailures++;
      } else {
        console.log(`  ✓ Root page horizontal overflow: 0px (${overflow.pageScrollW}px / ${overflow.pageClientW}px)`);
      }

      // 2. Measure Container & Buttons Single-Line Geometry
      const containerMetrics = await page.evaluate(() => {
        const nav = document.querySelector(".disciplines-nav-tabs");
        const pill = nav ? nav.querySelector(".bg-\\[\\#e10600\\]") : null;
        const btns = nav ? Array.from(nav.querySelectorAll(".disc-tab-btn")) : [];

        if (!nav || !pill || btns.length === 0) return { error: "Missing elements" };

        const navRect = nav.getBoundingClientRect();
        const pillRect = pill.getBoundingClientRect();
        const btnTops = btns.map(b => Math.round(b.getBoundingClientRect().top));
        const allOnOneRow = btnTops.every(t => t === btnTops[0]);
        const minBtnHeight = Math.min(...btns.map(b => b.getBoundingClientRect().height));

        return {
          navHeight: Math.round(navRect.height),
          pillHeight: Math.round(pillRect.height),
          allOnOneRow,
          minBtnHeight: Math.round(minBtnHeight),
          btnCount: btns.length,
          navScrollWidth: nav.scrollWidth,
          navClientWidth: nav.clientWidth,
          navHasScroll: nav.scrollWidth > nav.clientWidth,
        };
      });

      console.log(`  Container Height: ${containerMetrics.navHeight}px | Pill Height: ${containerMetrics.pillHeight}px | Single Row: ${containerMetrics.allOnOneRow} | Min Button Height: ${containerMetrics.minBtnHeight}px`);
      
      if (!containerMetrics.allOnOneRow) {
        console.error(`  ❌ Tabs wrapped across multiple rows!`);
        totalFailures++;
      } else {
        console.log(`  ✓ All ${containerMetrics.btnCount} tabs remain on a single horizontal row`);
      }

      if (containerMetrics.pillHeight > 50) {
        console.error(`  ❌ Active pill stretched vertically (${containerMetrics.pillHeight}px > 50px)!`);
        totalFailures++;
      } else {
        console.log(`  ✓ Active pill height is clean and undistorted (${containerMetrics.pillHeight}px)`);
      }

      if (containerMetrics.minBtnHeight < 44) {
        console.error(`  ❌ Button touch target height below 44px (${containerMetrics.minBtnHeight}px)!`);
        totalFailures++;
      } else {
        console.log(`  ✓ Touch target minimum height >= 44px (${containerMetrics.minBtnHeight}px)`);
      }

      // 3. Test Clicking Every Tab and GSAP Pill Alignment
      const tabIndices = [1, 2, 3, 4, 0];
      for (const idx of tabIndices) {
        const tabBtn = page.locator(".disc-tab-btn").nth(idx);
        const tabText = await tabBtn.textContent();
        await tabBtn.click();
        await page.waitForTimeout(400); // Wait for GSAP elastic animation

        const clickCheck = await page.evaluate((targetIdx) => {
          const nav = document.querySelector(".disciplines-nav-tabs");
          const pill = nav ? nav.querySelector(".bg-\\[\\#e10600\\]") : null;
          const btns = nav ? Array.from(nav.querySelectorAll(".disc-tab-btn")) : [];
          const target = btns[targetIdx];

          if (!nav || !pill || !target) return { error: "Missing elements on click" };

          const pillRect = pill.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();

          // In viewport coordinates, pill and target should be closely aligned
          const leftDiff = Math.abs(pillRect.left - targetRect.left);
          const widthDiff = Math.abs(pillRect.width - targetRect.width);
          const pillH = Math.round(pillRect.height);

          return {
            leftDiff: Math.round(leftDiff * 10) / 10,
            widthDiff: Math.round(widthDiff * 10) / 10,
            pillHeight: pillH,
            ariaSelected: target.getAttribute("aria-selected"),
            scrollLeft: nav.scrollLeft,
          };
        }, idx);

        if (clickCheck.leftDiff > 2 || clickCheck.widthDiff > 2 || clickCheck.pillHeight > 50) {
          console.error(`  ❌ Tab [${idx}] "${tabText.trim()}": alignment error (leftDiff=${clickCheck.leftDiff}px, widthDiff=${clickCheck.widthDiff}px, pillHeight=${clickCheck.pillHeight}px)`);
          totalFailures++;
        } else {
          console.log(`  ✓ Tab [${idx}] "${tabText.trim()}": Pill aligned perfectly (leftDiff=${clickCheck.leftDiff}px, widthDiff=${clickCheck.widthDiff}px, pillHeight=${clickCheck.pillHeight}px, scrollLeft=${clickCheck.scrollLeft}px)`);
        }
      }
    }

    // Take screenshot of 375px and 768px viewports
    if (vp.width === 375 || vp.width === 768) {
      const navEl = page.locator(".disciplines-nav-tabs");
      await navEl.screenshot({ path: `scripts/verified-disciplines-tabs-${vp.width}px.png` });
      console.log(`  📸 Screenshot saved to scripts/verified-disciplines-tabs-${vp.width}px.png`);
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n================================================================================`);
  if (totalFailures === 0) {
    console.log(`🎉 ALL MILESTONE 2 TESTS PASSED WITH 0 FAILURES!`);
  } else {
    console.error(`❌ TEST SUITE COMPLETED WITH ${totalFailures} FAILURES.`);
    process.exit(1);
  }
  console.log(`================================================================================`);
}

run().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
