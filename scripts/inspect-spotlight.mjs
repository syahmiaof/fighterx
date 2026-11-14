import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = "http://localhost:3000";

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  // Scroll close to spotlight
  const spotlightSection = await page.$("#spotlight-heading");
  console.log("Found spotlight heading:", !!spotlightSection);

  // Take screenshot before spotlight enters
  await spotlightSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await page.screenshot({ path: "evidence/nemo-review/spotlight-mid.png" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "evidence/nemo-review/spotlight-done.png" });

  await browser.close();
  console.log("Screenshots captured");
}

run().catch(console.error);
