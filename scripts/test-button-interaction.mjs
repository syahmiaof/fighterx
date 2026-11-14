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

  const result = await page.evaluate(async () => {
    const main = document.querySelector('main');
    const btn = main.querySelector('.tactile-btn');
    if (!btn) return { error: "No tactile-btn found in main" };

    const initialTransform = window.getComputedStyle(btn).transform;

    // Simulate pointerdown
    btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await new Promise(r => setTimeout(r, 90)); // after 0.08s handleDown
    const downInline = btn.getAttribute('style') || '';
    const downComputed = window.getComputedStyle(btn).transform;

    // Simulate pointerup
    btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await new Promise(r => setTimeout(r, 100)); // middle of 0.36s handleUp
    const midInline = btn.getAttribute('style') || '';
    const midComputed = window.getComputedStyle(btn).transform;

    await new Promise(r => setTimeout(r, 350)); // after spring finishes
    const finalInline = btn.getAttribute('style') || '';
    const finalComputed = window.getComputedStyle(btn).transform;

    return {
      initialTransform,
      downInline,
      downComputed,
      midInline,
      midComputed,
      finalInline,
      finalComputed,
    };
  });

  console.log("Evaluation Result for main .tactile-btn:", JSON.stringify(result, null, 2));
  await browser.close();
}

run().catch(console.error);
