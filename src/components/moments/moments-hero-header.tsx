"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/lib/i18n";

export function MomentsHeroHeader() {
  const { dict } = useLanguage();
  const md = dict.moments;
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = headerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.fromTo(
          el.querySelector(".hero-overline"),
          { y: -6, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.45 }
        )
          .fromTo(
            el.querySelector(".hero-display-title"),
            { y: 8, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5 },
            "-=0.25"
          )
          .fromTo(
            el.querySelector(".hero-narrative"),
            { y: 6, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.4 },
            "-=0.2"
          )
          .fromTo(
            el.querySelector(".hero-quote-callout"),
            { y: 4, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.35 },
            "-=0.15"
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          el.querySelectorAll(
            ".hero-overline, .hero-display-title, .hero-narrative, .hero-quote-callout"
          ),
          { autoAlpha: 1, y: 0, clearProps: "transform" }
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
          — {md.overline} —
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
          {md.subtitle}
        </p>

        {/* 4. Signature National Silat Quote Callout */}
        <div className="hero-quote-callout mt-4" role="note" aria-label={md.quote}>
          <span className="hero-quote-rule" aria-hidden="true" />
          <blockquote className="hero-quote-text">
            &ldquo;{md.quote}&rdquo;
          </blockquote>
          <span className="hero-quote-rule" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
