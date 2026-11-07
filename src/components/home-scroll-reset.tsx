"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function HomeScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    const jumpToTop = () => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
    };
    const scheduleHomeReset = () => {
      if (window.location.pathname !== "/") return;
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(jumpToTop);
      });
    };
    const handlePopState = () => {
      scheduleHomeReset();
      window.setTimeout(scheduleHomeReset, 80);
    };

    if (pathname === "/") scheduleHomeReset();
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  return null;
}
