import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test Competitions
  await page.goto("http://localhost:3005/competitions", { waitUntil: "networkidle" });
  const compCount = await page.$$eval(".comp-glass-card", (els) => els.length);
  console.log("Comp cards count:", compCount);
  await page.evaluate(() => {
    const card = document.querySelector(".comp-glass-card");
    if (card) card.click();
  });
  await page.waitForTimeout(500);
  const compModal = await page.evaluate(() => !!document.querySelector(".pro-modal-container"));
  console.log("Comp modal open:", compModal);

  // Test Leaderboard
  await page.goto("http://localhost:3005/leaderboard", { waitUntil: "networkidle" });
  const athCount = await page.$$eval("div.group.cursor-pointer", (els) => els.length);
  console.log("Athlete cards count:", athCount);
  await page.evaluate(() => {
    const card = document.querySelector("div.group.cursor-pointer");
    if (card) card.click();
  });
  await page.waitForTimeout(500);
  const athModal = await page.evaluate(() => !!document.querySelector(".athlete-modal-container, [role='dialog']"));
  console.log("Athlete modal open:", athModal);

  // Test Associations
  await page.goto("http://localhost:3005/associations", { waitUntil: "networkidle" });
  const assocCount = await page.$$eval(".association-card", (els) => els.length);
  console.log("Assoc cards count:", assocCount);
  await page.evaluate(() => {
    const card = document.querySelector(".association-card");
    if (card) card.click();
  });
  await page.waitForTimeout(500);
  const assocModal = await page.evaluate(() => !!document.querySelector(".assoc-modal-card, [role='dialog']"));
  console.log("Assoc modal open:", assocModal);

  // Test Moments
  await page.goto("http://localhost:3005/moments", { waitUntil: "networkidle" });
  const photoCount = await page.$$eval("[class*='aspect-[4/3]']", (els) => els.length);
  console.log("Moments photos count:", photoCount);
  await page.evaluate(() => {
    const photo = document.querySelector("[class*='aspect-[4/3]']");
    if (photo) photo.click();
  });
  await page.waitForTimeout(500);
  const momentModal = await page.evaluate(() => !!document.querySelector("[role='dialog']"));
  console.log("Moments modal open:", momentModal);

  await browser.close();
})();
