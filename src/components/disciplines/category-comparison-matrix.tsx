"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { COMPARISON_MATRIX } from "@/components/disciplines/disciplines-data";
import { Award, Scale, Swords } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
import { useLanguage } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

export function CategoryComparisonMatrix() {
  const { dict, locale } = useLanguage();
  const [viewMode, setViewMode] = useState<"ALL" | "SENI" | "OLAHRAGA">("ALL");
  const sectionRef = useRef<HTMLElement>(null);
  const containerMotionRef = useCollectionMotion<HTMLDivElement>(viewMode);
  const entranceTriggeredRef = useRef(false);

  // Helper to remove inline overrides after GSAP finishes
  const cleanInline = useCallback((elements: HTMLElement[]) => {
    elements.forEach((el) => {
      el.style.removeProperty("clip-path");
      el.style.removeProperty("clipPath");
      el.style.removeProperty("transform");
      el.style.removeProperty("opacity");
      el.style.removeProperty("scale");
      el.style.removeProperty("will-change");
    });
  }, []);

  useEffect(() => {
    if (entranceTriggeredRef.current) return;
    const container = containerMotionRef.current;
    if (!container) return;

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>(".matrix-card")).slice(0, 12);
    if (!cards.length) return;

    gsap.set(cards, {
      opacity: 0,
      y: 20,
      scale: 0.96,
      clipPath: "inset(0 50% 0 50% round 14px)",
      willChange: "transform, opacity, clip-path",
    });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 78%",
      once: true,
      onEnter: () => {
        entranceTriggeredRef.current = true;
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0% 0 0% round 14px)",
          duration: 0.95,
          stagger: 0.075,
          ease: "expo.out",
          clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
          onComplete: () => {
            cleanInline(cards);
          },
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [containerMotionRef, cleanInline]);

  // Interactive 3D Tactile Physics
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const interactiveSelector = ".matrix-toggle-btn, .matrix-card";
    const handlePointerDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 0.97, duration: 0.14, ease: "power2.out", overwrite: "auto" });
    };
    const handlePointerUp = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 1, duration: 0.28, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,scale" });
    };
    const handlePointerLeave = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 1, duration: 0.28, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,scale" });
    };

    el.addEventListener("pointerdown", handlePointerDown, { passive: true });
    el.addEventListener("pointerup", handlePointerUp, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave, { passive: true, capture: true });

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointerleave", handlePointerLeave, { capture: true });
    };
  }, []);

  return (
    <section ref={sectionRef} id="overview" className="py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-wider mb-2">
            <Scale size={13} /> {locale === "bm" ? "Matriks Perbandingan Komprehensif" : "Comprehensive Comparison Matrix"}
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "var(--font-athletic)" }}
          >
            SILAT SENI VS. <span className="text-red-600">SILAT OLAHRAGA</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {locale === "bm"
              ? "Perbandingan mendalam antara dua cabang utama sukan silat moden bagi memahami keunikan objektif latihan, peraturan kejohanan, dan profil kecergasan atlet."
              : "In-depth comparison between the two major branches of modern silat sports to understand training objectives, tournament rules, and athlete fitness profiles."}
          </p>

          {/* Toggle buttons */}
          <div className="mt-5 inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-[12px] max-w-full">
            <button
              type="button"
              onClick={() => setViewMode("ALL")}
              className={`matrix-toggle-btn px-3.5 py-1.5 rounded-full text-xs cursor-pointer ${
                viewMode === "ALL"
                  ? "bg-[#e10600] border border-[#ff3845] text-white font-bold shadow-[0_0_14px_rgba(225,6,0,0.4)]"
                  : "text-[#b5b6bc] font-semibold hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {locale === "bm" ? "Semua Ciri (Bandingan)" : "All Features (Comparison)"}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("SENI")}
              className={`matrix-toggle-btn px-3.5 py-1.5 rounded-full text-xs cursor-pointer ${
                viewMode === "SENI"
                  ? "bg-[#e10600] border border-[#ff3845] text-white font-bold shadow-[0_0_14px_rgba(225,6,0,0.4)]"
                  : "text-[#b5b6bc] font-semibold hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {locale === "bm" ? "Fokus Seni Sahaja" : "Seni Focus Only"}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("OLAHRAGA")}
              className={`matrix-toggle-btn px-3.5 py-1.5 rounded-full text-xs cursor-pointer ${
                viewMode === "OLAHRAGA"
                  ? "bg-[#e10600] border border-[#ff3845] text-white font-bold shadow-[0_0_14px_rgba(225,6,0,0.4)]"
                  : "text-[#b5b6bc] font-semibold hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {locale === "bm" ? "Fokus Olahraga Sahaja" : "Olahraga Focus Only"}
            </button>
          </div>
        </div>

        {/* Comparison Cards / Table Layout */}
        <div ref={containerMotionRef} className="space-y-3">
          {COMPARISON_MATRIX.map((item, idx) => (
            <div
              key={item.feature}
              className="matrix-card rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.18] hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.4)] flex items-center justify-center text-[10px] font-bold text-[#ff4d5a]">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  {locale === "en" ? (item.featureEn || item.feature) : item.feature}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {(viewMode === "ALL" || viewMode === "SENI") && (
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[rgba(240,180,40,0.3)] transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Award size={14} className="text-[#ffd24c]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ffd24c]">
                        Silat Seni
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {locale === "en" ? (item.seniEn || item.seni) : item.seni}
                    </p>
                  </div>
                )}

                {(viewMode === "ALL" || viewMode === "OLAHRAGA") && (
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[rgba(255,56,69,0.3)] transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Swords size={14} className="text-[#ff4d5a]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d5a]">
                        Silat Olahraga
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {locale === "en" ? (item.olahragaEn || item.olahraga) : item.olahraga}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
