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

  const faqDetailsSelector = '.faq-list details:first-child';
  const faqSummarySelector = '.faq-list details:first-child summary';
  
  const faq = await page.$(faqDetailsSelector);
  await faq.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // Wait for entrance iris reveal to clear

  console.log("1. Hovering FAQ details card...");
  await page.hover(faqDetailsSelector);
  await page.waitForTimeout(300);

  const hoverData = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      transform: window.getComputedStyle(el).transform,
      boxShadow: window.getComputedStyle(el).boxShadow,
      borderColor: window.getComputedStyle(el).borderColor,
    };
  }, faqDetailsSelector);
  console.log("Hover data:", hoverData);

  console.log("2. Clicking summary to expand...");
  await page.click(faqSummarySelector);
  await page.waitForTimeout(400);

  const openData = await page.evaluate(({ detailsSel, summarySel }) => {
    const details = document.querySelector(detailsSel);
    const summary = document.querySelector(summarySel);
    const plusSpan = summary.querySelector('span');
    return {
      isOpen: details.hasAttribute('open'),
      summaryInlineStyle: summary.getAttribute('style') || '',
      summaryTransform: window.getComputedStyle(summary).transform,
      plusTransform: window.getComputedStyle(plusSpan).transform,
      pVisible: window.getComputedStyle(details.querySelector('p')).display !== 'none',
    };
  }, { detailsSel: faqDetailsSelector, summarySel: faqSummarySelector });
  console.log("Open data:", openData);

  console.log("3. Clicking summary again to collapse...");
  await page.click(faqSummarySelector);
  await page.waitForTimeout(400);

  const closeData = await page.evaluate(({ detailsSel, summarySel }) => {
    const details = document.querySelector(detailsSel);
    const summary = document.querySelector(summarySel);
    return {
      isOpen: details.hasAttribute('open'),
      summaryInlineStyle: summary.getAttribute('style') || '',
    };
  }, { detailsSel: faqDetailsSelector, summarySel: faqSummarySelector });
  console.log("Close data:", closeData);

  const passed =
    hoverData.transform.includes('-2') &&
    openData.isOpen &&
    openData.pVisible &&
    openData.summaryInlineStyle === '' && // tactile styles cleaned up
    !closeData.isOpen &&
    closeData.summaryInlineStyle === '';

  console.log(`\nFAQ INTERACTION VERIFICATION: ${passed ? "PASSED" : "FAILED"}`);

  await browser.close();
  if (!passed) process.exit(1);
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
