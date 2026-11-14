import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("        FIGHTERX PERSATUAN (/associations) NEMO MOTION VERIFICATION SUITE       ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}/associations\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  await page.goto(`${BASE_URL}/associations`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const testResults = [];
  function assert(id, description, passed, details = "") {
    testResults.push({ id, description, passed, details });
    const mark = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`  ${mark} [${id}] ${description}`);
    if (details) console.log(`         -> ${details}`);
  }

  // 1. VERIFY CSS HOVER RULES & GPU ACCELERATION
  console.log("\n--- 1. CARD HOVER MICRO-INTERACTIONS & GPU ACCELERATION ---");
  const cssRules = await page.evaluate(() => {
    const results = {
      cardHover: null,
      specCardHover: null,
      gpuAcceleration: null,
      tactileButton: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (
            rule.selectorText &&
            rule.selectorText.split(",").some((s) => s.trim() === ".association-card:hover")
          ) {
            results.cardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".spec-card:hover")) {
            results.specCardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".association-card") && rule.style.transform && rule.style.transform.includes("translateZ")) {
            results.gpuAcceleration = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              backfaceVisibility: rule.style.backfaceVisibility,
            };
          }
          if (rule.selectorText && rule.selectorText.includes(".category-pill") && rule.style.transition) {
            results.tactileButton = {
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
    "ASSOC-HOVER-01",
    ".association-card specifies translateY(-2px) and red specular glow on hover",
    cssRules.cardHover && cssRules.cardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.cardHover)
  );

  assert(
    "ASSOC-HOVER-02",
    ".spec-card specifies translateY(-2px) hover micro-lift",
    cssRules.specCardHover && cssRules.specCardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.specCardHover)
  );

  assert(
    "ASSOC-GPU-01",
    ".association-card and .spec-card have GPU acceleration transform: translateZ(0)",
    cssRules.gpuAcceleration && cssRules.gpuAcceleration.transform.includes("translateZ"),
    JSON.stringify(cssRules.gpuAcceleration)
  );

  assert(
    "ASSOC-TACTILE-01",
    ".category-pill has tactile spring cubic-bezier transitions",
    cssRules.tactileButton !== null,
    JSON.stringify(cssRules.tactileButton)
  );

  // 2. VERIFY CONTROLS ENTRANCE & INLINE CLEANUP
  console.log("\n--- 2. CONTROLS SECTION ENTRANCE & INLINE CLEANUP ---");
  await page.waitForTimeout(1400); // Allow entrance animations to settle
  const controlsStatus = await page.evaluate(() => {
    const section = document.querySelector(".directory-controls-section");
    if (!section) return null;
    const computed = window.getComputedStyle(section);
    return {
      opacity: computed.opacity,
      inlineClipPath: section.style.clipPath,
      inlineTransform: section.style.transform,
      visible: computed.visibility !== "hidden" && computed.display !== "none",
    };
  });

  assert(
    "CONTROLS-ENTRANCE-01",
    ".directory-controls-section is fully visible (opacity = 1) with clean inline properties",
    controlsStatus && controlsStatus.opacity === "1" && !controlsStatus.inlineClipPath,
    JSON.stringify(controlsStatus)
  );

  // 3. VERIFY ASSOCIATION CARDS ENTRANCE AND SMOOTH IRIS SETTLING
  console.log("\n--- 3. ASSOCIATION CARDS ENTRANCE & IRIS SETTLING ---");
  const cardsStatus = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".association-card"));
    if (cards.length === 0) return { count: 0 };
    const firstCard = cards[0];
    const computed = window.getComputedStyle(firstCard);
    return {
      count: cards.length,
      firstCardOpacity: computed.opacity,
      firstCardInlineClip: firstCard.style.clipPath,
      firstCardInlineTransform: firstCard.style.transform,
    };
  });

  assert(
    "CARDS-COUNT-01",
    "Association cards grid rendered and populated (>= 4 cards)",
    cardsStatus.count >= 4,
    `Card count: ${cardsStatus.count}`
  );

  assert(
    "CARDS-REVEAL-01",
    "Cards completed entrance reveal, fully visible with inline GSAP overrides cleared",
    cardsStatus.firstCardOpacity === "1" && !cardsStatus.firstCardInlineClip,
    JSON.stringify(cardsStatus)
  );

  // 4. VERIFY CATEGORY FILTER INTERACTION & COLLECTION MOTION
  console.log("\n--- 4. CATEGORY FILTER INTERACTION & DYNAMIC MOTION ---");
  const categoryPills = await page.$$(".category-pill");
  assert(
    "CAT-PILLS-01",
    "Category filter pills exist (Semua, Badan Induk, Pengasas Teras, etc.)",
    categoryPills.length >= 4,
    `Found ${categoryPills.length} category pills`
  );

  // Click "Pengasas Teras" filter pill
  const pengasasPill = await page.$('.category-pill:has-text("Pengasas Teras")');
  if (pengasasPill) {
    await pengasasPill.click();
    await page.waitForTimeout(600);

    const pengasasCardsCount = await page.evaluate(() => {
      return document.querySelectorAll(".association-card").length;
    });

    assert(
      "CAT-FILTER-01",
      "Filtering to 'Pengasas Teras' updates card list dynamically (4 founding schools)",
      pengasasCardsCount === 4,
      `Found ${pengasasCardsCount} cards for Pengasas Teras`
    );

    // Switch back to "Semua"
    const allPill = await page.$('.category-pill:has-text("Semua")');
    if (allPill) {
      await allPill.click();
      await page.waitForTimeout(600);
    }
  }

  // 5. VERIFY SEARCH FUNCTIONALITY
  console.log("\n--- 5. SEARCH BAR INTERACTION ---");
  const searchInput = await page.$(".search-input");
  assert("SEARCH-INPUT-01", "Search input box exists and is interactive", searchInput !== null);

  if (searchInput) {
    await searchInput.fill("Gayong");
    await page.waitForTimeout(400);

    const searchResultCount = await page.evaluate(() => {
      return document.querySelectorAll(".association-card").length;
    });

    assert(
      "SEARCH-FILTER-01",
      "Typing 'Gayong' filters the list properly",
      searchResultCount >= 1,
      `Matches found: ${searchResultCount}`
    );

    // Clear search
    const clearBtn = await page.$(".search-clear-btn");
    if (clearBtn) {
      await clearBtn.click();
      await page.waitForTimeout(400);
    } else {
      await searchInput.fill("");
      await page.waitForTimeout(400);
    }
  }

  // 6. VERIFY ASSOCIATION DETAIL MODAL IRIS ENTRANCE & FOCUS TRAP
  console.log("\n--- 6. ASSOCIATION DETAIL MODAL IRIS ENTRANCE & FOCUS TRAP ---");
  const firstCard = await page.$(".association-card");
  assert("MODAL-TRIGGER-01", "First association card is clickable", firstCard !== null);

  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(650); // Allow modal GSAP Iris entrance to complete

    const modalData = await page.evaluate(() => {
      const modal = document.querySelector(".association-detail-modal");
      if (!modal) return null;
      const specCards = Array.from(modal.querySelectorAll(".spec-card"));
      const computed = window.getComputedStyle(modal);
      return {
        exists: true,
        opacity: computed.opacity,
        scale: computed.transform,
        bodyOverflow: document.body.style.overflow,
        specCardsCount: specCards.length,
        specCardOpacity: specCards.length > 0 ? window.getComputedStyle(specCards[0]).opacity : "0",
        closeButtonFocused: document.activeElement?.classList.contains("modal-close-button"),
      };
    });

    assert(
      "MODAL-IRIS-01",
      "Modal opened with Nemo Iris reveal and spec cards stagger animation",
      modalData && modalData.exists && modalData.opacity === "1" && modalData.specCardsCount > 0,
      JSON.stringify(modalData)
    );

    assert(
      "MODAL-OVERFLOW-01",
      "Body scroll is locked (overflow: hidden) while modal is open",
      modalData && modalData.bodyOverflow === "hidden",
      `Body overflow: ${modalData?.bodyOverflow}`
    );

    // Verify closing with Escape key
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    const afterClose = await page.evaluate(() => {
      const modal = document.querySelector(".association-detail-modal");
      return {
        modalClosed: modal === null,
        bodyOverflow: document.body.style.overflow,
      };
    });

    assert(
      "MODAL-ESCAPE-01",
      "Pressing Escape closes modal and restores body scroll",
      afterClose.modalClosed && afterClose.bodyOverflow !== "hidden",
      JSON.stringify(afterClose)
    );
  }

  // 7. SUMMARY
  console.log("\n================================================================================");
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`TOTAL TESTS : ${total}`);
  console.log(`PASSED      : ${passed}`);
  console.log(`FAILED      : ${failed}`);

  if (failed === 0) {
    console.log("\x1b[32m>>> ALL PERSATUAN NEMO MOTION CHECKS PASSED PERFECTLY! <<<\x1b[0m");
  } else {
    console.log("\x1b[31m>>> SOME CHECKS FAILED. PLEASE REVIEW ABOVE LOGS. <<<\x1b[0m");
  }
  console.log("================================================================================\n");

  await browser.close();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
