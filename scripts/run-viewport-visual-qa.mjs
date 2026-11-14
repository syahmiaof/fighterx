import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3005";

// Import Playwright from global installation
const { chromium } = await import(
  "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs"
);

const CHROMIUM_EXE =
  "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

const VIEWPORTS = [320, 360, 390, 430, 768, 1024, 1440];

const IN_SCOPE_ROUTES = [
  { id: "home", route: "/", name: "Homepage" },
  { id: "guidelines", route: "/guidelines", name: "Guidelines" },
  { id: "disciplines", route: "/disciplines", name: "Disciplines" },
  { id: "competitions", route: "/competitions", name: "Competitions" },
  { id: "calendar", route: "/calendar", name: "Calendar" },
  { id: "leaderboard", route: "/leaderboard", name: "Leaderboard" },
  { id: "associations", route: "/associations", name: "Associations" },
  { id: "moments", route: "/moments", name: "Moments" },
  { id: "knowledge", route: "/knowledge", name: "Knowledge Hub" },
  { id: "knowledge-article", route: "/knowledge/periodisasi-latihan-silat", name: "Knowledge Article" },
];

const SCREENSHOTS_DIR = path.join(ROOT_DIR, "tests", "visual-qa");
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}
const EVIDENCE_SCREENSHOTS_DIR = path.join(ROOT_DIR, "evidence", "screenshots");
if (!fs.existsSync(EVIDENCE_SCREENSHOTS_DIR)) {
  fs.mkdirSync(EVIDENCE_SCREENSHOTS_DIR, { recursive: true });
}

console.log("================================================================================");
console.log("          FIGHTERX AUTOMATED 7-VIEWPORT VISUAL QA & OVERFLOW SUITE              ");
console.log("================================================================================");
console.log(`Target Host: ${BASE_URL}`);
console.log(`Chromium Binary: ${CHROMIUM_EXE}`);
console.log(`Target Viewports: ${VIEWPORTS.join(", ")} px`);
console.log(`Total Scenarios: ${IN_SCOPE_ROUTES.length * VIEWPORTS.length}\n`);

async function runVisualQA() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const results = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const routeObj of IN_SCOPE_ROUTES) {
    console.log(`\n--- Route: ${routeObj.name} (${routeObj.route}) ---`);

    for (const width of VIEWPORTS) {
      totalTests++;
      const height = width < 768 ? 840 : 960;
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      try {
        const url = `${BASE_URL}${routeObj.route}`;
        await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
        // Allow CSS transforms and GSAP matchMedia to settle
        await page.waitForTimeout(400);

        // Bounding box & overflow analysis
        const metrics = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const innerWidth = window.innerWidth;
          const overflow = scrollWidth > clientWidth;

          // Find offending elements if any
          const overflowing = [];
          const allElements = document.querySelectorAll("*");
          for (const el of allElements) {
            // Ignore script, style, head, noscript
            if (["SCRIPT", "STYLE", "HEAD", "NOSCRIPT"].includes(el.tagName)) continue;
            const r = el.getBoundingClientRect();
            // Check if element extends significantly beyond window width (+1.5px tolerance for subpixels)
            if (r.right > innerWidth + 1.5 && r.width > 0) {
              overflowing.push({
                tag: el.tagName,
                id: el.id || undefined,
                className: (el.className && typeof el.className === "string") ? el.className.slice(0, 80) : undefined,
                right: Math.round(r.right),
                excess: Math.round(r.right - innerWidth),
              });
            }
          }

          return {
            scrollWidth,
            clientWidth,
            innerWidth,
            overflow,
            overflowingElementsCount: overflowing.length,
            overflowingDetails: overflowing.slice(0, 5),
          };
        });

        // Specialized responsive component inspections
        let componentCheck = { pass: true, details: "OK" };

        if (routeObj.id === "disciplines") {
          const discCheck = await page.evaluate(() => {
            const matrixContainer = document.querySelector(".matrix-mode-toggle, [class*='rounded-full'][class*='border-white']");
            const equipContainer = document.querySelector(".equipment-pills, [class*='flex-wrap'][class*='justify-center']");
            let matrixOk = true;
            let equipOk = true;
            if (matrixContainer) {
              const rect = matrixContainer.getBoundingClientRect();
              matrixOk = rect.right <= window.innerWidth + 2;
            }
            if (equipContainer) {
              const rect = equipContainer.getBoundingClientRect();
              equipOk = rect.right <= window.innerWidth + 2;
            }
            return { matrixOk, equipOk };
          });
          if (!discCheck.matrixOk) {
            componentCheck = { pass: false, details: "Comparison matrix container clipped" };
          }
        }

        if (routeObj.id === "knowledge") {
          const knowCheck = await page.evaluate(() => {
            const switcher = document.querySelector("[class*='stakeholder'], [class*='gap-2.5']");
            let switcherOk = true;
            if (switcher) {
              const rect = switcher.getBoundingClientRect();
              switcherOk = rect.right <= window.innerWidth + 2;
            }
            return { switcherOk };
          });
          if (!knowCheck.switcherOk) {
            componentCheck = { pass: false, details: "Stakeholder switcher clipped" };
          }
        }

        // Capture screenshot
        const screenshotName = `${routeObj.id}_${width}px.png`;
        const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        fs.copyFileSync(screenshotPath, path.join(EVIDENCE_SCREENSHOTS_DIR, screenshotName));

        const testPassed = !metrics.overflow && componentCheck.pass;
        if (testPassed) {
          passedTests++;
          console.log(`  [PASS] ${width}px | scrollWidth: ${metrics.scrollWidth}px, clientWidth: ${metrics.clientWidth}px | 0 overflow`);
        } else {
          failedTests++;
          console.error(
            `  [FAIL] ${width}px | scrollWidth: ${metrics.scrollWidth}px > clientWidth: ${metrics.clientWidth}px | ` +
            `Offending elements: ${metrics.overflowingElementsCount} | Details: ${componentCheck.details}`
          );
        }

        results.push({
          route: routeObj.route,
          id: routeObj.id,
          name: routeObj.name,
          width,
          scrollWidth: metrics.scrollWidth,
          clientWidth: metrics.clientWidth,
          hasOverflow: metrics.overflow,
          passed: testPassed,
          screenshot: `tests/visual-qa/${screenshotName}`,
          overflowDetails: metrics.overflowingDetails,
          componentDetails: componentCheck.details,
        });
      } catch (err) {
        failedTests++;
        console.error(`  [ERROR] ${width}px:`, err.message);
        results.push({
          route: routeObj.route,
          id: routeObj.id,
          name: routeObj.name,
          width,
          passed: false,
          error: err.message,
        });
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  console.log("\n================================================================================");
  console.log("                       7-VIEWPORT VISUAL QA SUMMARY                             ");
  console.log("================================================================================");
  console.log(`  Total Checks:    ${totalTests}`);
  console.log(`  Passed Checks:   ${passedTests} (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`  Failed Checks:   ${failedTests}`);
  console.log(`  Screenshots in:  ${SCREENSHOTS_DIR}`);
  console.log("================================================================================\n");

  const resultsOutPath = path.join(ROOT_DIR, "evidence", "viewport-qa-results.json");
  fs.writeFileSync(resultsOutPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`Saved full report to: ${resultsOutPath}`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runVisualQA().catch((err) => {
  console.error("Visual QA runner failed:", err);
  process.exit(1);
});
