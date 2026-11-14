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
  await page.waitForTimeout(400);

  console.log("Beginning rapid wheel scrubbing stress test...");

  // Rapidly scrub up and down
  const scrollDeltas = [
    600, -300, 1200, -800, 2000, -1000, 3500, -2000, 5000, -3000, 6500, 0,
    3000, 1000, 4500, 200, 7000
  ];

  for (const delta of scrollDeltas) {
    await page.evaluate((y) => window.scrollTo(0, y), delta);
    await page.waitForTimeout(50);
  }

  // Scroll to bottom, wait 1.5s for all animations to complete
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);

  const componentsToTest = [
    { name: "FeatureRail", selector: ".feature-item" },
    { name: "Athlete Spotlight", selector: ".spotlight-card" },
    { name: "Collaboration", selector: ".collab-card" },
    { name: "Testimonials", selector: ".testimonial-card" },
    { name: "Workflow steps", selector: ".workflow-step" },
    { name: "Programme cards", selector: ".programme-card" },
    { name: "FAQ accordion", selector: ".faq-list details" },
  ];

  const results = await page.evaluate((comps) => {
    return comps.map(c => {
      const items = Array.from(document.querySelectorAll(c.selector));
      const unclean = items.filter(el => {
        const style = el.getAttribute('style') || '';
        return (
          style.includes('clip-path') ||
          style.includes('clipPath') ||
          style.includes('opacity') ||
          style.includes('will-change') ||
          style.includes('transform')
        );
      });
      const invisible = items.filter(el => {
        const cs = window.getComputedStyle(el);
        return cs.opacity !== '1' || cs.display === 'none' || cs.visibility === 'hidden';
      });

      return {
        name: c.name,
        count: items.length,
        uncleanCount: unclean.length,
        invisibleCount: invisible.length,
        passed: items.length > 0 && unclean.length === 0 && invisible.length === 0,
      };
    });
  }, componentsToTest);

  console.log("Rapid Scrubbing Test Results:\n", JSON.stringify(results, null, 2));

  // Now scroll back to top rapidly
  console.log("\nScrubbing back to top rapidly...");
  for (let y = 6000; y >= 0; y -= 800) {
    await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(500);

  const topCheck = await page.evaluate((comps) => {
    return comps.map(c => {
      const items = Array.from(document.querySelectorAll(c.selector));
      const unclean = items.filter(el => {
        const style = el.getAttribute('style') || '';
        return (
          style.includes('clip-path') ||
          style.includes('clipPath') ||
          style.includes('opacity') ||
          style.includes('will-change') ||
          style.includes('transform')
        );
      });
      return {
        name: c.name,
        count: items.length,
        uncleanCount: unclean.length,
        passed: items.length > 0 && unclean.length === 0,
      };
    });
  }, componentsToTest);

  console.log("Top-Return Test Results:\n", JSON.stringify(topCheck, null, 2));

  const allPassed = results.every(r => r.passed) && topCheck.every(r => r.passed);
  console.log(`\nOVERALL SCRUBBING VERIFICATION: ${allPassed ? "PASSED" : "FAILED"}`);

  await browser.close();
  if (!allPassed) process.exit(1);
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
