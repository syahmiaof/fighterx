"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Trophy, Award, Scale } from "lucide-react";

interface SpotlightFigure {
  id: string;
  role: string;
  name: string;
  discipline: string;
  achievement: string;
  image: string;
  alt: string;
  href: string;
  linkLabel: string;
  accentColor: string;
  badgeClass: string;
  icon: typeof Trophy;
}

const SPOTLIGHT_FIGURES: SpotlightFigure[] = [
  {
    id: "top-atlet",
    role: "ATLET",
    name: "Megat Zulkarnain",
    discipline: "Silat Olahraga · Kelas Putra D",
    achievement: "Pingat Emas Sirkit Remaja Kebangsaan 2025",
    image: "/assets/fighterx/spotlight-athlete-standard.png",
    alt: "Megat Zulkarnain - MVP Atlet Bulan Ini",
    href: "/leaderboard",
    linkLabel: "Leaderboard",
    accentColor: "#FFB800",
    badgeClass: "text-[#FFB800] bg-[#FFB800]/15 border-[#FFB800]/40 shadow-[0_0_15px_rgba(255,184,0,0.2)]",
    icon: Trophy,
  },
  {
    id: "top-coach",
    role: "COACH",
    name: "Cikgu Ahmad Farhan",
    discipline: "Ketua Jurulatih · SKK Tahap 3 (MSN)",
    achievement: "14 Finalis Kebangsaan (Tier 1 Emas PESAKA)",
    image: "/assets/fighterx/spotlight-coach-standard.png",
    alt: "Cikgu Ahmad Farhan - MVP Jurulatih Bulan Ini",
    href: "/coach",
    linkLabel: "Portal Coach",
    accentColor: "#FF3845",
    badgeClass: "text-[#FF3845] bg-[#FF3845]/15 border-[#FF3845]/40 shadow-[0_0_15px_rgba(225,6,0,0.25)]",
    icon: Award,
  },
  {
    id: "top-wasit",
    role: "WASIT",
    name: "Wasit Faridah Mansor",
    discipline: "Adjudikasi Rasmi · PERSILAT Kelas 1",
    achievement: "48 Perlawanan Bersih & Tauliah Antarabangsa",
    image: "/assets/fighterx/spotlight-referee-standard.png",
    alt: "Wasit Faridah Mansor - MVP Wasit Bulan Ini",
    href: "/guidelines",
    linkLabel: "Garis Panduan",
    accentColor: "#00E599",
    badgeClass: "text-[#00E599] bg-[#00E599]/15 border-[#00E599]/40 shadow-[0_0_15px_rgba(0,229,153,0.2)]",
    icon: Scale,
  },
];

export function AthleteCoachSpotlight() {
  return (
    <section
      className="relative z-10 py-16 sm:py-24 bg-black/25 backdrop-blur-[2px] border-b border-white/[0.08] overflow-hidden"
      id="spotlight"
      aria-labelledby="spotlight-heading"
    >
      {/* Subtle Directional Atmosphere */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-[radial-gradient(ellipse_at_top,_rgba(225,6,0,0.18),_transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimalist Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-18">
          <p className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#FF3845] uppercase mb-2">
            — DEWAN KEHORMAT —
          </p>
          <h2
            id="spotlight-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-athletic tracking-wide text-white uppercase"
          >
            MVP OF NOVEMBER
          </h2>
          <p className="text-xs sm:text-sm text-[#C5C6CA] mt-2 font-medium">
            Pengiktirafan tokoh silat kebangsaan paling cemerlang bulan ini.
          </p>
        </div>

        {/* 3-Card 3D Pop-Out Grid with Equal Sizing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-12 sm:pt-16 mb-10">
          {SPOTLIGHT_FIGURES.map((figure) => {
            const Icon = figure.icon;
            return (
              <div
                key={figure.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.08] via-black/40 to-black/75 p-6 pt-0 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)]"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                }}
              >
                {/* 3D Pop-Out Character Stage — Standardized Scale & Framing */}
                <div className="relative h-64 sm:h-72 w-full flex items-end justify-center overflow-visible -mt-14 sm:-mt-18 pointer-events-none select-none">
                  {/* Subtle Colored Aura Behind Figure */}
                  <div
                    className="absolute inset-x-8 bottom-4 h-48 rounded-full blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: figure.accentColor }}
                  />

                  {/* Standardized Cutout Figure */}
                  <div className="relative w-full h-[125%] flex items-end justify-center overflow-visible">
                    <Image
                      src={figure.image}
                      alt={figure.alt}
                      width={400}
                      height={450}
                      className="object-contain h-full w-auto max-h-[310px] drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  </div>

                  {/* Bottom fade blending smoothly into glass surface */}
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>

                {/* Minimalist Info: Role Pill, Full Name, Category, Achievement */}
                <div className="relative z-10 pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Role Pill */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${figure.badgeClass}`}
                      >
                        <Icon size={11} aria-hidden="true" />
                        <span>{figure.role}</span>
                      </span>
                    </div>

                    {/* Name — Full name, no truncate ... */}
                    <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide uppercase leading-tight">
                      {figure.name}
                    </h3>

                    {/* Discipline / Category */}
                    <p className="text-xs text-[#96989F] font-medium mt-1 leading-snug">
                      {figure.discipline}
                    </p>

                    {/* Key Achievement */}
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C8E96] block mb-1">
                        Pencapaian
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white/90 leading-snug">
                        {figure.achievement}
                      </p>
                    </div>
                  </div>

                  {/* Minimalist Link */}
                  <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8C8E96]">
                      Edisi Bulanan
                    </span>
                    <Link
                      href={figure.href}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors group-hover:underline"
                    >
                      <span>{figure.linkLabel}</span>
                      <ArrowUpRight size={13} aria-hidden="true" className="text-[#FF3845]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Bottom Disclaimer */}
        <div className="text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#96989F] hover:text-white transition-colors"
          >
            <span>Kemaskini rasmi setiap awal bulan · Semak kedudukan penuh kebangsaan</span>
            <ArrowUpRight size={13} aria-hidden="true" className="text-[#FF3845]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
