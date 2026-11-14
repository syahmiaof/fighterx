import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const chart = page.locator("#telemetri-prestasi");
  await chart.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "evidence/new-telemetry-chart-final.png" });
  console.log("All view saved to evidence/new-telemetry-chart-final.png");

  // Click Olahraga tab
  await page.locator('button:has-text("Olahraga (68%)")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "evidence/chart-olahraga-view.png" });
  console.log("Olahraga view saved!");

  // Click Seni tab
  await page.locator('button:has-text("Seni (32%)")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "evidence/chart-seni-view.png" });
  console.log("Seni view saved!");

  await browser.close();
}

run();
