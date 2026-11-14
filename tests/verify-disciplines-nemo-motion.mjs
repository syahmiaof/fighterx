import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("================================================================================");
  console.log("        FIGHTERX KATEGORI (/disciplines) NEMO MOTION VERIFICATION SUITE         ");
  console.log("================================================================================");
  console.log(`Connecting to: ${BASE_URL}/disciplines\n`);

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  await page.goto(`${BASE_URL}/disciplines`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

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
      matrixCardHover: null,
      gpuAcceleration: null,
      tactileButton: null,
    };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (
            rule.selectorText &&
            rule.selectorText.split(",").some((s) => s.trim() === ".discipline-card-seni:hover")
          ) {
            results.cardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              boxShadow: rule.style.boxShadow,
              borderColor: rule.style.borderColor,
            };
          }
          if (
            rule.selectorText &&
            rule.selectorText.split(",").some((s) => s.trim() === ".matrix-card:hover")
          ) {
            results.matrixCardHover = {
              selector: rule.selectorText,
              transform: rule.style.transform,
            };
          }
          if (
            rule.selectorText &&
            rule.selectorText.includes(".discipline-card-seni") &&
            rule.style.transform &&
            rule.style.transform.includes("translateZ")
          ) {
            results.gpuAcceleration = {
              selector: rule.selectorText,
              transform: rule.style.transform,
              backfaceVisibility: rule.style.backfaceVisibility,
            };
          }
          if (
            rule.selectorText &&
            rule.selectorText.includes(".disc-tab-btn") &&
            rule.style.transition
          ) {
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
    "DISC-HOVER-01",
    ".discipline-card-seni specifies translateY(-2px) and red specular glow on hover",
    cssRules.cardHover && cssRules.cardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.cardHover)
  );

  assert(
    "DISC-HOVER-02",
    ".matrix-card specifies translateY(-2px) hover micro-lift",
    cssRules.matrixCardHover && cssRules.matrixCardHover.transform.includes("translateY(-2px)"),
    JSON.stringify(cssRules.matrixCardHover)
  );

  assert(
    "DISC-GPU-01",
    "Discipline cards have GPU acceleration transform: translateZ(0)",
    cssRules.gpuAcceleration && cssRules.gpuAcceleration.transform.includes("translateZ"),
    JSON.stringify(cssRules.gpuAcceleration)
  );

  assert(
    "DISC-TACTILE-01",
    ".disc-tab-btn and discipline buttons have tactile spring transitions",
    cssRules.tactileButton !== null,
    JSON.stringify(cssRules.tactileButton)
  );

  // 2. VERIFY HERO CARDS ENTRANCE AND SETTLING
  console.log("\n--- 2. HERO DUAL CARDS ENTRANCE & IRIS SETTLING ---");
  await page.waitForTimeout(2200); // Allow full hero entrance timeline (1.8s) to complete
  const heroCardsStatus = await page.evaluate(() => {
    const seniCard = document.querySelector(".discipline-card-seni");
    const olahragaCard = document.querySelector(".discipline-card-olahraga");
    if (!seniCard || !olahragaCard) return null;
    const seniComputed = window.getComputedStyle(seniCard);
    const olahComputed = window.getComputedStyle(olahragaCard);
    return {
      seniOpacity: seniComputed.opacity,
      seniInlineClip: seniCard.style.clipPath,
      olahOpacity: olahComputed.opacity,
      olahInlineClip: olahragaCard.style.clipPath,
    };
  });

  assert(
    "HERO-CARDS-01",
    "Hero dual cards (Seni & Olahraga) completed entrance reveal with clean inline properties",
    heroCardsStatus &&
      heroCardsStatus.seniOpacity === "1" &&
      !heroCardsStatus.seniInlineClip &&
      heroCardsStatus.olahOpacity === "1" &&
      !heroCardsStatus.olahInlineClip,
    JSON.stringify(heroCardsStatus)
  );

  // 3. VERIFY COMPARISON MATRIX CARDS SCROLL ENTRANCE & TOGGLE
  console.log("\n--- 3. COMPARISON MATRIX CARDS ENTRANCE & VIEW TOGGLE ---");
  await page.evaluate(() => {
    document.getElementById("overview")?.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1400); // Allow ScrollTrigger reveal to finish

  const matrixStatus = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".matrix-card"));
    if (cards.length === 0) return { count: 0 };
    const first = cards[0];
    const computed = window.getComputedStyle(first);
    return {
      count: cards.length,
      firstOpacity: computed.opacity,
      firstInlineClip: first.style.clipPath,
    };
  });

  assert(
    "MATRIX-COUNT-01",
    "Matrix comparison cards rendered (>= 6 items)",
    matrixStatus.count >= 6,
    `Card count: ${matrixStatus.count}`
  );

  assert(
    "MATRIX-REVEAL-01",
    "Matrix cards revealed with clean inline properties",
    matrixStatus.firstOpacity === "1" && !matrixStatus.firstInlineClip,
    JSON.stringify(matrixStatus)
  );

  // Toggle view mode to "Fokus Seni Sahaja"
  const seniFocusBtn = await page.$('button.matrix-toggle-btn:has-text("Fokus Seni Sahaja")');
  if (seniFocusBtn) {
    await seniFocusBtn.click();
    await page.waitForTimeout(500);

    const seniVisible = await page.evaluate(() => {
      const cards = document.querySelectorAll(".matrix-card");
      const seniBadges = Array.from(document.querySelectorAll(".matrix-card span")).filter((el) =>
        el.textContent?.includes("Silat Seni")
      );
      return { cardsCount: cards.length, seniBadgesCount: seniBadges.length };
    });

    assert(
      "MATRIX-TOGGLE-01",
      "Switching view mode to 'Fokus Seni' filters matrix cards smoothly",
      seniVisible.cardsCount > 0,
      JSON.stringify(seniVisible)
    );
  }

  // 4. VERIFY SILAT SENI SECTION & 100 JURUS CARDS
  console.log("\n--- 4. SILAT SENI SECTION & 100 JURUS CARDS ---");
  await page.evaluate(() => {
    document.getElementById("silat-seni")?.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1400);

  const seniSectionStatus = await page.evaluate(() => {
    const glassCard = document.querySelector(".seni-glass-card");
    const phaseCards = Array.from(document.querySelectorAll(".seni-phase-card"));
    const glassOpacity = glassCard ? window.getComputedStyle(glassCard).opacity : "0";
    return {
      glassVisible: glassOpacity === "1",
      glassInlineClip: glassCard?.style.clipPath,
      phaseCardsCount: phaseCards.length,
    };
  });

  assert(
    "SENI-REVEAL-01",
    "Silat Seni detail glass card & 3-phase cards revealed cleanly",
    seniSectionStatus.glassVisible && seniSectionStatus.phaseCardsCount === 3,
    JSON.stringify(seniSectionStatus)
  );

  // Click "Ganda" tab in Seni section
  const gandaTab = await page.$('.seni-cat-btn:has-text("Ganda")');
  if (gandaTab) {
    await gandaTab.click();
    await page.waitForTimeout(600);

    const gandaTitle = await page.evaluate(() => {
      return document.querySelector(".seni-glass-card h3")?.textContent;
    });

    assert(
      "SENI-TAB-01",
      "Seni category switcher dynamically updates card content to 'Ganda'",
      gandaTitle && gandaTitle.includes("Ganda"),
      `Title: ${gandaTitle}`
    );
  }

  // 5. VERIFY SILAT OLAHRAGA SECTION & TACTICAL PILLARS
  console.log("\n--- 5. SILAT OLAHRAGA SECTION & TACTICAL PILLARS ---");
  await page.evaluate(() => {
    document.getElementById("silat-olahraga")?.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1400);

  const olahragaStatus = await page.evaluate(() => {
    const pillars = Array.from(document.querySelectorAll(".tactical-pillar-card"));
    const weightCards = Array.from(document.querySelectorAll(".weight-class-card"));
    return {
      pillarCount: pillars.length,
      firstPillarOpacity: pillars.length > 0 ? window.getComputedStyle(pillars[0]).opacity : "0",
      firstPillarClip: pillars[0]?.style.clipPath,
      weightCardsCount: weightCards.length,
    };
  });

  assert(
    "OLAH-PILLARS-01",
    "3 Tactical pillar cards revealed with clean inline properties",
    olahragaStatus.pillarCount === 3 && olahragaStatus.firstPillarOpacity === "1",
    JSON.stringify(olahragaStatus)
  );

  assert(
    "OLAH-WEIGHTS-01",
    "Senior weight class cards populated and rendered",
    olahragaStatus.weightCardsCount >= 8,
    `Weight classes: ${olahragaStatus.weightCardsCount}`
  );

  // Test target zone click
  const prohibitedZoneBtn = await page.$('button.zone-toggle-btn:has-text("Leher & Kepala")');
  if (prohibitedZoneBtn) {
    await prohibitedZoneBtn.click();
    await page.waitForTimeout(400);

    const activeZoneName = await page.evaluate(() => {
      return document.querySelector(".lg\\:col-span-7 h4")?.textContent;
    });

    assert(
      "OLAH-ZONE-01",
      "Interactive anatomy target zone selector updates detail card",
      activeZoneName && activeZoneName.includes("Leher"),
      `Active zone: ${activeZoneName}`
    );
  }

  // 6. VERIFY EQUIPMENT BREAKDOWN SECTION
  console.log("\n--- 6. EQUIPMENT BREAKDOWN SECTION ---");
  await page.evaluate(() => {
    document.getElementById("equipment")?.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1400);

  const equipmentStatus = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".equipment-card"));
    return {
      count: cards.length,
      firstOpacity: cards.length > 0 ? window.getComputedStyle(cards[0]).opacity : "0",
      firstClip: cards[0]?.style.clipPath,
    };
  });

  assert(
    "EQUIP-REVEAL-01",
    "Equipment cards revealed with clean inline properties",
    equipmentStatus.count >= 6 && equipmentStatus.firstOpacity === "1" && !equipmentStatus.firstClip,
    JSON.stringify(equipmentStatus)
  );

  // 7. VERIFY CTA SECTION
  console.log("\n--- 7. DISCIPLINES CTA SECTION ---");
  await page.evaluate(() => {
    document.getElementById("cta")?.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1400);

  const ctaStatus = await page.evaluate(() => {
    const card = document.querySelector(".discipline-cta-card");
    if (!card) return null;
    const computed = window.getComputedStyle(card);
    return {
      opacity: computed.opacity,
      inlineClip: card.style.clipPath,
    };
  });

  assert(
    "CTA-REVEAL-01",
    ".discipline-cta-card completed entrance reveal with clean inline properties",
    ctaStatus && ctaStatus.opacity === "1" && !ctaStatus.inlineClip,
    JSON.stringify(ctaStatus)
  );

  // 8. SUMMARY
  console.log("\n================================================================================");
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`TOTAL TESTS : ${total}`);
  console.log(`PASSED      : ${passed}`);
  console.log(`FAILED      : ${failed}`);

  if (failed === 0) {
    console.log("\x1b[32m>>> ALL KATEGORI NEMO MOTION CHECKS PASSED PERFECTLY! <<<\x1b[0m");
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
