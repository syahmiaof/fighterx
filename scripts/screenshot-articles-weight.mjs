import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
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

  // Articles Section
  const articlesSec = page.locator("#articles-section");
  await articlesSec.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "scripts/screenshot-sportscience-articles.png" });

  // Weight Categories Section
  const weightSec = page.locator("#weight-categories");
  await weightSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "scripts/screenshot-sportscience-weight.png" });

  await browser.close();
  console.log("Screenshots captured successfully!");
}

main().catch(console.error);
