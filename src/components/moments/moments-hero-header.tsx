"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function MomentsHeroHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = headerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo(
          el.querySelectorAll(".hero-display-title .title-word"),
          { yPercent: 110, rotateX: -24, autoAlpha: 0, filter: "blur(6px)" },
          { yPercent: 0, rotateX: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.08 }
        )
          .fromTo(
            el.querySelector(".hero-overline"),
            { clipPath: "inset(0 50% 0 50%)", autoAlpha: 0.3 },
            { clipPath: "inset(0 0% 0 0%)", autoAlpha: 1, duration: 0.55 },
            "<0.1"
          )
          .fromTo(
            el.querySelector(".hero-narrative"),
            { y: 15, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45 },
            "<0.2"
          )
          .fromTo(
            el.querySelector(".hero-quote-callout"),
            { y: 15, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45 },
            "<0.15"
          );
      });
    },
    { scope: headerRef }
  );

  return (
    <header
      ref={headerRef}
      className="relative pt-12 pb-6 sm:pt-16 sm:pb-8 text-center overflow-hidden"
      aria-label="Tajuk Galeri Moment Atlet"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Official Hero Overline */}
        <div className="hero-overline mb-3">
          <span className="hero-overline-rule" aria-hidden="true" />
          — GALERI &amp; AKSI LATIHAN ATLET SILAT MALAYSIA —
          <span className="hero-overline-rule" aria-hidden="true" />
        </div>

        {/* 2. Teko Athletic Dual-Tone 3D Title (Kekalkan Tajuk Mengikut Homepage) */}
        <h1 className="hero-display-title mb-3 select-none">
          <span className="title-white block">
            <span className="title-word inline-block">MOMENTS</span>{" "}
            <span className="title-word inline-block">OF</span>
          </span>
          <span className="title-crimson block relative mt-1">
            <span className="title-word inline-block">WARRIORS.</span>
            <span
              className="absolute left-1/3 right-1/3 -bottom-1 h-[1px] bg-gradient-to-r from-transparent via-[#ff3845] to-transparent shadow-[0_0_8px_rgba(225,6,0,0.6)]"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* 3. Hero Narrative Minimalis */}
        <p className="hero-narrative max-w-xl mx-auto text-xs sm:text-sm text-[#96989F] leading-relaxed">
          Rakaman dedikasi, keringat, dan disiplin pesilat tanah air dari gelanggang latihan seluruh negeri.
        </p>

        {/* 4. Signature National Silat Quote Callout */}
        <div className="hero-quote-callout mt-4" role="note" aria-label="Semangat Juang. Jiwa Malaysia.">
          <span className="hero-quote-rule" aria-hidden="true" />
          <blockquote className="hero-quote-text">
            &ldquo;Semangat Juang. <span className="hero-quote-highlight">Jiwa Malaysia.</span>&rdquo;
          </blockquote>
          <span className="hero-quote-rule" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
