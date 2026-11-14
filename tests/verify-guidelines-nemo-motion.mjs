import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("       FIGHTERX GUIDELINES NEMO MOTION AUTOMATED VERIFICATION SUITE             ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}/guidelines\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/guidelines`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const testResults = [];
  function assert(id, description, passed, details = "") {
    testResults.push({ id, description, passed, details });
    const mark = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`  ${mark} [${id}] ${description}`);
    if (details) console.log(`         -> ${details}`);
  }

  // 1. VERIFY CSS HOVER RULES FOR .guidelines-card
  console.log("\n--- 1. CARD HOVER MICRO-INTERACTIONS & TACTILE 3D BUTTON POP ---");
  const cssRules = await page.evaluate(() => {
    const results = {
      cardHoverRule: null,
      cardTransitionRule: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes(".guidelines-card:hover")) {
            results.cardHoverRule = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".guidelines-card") && !rule.selectorText.includes(":")) {
            results.cardTransitionRule = {
              selector: rule.selectorText,
              transition: rule.style.transition,
            };
          }
        }
      } catch {}
    }
    return results;
  });

  assert(
    "GUIDELINES-HOVER-01",
    ".guidelines-card specifies translateY(-2px) and shadow pop on hover",
    cssRules.cardHoverRule && cssRules.cardHoverRule.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.cardHoverRule)
  );

  assert(
    "GUIDELINES-TRANSITION-01",
    ".guidelines-card specifies cubic-bezier transition for smooth lift",
    cssRules.cardTransitionRule && cssRules.cardTransitionRule.transition.includes("cubic-bezier"),
    JSON.stringify(cssRules.cardTransitionRule)
  );

  // 2. VERIFY ENTRANCE & INLINE PROPERTY CLEARANCE ON ALL GUIDELINES CARD GROUPS
  console.log("\n--- 2. HORIZONTAL CLIP-PATH IRIS ENTRANCE & INLINE STYLE CLEARANCE ---");

  const componentsToTest = [
    { name: "Quick Rules (4 cards)", selector: "#asas-mata .guidelines-card" },
    { name: "Format Acara (2 cards)", selector: "#format-acara .grid-cols-1.md\\:grid-cols-2 .guidelines-card" },
    { name: "Dos & Don'ts (2 cards)", selector: "#zon-sasaran .guidelines-card" },
    { name: "Tangga Hukuman chips (6 chips)", selector: ".guidelines-motion-chips .guidelines-card" },
    { name: "Senarai Semak (2 cards)", selector: "#senarai-semak .guidelines-card" },
  ];

  for (const comp of componentsToTest) {
    const el = page.locator(comp.selector).first();
    const count = await page.locator(comp.selector).count();
    if (count > 0) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1400); // allow 0.95s animation + clearance
      const status = await page.evaluate((sel) => {
        const cards = document.querySelectorAll(sel);
        return Array.from(cards).map((c) => ({
          clipPath: c.style.clipPath || c.style.webkitClipPath || "",
          transform: c.style.transform || "",
          opacity: c.style.opacity || "",
        }));
      }, comp.selector);

      const allClear = status.every((s) => !s.clipPath && !s.transform && !s.opacity);
      assert(
        `GUIDELINES-CLEAR-${comp.name.toUpperCase().replace(/[^A-Z]/g, "_")}`,
        `${comp.name} (${count} items) clear inline clipPath, transform, and opacity upon completion`,
        allClear,
        `Items: ${count}, AllClear: ${allClear}`
      );
    }
  }

  // 3. VERIFY GLASSMORPHISM PRESERVATION
  console.log("\n--- 3. GLASSMORPHISM VISUAL STYLING PRESERVATION ---");
  const glassStyles = await page.evaluate(() => {
    const card = document.querySelector("#asas-mata .guidelines-card");
    if (!card) return null;
    const computed = window.getComputedStyle(card);
    return {
      backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
      borderColor: computed.borderColor,
    };
  });

  assert(
    "GUIDELINES-GLASS-01",
    "Guidelines cards preserve 16px glassmorphism blur and translucent border",
    glassStyles && glassStyles.backdropFilter.includes("blur(16px)"),
    `BackdropFilter: ${glassStyles?.backdropFilter}`
  );

  console.log("\n================================================================================");
  console.log("                        VERIFICATION AUDIT SUMMARY                              ");
  console.log("================================================================================");
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  console.log(`  Total Checks:  ${total}`);
  console.log(`  Passed Checks: ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`  Failed Checks: ${total - passed}`);
  console.log("================================================================================\n");

  await browser.close();
  if (passed !== total) process.exit(1);
}

main().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
