import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });
  
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // 1. English
  await page.goto("http://localhost:3000/guidelines", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/screenshot-guidelines-en-fixed.png" });
  console.log("EN screenshot saved!");

  // 2. Switch to BM
  const bmBtn = page.getByRole("button", { name: "BM", exact: true });
  await bmBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/screenshot-guidelines-bm-fixed.png" });
  console.log("BM screenshot saved!");

  // 3. Close-up on the title to verify letter S
  const titleEl = page.locator("#guidelines-title");
  await titleEl.screenshot({ path: "scripts/screenshot-title-closeup.png" });
  console.log("Title close-up saved!");

  await browser.close();
}

run();
