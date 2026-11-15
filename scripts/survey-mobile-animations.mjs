import { chromium } from "file:///C:/Users/USER/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const CHROMIUM_EXE = "C:\\Users\\USER\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const BASE_URL = "http://localhost:3000";

const ROUTES = [
  { id: "home", path: "/" },
  { id: "guidelines", path: "/guidelines" },
  { id: "knowledge", path: "/knowledge" },
  { id: "competitions", path: "/competitions" },
  { id: "disciplines", path: "/disciplines" },
  { id: "login", path: "/login" },
  { id: "register-club", path: "/register-club" },
];

const VIEWPORTS = [
  { name: "375px (iPhone SE)", width: 375, height: 667 },
  { name: "390px (iPhone 12/13/14)", width: 390, height: 844 },
  { name: "768px (iPad Mini / Tablet)", width: 768, height: 1024 },
];

async function runSurvey() {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const report = {
    overflowIssues: [],
    drawerAudit: [],
    touchTargetIssues: [],
    animationAudit: [],
    routeResults: [],
  };

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    for (const r of ROUTES) {
      console.log(`\n[Route: ${r.path}] (${vp.width}px)`);
      try {
        await page.goto(`${BASE_URL}${r.path}`, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(400);

        // 1. Horizontal overflow check
        const overflowData = await page.evaluate((vpWidth) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientW = docEl.clientWidth;
          const hasOverflow = scrollW > clientW;

          const offenders = [];
          const all = document.querySelectorAll("*");
          for (const el of all) {
            if (["SCRIPT", "STYLE", "HEAD", "NOSCRIPT", "svg", "path"].includes(el.tagName)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.right > vpWidth + 1.5 && rect.width > 0) {
              offenders.push({
                tag: el.tagName,
                id: el.id || "",
                className: typeof el.className === "string" ? el.className.slice(0, 100) : "",
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                excess: Math.round(rect.right - vpWidth),
              });
            }
          }

          return {
            scrollW,
            clientW,
            hasOverflow,
            offendersCount: offenders.length,
            offenders: offenders.slice(0, 5),
          };
        }, vp.width);

        if (overflowData.hasOverflow) {
          console.error(`  ❌ OVERFLOW DETECTED: scrollWidth ${overflowData.scrollW}px > clientWidth ${overflowData.clientW}px (+${overflowData.scrollW - overflowData.clientW}px)`);
          report.overflowIssues.push({
            route: r.path,
            viewport: vp.width,
            scrollW: overflowData.scrollW,
            clientW: overflowData.clientW,
            offenders: overflowData.offenders,
          });
        } else {
          console.log(`  ✓ No horizontal overflow (scrollWidth: ${overflowData.scrollW}px, clientWidth: ${overflowData.clientW}px)`);
        }

        // 2. Touch target collisions & small targets
        const touchData = await page.evaluate((vpWidth) => {
          const interactive = Array.from(document.querySelectorAll("button, a, input, select, textarea, [role='button'], [tabindex='0']"));
          const smallTargets = [];
          const collisions = [];

          for (let i = 0; i < interactive.length; i++) {
            const el1 = interactive[i];
            const r1 = el1.getBoundingClientRect();
            // Ignore hidden or zero size elements
            if (r1.width <= 0 || r1.height <= 0 || r1.bottom < 0 || r1.top > window.innerHeight) continue;

            const isSmall = r1.width < 32 || r1.height < 32;
            if (isSmall) {
              const text = (el1.textContent || "").trim().slice(0, 30);
              smallTargets.push({
                tag: el1.tagName,
                text,
                width: Math.round(r1.width),
                height: Math.round(r1.height),
                className: typeof el1.className === "string" ? el1.className.slice(0, 60) : "",
              });
            }

            // Check collision with other interactive elements
            for (let j = i + 1; j < interactive.length; j++) {
              const el2 = interactive[j];
              const r2 = el2.getBoundingClientRect();
              if (r2.width <= 0 || r2.height <= 0 || r2.bottom < 0 || r2.top > window.innerHeight) continue;

              // Check bounding box overlap
              const overlap = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
              if (overlap && !el1.contains(el2) && !el2.contains(el1)) {
                collisions.push({
                  el1: { tag: el1.tagName, text: (el1.textContent || "").trim().slice(0, 30), rect: r1 },
                  el2: { tag: el2.tagName, text: (el2.textContent || "").trim().slice(0, 30), rect: r2 },
                });
              }
            }
          }

          return {
            smallTargetsCount: smallTargets.length,
            smallTargets: smallTargets.slice(0, 5),
            collisionsCount: collisions.length,
            collisions: collisions.slice(0, 5),
          };
        }, vp.width);

        if (touchData.smallTargetsCount > 0 || touchData.collisionsCount > 0) {
          console.log(`  ⚠ Touch Targets: ${touchData.smallTargetsCount} small targets (<32px), ${touchData.collisionsCount} bounding box overlaps`);
          report.touchTargetIssues.push({
            route: r.path,
            viewport: vp.width,
            smallTargets: touchData.smallTargets,
            collisions: touchData.collisions,
          });
        } else {
          console.log(`  ✓ Touch targets clean`);
        }

        // 3. Inspect Navigation & Drawer on each route (especially at 375px & 768px)
        const drawerCheck = await page.evaluate(async (vpWidth) => {
          const header = document.querySelector(".site-header");
          const toggleBtn = document.querySelector(".mobile-menu-toggle");
          const mobileMenu = document.querySelector(".mobile-menu");
          const topLangSwitchers = document.querySelectorAll(".mobile-header-actions .language-switcher, .header-actions .language-switcher");
          
          const headerRect = header ? header.getBoundingClientRect() : null;
          const toggleBtnVisible = toggleBtn ? window.getComputedStyle(toggleBtn).display !== "none" : false;

          let drawerInfo = {
            headerHeight: headerRect ? headerRect.height : 0,
            toggleBtnVisible,
            topLangCount: topLangSwitchers.length,
            drawerFound: !!mobileMenu,
          };

          return drawerInfo;
        }, vp.width);

        console.log(`  Header status: height ${drawerCheck.headerHeight}px, toggleVisible: ${drawerCheck.toggleBtnVisible}, topLangCount: ${drawerCheck.topLangCount}`);

        // Open mobile drawer to test opening, backdrop, and styling
        if (drawerCheck.toggleBtnVisible) {
          const toggleBtn = await page.$(".mobile-menu-toggle");
          if (toggleBtn) {
            await toggleBtn.click();
            await page.waitForTimeout(300); // Wait for GSAP animation

            const openDrawerState = await page.evaluate((vpWidth) => {
              const menu = document.querySelector(".mobile-menu");
              const header = document.querySelector(".site-header");
              const headerInner = document.querySelector(".header-inner");
              const toggleBtn = document.querySelector(".mobile-menu-toggle");
              const langSwitchers = document.querySelectorAll(".language-switcher");
              const visibleLangSwitchers = Array.from(langSwitchers).filter(el => {
                const style = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
              });

              if (!menu) return { error: "No mobile-menu element" };

              const menuStyle = window.getComputedStyle(menu);
              const menuRect = menu.getBoundingClientRect();
              const headerRect = header ? header.getBoundingClientRect() : null;
              const innerRect = headerInner ? headerInner.getBoundingClientRect() : null;

              // Check links inside drawer
              const drawerLinks = Array.from(menu.querySelectorAll("a, button")).map(el => ({
                text: el.textContent?.trim() || "",
                rect: el.getBoundingClientRect(),
              }));

              // Check close button
              const closeIcon = toggleBtn ? toggleBtn.querySelector("svg") : null;

              return {
                menuDisplay: menuStyle.display,
                menuOpacity: menuStyle.opacity,
                menuGridCols: menuStyle.gridTemplateColumns,
                menuPosition: menuStyle.position,
                menuRect: {
                  top: Math.round(menuRect.top),
                  bottom: Math.round(menuRect.bottom),
                  left: Math.round(menuRect.left),
                  right: Math.round(menuRect.right),
                  width: Math.round(menuRect.width),
                  height: Math.round(menuRect.height),
                },
                headerRect: headerRect ? {
                  top: Math.round(headerRect.top),
                  bottom: Math.round(headerRect.bottom),
                  height: Math.round(headerRect.height),
                } : null,
                innerRect: innerRect ? {
                  flexWrap: window.getComputedStyle(headerInner).flexWrap,
                  height: Math.round(innerRect.height),
                } : null,
                visibleLangSwitchersCount: visibleLangSwitchers.length,
                visibleLangLocations: visibleLangSwitchers.map(el => {
                  const p = el.parentElement?.className || el.parentElement?.tagName;
                  return p;
                }),
                drawerLinksCount: drawerLinks.length,
                drawerLinks: drawerLinks.slice(0, 8),
                hasCloseButtonIcon: !!closeIcon,
              };
            }, vp.width);

            console.log(`  [DRAWER OPEN] display: ${openDrawerState.menuDisplay}, cols: "${openDrawerState.menuGridCols}", width: ${openDrawerState.menuRect?.width}px, height: ${openDrawerState.menuRect?.height}px`);
            console.log(`  Visible Lang Switchers when open: ${openDrawerState.visibleLangSwitchersCount} (Locations: ${JSON.stringify(openDrawerState.visibleLangLocations)})`);
            console.log(`  Header height after open: ${openDrawerState.headerRect?.height}px, flexWrap: ${openDrawerState.innerRect?.flexWrap}`);

            report.drawerAudit.push({
              route: r.path,
              viewport: vp.width,
              state: openDrawerState,
            });

            // Close it back
            await toggleBtn.click();
            await page.waitForTimeout(250);
          }
        }

        report.routeResults.push({
          route: r.path,
          viewport: vp.width,
          overflow: overflowData,
          touch: touchData,
        });

      } catch (err) {
        console.error(`  ❌ Error testing ${r.path} at ${vp.width}px:`, err.message);
      }
    }

    await context.close();
  }

  // Animation and GPU acceleration audit
  console.log(`\n======================================================`);
  console.log(`AUDITING ANIMATIONS & GPU ACCELERATION`);
  console.log(`======================================================`);

  const animContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const animPage = await animContext.newPage();
  await animPage.goto(BASE_URL, { waitUntil: "networkidle" });

  const animMetrics = await animPage.evaluate(() => {
    const animatedElements = [];
    const allEls = document.querySelectorAll("*");
    for (const el of allEls) {
      const style = window.getComputedStyle(el);
      const willChange = style.willChange;
      const transform = style.transform;
      const transition = style.transition;
      const animation = style.animation;

      if (
        (willChange && willChange !== "auto") ||
        (transform && transform !== "none") ||
        (animation && animation !== "none") ||
        (transition && transition !== "all 0s ease 0s" && !transition.startsWith("all 0s"))
      ) {
        animatedElements.push({
          tag: el.tagName,
          className: (el.className && typeof el.className === "string") ? el.className.slice(0, 60) : "",
          willChange,
          transform: transform !== "none" ? transform.slice(0, 40) : "none",
          transition: transition !== "all 0s ease 0s" ? transition.slice(0, 40) : "none",
          animation: animation !== "none" ? animation.slice(0, 40) : "none",
        });
      }
    }

    return {
      totalElementsWithMotion: animatedElements.length,
      samples: animatedElements.slice(0, 15),
    };
  });

  console.log(`  Found ${animMetrics.totalElementsWithMotion} elements with motion/GPU properties on homepage`);
  report.animationAudit = animMetrics;

  await animContext.close();
  await browser.close();

  const outPath = "scripts/survey-audit-results.json";
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`\nSurvey finished! Saved audit results to ${outPath}`);
}

runSurvey().catch(console.error);
