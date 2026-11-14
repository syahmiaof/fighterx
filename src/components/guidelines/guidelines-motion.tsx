"use client";

import { useRef, type PropsWithChildren } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function GuidelinesMotion({ children }: PropsWithChildren) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const page = root.current;
      if (!page) return;

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReduced) {
        gsap.set(
          ".guidelines-title-line, .guidelines-card-grid > *, .guidelines-motion-item, .guidelines-motion-chips > *, .guidelines-section-title",
          {
            autoAlpha: 1,
            opacity: 1,
            y: 0,
            yPercent: 0,
            scale: 1,
            clearProps: "all",
          }
        );
        return;
      }

      // =========================================================================
      // 1. HERO TITLE ENTRANCE (Athletic 3D Typography)
      // =========================================================================
      if (isDesktop) {
        gsap.fromTo(
          ".guidelines-title-line",
          { yPercent: 65, autoAlpha: 0, rotateX: -10, transformOrigin: "50% 100%" },
          {
            yPercent: 0,
            autoAlpha: 1,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all",
          }
        );
      } else {
        gsap.fromTo(
          ".guidelines-title-line",
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.35,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }

      // =========================================================================
      // 2. SECTION TITLE REVEAL (Clean Editorial Fade-Up)
      // =========================================================================
      page.querySelectorAll<HTMLElement>(".guidelines-section-title").forEach((title) => {
        gsap.fromTo(
          title,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: title, start: "top 82%", once: true },
          }
        );
      });

      // =========================================================================
      // 3. NEMO IRIS REVEAL ACROSS ALL CARD GRIDS (Horizontal Clip-Path + Scale)
      // =========================================================================
      page.querySelectorAll<HTMLElement>(".guidelines-card-grid, .motion-grid").forEach((grid) => {
        const items = Array.from(grid.children).filter(
          (c): c is HTMLElement => c instanceof HTMLElement
        );
        if (items.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: grid, start: "top 78%", once: true },
          onComplete: () => {
            items.forEach((item) => {
              item.style.removeProperty("clip-path");
              item.style.removeProperty("-webkit-clip-path");
              item.style.removeProperty("transform");
              item.style.removeProperty("scale");
              item.style.removeProperty("opacity");
              item.style.removeProperty("will-change");
            });
          },
        });

        items.forEach((item, index) => {
          tl.fromTo(
            item,
            {
              opacity: 0,
              y: 22,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 24px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 24px)",
              duration: 0.95,
              ease: "expo.out",
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              onComplete: () => {
                item.style.removeProperty("clip-path");
                item.style.removeProperty("-webkit-clip-path");
                item.style.removeProperty("transform");
                item.style.removeProperty("scale");
                item.style.removeProperty("opacity");
                item.style.removeProperty("will-change");
              },
            },
            index * 0.085
          );
        });
      });

      // =========================================================================
      // 4. STANDALONE MOTION ITEMS (Notice, Match Flow Box, Calculators, Explorer)
      // =========================================================================
      page.querySelectorAll<HTMLElement>(".guidelines-motion-item").forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 24,
            scale: 0.98,
            willChange: "transform, opacity",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "expo.out",
            clearProps: "transform,scale,opacity,willChange",
            scrollTrigger: { trigger: item, start: "top 80%", once: true },
            onComplete: () => {
              item.style.removeProperty("transform");
              item.style.removeProperty("scale");
              item.style.removeProperty("opacity");
              item.style.removeProperty("will-change");
            },
          }
        );
      });

      // =========================================================================
      // 5. TANGGA HUKUMAN STEP CHIPS (Sequential Ripple Pop)
      // =========================================================================
      page.querySelectorAll<HTMLElement>(".guidelines-motion-chips").forEach((group) => {
        const chips = Array.from(group.children).filter(
          (c): c is HTMLElement => c instanceof HTMLElement
        );
        if (chips.length === 0) return;

        gsap.fromTo(
          chips,
          {
            opacity: 0,
            scale: 0.9,
            y: 14,
            willChange: "transform, opacity",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.07,
            ease: "back.out(1.8)",
            clearProps: "transform,scale,opacity,willChange",
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
            onComplete: () => {
              chips.forEach((c) => {
                c.style.removeProperty("transform");
                c.style.removeProperty("scale");
                c.style.removeProperty("opacity");
                c.style.removeProperty("will-change");
              });
            },
          }
        );
      });

      // =========================================================================
      // 6. TACTILE 3D BUTTON & CHIP SPRING INTERACTION
      // =========================================================================
      const interactiveButtons = page.querySelectorAll<HTMLElement>(
        ".button, .button-primary, .button-outline, .btn-crimson, .text-link, .tactile-btn, button"
      );
      interactiveButtons.forEach((btn) => {
        const handleDown = () => {
          gsap.to(btn, { scale: 0.95, duration: 0.08, ease: "power2.out" });
        };
        const handleUp = () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.34,
            ease: "back.out(2)",
            clearProps: "transform,scale",
            onComplete: () => {
              btn.style.removeProperty("transform");
              btn.style.removeProperty("scale");
            },
          });
        };
        btn.addEventListener("pointerdown", handleDown);
        btn.addEventListener("pointerup", handleUp);
        btn.addEventListener("pointercancel", handleUp);
        btn.addEventListener("pointerleave", handleUp);
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="guidelines-motion-root">
      {children}
    </div>
  );
}
