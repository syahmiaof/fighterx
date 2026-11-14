import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });
  
  // Laptop 1280px
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto("http://localhost:3000/guidelines", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scripts/screenshot-guidelines-1280.png" });
  console.log("1280px screenshot saved!");

  // iPad / Tablet 1024px
  const page1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await page1024.goto("http://localhost:3000/guidelines", { waitUntil: "networkidle" });
  await page1024.waitForTimeout(500);
  await page1024.screenshot({ path: "scripts/screenshot-guidelines-1024.png" });
  console.log("1024px screenshot saved!");

  // Mobile 390px
  const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageMobile.goto("http://localhost:3000/guidelines", { waitUntil: "networkidle" });
  await pageMobile.waitForTimeout(500);
  await pageMobile.screenshot({ path: "scripts/screenshot-guidelines-mobile.png" });
  console.log("Mobile screenshot saved!");

  await browser.close();
}

run();
