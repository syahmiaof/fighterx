"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  EQUIPMENT_LIST,
  type EquipmentItem,
} from "@/components/disciplines/disciplines-data";
import { Award, BookOpen, ShieldCheck, Swords } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
import { useLanguage } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

export function EquipmentBreakdown() {
  const { dict, locale } = useLanguage();
  const [filterType, setFilterType] = useState<"ALL" | "SENI" | "OLAHRAGA">("ALL");
  const sectionRef = useRef<HTMLElement>(null);
  const equipmentMotionRef = useCollectionMotion<HTMLDivElement>(filterType);
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
    const el = sectionRef.current;
    if (!el) return;

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>(".equipment-card")).slice(0, 12);
    if (!cards.length) return;

    gsap.set(cards, {
      opacity: 0,
      y: 20,
      scale: 0.96,
      clipPath: "inset(0 50% 0 50% round 14px)",
      willChange: "transform, opacity, clip-path",
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
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
  }, [cleanInline]);

  // Interactive 3D Tactile Physics
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const interactiveSelector = ".equipment-filter-btn, .equipment-card";
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

  const filteredItems = EQUIPMENT_LIST.filter((item) => {
    if (filterType === "ALL") return true;
    return item.category === filterType;
  });

  return (
    <section ref={sectionRef} id="equipment" className="py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={13} /> {locale === "bm" ? "Peralatan & Keselamatan Atlet" : "Athlete Equipment & Safety"}
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "var(--font-athletic)" }}
          >
            {locale === "bm" ? (
              <>PERALATAN RASMI &amp; <span className="text-red-600">STANDARD PERSILAT</span></>
            ) : (
              <>OFFICIAL EQUIPMENT &amp; <span className="text-red-600">PERSILAT STANDARDS</span></>
            )}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {locale === "bm"
              ? "Setiap senjata seni dan peralatan perlindungan tanding wajib mematuhi spesifikasi ketat PERSILAT 2026 demi keselamatan atlet dan ketulenan persembahan."
              : "Every artistic weapon and combat protection gear must comply with strict PERSILAT 2026 specifications for athlete safety and authentic performance."}
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`equipment-filter-btn px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                filterType === "ALL"
                  ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white"
              }`}
            >
              {locale === "bm" ? `Semua Peralatan (${EQUIPMENT_LIST.length})` : `All Equipment (${EQUIPMENT_LIST.length})`}
            </button>
            <button
              type="button"
              onClick={() => setFilterType("SENI")}
              className={`equipment-filter-btn px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                filterType === "SENI"
                  ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white"
              }`}
            >
              {locale === "bm" ? "Peralatan Silat Seni" : "Silat Seni Equipment"}
            </button>
            <button
              type="button"
              onClick={() => setFilterType("OLAHRAGA")}
              className={`equipment-filter-btn px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                filterType === "OLAHRAGA"
                  ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white"
              }`}
            >
              {locale === "bm" ? "Peralatan Silat Olahraga" : "Silat Olahraga Equipment"}
            </button>
          </div>
        </div>

        {/* Equipment Cards Grid */}
        <div ref={equipmentMotionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item: EquipmentItem) => {
            const isSeni = item.category === "SENI";
            return (
              <div
                key={item.id}
                className="equipment-card rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[border-color,background-color,box-shadow,transform] duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isSeni
                          ? "bg-[rgba(240,180,40,0.12)] text-[#ffd24c] border border-[rgba(240,180,40,0.35)]"
                          : "bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] border border-[rgba(255,56,69,0.35)]"
                      }`}
                    >
                      {isSeni ? <Award size={11} /> : <Swords size={11} />}
                      {isSeni ? "Silat Seni" : "Silat Olahraga"}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-neutral-500">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    {item.purpose}
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Spesifikasi Teknikal:
                    </span>
                    <p className="text-[11px] text-neutral-300 leading-snug mt-0.5">
                      {item.specs}
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-neutral-400 pt-1">
                    <BookOpen size={12} className="flex-none mt-0.5 text-neutral-400" />
                    <span>{item.ruleCitation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
