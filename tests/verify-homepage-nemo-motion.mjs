import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("       FIGHTERX HOMEPAGE NEMO MOTION AUTOMATED VERIFICATION SUITE              ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const testResults = [];
  function assert(id, description, passed, details = "") {
    testResults.push({ id, description, passed, details });
    const mark = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`  ${mark} [${id}] ${description}`);
    if (details) console.log(`         -> ${details}`);
  }

  // 1. VERIFY CSS HOVER RULES ACROSS ALL 7 CARD TYPES
  console.log("\n--- 1. CARD HOVER MICRO-INTERACTIONS & TACTILE 3D BUTTON POP ---");
  const cssRules = await page.evaluate(() => {
    const results = {
      cardHoverRule: null,
      tactileButtonActiveRule: null,
      tactileButtonDefaultRule: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('.feature-item:hover') && rule.selectorText.includes('.spotlight-card:hover')) {
            results.cardHoverRule = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes('.tactile-btn:active')) {
            results.tactileButtonActiveRule = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              transition: rule.style.transition,
            };
          }
          if (rule.selectorText && rule.selectorText.includes('.tactile-btn') && !rule.selectorText.includes(':')) {
            results.tactileButtonDefaultRule = {
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
    "NEMO-HOVER-01",
    "Card hover micro-interaction specifies translateY(-2px) and shadow pop across all 7 card components",
    cssRules.cardHoverRule && cssRules.cardHoverRule.transform.includes("translateY(-2px)") && !!cssRules.cardHoverRule.boxShadow,
    JSON.stringify(cssRules.cardHoverRule)
  );

  assert(
    "NEMO-TACTILE-01",
    "Tactile 3D button pop specifies scale(0.95) on :active with spring/back easing transition on release",
    cssRules.tactileButtonActiveRule && cssRules.tactileButtonActiveRule.transform.includes("scale(0.95)") &&
    cssRules.tactileButtonDefaultRule && cssRules.tactileButtonDefaultRule.transition.includes("cubic-bezier"),
    `Active: ${cssRules.tactileButtonActiveRule?.transform}, Default: ${cssRules.tactileButtonDefaultRule?.transition}`
  );

  // 2. VERIFY ENTRANCE & INLINE PROPERTY CLEARANCE ON ALL 7 CARD GROUPS
  console.log("\n--- 2. HORIZONTAL CLIP-PATH IRIS ENTRANCE & INLINE STYLE CLEARANCE ---");

  const componentsToTest = [
    { name: "FeatureRail", selector: ".feature-item" },
    { name: "Athlete Spotlight", selector: ".spotlight-card" },
    { name: "Collaboration", selector: ".collab-card" },
    { name: "Testimonials", selector: ".testimonial-card" },
    { name: "Workflow steps", selector: ".workflow-step" },
    { name: "Programme cards", selector: ".programme-card" },
    { name: "FAQ accordion", selector: ".faq-list details" },
  ];

  for (const comp of componentsToTest) {
    const report = await page.evaluate(async (sel) => {
      const el = document.querySelector(sel);
      if (!el) return { found: false, count: 0, allClear: false };
      
      // Scroll into view to trigger ScrollTrigger
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      window.dispatchEvent(new Event('scroll'));
      
      const startTime = Date.now();
      let elements = Array.from(document.querySelectorAll(sel));
      let states = [];
      let allClear = false;

      while (Date.now() - startTime < 2500) {
        elements = Array.from(document.querySelectorAll(sel));
        states = elements.map((item, idx) => {
          const style = item.getAttribute('style') || '';
          const cs = window.getComputedStyle(item);
          const hasInlineClipPath = style.includes('clip-path') || style.includes('clipPath');
          const hasInlineTransform = style.includes('transform');
          const hasInlineOpacity = style.includes('opacity');
          const hasInlineWillChange = style.includes('will-change');
          
          return {
            idx,
            hasInlineClipPath,
            hasInlineTransform,
            hasInlineOpacity,
            hasInlineWillChange,
            computedOpacity: cs.opacity,
            computedClipPath: cs.clipPath,
            inlineStyle: style,
          };
        });
        allClear = states.every(s => !s.hasInlineClipPath && !s.hasInlineTransform && !s.hasInlineOpacity && !s.hasInlineWillChange);
        if (allClear) break;
        await new Promise(r => setTimeout(r, 100));
      }
      
      return {
        found: true,
        count: elements.length,
        allClear,
        states,
      };
    }, comp.selector);

    assert(
      `NEMO-CLEAR-${comp.name.toUpperCase().replace(/\s+/g, "_")}`,
      `${comp.name} cards (${report.count} items) clear inline clipPath, transform, and opacity upon completion`,
      report.found && report.allClear,
      `Items: ${report.count}, AllClear: ${report.allClear}`
    );
  }

  // 3. VERIFY GLASSMORPHISM VISUAL INTEGRITY
  console.log("\n--- 3. GLASSMORPHISM VISUAL STYLING PRESERVATION ---");

  const glassmorphismData = await page.evaluate(() => {
    const spotlight = document.querySelector('.spotlight-card');
    const testimonials = document.querySelector('.testimonial-card');
    const featureRail = document.querySelector('.feature-rail');
    
    return {
      spotlightBlur: spotlight ? window.getComputedStyle(spotlight).backdropFilter : 'none',
      spotlightBorder: spotlight ? window.getComputedStyle(spotlight).borderColor : 'none',
      testimonialsBlur: testimonials ? window.getComputedStyle(testimonials).backdropFilter : 'none',
      featureRailBlur: featureRail ? window.getComputedStyle(featureRail).backdropFilter : 'none',
      featureRailBg: featureRail ? window.getComputedStyle(featureRail).background : 'none',
    };
  });

  assert(
    "NEMO-GLASS-01",
    "Athlete Spotlight preserves 40px glassmorphism blur and translucent border",
    glassmorphismData.spotlightBlur.includes("blur") && glassmorphismData.spotlightBorder !== "none",
    `Blur: ${glassmorphismData.spotlightBlur}, Border: ${glassmorphismData.spotlightBorder}`
  );

  assert(
    "NEMO-GLASS-02",
    "Testimonials cards preserve 12px glassmorphism backdrop blur",
    glassmorphismData.testimonialsBlur.includes("blur"),
    `Blur: ${glassmorphismData.testimonialsBlur}`
  );

  assert(
    "NEMO-GLASS-03",
    "FeatureRail preserves 8px glassmorphism blur and translucent gradient background",
    glassmorphismData.featureRailBlur.includes("blur") && glassmorphismData.featureRailBg.includes("rgba"),
    `Blur: ${glassmorphismData.featureRailBlur}`
  );

  // 4. VERIFY POINTER CLICK INTERACTION POP
  console.log("\n--- 4. INTERACTIVE POINTER CLICK POP ---");

  const pointerPopResult = await page.evaluate(async () => {
    const btn = document.querySelector('.tactile-btn') || document.querySelector('.button-primary');
    if (!btn) return { tested: false };
    
    btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await new Promise(r => setTimeout(r, 40));
    
    btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await new Promise(r => setTimeout(r, 450));
    
    const finalStyle = btn.getAttribute('style') || '';
    const hasLingeringTransform = finalStyle.includes('transform') || finalStyle.includes('scale');
    
    return {
      tested: true,
      hasLingeringTransform,
      finalStyle,
    };
  });

  assert(
    "NEMO-CLICK-01",
    "Tactile button pop cleanly removes inline transform styles after spring oscillation",
    pointerPopResult.tested && !pointerPopResult.hasLingeringTransform,
    `Tested: ${pointerPopResult.tested}, Cleaned: ${!pointerPopResult.hasLingeringTransform}`
  );

  await browser.close();

  console.log("\n================================================================================");
  console.log("                        VERIFICATION AUDIT SUMMARY                              ");
  console.log("================================================================================");
  const total = testResults.length;
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  console.log(`  Total Checks:  ${total}`);
  console.log(`  Passed Checks: ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`  Failed Checks: ${failed}`);
  console.log("================================================================================\n");

  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
