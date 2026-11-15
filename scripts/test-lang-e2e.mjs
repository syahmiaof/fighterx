import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = "http://localhost:3000";

// Banned parenthetical rojak strings that violate strict localization
const BANNED_ROJAK_PATTERNS = [
  /\bPukulan\s*\(\s*Punches\s*\)/i,
  /\bTendangan\s*\(\s*Kicks\s*\)/i,
  /\bJatuhan\s*\(\s*Takedown\s*\)/i,
  /\bSilat\s+Olahraga\s*\(\s*Tanding\s+Combat\s*\)/i,
  /\bSilat\s+Seni\s*\(\s*Artistic\s*\)/i,
  /\bKelab\s+Silat\s*\(\s*Club\s*\)/i,
  /\bAkademi\s+Persilatan\s*\(\s*Academy\s*\)/i,
  /\bGelanggang\s+Sendiri\s*\(\s*Dojo\s+Tetap\s*\)/i,
  /\bMatras\s+Pertandingan\s*\(\s*EVA\s+Mat\s*\)/i,
  /\bPelindung\s+Badan\s*\(\s*Body\s+Protector\s*\)/i,
];

async function toggleLanguage(page, targetLang) {
  await page.waitForTimeout(200);
  const currentLang = await page.getAttribute("html", "lang");
  if (currentLang === targetLang) return;

  const selector = targetLang === "bm"
    ? 'button[aria-label="Tukar ke Bahasa Melayu"]'
    : 'button[aria-label="Switch to English"]';

  const btn = await page.$(selector);
  if (btn) {
    await btn.click();
    await page.waitForFunction(
      (expected) => document.documentElement.lang === expected,
      targetLang,
      { timeout: 3000 }
    ).catch(() => {});
    await page.waitForTimeout(300);
  }
}

async function verifyNoBannedRojak(page, routeName, mode) {
  const content = await page.content();
  for (const pattern of BANNED_ROJAK_PATTERNS) {
    if (pattern.test(content)) {
      throw new Error(`[ZERO ROJAK VIOLATION] Found banned rojak pattern ${pattern} in route ${routeName} (${mode} mode)!`);
    }
  }
}

async function run() {
  console.log("================================================================================");
  console.log("   FIGHTERX E2E: STRICT BILINGUAL LOCALIZATION & ZERO ROJAK (7 ROUTES)         ");
  console.log("================================================================================");

  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let passedTests = 0;

  // --------------------------------------------------------------------------
  // TEST 1: Navigation Architecture & Default EN
  // --------------------------------------------------------------------------
  console.log("\n[TEST 1] Navigation Architecture & Default Pure English");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  let lang = await page.getAttribute("html", "lang");
  if (lang !== "en") throw new Error(`Expected default html[lang="en"], got ${lang}`);

  const enNavLabels = await page.$$eval(".nav-item-btn span:first-child", els => els.map(e => e.textContent?.trim()));
  console.log("  EN Navigation Labels:", enNavLabels);
  if (!enNavLabels.includes("Guidelines") || !enNavLabels.includes("Sport Science") || !enNavLabels.includes("Calendar") || !enNavLabels.includes("Disciplines")) {
    throw new Error("Missing expected English nav labels!");
  }
  await verifyNoBannedRojak(page, "/", "EN");
  console.log("  ✓ Default html[lang=\"en\"] and pure English nav verified with 0 rojak");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 2: Navigation Pure BM Toggle
  // --------------------------------------------------------------------------
  console.log("\n[TEST 2] Navigation Pure Bahasa Melayu on Toggle");
  await toggleLanguage(page, "bm");
  lang = await page.getAttribute("html", "lang");
  if (lang !== "bm") throw new Error(`Expected html[lang="bm"], got ${lang}`);

  const bmNavLabels = await page.$$eval(".nav-item-btn span:first-child", els => els.map(e => e.textContent?.trim()));
  console.log("  BM Navigation Labels:", bmNavLabels);
  if (!bmNavLabels.includes("Panduan") || !bmNavLabels.includes("Sains Sukan") || !bmNavLabels.includes("Kalendar") || !bmNavLabels.includes("Kategori")) {
    throw new Error("Missing expected Bahasa Melayu nav labels!");
  }
  await verifyNoBannedRojak(page, "/", "BM");
  console.log("  ✓ Toggled html[lang=\"bm\"] and pure Bahasa Melayu nav verified with 0 rojak");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 3: Route / (Homepage) Bilingual & Zero Rojak
  // --------------------------------------------------------------------------
  console.log("\n[TEST 3] Route / (Homepage) Bilingual Validation");
  // Check BM homepage content
  const bmHeroText = await page.innerText("body");
  if (!bmHeroText.includes("PLATFORM ATLET SILAT MALAYSIA")) {
    throw new Error("Expected 'PLATFORM ATLET SILAT MALAYSIA' in BM homepage!");
  }
  if (bmHeroText.includes("THE SILAT ATHLETE PLATFORM")) {
    throw new Error("Found leftover English hero 'THE SILAT ATHLETE PLATFORM' in BM homepage!");
  }
  console.log("  ✓ BM Homepage has pure Malay header 'PLATFORM ATLET SILAT MALAYSIA'");

  // Toggle back to EN
  await toggleLanguage(page, "en");
  const enHeroText = await page.innerText("body");
  if (!enHeroText.includes("THE SILAT ATHLETE PLATFORM")) {
    throw new Error("Expected 'THE SILAT ATHLETE PLATFORM' in EN homepage!");
  }
  if (enHeroText.includes("PLATFORM ATLET SILAT MALAYSIA")) {
    throw new Error("Found untranslated 'PLATFORM ATLET SILAT MALAYSIA' in EN homepage!");
  }
  await verifyNoBannedRojak(page, "/", "EN");
  console.log("  ✓ EN Homepage has pure English hero 'THE SILAT ATHLETE PLATFORM'");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 4: Route /guidelines (Guidelines & Calculators)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 4] Route /guidelines Bilingual & Calculators Validation");
  await page.goto(`${BASE_URL}/guidelines`, { waitUntil: "networkidle" });

  // EN Mode
  await toggleLanguage(page, "en");
  let bodyEn = await page.innerText("body");
  if (!bodyEn.includes("PERSILAT 2026") || !bodyEn.includes("Punches") || !bodyEn.includes("Kicks")) {
    throw new Error("Missing pure English scoring terms (Punches / Kicks) in /guidelines EN!");
  }
  // Check that Official Disclaimer renders ONLY English advisory in EN mode
  if (bodyEn.includes("Penafian Kawal Selia Rasmi")) {
    throw new Error("Official Disclaimer stacked BM advisory text in EN mode!");
  }
  await verifyNoBannedRojak(page, "/guidelines", "EN");
  console.log("  ✓ /guidelines in EN: pure English calculators & unstacked official disclaimer");

  // BM Mode
  await toggleLanguage(page, "bm");
  let bodyBm = await page.innerText("body");
  if (!bodyBm.includes("Pukulan") || !bodyBm.includes("Tendangan") || !bodyBm.includes("Jatuhan")) {
    throw new Error("Missing pure Malay scoring terms (Pukulan / Tendangan) in /guidelines BM!");
  }
  if (bodyBm.includes("Official Regulatory Disclaimer")) {
    throw new Error("Official Disclaimer stacked EN advisory text in BM mode!");
  }
  await verifyNoBannedRojak(page, "/guidelines", "BM");
  console.log("  ✓ /guidelines in BM: pure Bahasa Melayu calculators & unstacked official disclaimer");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 5: Route /knowledge (Sport Science & Tools)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 5] Route /knowledge Bilingual & Calculators Validation");
  await page.goto(`${BASE_URL}/knowledge`, { waitUntil: "networkidle" });

  // BM Mode
  await toggleLanguage(page, "bm");
  bodyBm = await page.innerText("body");
  if (!bodyBm.includes("SAINS SUKAN") && !bodyBm.includes("Sains Sukan")) {
    throw new Error("Missing 'SAINS SUKAN' in /knowledge BM!");
  }
  await verifyNoBannedRojak(page, "/knowledge", "BM");
  console.log("  ✓ /knowledge in BM: localized Sports Science Hub & pure sports science calculators");

  // EN Mode
  await toggleLanguage(page, "en");
  bodyEn = await page.innerText("body");
  if (!bodyEn.includes("SPORT SCIENCE") && !bodyEn.includes("Sport Science")) {
    throw new Error("Missing 'SPORT SCIENCE' in /knowledge EN!");
  }
  await verifyNoBannedRojak(page, "/knowledge", "EN");
  console.log("  ✓ /knowledge in EN: pure English Sport Science Hub & calculators");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 6: Route /competitions (Competition Calendar)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 6] Route /competitions Bilingual Validation");
  await page.goto(`${BASE_URL}/competitions`, { waitUntil: "networkidle" });

  // EN Mode
  await toggleLanguage(page, "en");
  bodyEn = await page.innerText("body");
  if (!bodyEn.includes("MALAYSIAN SILAT COMPETITION CALENDAR") && !bodyEn.includes("COMPETITION CALENDAR")) {
    throw new Error("Expected English competition calendar header in /competitions EN!");
  }
  await verifyNoBannedRojak(page, "/competitions", "EN");
  console.log("  ✓ /competitions in EN: pure English calendar & status badges with 0 rojak");

  // BM Mode
  await toggleLanguage(page, "bm");
  bodyBm = await page.innerText("body");
  if (!bodyBm.includes("KALENDAR PERTANDINGAN SILAT MALAYSIA") && !bodyBm.includes("KALENDAR PERTANDINGAN")) {
    throw new Error("Expected Malay competition calendar header in /competitions BM!");
  }
  await verifyNoBannedRojak(page, "/competitions", "BM");
  console.log("  ✓ /competitions in BM: pure Bahasa Melayu calendar & status badges with 0 rojak");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 7: Route /disciplines (Disciplines & Equipment)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 7] Route /disciplines Bilingual Validation");
  await page.goto(`${BASE_URL}/disciplines`, { waitUntil: "networkidle" });

  // BM Mode
  await toggleLanguage(page, "bm");
  bodyBm = await page.innerText("body");
  if (!bodyBm.includes("DUA CABANG.") || !bodyBm.includes("SATU JIWA PERSILATAN.")) {
    throw new Error("Missing 'DUA CABANG. SATU JIWA PERSILATAN.' in /disciplines BM!");
  }
  if (!bodyBm.includes("Nilai Kebenaran") || !bodyBm.includes("Nilai Kemantapan")) {
    throw new Error("Missing pure Malay scoring rubrics (Nilai Kebenaran / Nilai Kemantapan) in /disciplines BM!");
  }
  await verifyNoBannedRojak(page, "/disciplines", "BM");
  console.log("  ✓ /disciplines in BM: pure Malay hero 'DUA CABANG. SATU JIWA PERSILATAN.' & scoring rubrics");

  // EN Mode
  await toggleLanguage(page, "en");
  bodyEn = await page.innerText("body");
  if (!bodyEn.includes("TWO DISCIPLINES.") || !bodyEn.includes("ONE SILAT SOUL.")) {
    throw new Error("Missing 'TWO DISCIPLINES. ONE SILAT SOUL.' in /disciplines EN!");
  }
  if (!bodyEn.includes("Accuracy Standard") || !bodyEn.includes("Firmness & Expression")) {
    throw new Error("Missing pure English scoring rubrics (Accuracy Standard / Firmness & Expression) in /disciplines EN!");
  }
  await verifyNoBannedRojak(page, "/disciplines", "EN");
  console.log("  ✓ /disciplines in EN: pure English hero 'TWO DISCIPLINES. ONE SILAT SOUL.' & scoring rubrics");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 8: Route /login (Role Sign-In & Bypass)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 8] Route /login Bilingual Validation");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });

  // EN Mode
  await toggleLanguage(page, "en");
  bodyEn = await page.innerText("body");
  if (!bodyEn.includes("Login Portal") && !bodyEn.includes("LOGIN PORTAL")) {
    throw new Error("Missing English login title 'Login Portal' in /login EN!");
  }
  if (!bodyEn.toUpperCase().includes("BYPASS LOGIN")) {
    throw new Error("Missing English bypass button 'BYPASS LOGIN' in /login EN!");
  }
  await verifyNoBannedRojak(page, "/login", "EN");
  console.log("  ✓ /login in EN: pure English headers and bypass buttons");

  // BM Mode
  await toggleLanguage(page, "bm");
  bodyBm = await page.innerText("body");
  if (!bodyBm.includes("Log Masuk Portal") && !bodyBm.includes("LOG MASUK PORTAL")) {
    throw new Error("Missing Malay login title 'Log Masuk Portal' in /login BM!");
  }
  if (!bodyBm.toUpperCase().includes("PINTAS MASUK")) {
    throw new Error("Missing Malay bypass button 'Pintas Masuk' in /login BM!");
  }
  if (bodyBm.includes("BYPASS MASUK")) {
    throw new Error("Found leftover 'BYPASS MASUK' in /login BM!");
  }
  await verifyNoBannedRojak(page, "/login", "BM");
  console.log("  ✓ /login in BM: pure Malay headers and 'Pintas Masuk' bypass buttons");
  passedTests++;

  // --------------------------------------------------------------------------
  // TEST 9: Route /register-club (Club Registration Gateway & Form)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 9] Route /register-club (Gateway & Form) Bilingual Validation");
  await page.goto(`${BASE_URL}/register-club`, { waitUntil: "networkidle" });

  // BM Mode Gateway
  await toggleLanguage(page, "bm");
  bodyBm = await page.innerText("body");
  if (!bodyBm.includes("Kelab Anda. Perjalanan Anda.") && !bodyBm.includes("KELAB ANDA. PERJALANAN ANDA.")) {
    throw new Error("Missing 'Kelab Anda. Perjalanan Anda.' in /register-club BM!");
  }
  if (bodyBm.includes("Your Club. Your Journey.")) {
    throw new Error("Found leftover English title in /register-club BM!");
  }
  await verifyNoBannedRojak(page, "/register-club", "BM");
  console.log("  ✓ /register-club Gateway in BM: pure Malay title 'Kelab Anda. Perjalanan Anda.'");

  // EN Mode Gateway
  await toggleLanguage(page, "en");
  bodyEn = await page.innerText("body");
  if (!bodyEn.includes("Your Club. Your Journey.") && !bodyEn.includes("YOUR CLUB. YOUR JOURNEY.")) {
    throw new Error("Missing 'Your Club. Your Journey.' in /register-club EN!");
  }
  if (bodyEn.includes("Kelab Anda. Perjalanan Anda.")) {
    throw new Error("Found untranslated Malay title in /register-club EN!");
  }
  await verifyNoBannedRojak(page, "/register-club", "EN");
  console.log("  ✓ /register-club Gateway in EN: pure English title 'Your Club. Your Journey.'");

  // Now verify the 5-step registration form at /register-club/new
  await page.goto(`${BASE_URL}/register-club/new`, { waitUntil: "networkidle" });

  // EN Mode Form
  await toggleLanguage(page, "en");
  bodyEn = await page.innerText("body");
  if (!bodyEn.toUpperCase().includes("BASIC CLUB INFORMATION") || !bodyEn.toUpperCase().includes("STEP 1 OF 5")) {
    throw new Error("Missing English step 1 header in /register-club/new EN!");
  }
  if (!bodyEn.includes("Next Step")) {
    throw new Error("Missing English 'Next Step' button in /register-club/new EN!");
  }
  await verifyNoBannedRojak(page, "/register-club/new", "EN");
  console.log("  ✓ /register-club/new Form in EN: pure English 'Basic Club Information' and 'Step 1 of 5'");

  // BM Mode Form
  await toggleLanguage(page, "bm");
  bodyBm = await page.innerText("body");
  if (!bodyBm.toUpperCase().includes("MAKLUMAT ASAS KELAB") || !bodyBm.toUpperCase().includes("LANGKAH 1 DARIPADA 5")) {
    throw new Error("Missing Malay step 1 header in /register-club/new BM!");
  }
  if (!bodyBm.includes("Langkah Seterusnya")) {
    throw new Error("Missing Malay 'Langkah Seterusnya' button in /register-club/new BM!");
  }
  await verifyNoBannedRojak(page, "/register-club/new", "BM");
  console.log("  ✓ /register-club/new Form in BM: pure Malay 'Maklumat Asas Kelab' and 'Langkah 1 daripada 5'");
  passedTests++;

  console.log("\n================================================================================");
  console.log(`     ALL ${passedTests} E2E LOCALIZATION TESTS PASSED WITH 100% SUCCESS RATE!     `);
  console.log("================================================================================");

  await browser.close();
}

run().catch((err) => {
  console.error("\n❌ Localization Test Failure:", err.message);
  process.exit(1);
});
