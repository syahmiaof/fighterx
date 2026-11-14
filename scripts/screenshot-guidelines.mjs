import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("http://localhost:3000/guidelines", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Scroll to 4 Quick Rules
  const sec1 = page.locator("#asas-mata");
  await sec1.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "evidence/guidelines-quick-rules.png" });
  console.log("Quick rules saved!");

  // Scroll to Format Acara & Match Steps
  const sec2 = page.locator("#format-acara");
  await sec2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "evidence/guidelines-format-acara.png" });
  console.log("Format acara saved!");

  // Scroll to Tangga Hukuman
  const sec5 = page.locator("#tatatertib-wasit");
  await sec5.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "evidence/guidelines-tatatertib.png" });
  console.log("Tatatertib saved!");

  await browser.close();
}

run();
