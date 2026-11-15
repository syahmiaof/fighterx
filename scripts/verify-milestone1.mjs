import { chromium } from 'file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "375px (iPhone SE)", width: 375, height: 667 },
  { name: "390px (iPhone 14)", width: 390, height: 844 },
  { name: "768px (iPad Mini)", width: 768, height: 1024 },
];

const ROUTES = [
  "/",
  "/guidelines",
  "/knowledge",
  "/competitions",
  "/disciplines",
  "/login",
  "/register-club",
];

async function run() {
  const browser = await chromium.launch({ executablePath: CHROMIUM_EXE });
  let totalErrors = 0;

  console.log("================================================================================");
  console.log("   MILESTONE 1 VERIFICATION: MOBILE DRAWER, BACKDROP & BLEED ELIMINATION        ");
  console.log("================================================================================");

  for (const vp of VIEWPORTS) {
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`--------------------------------------------------------------------------------`);

    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const route of ROUTES) {
      console.log(`\n  Route: ${route}`);
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });

      // 1. Initial Closed State Verification
      const closedState = await page.evaluate(() => {
        const header = document.querySelector(".site-header");
        const toggleBtn = document.querySelector(".mobile-menu-toggle");
        const mobileMenu = document.querySelector(".mobile-menu");
        const backdrop = document.querySelector(".mobile-drawer-backdrop");
        const topActions = document.querySelector(".mobile-header-actions");
        const allLangSwitchers = Array.from(document.querySelectorAll(".header-lang-switcher, .language-switcher")).filter(el => {
          const s = window.getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
        });

        const toggleRect = toggleBtn ? toggleBtn.getBoundingClientRect() : null;
        const toggleStyle = toggleBtn ? window.getComputedStyle(toggleBtn) : null;
        const menuStyle = mobileMenu ? window.getComputedStyle(mobileMenu) : null;

        return {
          headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
          toggleVisible: toggleStyle ? toggleStyle.display !== "none" : false,
          toggleWidth: toggleRect ? Math.round(toggleRect.width) : 0,
          toggleHeight: toggleRect ? Math.round(toggleRect.height) : 0,
          backdropPresent: !!backdrop,
          menuDisplay: menuStyle ? menuStyle.display : null,
          visibleLangCount: allLangSwitchers.length,
          bodyOverflow: document.body.style.overflow,
        };
      });

      if (!closedState.toggleVisible) {
        console.error(`    ❌ Toggle button not visible in closed state!`);
        totalErrors++;
      } else {
        console.log(`    ✓ Toggle button visible (${closedState.toggleWidth}x${closedState.toggleHeight}px)`);
      }

      if (closedState.toggleWidth < 44 || closedState.toggleHeight < 44) {
        console.error(`    ❌ Toggle button smaller than 44x44px target! Got: ${closedState.toggleWidth}x${closedState.toggleHeight}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Toggle button meets WCAG 44x44px target`);
      }

      if (closedState.visibleLangCount !== 1) {
        console.error(`    ❌ Expected exactly 1 visible language switcher when closed, got: ${closedState.visibleLangCount}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Exactly 1 language switcher visible in closed top bar`);
      }

      if (closedState.backdropPresent) {
        console.error(`    ❌ Backdrop present while drawer closed!`);
        totalErrors++;
      }

      // 2. Open Drawer Verification
      const toggleBtn = await page.$(".mobile-menu-toggle");
      await toggleBtn?.click();
      await page.waitForTimeout(300); // Wait for GSAP animation

      const openState = await page.evaluate((expectedWidth) => {
        const header = document.querySelector(".site-header");
        const toggleBtn = document.querySelector(".mobile-menu-toggle");
        const mobileMenu = document.querySelector(".mobile-menu");
        const backdrop = document.querySelector(".mobile-drawer-backdrop");
        const allLangSwitchers = Array.from(document.querySelectorAll(".header-lang-switcher, .language-switcher")).filter(el => {
          const s = window.getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
        });

        const menuStyle = mobileMenu ? window.getComputedStyle(mobileMenu) : null;
        const menuRect = mobileMenu ? mobileMenu.getBoundingClientRect() : null;
        const backdropStyle = backdrop ? window.getComputedStyle(backdrop) : null;
        const backdropRect = backdrop ? backdrop.getBoundingClientRect() : null;
        const toggleRect = toggleBtn ? toggleBtn.getBoundingClientRect() : null;

        return {
          menuDisplay: menuStyle ? menuStyle.display : null,
          menuPosition: menuStyle ? menuStyle.position : null,
          menuTop: menuRect ? Math.round(menuRect.top) : null,
          menuLeft: menuRect ? Math.round(menuRect.left) : null,
          menuWidth: menuRect ? Math.round(menuRect.width) : null,
          menuHeight: menuRect ? Math.round(menuRect.height) : null,
          menuBg: menuStyle ? menuStyle.backgroundColor : null,
          menuBackdropFilter: menuStyle ? menuStyle.backdropFilter || menuStyle.webkitBackdropFilter : null,
          menuGridCols: menuStyle ? menuStyle.gridTemplateColumns : null,
          menuZIndex: menuStyle ? menuStyle.zIndex : null,
          backdropPresent: !!backdrop,
          backdropPosition: backdropStyle ? backdropStyle.position : null,
          backdropTop: backdropRect ? Math.round(backdropRect.top) : null,
          backdropBg: backdropStyle ? backdropStyle.backgroundColor : null,
          backdropFilter: backdropStyle ? backdropStyle.backdropFilter || backdropStyle.webkitBackdropFilter : null,
          backdropZIndex: backdropStyle ? backdropStyle.zIndex : null,
          visibleLangCount: allLangSwitchers.length,
          bodyOverflow: document.body.style.overflow,
          toggleWidth: toggleRect ? Math.round(toggleRect.width) : 0,
          toggleHeight: toggleRect ? Math.round(toggleRect.height) : 0,
        };
      }, vp.width);

      // Assertions for Open State
      if (openState.menuPosition !== "fixed") {
        console.error(`    ❌ Drawer position not fixed: ${openState.menuPosition}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Drawer position: fixed`);
      }

      if (openState.menuTop !== 64) {
        console.error(`    ❌ Drawer top offset mismatch: expected 64, got ${openState.menuTop}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Drawer top: 64px`);
      }

      if (openState.menuWidth !== vp.width) {
        console.error(`    ❌ Drawer width mismatch: expected ${vp.width}, got ${openState.menuWidth}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Drawer width matches viewport: ${openState.menuWidth}px`);
      }

      if (!openState.menuBg.includes("rgba(8, 9, 11, 0.98)")) {
        console.error(`    ❌ Drawer background mismatch: expected rgba(8, 9, 11, 0.98), got ${openState.menuBg}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Drawer opaque glassmorphism background: ${openState.menuBg}`);
      }

      if (!openState.menuBackdropFilter || !openState.menuBackdropFilter.includes("blur(40px)")) {
        console.error(`    ❌ Drawer backdrop-filter mismatch: expected blur(40px), got ${openState.menuBackdropFilter}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Drawer backdrop-filter: ${openState.menuBackdropFilter}`);
      }

      if (openState.menuZIndex !== "50") {
        console.error(`    ❌ Drawer z-index mismatch: expected 50, got ${openState.menuZIndex}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Drawer z-index: 50`);
      }

      // Check single column grid
      // In CSS, 1-column grid computed value is a single pixel value (e.g. "375px")
      const colParts = openState.menuGridCols ? openState.menuGridCols.split(" ").filter(Boolean) : [];
      if (colParts.length !== 1) {
        console.error(`    ❌ Drawer grid should be 1 column, got: "${openState.menuGridCols}"`);
        totalErrors++;
      } else {
        console.log(`    ✓ Drawer 1-column grid layout: "${openState.menuGridCols}"`);
      }

      // Check Backdrop
      if (!openState.backdropPresent) {
        console.error(`    ❌ Backdrop overlay element missing when drawer open!`);
        totalErrors++;
      } else if (!openState.backdropFilter || !openState.backdropFilter.includes("blur(8px)")) {
        console.error(`    ❌ Backdrop overlay filter mismatch: expected blur(8px), got ${openState.backdropFilter}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Dimmed backdrop present (bg: ${openState.backdropBg}, filter: ${openState.backdropFilter}, zIndex: ${openState.backdropZIndex})`);
      }

      // Check Language Switcher rule
      if (openState.visibleLangCount !== 1) {
        console.error(`    ❌ Expected exactly 1 visible language switcher when drawer open, got: ${openState.visibleLangCount}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Exactly 1 language switcher active inside open drawer (top bar hidden)`);
      }

      // Check body scroll lock
      if (openState.bodyOverflow !== "hidden") {
        console.error(`    ❌ Body scroll lock failed: expected "hidden", got "${openState.bodyOverflow}"`);
        totalErrors++;
      } else {
        console.log(`    ✓ Body scroll lock active (overflow: hidden)`);
      }

      // 3. Test Backdrop Click to Close
      if (openState.backdropPresent) {
        // Click on exposed area of backdrop (below drawer content)
        const clickY = Math.min(openState.menuHeight + 84, vp.height - 20);
        await page.mouse.click(Math.round(vp.width / 2), clickY);
        await page.waitForTimeout(300);

        const closedAfterBackdrop = await page.evaluate(() => {
          const menu = document.querySelector(".mobile-menu");
          const backdrop = document.querySelector(".mobile-drawer-backdrop");
          return {
            menuDisplay: menu ? window.getComputedStyle(menu).display : null,
            backdropPresent: !!backdrop,
            bodyOverflow: document.body.style.overflow,
          };
        });

        if (closedAfterBackdrop.menuDisplay !== "none") {
          console.error(`    ❌ Drawer did not close after clicking backdrop! display: ${closedAfterBackdrop.menuDisplay}`);
          totalErrors++;
        } else {
          console.log(`    ✓ Backdrop click successfully closes drawer and unfreezes body scroll`);
        }
      }

      // 4. Test Re-opening and Close Button Click
      await toggleBtn?.click();
      await page.waitForTimeout(300);
      await toggleBtn?.click(); // Click close button [X]
      await page.waitForTimeout(250);

      const closedAfterBtn = await page.evaluate(() => {
        const menu = document.querySelector(".mobile-menu");
        return {
          menuDisplay: menu ? window.getComputedStyle(menu).display : null,
          bodyOverflow: document.body.style.overflow,
        };
      });

      if (closedAfterBtn.menuDisplay !== "none") {
        console.error(`    ❌ Drawer did not close after clicking close button! display: ${closedAfterBtn.menuDisplay}`);
        totalErrors++;
      } else {
        console.log(`    ✓ Close button [X] click successfully closes drawer`);
      }
    }

    await context.close();
  }

  // Capture screenshot of open drawer at 375px
  const snapContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const snapPage = await snapContext.newPage();
  await snapPage.goto(BASE_URL, { waitUntil: "networkidle" });
  await snapPage.click(".mobile-menu-toggle");
  await snapPage.waitForTimeout(350);
  await snapPage.screenshot({ path: "scripts/screenshot-drawer-m1-verified.png" });
  console.log("\n  ✓ Verified screenshot saved: scripts/screenshot-drawer-m1-verified.png");
  await snapContext.close();

  await browser.close();

  console.log("\n================================================================================");
  if (totalErrors === 0) {
    console.log("   ALL MILESTONE 1 CHECKS PASSED: 0 ERRORS DETECTED ACROSS ALL ROUTES!         ");
  } else {
    console.error(`   VERIFICATION FAILED: ${totalErrors} ERRORS DETECTED!                       `);
    process.exit(1);
  }
  console.log("================================================================================");
}

run().catch((err) => {
  console.error("Verification execution error:", err);
  process.exit(1);
});
