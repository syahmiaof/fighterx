"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/lib/i18n";
gsap.registerPlugin(useGSAP);

interface DisciplinesHeroProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export function DisciplinesHero({
  activeSection,
  onNavigateSection,
}: DisciplinesHeroProps) {
  const { dict, locale } = useLanguage();
  const dd = dict.disciplines;
  const rootRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const prevTabIdx = useRef(0);
  const [internalActive, setInternalActive] = useState(activeSection);

  const alignPill = (animate = false) => {
    if (!navRef.current || !pillRef.current) return;
    const activeBtn =
      navRef.current.querySelector<HTMLButtonElement>(
        ".disc-tab-btn[aria-selected='true']"
      ) ||
      navRef.current.querySelector<HTMLButtonElement>(".disc-tab-btn");
    if (!activeBtn) return;

    const targetLeft = activeBtn.offsetLeft;
    const targetWidth = activeBtn.getBoundingClientRect().width;

    if (animate) {
      gsap.killTweensOf(pillRef.current);
      gsap.to(pillRef.current, {
        left: targetLeft,
        width: targetWidth,
        duration: 0.28,
        ease: "power2.out",
      });
    } else {
      gsap.set(pillRef.current, {
        left: targetLeft,
        width: targetWidth,
        autoAlpha: 1,
      });
    }
  };

  useEffect(() => {
    setInternalActive(activeSection);
  }, [activeSection]);

  useEffect(() => {
    alignPill(false);

    const handleResize = () => {
      alignPill(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [internalActive, dict]);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;

      // Align elastic pill to active tab on mount
      alignPill(false);

      const media = gsap.matchMedia();

      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            el.querySelector(".disciplines-hero-title"),
            { y: 25, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", clearProps: "transform", delay: 0.15 }
          );

          const cards = el.querySelectorAll<HTMLElement>(".discipline-card-seni, .discipline-card-olahraga");
          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              { y: 22, autoAlpha: 0, scale: 0.98 },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.65,
                stagger: 0.08,
                ease: "power3.out",
                delay: 0.25,
                clearProps: "all",
                onComplete: () => {
                  cards.forEach((c) => {
                    c.removeAttribute("style");
                  });
                },
              }
            );
          }

          gsap.fromTo(
            el.querySelector(".disciplines-nav-tabs"),
            { y: 10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out", clearProps: "transform", delay: 0.35 }
          );
        }
      );

      // Reduced motion: immediate settle into static resting layer
      media.add("(prefers-reduced-motion: reduce)", () => {
        const all = el.querySelectorAll<HTMLElement>(
          ".disciplines-hero-title, .discipline-card-seni, .discipline-card-olahraga, .disciplines-nav-tabs"
        );
        all.forEach((item) => {
          item.removeAttribute("style");
        });
      });

      return () => {
        media.revert();
      };
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Main title — Persatuan two-tone Athletic style */}
        <h1
          className="disciplines-hero-title select-none uppercase mb-4"
          style={{
            font: "italic 700 clamp(40px, 6vw, 76px)/0.88 var(--font-athletic)",
            letterSpacing: "-0.012em",
          }}
        >
          <span
            className="block text-white"
            style={{
              textShadow: "0 2px 0 #aaaab0, 0 5px 0 #66676d, 0 9px 14px rgba(0,0,0,0.7)",
            }}
          >
            {locale === "en" ? "TWO DISCIPLINES." : "DUA CABANG."}
          </span>
          <em
            className="block"
            style={{
              fontStyle: "italic",
              color: "#f51c25",
              textShadow:
                "0 2px 0 #a10a11, 0 5px 0 #65050a, 0 9px 14px rgba(0,0,0,0.7)",
              filter: "drop-shadow(0 4px 8px rgba(225,6,0,0.35))",
            }}
          >
            {locale === "en" ? "ONE SILAT SOUL." : "SATU JIWA PERSILATAN."}
          </em>
        </h1>

        {/* Category Cards */}
        <div className="relative mt-8 sm:mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Silat Seni Card */}
          <div
            onClick={() => onNavigateSection("silat-seni")}
            className="discipline-card-seni group relative rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 text-left cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300"
          >
            <div className="absolute -right-4 -bottom-4 w-40 h-40 opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity">
              <Image
                src="/assets/fighterx/hero-silat-seni-athlete-lit.png"
                alt="Silat Seni Silhouette"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative z-10">

              <h2
                className="text-2xl sm:text-3xl font-bold text-white uppercase"
                style={{ fontFamily: "var(--font-athletic)", fontStyle: "italic" }}
              >
                Silat Seni
              </h2>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                {dd.cardSeniDesc}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400 group-hover:text-red-300 transition-colors">
                {dd.cardSeniCta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Silat Olahraga Card */}
          <div
            onClick={() => onNavigateSection("silat-olahraga")}
            className="discipline-card-olahraga group relative rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 text-left cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300"
          >
            <div className="absolute -right-4 -bottom-4 w-40 h-40 opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity">
              <Image
                src="/assets/fighterx/hero-silat-olahraga-athlete-lit.png"
                alt="Silat Olahraga Silhouette"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative z-10">

              <h2
                className="text-2xl sm:text-3xl font-bold text-white uppercase"
                style={{ fontFamily: "var(--font-athletic)", fontStyle: "italic" }}
              >
                Silat Olahraga
              </h2>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                {dd.cardOlahragaDesc}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400 group-hover:text-red-300 transition-colors">
                {dd.cardOlahragaCta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs — Elastic pill switcher (Nemo style) */}
        {(() => {
          const tabs = [
            { id: "overview", label: dd.navOverview },
            { id: "silat-seni", label: dd.navSeni },
            { id: "silat-olahraga", label: dd.navOlahraga },
            { id: "equipment", label: dd.navEquipment },
            { id: "weight-classes", label: dd.navWeights },
          ];

          const handleTabClick = (id: string, index: number) => {
            if (!navRef.current || !pillRef.current) {
              onNavigateSection(id);
              setInternalActive(id);
              return;
            }
            const isReduced =
              typeof window !== "undefined" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const btns = navRef.current.querySelectorAll<HTMLButtonElement>(".disc-tab-btn");
            const target = btns[index];
            if (!target) { onNavigateSection(id); setInternalActive(id); return; }

            const targetLeft = target.offsetLeft;
            const targetWidth = target.getBoundingClientRect().width;
            const isMovingRight = index > prevTabIdx.current;

            gsap.killTweensOf(pillRef.current);

            if (isReduced) {
              gsap.set(pillRef.current, { left: targetLeft, width: targetWidth });
            } else {
              const currentLeft = pillRef.current.offsetLeft;
              const currentWidth = pillRef.current.offsetWidth;
              const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
              if (isMovingRight) {
                tl.to(pillRef.current, {
                  width: targetLeft + targetWidth - currentLeft,
                  duration: 0.2,
                }).to(pillRef.current, {
                  left: targetLeft,
                  width: targetWidth,
                  duration: 0.28,
                  ease: "elastic.out(1, 0.75)",
                }, "-=0.06");
              } else {
                tl.to(pillRef.current, {
                  left: targetLeft,
                  width: (currentLeft + currentWidth) - targetLeft,
                  duration: 0.2,
                }).to(pillRef.current, {
                  width: targetWidth,
                  duration: 0.28,
                  ease: "elastic.out(1, 0.75)",
                }, "-=0.06");
              }
            }

            // Smoothly scroll active tab into view on mobile without vertical page jitter
            const scrollTarget = target.offsetLeft - (navRef.current.clientWidth - targetWidth) / 2;
            navRef.current.scrollTo({
              left: Math.max(0, scrollTarget),
              behavior: isReduced ? "auto" : "smooth",
            });

            prevTabIdx.current = index;
            setInternalActive(id);
            onNavigateSection(id);
          };

          return (
            <div className="disciplines-nav-outer mt-8 w-full flex justify-center">
              <div
                ref={navRef}
                className="disciplines-nav-tabs relative flex flex-nowrap items-center gap-1 p-1 rounded-full bg-white/[0.035] border border-white/[0.08] backdrop-blur-[8px] max-w-full overflow-x-auto scroll-smooth touch-pan-x overscroll-x-contain scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden no-scrollbar"
                role="tablist"
                aria-label="Disciplines sections"
              >
                {/* Elastic active pill */}
                <div
                  ref={pillRef}
                  className="absolute top-1 bottom-1 bg-[#e10600] rounded-full pointer-events-none shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  style={{ left: 4, width: 120 }}
                  aria-hidden="true"
                />
                {tabs.map((item, idx) => {
                  const isActive = internalActive === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTabClick(item.id, idx)}
                      className={`disc-tab-btn relative z-10 min-h-[44px] flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap shrink-0 cursor-pointer select-none transition-colors duration-200 ${
                        isActive ? "text-white" : "text-[#b5b6bc] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
