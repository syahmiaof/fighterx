import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function captureCurriculum() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/knowledge', { waitUntil: 'networkidle' });
  
  // Scroll to the curriculum section
  const curriculumSec = page.locator('#silibus-latihan-rumah');
  await curriculumSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'scripts/curriculum-preview-desktop.png' });
  console.log('Saved curriculum-preview-desktop.png');
  
  // Also click on Modul 2 tab
  const m2Btn = page.getByRole('button', { name: /Modul 2/i });
  if (await m2Btn.isVisible()) {
    await m2Btn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scripts/curriculum-m2-preview.png' });
    console.log('Saved curriculum-m2-preview.png');
  }

  // Also check on Mobile (375px)
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://localhost:3000/knowledge#silibus-latihan-rumah', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: 'scripts/curriculum-mobile-375px.png' });
  console.log('Saved curriculum-mobile-375px.png');
  await mobileCtx.close();
  
  await browser.close();
}

captureCurriculum().catch(console.error);
