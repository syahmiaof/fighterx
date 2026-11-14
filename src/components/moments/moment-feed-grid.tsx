"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MomentCard } from "./moment-card";
import { useMoments } from "@/lib/moments/moments-context";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
import { useLanguage } from "@/lib/i18n";
import { CameraOff, RotateCcw } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MomentFeedGrid() {
  const { dict, locale } = useLanguage();
  const { filteredMoments, activeCategory, activeState, searchQuery, setActiveCategory, setActiveState, setSearchQuery } = useMoments();
  const filterKey = `${activeCategory}|${activeState}|${searchQuery}`;
  const feedMotionRef = useCollectionMotion<HTMLDivElement>(filterKey);

  // Helper to remove all temporary animation inline properties so hover micro-interactions work cleanly
  const cleanInline = (el: HTMLElement) => {
    el.style.removeProperty("clip-path");
    el.style.removeProperty("-webkit-clip-path");
    el.style.removeProperty("transform");
    el.style.removeProperty("scale");
    el.style.removeProperty("opacity");
    el.style.removeProperty("will-change");
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = Array.from(
          document.querySelectorAll<HTMLElement>(".moment-card")
        ).slice(0, 24);

        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 20,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 16px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 16px)",
              duration: 0.95,
              stagger: 0.075,
              ease: "expo.out",
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              scrollTrigger: {
                trigger: feedMotionRef.current || ".moment-card",
                start: "top 78%",
                once: true,
              },
              onComplete: () => {
                cards.forEach(cleanInline);
              },
            }
          );
        }

        // Tactile 3D Micro-Interactions for Moment Cards & Buttons
        const interactiveElements = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".moment-card, .moments-cat-pill, .moments-upload-btn, .moments-like-btn, .moments-share-btn"
          )
        );

        const handleDown = (e: Event) => {
          const target = e.currentTarget as HTMLElement;
          gsap.to(target, {
            scale: 0.97,
            duration: 0.12,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const handleUp = (e: Event) => {
          const target = e.currentTarget as HTMLElement;
          gsap.to(target, {
            scale: 1,
            duration: 0.35,
            ease: "back.out(2)",
            overwrite: "auto",
            onComplete: () => {
              target.style.removeProperty("transform");
              target.style.removeProperty("scale");
            },
          });
        };

        interactiveElements.forEach((el) => {
          el.addEventListener("pointerdown", handleDown);
          el.addEventListener("pointerup", handleUp);
          el.addEventListener("pointerleave", handleUp);
        });

        return () => {
          interactiveElements.forEach((el) => {
            el.removeEventListener("pointerdown", handleDown);
            el.removeEventListener("pointerup", handleUp);
            el.removeEventListener("pointerleave", handleUp);
          });
        };
      });
    },
    { dependencies: [filteredMoments.length] }
  );

  const handleResetFilters = () => {
    setActiveCategory("semua");
    setActiveState("Semua Negeri");
    setSearchQuery("");
  };

  if (filteredMoments.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#FF3845] mb-3">
          <CameraOff size={24} />
        </div>
        <h3 className="text-base font-bold font-athletic uppercase text-white tracking-wide">
          {dict.moments.emptyTitle || (locale === "bm" ? "Tiada Moment Ditemui" : "No Moments Found")}
        </h3>
        <p className="text-xs text-[#96989F] mt-1 leading-relaxed">
          {locale === "bm"
            ? "Tiada foto atau rekod latihan atlet yang sepadan dengan penapis yang dipilih."
            : "No athlete photos or training records matching the selected filters."}
        </p>
        <button
          type="button"
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-4 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#FF3845] text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>{locale === "bm" ? "Set Semula" : "Reset Filter"}</span>
        </button>
      </div>
    );
  }

  return (
    <section className="py-8 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Grid of Clean Minimalist Glass Cards */}
      <div ref={feedMotionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMoments.map((moment) => (
          <MomentCard key={moment.id} moment={moment} />
        ))}
      </div>
    </section>
  );
}
