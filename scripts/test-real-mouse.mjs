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

  const btnSelector = '.tactile-btn[aria-label="Scroll testimoni ke kiri"]';
  const btn = await page.$(btnSelector);
  await btn.scrollIntoViewIfNeeded();

  console.log("Hovering tactile button...");
  await page.hover(btnSelector);
  await page.waitForTimeout(300);

  const hoverStyle = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      inline: el.getAttribute('style') || '',
      computed: window.getComputedStyle(el).transform,
      boxShadow: window.getComputedStyle(el).boxShadow,
    };
  }, btnSelector);
  console.log("Hover style:", hoverStyle);

  console.log("Pressing down...");
  await page.mouse.down();
  await page.waitForTimeout(100);

  const downStyle = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      inline: el.getAttribute('style') || '',
      computed: window.getComputedStyle(el).transform,
    };
  }, btnSelector);
  console.log("Down style:", downStyle);

  console.log("Releasing...");
  await page.mouse.up();
  await page.waitForTimeout(150);

  const midStyle = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      inline: el.getAttribute('style') || '',
      computed: window.getComputedStyle(el).transform,
    };
  }, btnSelector);
  console.log("Mid style:", midStyle);

  await page.waitForTimeout(400);
  const afterStyle = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      inline: el.getAttribute('style') || '',
      computed: window.getComputedStyle(el).transform,
    };
  }, btnSelector);
  console.log("After spring style:", afterStyle);

  await browser.close();
}

run().catch(console.error);
