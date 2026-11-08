"use client";

import Image from "next/image";
import { ArrowRight, Award, Flame, Swords } from "lucide-react";

interface DisciplinesHeroProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export function DisciplinesHero({
  activeSection,
  onNavigateSection,
}: DisciplinesHeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-white/[0.08]">
      {/* Top Tagline */}
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-widest mb-4">
          <Flame size={14} className="text-red-500 animate-pulse" />
          <span>Eksplorasi Disiplin Pencak Silat Moden</span>
        </div>

        <h1 className="hero-display-title mb-4">
          <span className="title-white">DUA CABANG.</span>{" "}
          <span className="title-crimson">SATU JIWA PERSILATAN.</span>
        </h1>

        <p className="mt-3 text-sm sm:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed">
          Pencak Silat menggabungkan keindahan estetika warisan seni Melayu purba dengan ketangkasan pertarungan sukan sentuhan penuh moden bertaraf dunia di bawah peraturan rasmi PERSILAT 2026.
        </p>

        {/* Dual Athlete Graphic Showcase */}
        <div className="relative mt-8 sm:mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Silat Seni Card */}
          <div
            onClick={() => onNavigateSection("silat-seni")}
            className="group relative rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 text-left cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300"
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[rgba(240,180,40,0.12)] border border-[rgba(240,180,40,0.35)] text-[#ffd24c] uppercase tracking-wider mb-2">
                <Award size={12} /> Warisan Estetika &amp; Jurus
              </span>
              <h2
                className="text-2xl sm:text-3xl font-display font-bold text-white uppercase"
                style={{ fontFamily: "var(--font-athletic)" }}
              >
                Silat Seni
              </h2>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                Tunggal 100 Jurus Baku (Tangan Kosong, Golok &amp; Toya), Ganda tempur koreografi bercorak realistik, Regu keseragaman mutlak trio, dan Solo Bebas Nusantara.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400 group-hover:text-red-300 transition-colors">
                Terokai Silat Seni <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Silat Olahraga Card */}
          <div
            onClick={() => onNavigateSection("silat-olahraga")}
            className="group relative rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 text-left cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300"
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] text-[#ff4d5a] uppercase tracking-wider mb-2">
                <Swords size={12} /> Pertarungan Tanding Penuh
              </span>
              <h2
                className="text-2xl sm:text-3xl font-display font-bold text-white uppercase"
                style={{ fontFamily: "var(--font-athletic)" }}
              >
                Silat Olahraga
              </h2>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                Sistem perlawanan tanding digital PERSILAT 2026: Pukulan (1 pt), Tendangan (2 pts), Jatuhan (3 pts), zon sasaran vest, had tangkapan 5 saat &amp; divisyen berat badan.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400 group-hover:text-red-300 transition-colors">
                Terokai Silat Olahraga <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3" role="tablist">
          {[
            { id: "overview", label: "Perbandingan Asas" },
            { id: "silat-seni", label: "Silat Seni (4 Kategori)" },
            { id: "silat-olahraga", label: "Silat Olahraga & Taktikal" },
            { id: "equipment", label: "Peralatan & Keselamatan" },
            { id: "weight-classes", label: "Kategori Berat Senior" },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onNavigateSection(item.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                    : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:-translate-y-0.5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
