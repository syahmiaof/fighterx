import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function testScreenshots() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE, headless: true });
  
  // 1. Desktop Guidelines in English
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/guidelines', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'scripts/current-guidelines-en-desktop.png' });
    console.log('Saved current-guidelines-en-desktop.png');
    await context.close();
  }

  // 2. Desktop Guidelines in BM
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/guidelines', { waitUntil: 'networkidle' });
    // Switch to BM
    const bmBtn = page.locator('button[aria-label="Tukar ke Bahasa Melayu"]').first();
    if (await bmBtn.isVisible()) {
      await bmBtn.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'scripts/current-guidelines-bm-desktop.png' });
    console.log('Saved current-guidelines-bm-desktop.png');
    await context.close();
  }

  // 3. Mobile Homepage (375px) with Drawer Open
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const toggle = page.locator('.mobile-menu-toggle');
    await toggle.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/current-mobile-drawer-375px.png' });
    console.log('Saved current-mobile-drawer-375px.png');
    await context.close();
  }

  await browser.close();
}

testScreenshots().catch(console.error);
