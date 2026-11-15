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

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`CHECKING VIEWPORT: ${vp.name}`);
    console.log(`======================================================`);

    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/disciplines`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => {
      const navTabs = document.querySelector(".disciplines-nav-tabs");
      const pill = navTabs ? navTabs.querySelector(".bg-\\[\\#e10600\\]") : null;
      const btns = navTabs ? Array.from(navTabs.querySelectorAll(".disc-tab-btn")) : [];

      const navRect = navTabs ? navTabs.getBoundingClientRect() : null;
      const pillRect = pill ? pill.getBoundingClientRect() : null;

      const btnMetrics = btns.map((btn, i) => {
        const r = btn.getBoundingClientRect();
        return {
          idx: i,
          text: btn.textContent.trim(),
          top: Math.round(r.top),
          left: Math.round(r.left),
          width: Math.round(r.width),
          height: Math.round(r.height),
          selected: btn.getAttribute("aria-selected"),
        };
      });

      return {
        navRect: navRect ? {
          top: Math.round(navRect.top),
          left: Math.round(navRect.left),
          width: Math.round(navRect.width),
          height: Math.round(navRect.height),
          scrollWidth: navTabs.scrollWidth,
          clientWidth: navTabs.clientWidth,
        } : null,
        pillRect: pillRect ? {
          top: Math.round(pillRect.top),
          left: Math.round(pillRect.left),
          width: Math.round(pillRect.width),
          height: Math.round(pillRect.height),
        } : null,
        btnMetrics,
      };
    });

    console.log("Nav Tabs Container:", metrics.navRect);
    console.log("Active Pill:", metrics.pillRect);
    console.log("Tab Buttons:");
    metrics.btnMetrics.forEach(b => {
      console.log(`  [${b.idx}] "${b.text}" top=${b.top} left=${b.left} w=${b.width} h=${b.height} (selected=${b.selected})`);
    });

    await context.close();
  }

  await browser.close();
}

run().catch(console.error);
