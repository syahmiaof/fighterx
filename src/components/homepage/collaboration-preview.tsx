"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

export function CollaborationPreview() {
  const { d, locale } = useLanguage();
  return (
    <section
      className="relative z-10 py-8 sm:py-10 md:py-12 bg-black/35 backdrop-blur-[2px] border-b border-[#26272C]/40 overflow-hidden"
      id="kolaborasi"
      aria-labelledby="collab-heading"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <p className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#FF3845] uppercase mb-1.5">
            {d.home.collaboration.overline}
          </p>
          <h2
            id="collab-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold font-athletic tracking-wider text-white uppercase"
          >
            {d.home.collaboration.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1.5">
            {d.home.collaboration.subtitle}
          </p>
        </div>

        {/* Partner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-2xl mx-auto motion-grid">
          {/* Fifty7K */}
          <div className="collab-card group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-[#FF3845]/60 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(225,6,0,0.22)] transition-all duration-300">
            <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
              <Image
                src="/assets/partners/fifty7k.png"
                alt="Fifty7K Apparel"
                width={240}
                height={100}
                className="max-h-16 sm:max-h-20 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center gap-2 text-xs font-medium text-[#C5C6CA]">
                <span className="text-[10px] font-mono tracking-widest text-[#FF3845] uppercase font-bold">
                  {d.home.collaboration.badgeApparel}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs font-semibold tracking-wide text-white">Fifty7K</span>
              </div>
              <p className="text-[11px] text-[#96989F] max-w-xs mt-0.5">
                {locale === "bm"
                  ? "Inovasi fabrik aerodinamik dan jersi latihan silat moden berprestasi tinggi."
                  : "Aerodynamic performance fabrics and modern high-performance silat training wear."}
              </p>
            </div>
          </div>

          {/* Jiwa Fighter */}
          <div className="collab-card group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-[#FF3845]/60 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(225,6,0,0.22)] transition-all duration-300">
            <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
              <Image
                src="/assets/partners/jiwa-fighter.png"
                alt="Jiwa Fighter"
                width={240}
                height={100}
                className="max-h-16 sm:max-h-20 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center gap-2 text-xs font-medium text-[#C5C6CA]">
                <span className="text-[10px] font-mono tracking-widest text-[#FF3845] uppercase font-bold">
                  {d.home.collaboration.badgeGear}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs font-semibold tracking-wide text-white">Jiwa Fighter</span>
              </div>
              <p className="text-[11px] text-[#96989F] max-w-xs mt-0.5">
                {locale === "bm"
                  ? "Kelengkapan perlindungan tempur silat standard PERSILAT 2026."
                  : "Combat protective gear certified to PERSILAT 2026 international standards."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
