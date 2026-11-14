import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });
  
  // Desktop 1440px
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/guidelines", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: "scripts/screenshot-guidelines-hero-duo.png" });
  console.log("Screenshot saved to scripts/screenshot-guidelines-hero-duo.png");
  
  await browser.close();
}

run();
