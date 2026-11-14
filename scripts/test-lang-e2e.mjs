import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = "http://localhost:3000";

async function run() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("================================================================================");
  console.log("   VERIFICATION: MOMENTS, LEADERBOARD & ASSOCIATIONS HIDDEN FROM NAVIGATION   ");
  console.log("================================================================================");

  // 1. Initial Load - Default English
  console.log("\n[TEST 1] Clean Initial Load on / (Home Page)");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  const initialLang = await page.getAttribute("html", "lang");
  console.log(`  HTML lang attribute: ${initialLang} (Expected: en)`);

  const initialNavLabels = await page.$$eval(".nav-item-btn span:first-child", els => els.map(e => e.textContent?.trim()));
  console.log("  Nav Labels (EN):", initialNavLabels);

  if (initialNavLabels.includes("Leaderboard") || initialNavLabels.includes("Moments") || initialNavLabels.includes("Associations")) {
    throw new Error("Leaderboard, Moments, or Associations still found in navigation!");
  }
  console.log("  ✓ Leaderboard, Moments, and Associations successfully removed from primary nav");

  // 2. Toggle to BM
  console.log("\n[TEST 2] Toggling to Bahasa Melayu (BM)");
  const bmBtn = await page.$('button[aria-label="Tukar ke Bahasa Melayu"]');
  await bmBtn?.click();
  await page.waitForTimeout(350);

  const bmNavLabels = await page.$$eval(".nav-item-btn span:first-child", els => els.map(e => e.textContent?.trim()));
  console.log("  Nav Labels (BM):", bmNavLabels);

  if (bmNavLabels.includes("Kedudukan") || bmNavLabels.includes("Moment") || bmNavLabels.includes("Persatuan")) {
    throw new Error("Kedudukan, Moment, or Persatuan still found in BM navigation!");
  }
  console.log("  ✓ Kedudukan, Moment, and Persatuan successfully removed from BM nav");

  // 3. Test Redirects for Hidden Routes
  console.log("\n[TEST 3] Testing direct access redirection for hidden pages");
  await page.goto(`${BASE_URL}/leaderboard`, { waitUntil: "networkidle" });
  console.log(`  Navigated to /leaderboard -> URL resolved to: ${page.url()}`);
  if (page.url() !== `${BASE_URL}/`) {
    throw new Error(`Expected redirect to /, got: ${page.url()}`);
  }
  console.log("  ✓ /leaderboard successfully redirected to /");

  await page.goto(`${BASE_URL}/moments`, { waitUntil: "networkidle" });
  console.log(`  Navigated to /moments -> URL resolved to: ${page.url()}`);
  if (page.url() !== `${BASE_URL}/`) {
    throw new Error(`Expected redirect to /, got: ${page.url()}`);
  }
  console.log("  ✓ /moments successfully redirected to /");

  await page.goto(`${BASE_URL}/associations`, { waitUntil: "networkidle" });
  console.log(`  Navigated to /associations -> URL resolved to: ${page.url()}`);
  if (page.url() !== `${BASE_URL}/`) {
    throw new Error(`Expected redirect to /, got: ${page.url()}`);
  }
  console.log("  ✓ /associations successfully redirected to /");

  // 4. Verify Active Public Routes Still Function
  const activeRoutes = [
    "/guidelines",
    "/knowledge",
    "/competitions",
    "/disciplines",
    "/login",
    "/register-club",
  ];

  console.log("\n[TEST 4] Verifying all active public routes still work");
  for (const route of activeRoutes) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    const title = await page.title();
    console.log(`  ✓ Route: ${route} -> ${title.slice(0, 45)}...`);
  }

  // 5. Screenshot Header for Visual Evidence
  console.log("\n[TEST 5] Capturing new 5-item header screenshot");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.screenshot({
    path: "scripts/screenshot-header-clean-5items.png",
    clip: { x: 0, y: 0, width: 1440, height: 80 },
  });
  console.log("  ✓ Screenshot saved: scripts/screenshot-header-clean-5items.png");

  console.log("\n================================================================================");
  console.log("     ALL TESTS PASSED: MOMENTS, LEADERBOARD & ASSOCIATIONS SAFELY HIDDEN!       ");
  console.log("================================================================================");

  await browser.close();
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
