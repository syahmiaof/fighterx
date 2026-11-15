import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function verifyMarqueeNoPause() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  const marquee = page.locator('.partner-scroll-wrapper');
  await marquee.scrollIntoViewIfNeeded();
  
  // Hover over the marquee wrapper
  await marquee.hover();
  await page.waitForTimeout(300);
  
  // Evaluate the computed animation-play-state
  const playState = await page.evaluate(() => {
    const track = document.querySelector('.partner-scroll-track');
    return track ? window.getComputedStyle(track).animationPlayState : null;
  });
  
  console.log('Marquee animation-play-state while hovering:', playState);
  
  if (playState === 'running') {
    console.log('SUCCESS: Marquee continues running on hover without pausing!');
  } else {
    console.error('FAILED: Marquee play state is', playState);
    process.exit(1);
  }
  
  await browser.close();
}

verifyMarqueeNoPause().catch(err => {
  console.error(err);
  process.exit(1);
});
