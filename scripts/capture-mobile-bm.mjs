import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function testBmMobile() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE, headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Open mobile drawer
  const toggle = page.locator('.mobile-menu-toggle');
  await toggle.click();
  await page.waitForTimeout(400);
  
  // Click BM button in the drawer
  const bmBtn = page.locator('.mobile-drawer-lang-row button[aria-label="Tukar ke Bahasa Melayu"]');
  await bmBtn.click();
  await page.waitForTimeout(600);
  
  await page.screenshot({ path: 'scripts/current-mobile-drawer-bm-375px.png' });
  console.log('Saved current-mobile-drawer-bm-375px.png');
  
  await browser.close();
}

testBmMobile().catch(console.error);
