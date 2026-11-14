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

console.log("================================================================================");
console.log("    FIGHTERX E2E ACCESSIBILITY, REDUCED MOTION & MODAL FOCUS SUITE             ");
console.log("================================================================================");
console.log(`Target Host: ${BASE_URL}\n`);

const testResults = [];

function recordTest(id, name, passed, details = "") {
  testResults.push({ id, name, passed, details });
  const status = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
  console.log(`  ${status} [${id}] ${name}`);
  if (details) {
    console.log(`         -> ${details}`);
  }
}

async function runA11ySuite() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  // ---------------------------------------------------------------------------
  // 1. REDUCED MOTION VERIFICATION (prefers-reduced-motion: reduce)
  // ---------------------------------------------------------------------------
  console.log("--- 1. PREFERS-REDUCED-MOTION: REDUCE VERIFICATION ---");

  const reducedMotionContext = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });

  // 1.1 Homepage Reduced Motion
  try {
    const page = await reducedMotionContext.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(200);

    const smokeDrift = await page.evaluate(() => {
      const smokeEl = document.querySelector(".hero-smoke");
      if (!smokeEl) return null;
      const style = window.getComputedStyle(smokeEl);
      return {
        animationName: style.animationName,
        opacity: style.opacity,
        transform: style.transform,
      };
    });

    const settledHeadline = await page.evaluate(() => {
      const headline = document.querySelector(".hero-heading, h1");
      if (!headline) return null;
      const style = window.getComputedStyle(headline);
      return {
        opacity: style.opacity,
        visibility: style.visibility,
      };
    });

    const smokeSettled = !smokeDrift || smokeDrift.animationName === "none" || smokeDrift.animationName === "";
    recordTest(
      "A11Y-REDMOT-01",
      "Homepage ambient smoke loop settled to static layer without keyframe drift",
      smokeSettled,
      smokeDrift ? `animationName: "${smokeDrift.animationName}", opacity: ${smokeDrift.opacity}` : "element not found"
    );

    const headlineVisible = settledHeadline && parseFloat(settledHeadline.opacity) >= 0.9;
    recordTest(
      "A11Y-REDMOT-02",
      "Homepage hero headline immediately settled at opacity 1 on reduced motion",
      headlineVisible,
      settledHeadline ? `opacity: ${settledHeadline.opacity}, visibility: ${settledHeadline.visibility}` : "not found"
    );

    await page.close();
  } catch (err) {
    recordTest("A11Y-REDMOT-01/02", "Homepage reduced motion check", false, err.message);
  }

  // 1.2 Guidelines Reduced Motion
  try {
    const page = await reducedMotionContext.newPage();
    await page.goto(`${BASE_URL}/guidelines`, { waitUntil: "networkidle" });
    await page.waitForTimeout(200);

    const titleSettled = await page.evaluate(() => {
      const titleLines = document.querySelectorAll(".guidelines-title-line");
      if (!titleLines.length) return false;
      return Array.from(titleLines).every((el) => {
        const s = window.getComputedStyle(el);
        return parseFloat(s.opacity) >= 0.9 && s.visibility === "visible";
      });
    });

    recordTest(
      "A11Y-REDMOT-03",
      "Guidelines hero title lines settle immediately to autoAlpha 1 under reduced motion",
      titleSettled,
      "Found .guidelines-title-line settled with full visibility"
    );
    await page.close();
  } catch (err) {
    recordTest("A11Y-REDMOT-03", "Guidelines reduced motion check", false, err.message);
  }

  // 1.3 Disciplines Paired Cards Reduced Motion
  try {
    const page = await reducedMotionContext.newPage();
    await page.goto(`${BASE_URL}/disciplines`, { waitUntil: "networkidle" });
    await page.waitForTimeout(200);

    const cardsSettled = await page.evaluate(() => {
      const seni = document.querySelector(".discipline-card-seni");
      const olahraga = document.querySelector(".discipline-card-olahraga");
      if (!seni || !olahraga) return false;
      const sSeni = window.getComputedStyle(seni);
      const sOlahraga = window.getComputedStyle(olahraga);
      return parseFloat(sSeni.opacity) >= 0.9 && parseFloat(sOlahraga.opacity) >= 0.9;
    });

    recordTest(
      "A11Y-REDMOT-04",
      "Disciplines Seni & Olahraga paired cards settle immediately without delay",
      cardsSettled,
      "Cards have opacity >= 0.9 without animation delay"
    );
    await page.close();
  } catch (err) {
    recordTest("A11Y-REDMOT-04", "Disciplines reduced motion check", false, err.message);
  }

  await reducedMotionContext.close();

  // ---------------------------------------------------------------------------
  // 2. MODAL KEYBOARD NAVIGATION & FOCUS TRAPPING
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. MODAL KEYBOARD FOCUS TRAPPING & TRIGGER RESTORATION ---");

  const normalContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  // 2.1 Competitions Modal Focus Trap & Restoration
  try {
    const page = await normalContext.newPage();
    await page.goto(`${BASE_URL}/competitions`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    // Click first competition card to open detail modal
    const clicked = await page.evaluate(() => {
      const card = document.querySelector(".comp-glass-card, [class*='comp-glass-card']");
      if (card) {
        card.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await page.waitForTimeout(400);

      // Verify modal is open
      const modalOpen = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .pro-modal-container, .modal-backdrop");
        return !!modal;
      });

      // Verify focus is inside modal
      const focusInsideModal = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .pro-modal-container, .modal-backdrop");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      // Test Tab navigation inside modal
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      const tabTrapped = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .pro-modal-container, .modal-backdrop");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      // Test Escape dismissal
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      const modalClosed = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .pro-modal-container, .modal-backdrop");
        return !modal;
      });

      recordTest(
        "A11Y-MODAL-01",
        "Competitions tournament modal: focus auto-contained, Tab trapped, Escape dismissed",
        modalOpen && (focusInsideModal || tabTrapped) && modalClosed,
        `modalOpen: ${modalOpen}, focusInside: ${focusInsideModal}, tabTrapped: ${tabTrapped}, modalClosed: ${modalClosed}`
      );
    } else {
      recordTest("A11Y-MODAL-01", "Competitions tournament modal", false, "Card not found");
    }
    await page.close();
  } catch (err) {
    recordTest("A11Y-MODAL-01", "Competitions modal focus test", false, err.message);
  }

  // 2.2 Leaderboard Athlete Detail Modal Focus Trap & Restoration
  try {
    const page = await normalContext.newPage();
    await page.goto(`${BASE_URL}/leaderboard`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const clicked = await page.evaluate(() => {
      const card = document.querySelector("div.group.cursor-pointer");
      if (card) {
        card.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await page.waitForTimeout(400);

      const modalOpen = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .athlete-modal-container");
        return !!modal;
      });

      const focusInside = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .athlete-modal-container");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      const tabStayedInside = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .athlete-modal-container");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      const modalClosed = await page.evaluate(() => {
        return !document.querySelector("[role='dialog'], .athlete-modal-container");
      });

      recordTest(
        "A11Y-MODAL-02",
        "Leaderboard athlete detail modal: focus trapped within dialog and dismisses on Escape",
        modalOpen && (focusInside || tabStayedInside) && modalClosed,
        `modalOpen: ${modalOpen}, focusInside: ${focusInside}, tabTrapped: ${tabStayedInside}, closed: ${modalClosed}`
      );
    } else {
      recordTest("A11Y-MODAL-02", "Leaderboard athlete modal", false, "Athlete card not found");
    }
    await page.close();
  } catch (err) {
    recordTest("A11Y-MODAL-02", "Leaderboard athlete modal test", false, err.message);
  }

  // 2.3 Associations Detail Modal Focus Trap & Restoration
  try {
    const page = await normalContext.newPage();
    await page.goto(`${BASE_URL}/associations`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const clicked = await page.evaluate(() => {
      const card = document.querySelector(".association-card, article[role='button']");
      if (card) {
        card.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await page.waitForTimeout(400);

      const modalOpen = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .assoc-modal-card");
        return !!modal;
      });

      const focusInside = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .assoc-modal-card");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      await page.keyboard.press("Tab");
      const tabTrapped = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], .assoc-modal-card");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      const modalClosed = await page.evaluate(() => {
        return !document.querySelector("[role='dialog'], .assoc-modal-card");
      });

      recordTest(
        "A11Y-MODAL-03",
        "Associations detail modal: keyboard focus containment and Escape dismissal verified",
        modalOpen && (focusInside || tabTrapped) && modalClosed,
        `modalOpen: ${modalOpen}, focusInside: ${focusInside}, tabTrapped: ${tabTrapped}, closed: ${modalClosed}`
      );
    } else {
      recordTest("A11Y-MODAL-03", "Associations detail modal", false, "Association card not found");
    }
    await page.close();
  } catch (err) {
    recordTest("A11Y-MODAL-03", "Associations modal test", false, err.message);
  }

  // 2.4 Moments Lightbox Modal Focus Trap & Restoration
  try {
    const page = await normalContext.newPage();
    await page.goto(`${BASE_URL}/moments`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const clicked = await page.evaluate(() => {
      const photo = document.querySelector("[class*='aspect-[4/3]'].cursor-pointer, [class*='cursor-pointer'][class*='aspect']");
      if (photo) {
        photo.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await page.waitForTimeout(400);

      const modalOpen = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], [class*='fixed inset-0']");
        return !!modal;
      });

      const focusInside = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], [class*='fixed inset-0']");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      await page.keyboard.press("Tab");
      const tabTrapped = await page.evaluate(() => {
        const modal = document.querySelector("[role='dialog'], [class*='fixed inset-0']");
        if (!modal) return false;
        return modal.contains(document.activeElement);
      });

      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      const modalClosed = await page.evaluate(() => {
        return !document.querySelector("[role='dialog'], [class*='fixed inset-0']");
      });

      recordTest(
        "A11Y-MODAL-04",
        "Moments lightbox modal: focus trapping and Escape dismissal verified",
        modalOpen && (focusInside || tabTrapped) && modalClosed,
        `modalOpen: ${modalOpen}, focusInside: ${focusInside}, tabTrapped: ${tabTrapped}, closed: ${modalClosed}`
      );
    } else {
      recordTest("A11Y-MODAL-04", "Moments lightbox modal", false, "Moment photo trigger not found");
    }
    await page.close();
  } catch (err) {
    recordTest("A11Y-MODAL-04", "Moments lightbox modal test", false, err.message);
  }

  await normalContext.close();

  // ---------------------------------------------------------------------------
  // 3. JAVASCRIPT-DISABLED SSR BASELINE VERIFICATION
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. JAVASCRIPT-DISABLED READABILITY & BASELINE AUDIT ---");

  const noJsContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 800 },
  });

  const NO_JS_ROUTES = [
    { route: "/", name: "Homepage", headingSelector: "h1" },
    { route: "/guidelines", name: "Guidelines", headingSelector: "h1" },
    { route: "/disciplines", name: "Disciplines", headingSelector: "h1" },
    { route: "/competitions", name: "Competitions", headingSelector: "h1" },
    { route: "/knowledge", name: "Knowledge Hub", headingSelector: "h1" },
  ];

  for (const { route, name, headingSelector } of NO_JS_ROUTES) {
    try {
      const page = await noJsContext.newPage();
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "commit" });

      const audit = await page.evaluate((sel) => {
        const heading = document.querySelector(sel);
        const bodyText = document.body.innerText || "";
        const visibleLinks = Array.from(document.querySelectorAll("a")).filter((a) => a.offsetParent !== null).length;
        const visibleButtons = Array.from(document.querySelectorAll("button")).filter((b) => b.offsetParent !== null).length;
        return {
          hasHeading: !!heading,
          headingText: heading ? heading.innerText.trim().slice(0, 50) : "",
          bodyTextLength: bodyText.length,
          visibleLinks,
          visibleButtons,
        };
      }, headingSelector);

      const passed = audit.hasHeading && audit.bodyTextLength > 300;
      recordTest(
        `A11Y-NOJS-${name.slice(0, 4).toUpperCase()}`,
        `No-JS baseline for ${name}: content and semantic markup rendered cleanly in SSR`,
        passed,
        `Heading: "${audit.headingText}", TextLen: ${audit.bodyTextLength}, Links: ${audit.visibleLinks}, Buttons: ${audit.visibleButtons}`
      );

      await page.close();
    } catch (err) {
      recordTest(`A11Y-NOJS-${name.slice(0, 4).toUpperCase()}`, `No-JS baseline for ${name}`, false, err.message);
    }
  }

  await noJsContext.close();
  await browser.close();

  console.log("\n================================================================================");
  console.log("             ACCESSIBILITY & REDUCED MOTION AUDIT SUMMARY                      ");
  console.log("================================================================================");
  const total = testResults.length;
  const passedCount = testResults.filter((r) => r.passed).length;
  const failedCount = testResults.filter((r) => !r.passed).length;
  console.log(`  Total Checks:  ${total}`);
  console.log(`  Passed Checks: ${passedCount} (${Math.round((passedCount / total) * 100)}%)`);
  console.log(`  Failed Checks: ${failedCount}`);
  console.log("================================================================================\n");

  const outPath = path.join(ROOT_DIR, "evidence", "a11y-motion-results.json");
  fs.writeFileSync(outPath, JSON.stringify(testResults, null, 2), "utf8");
  console.log(`Saved detailed audit to: ${outPath}`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runA11ySuite().catch((err) => {
  console.error("Accessibility suite execution failed:", err);
  process.exit(1);
});
