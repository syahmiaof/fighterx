"use client";

import { useState, useRef } from "react";
import {
  Building2,
  Users,
  Award,
  Activity,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Swords,
  Sparkles,
  Layers,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Milestone {
  month: string;
  monthEn?: string;
  label: string;
  labelEn?: string;
  sessions: number;
  olahraga: number;
  seni: number;
  athletes: number;
  note: string;
  noteEn?: string;
  x: number;
  yTotal: number;
  yOlahraga: number;
  ySeni: number;
}

const milestones: Milestone[] = [
  {
    month: "Jan 2025",
    monthEn: "Jan 2025",
    label: "Pelancaran Rintis",
    labelEn: "Pilot Launch",
    sessions: 1200,
    olahraga: 820,
    seni: 380,
    athletes: 180,
    note: "12 Kelab perintis Selangor & KL",
    noteEn: "12 Pilot clubs across Selangor & KL",
    x: 60,
    yTotal: 202,
    yOlahraga: 206,
    ySeni: 211,
  },
  {
    month: "Apr 2025",
    monthEn: "Apr 2025",
    label: "Ekspansi Zon",
    labelEn: "Regional Expansion",
    sessions: 3400,
    olahraga: 2310,
    seni: 1090,
    athletes: 390,
    note: "Penyertaan Zon Utara & Selatan",
    noteEn: "Northern & Southern zone expansion",
    x: 173,
    yTotal: 178,
    yOlahraga: 190,
    ySeni: 203,
  },
  {
    month: "Jul 2025",
    monthEn: "Jul 2025",
    label: "Fasa Kejohanan",
    labelEn: "Tournament Phase",
    sessions: 6100,
    olahraga: 4150,
    seni: 1950,
    athletes: 620,
    note: "Persediaan Sirkit Remaja Kebangsaan",
    noteEn: "National Youth Circuit preparation",
    x: 286,
    yTotal: 148,
    yOlahraga: 170,
    ySeni: 194,
  },
  {
    month: "Okt 2025",
    monthEn: "Oct 2025",
    label: "Standard SKK",
    labelEn: "SKK Standard",
    sessions: 9200,
    olahraga: 6250,
    seni: 2950,
    athletes: 890,
    note: "Akreditasi 85+ jurulatih bertauliah",
    noteEn: "85+ Certified coaches accredited",
    x: 400,
    yTotal: 114,
    yOlahraga: 147,
    ySeni: 183,
  },
  {
    month: "Jan 2026",
    monthEn: "Jan 2026",
    label: "Peraturan PERSILAT",
    labelEn: "PERSILAT Rules",
    sessions: 11800,
    olahraga: 8020,
    seni: 3780,
    athletes: 1100,
    note: "Penguatkuasaan format digital 2026",
    noteEn: "2026 Digital combat format enforcement",
    x: 513,
    yTotal: 86,
    yOlahraga: 127,
    ySeni: 174,
  },
  {
    month: "Mac 2026",
    monthEn: "Mar 2026",
    label: "Ujian Timbang & Fizikal",
    labelEn: "Weigh-in & Physical Tests",
    sessions: 13100,
    olahraga: 8900,
    seni: 4200,
    athletes: 1190,
    note: "98% pematuhan rekod pemakanan & berat",
    noteEn: "98% Nutrition & weigh-in compliance",
    x: 626,
    yTotal: 72,
    yOlahraga: 118,
    ySeni: 169,
  },
  {
    month: "Kini (2026)",
    monthEn: "Present (2026)",
    label: "Skala Kebangsaan",
    labelEn: "National Scale",
    sessions: 14250,
    olahraga: 9690,
    seni: 4560,
    athletes: 1250,
    note: "Liputan penuh 14 negeri seluruh Malaysia",
    noteEn: "Full nationwide coverage across 14 states",
    x: 740,
    yTotal: 59,
    yOlahraga: 109,
    ySeni: 165,
  },
];

// Mathematical natural cubic spline curves
const pathTotal =
  "M 60,202 C 78.8,198.0 135.3,187.0 173,178 C 210.7,169.0 248.2,158.7 286,148 C 323.8,137.3 362.2,124.3 400,114 C 437.8,103.7 475.3,93.0 513,86 C 550.7,79.0 588.2,76.5 626,72 C 663.8,67.5 721.0,61.2 740,59";
const areaTotal = `${pathTotal} L 740,225 L 60,225 Z`;

const pathOlahraga =
  "M 60,206 C 78.8,203.3 135.3,196.0 173,190 C 210.7,184.0 248.2,177.2 286,170 C 323.8,162.8 362.2,154.2 400,147 C 437.8,139.8 475.3,131.8 513,127 C 550.7,122.2 588.2,121.0 626,118 C 663.8,115.0 721.0,110.5 740,109";
const areaOlahraga = `${pathOlahraga} L 740,225 L 60,225 Z`;

const pathSeni =
  "M 60,211 C 78.8,209.7 135.3,205.8 173,203 C 210.7,200.2 248.2,197.3 286,194 C 323.8,190.7 362.2,186.3 400,183 C 437.8,179.7 475.3,176.3 513,174 C 550.7,171.7 588.2,170.5 626,169 C 663.8,167.5 721.0,165.7 740,165";
const areaSeni = `${pathSeni} L 740,225 L 60,225 Z`;

type ViewMode = "all" | "olahraga" | "seni";

export function AnimatedStats() {
  const { d, locale } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number>(milestones.length - 1);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const activePoint = milestones[activeIdx];

  const sectionRef = useRef<HTMLElement>(null);
  const kpiStripRef = useRef<HTMLDivElement>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);

  // SVG Refs
  const curveTotalRef = useRef<SVGPathElement>(null);
  const curveOlahragaRef = useRef<SVGPathElement>(null);
  const curveSeniRef = useRef<SVGPathElement>(null);
  const areaTotalRef = useRef<SVGPathElement>(null);
  const areaOlahragaRef = useRef<SVGPathElement>(null);
  const areaSeniRef = useRef<SVGPathElement>(null);

  // Metric text refs
  const kpiKelabRef = useRef<HTMLSpanElement>(null);
  const kpiPesilatRef = useRef<HTMLSpanElement>(null);
  const kpiJurulatihRef = useRef<HTMLSpanElement>(null);
  const kpiSesiRef = useRef<HTMLSpanElement>(null);

  const svgWidth = 800;
  const svgHeight = 250;

  useGSAP(
    () => {
      const el = sectionRef.current;
      const kpiEl = kpiStripRef.current;
      const chartEl = chartCardRef.current;
      if (!el || !kpiEl || !chartEl) return;

      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReduced) {
        if (kpiKelabRef.current) kpiKelabRef.current.innerText = "52";
        if (kpiPesilatRef.current) kpiPesilatRef.current.innerText = "1,250";
        if (kpiJurulatihRef.current) kpiJurulatihRef.current.innerText = "85";
        if (kpiSesiRef.current) kpiSesiRef.current.innerText = "14,250";
        return;
      }

      // =========================================================================
      // 1. KPI COUNTER TIMELINE (Triggers when KPI strip enters viewport)
      // =========================================================================
      const counters = { kelab: 0, pesilat: 0, jurulatih: 0, sesi: 0 };
      const kpiTl = gsap.timeline({
        scrollTrigger: {
          trigger: kpiEl,
          start: "top 85%",
          once: true,
        },
      });

      kpiTl.to(counters, {
        kelab: 52,
        pesilat: 1250,
        jurulatih: 85,
        sesi: 14250,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          if (kpiKelabRef.current) {
            kpiKelabRef.current.innerText = Math.round(counters.kelab).toString();
          }
          if (kpiPesilatRef.current) {
            kpiPesilatRef.current.innerText = Math.round(counters.pesilat).toLocaleString();
          }
          if (kpiJurulatihRef.current) {
            kpiJurulatihRef.current.innerText = Math.round(counters.jurulatih).toString();
          }
          if (kpiSesiRef.current) {
            kpiSesiRef.current.innerText = Math.round(counters.sesi).toLocaleString();
          }
        },
      });

      // =========================================================================
      // 2. CHART TELEMETRY TIMELINE (Triggers DIRECTLY on chart container)
      //    User sees the lines draw and bars rise as they scroll into the chart!
      // =========================================================================
      const paths = [curveTotalRef.current, curveOlahragaRef.current, curveSeniRef.current].filter(
        Boolean
      ) as SVGPathElement[];
      const areas = [areaTotalRef.current, areaOlahragaRef.current, areaSeniRef.current].filter(
        Boolean
      ) as SVGPathElement[];

      paths.forEach((p) => {
        const len = p.getTotalLength() || 800;
        gsap.set(p, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });

      areas.forEach((a) => {
        gsap.set(a, { opacity: 0 });
      });

      const bars = chartEl.querySelectorAll(".chart-telemetry-bar");
      gsap.set(bars, { scaleY: 0, transformOrigin: "bottom center" });

      const points = chartEl.querySelectorAll(".chart-data-point");
      gsap.set(points, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      });

      const chartTl = gsap.timeline({
        scrollTrigger: {
          trigger: chartEl,
          start: "top 75%", // Starts smoothly when chart enters 25% of viewport
          once: true,
        },
      });

      // Step A: Foundation glass volume bars rise from baseline (1.2s)
      chartTl.to(
        bars,
        {
          scaleY: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform",
        },
        0
      );

      // Step B: Curves draw smoothly across the grid (2.2s silky deceleration)
      paths.forEach((p, idx) => {
        chartTl.to(
          p,
          {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: "power2.out",
          },
          0.15 + idx * 0.12
        );
      });

      // Step C: Area gradient fills fade in softly
      areas.forEach((a, idx) => {
        chartTl.to(
          a,
          {
            opacity: 1,
            duration: 1.8,
            ease: "power1.out",
          },
          0.35 + idx * 0.1
        );
      });

      // Step D: Milestone telemetry nodes pop into position with back-bounce
      chartTl.to(
        points,
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.1,
          ease: "back.out(2)",
          clearProps: "transform",
        },
        0.5
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-14 md:py-20 bg-black/25 backdrop-blur-[2px] border-y border-[#26272C]/40 overflow-hidden"
      id="telemetri-prestasi"
      aria-label={
        locale === "bm"
          ? "Statistik dan aktiviti latihan platform FighterX"
          : "FighterX platform training telemetry and activity statistics"
      }
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#FF3845] uppercase mb-2">
            {d.home.stats.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-athletic tracking-wider text-white uppercase">
            {d.home.stats.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#96989F] mt-2 max-w-xl mx-auto leading-relaxed">
            {locale === "bm"
              ? "Data latihan berprestasi tinggi yang disahkan oleh jurulatih bertauliah merentasi seluruh 14 negeri di Malaysia."
              : "High-performance training telemetry verified by certified coaches across all 14 states in Malaysia."}
          </p>
        </div>

        {/* Sports-Science Dashboard Container */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-black/40 to-black/60 shadow-[0_16px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* 4 Clean Metric KPIs Strip */}
          <div
            ref={kpiStripRef}
            className="grid grid-cols-2 lg:grid-cols-4 border-b border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10"
          >
            {/* KPI 1: Kelab */}
            <div className="p-5 sm:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845] shrink-0">
                <Building2 size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    ref={kpiKelabRef}
                    className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  >
                    52
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">{d.home.stats.kpiClubs.split(" (")[0]}</div>
                <div className="text-[10px] text-[#8C8E97]">{d.home.stats.kpiClubs.split(" (")[1]?.replace(")", "") || ""}</div>
              </div>
            </div>

            {/* KPI 2: Pesilat */}
            <div className="p-5 sm:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845] shrink-0">
                <Users size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    ref={kpiPesilatRef}
                    className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  >
                    1,250
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">{d.home.stats.kpiAthletes.split(" (")[0]}</div>
                <div className="text-[10px] text-[#8C8E97]">{d.home.stats.kpiAthletes.split(" (")[1]?.replace(")", "") || ""}</div>
              </div>
            </div>

            {/* KPI 3: Jurulatih */}
            <div className="p-5 sm:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845] shrink-0">
                <Award size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    ref={kpiJurulatihRef}
                    className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  >
                    85
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">{d.home.stats.kpiCoaches.split(" (")[0]}</div>
                <div className="text-[10px] text-[#8C8E97]">{d.home.stats.kpiCoaches.split(" (")[1]?.replace(")", "") || ""}</div>
              </div>
            </div>

            {/* KPI 4: Sesi Latihan */}
            <div className="p-5 sm:p-6 flex items-center gap-4 bg-[#FF3845]/[0.03] hover:bg-[#FF3845]/[0.06] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#FF3845]/15 border border-[#FF3845]/30 flex items-center justify-center text-[#FF3845] shrink-0">
                <Activity size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    ref={kpiSesiRef}
                    className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  >
                    14,250
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">{d.home.stats.kpiSessions.split(" (")[0]}</div>
                <div className="text-[10px] text-[#22C55E] flex items-center gap-1 font-mono">
                  <CheckCircle2 size={10} />
                  <span>{d.home.stats.kpiSessions.split(" (")[1]?.replace(")", "") || ""}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Activity Chart Panel */}
          <div ref={chartCardRef} className="p-5 sm:p-8">
            
            {/* Chart Subheader & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#FF3845]" />
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    {d.home.stats.chartTitle}
                  </h3>
                </div>
                <p className="text-xs text-[#8C8E97] mt-0.5">
                  {locale === "bm"
                    ? "Layarkan tetikus pada titik graf atau lajur fasa untuk melihat perincian data latihan"
                    : "Hover over chart nodes or phase columns to inspect training telemetry details"}
                </p>
              </div>

              {/* View Switcher Tabs & Active Milestone HUD */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* View Mode Filters */}
                <div className="p-1 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("all")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                      viewMode === "all"
                        ? "bg-white/15 text-white shadow-sm"
                        : "text-[#8C8E97] hover:text-white"
                    }`}
                  >
                    <Layers size={12} />
                    <span>{d.home.stats.filterAll}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("olahraga")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                      viewMode === "olahraga"
                        ? "bg-[#FF3845]/20 text-[#FF3845] border border-[#FF3845]/40"
                        : "text-[#8C8E97] hover:text-[#FF3845]"
                    }`}
                  >
                    <Swords size={12} />
                    <span>{d.home.stats.filterOlahraga}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("seni")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                      viewMode === "seni"
                        ? "bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/40"
                        : "text-[#8C8E97] hover:text-[#E5A93C]"
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>{d.home.stats.filterSeni}</span>
                  </button>
                </div>

                {/* Active Milestone Card / Pill */}
                <div className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-[#8C8E97]">
                      {locale === "en" ? (activePoint.monthEn || activePoint.month) : activePoint.month}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {viewMode === "olahraga"
                        ? `${activePoint.olahraga.toLocaleString()} ${locale === "bm" ? "Sesi" : "Sessions"}`
                        : viewMode === "seni"
                        ? `${activePoint.seni.toLocaleString()} ${locale === "bm" ? "Sesi" : "Sessions"}`
                        : `${activePoint.sessions.toLocaleString()} ${locale === "bm" ? "Sesi" : "Sessions"}`}
                    </div>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-[#FF3845] uppercase">
                      {locale === "en" ? (activePoint.labelEn || activePoint.label) : activePoint.label}
                    </div>
                    <div className="text-[10px] text-[#A0A2AB] max-w-[140px] truncate">
                      {locale === "en" ? (activePoint.noteEn || activePoint.note) : activePoint.note}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Dual-Stream Area & Telemetry Chart */}
            <div className="relative w-full overflow-hidden select-none">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-52 sm:h-72 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Total Area Gradient */}
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
                    <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>

                  {/* Silat Olahraga Crimson Gradient */}
                  <linearGradient id="olahragaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF3845" stopOpacity="0.38" />
                    <stop offset="60%" stopColor="#FF3845" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#FF3845" stopOpacity="0" />
                  </linearGradient>

                  {/* Silat Seni Amber Gold Gradient */}
                  <linearGradient id="seniGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#E5A93C" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#E5A93C" stopOpacity="0" />
                  </linearGradient>

                  {/* Line glow filters */}
                  <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FF3845" floodOpacity="0.65" />
                  </filter>
                  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E5A93C" floodOpacity="0.65" />
                  </filter>
                  <filter id="whiteGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FFFFFF" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="40" y1="50" x2="760" y2="50" stroke="#FFFFFF" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="40" y1="95" x2="760" y2="95" stroke="#FFFFFF" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="40" y1="140" x2="760" y2="140" stroke="#FFFFFF" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="40" y1="185" x2="760" y2="185" stroke="#FFFFFF" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="40" y1="225" x2="760" y2="225" stroke="#FFFFFF" strokeOpacity="0.12" />

                {/* Y-axis micro labels */}
                <text x="32" y="54" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">15k</text>
                <text x="32" y="99" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">11k</text>
                <text x="32" y="144" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">7k</text>
                <text x="32" y="189" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">3k</text>

                {/* Vertical Architectural Telemetry Columns (Volume density bars) */}
                {milestones.map((point, idx) => {
                  const isActive = idx === activeIdx;
                  const barHeight = 225 - point.yTotal;
                  return (
                    <g
                      key={`bar-${point.month}`}
                      className="chart-telemetry-bar cursor-pointer"
                      onClick={() => setActiveIdx(idx)}
                      onMouseEnter={() => setActiveIdx(idx)}
                    >
                      {/* Translucent column backdrop */}
                      <rect
                        x={point.x - 18}
                        y={point.yTotal}
                        width="36"
                        height={barHeight}
                        rx="6"
                        fill={isActive ? "rgba(255, 56, 69, 0.16)" : "rgba(255, 255, 255, 0.025)"}
                        stroke={isActive ? "rgba(255, 56, 69, 0.4)" : "rgba(255, 255, 255, 0.05)"}
                        strokeWidth="1"
                        className="transition-colors duration-200"
                      />

                      {/* Vertical guidance crosshair line when active */}
                      {isActive && (
                        <line
                          x1={point.x}
                          y1="40"
                          x2={point.x}
                          y2="225"
                          stroke="#FF3845"
                          strokeOpacity="0.35"
                          strokeDasharray="2 2"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Area Gradient Fills */}
                {(viewMode === "all" || viewMode === "seni") && (
                  <path
                    ref={areaSeniRef}
                    d={areaSeni}
                    fill="url(#seniGrad)"
                    className="transition-opacity duration-300"
                  />
                )}

                {(viewMode === "all" || viewMode === "olahraga") && (
                  <path
                    ref={areaOlahragaRef}
                    d={areaOlahraga}
                    fill="url(#olahragaGrad)"
                    className="transition-opacity duration-300"
                  />
                )}

                {viewMode === "all" && (
                  <path
                    ref={areaTotalRef}
                    d={areaTotal}
                    fill="url(#totalGrad)"
                    className="transition-opacity duration-300"
                  />
                )}

                {/* Smooth Curve Lines */}
                {/* 1. Silat Seni (Gold Curve) */}
                <path
                  ref={curveSeniRef}
                  d={pathSeni}
                  fill="none"
                  stroke="#E5A93C"
                  strokeWidth={viewMode === "seni" ? "3.6" : "2.4"}
                  strokeLinecap="round"
                  filter="url(#goldGlow)"
                  opacity={viewMode === "olahraga" ? 0.2 : 1}
                  className="transition-all duration-300"
                />

                {/* 2. Silat Olahraga (Crimson Curve) */}
                <path
                  ref={curveOlahragaRef}
                  d={pathOlahraga}
                  fill="none"
                  stroke="#FF3845"
                  strokeWidth={viewMode === "olahraga" ? "3.8" : "2.8"}
                  strokeLinecap="round"
                  filter="url(#crimsonGlow)"
                  opacity={viewMode === "seni" ? 0.2 : 1}
                  className="transition-all duration-300"
                />

                {/* 3. Total Combined Peak Line (Semua) */}
                {viewMode === "all" && (
                  <path
                    ref={curveTotalRef}
                    d={pathTotal}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    filter="url(#whiteGlow)"
                    opacity={0.85}
                  />
                )}

                {/* Interactive Data Points (Nodes) */}
                {milestones.map((point, idx) => {
                  const isActive = idx === activeIdx;
                  const activeY =
                    viewMode === "olahraga"
                      ? point.yOlahraga
                      : viewMode === "seni"
                      ? point.ySeni
                      : point.yTotal;

                  return (
                    <g
                      key={`point-${point.month}`}
                      className="chart-data-point cursor-pointer"
                      onClick={() => setActiveIdx(idx)}
                      onMouseEnter={() => setActiveIdx(idx)}
                    >
                      {/* Active Radar Ripple Beacon on Current Milestone */}
                      {idx === milestones.length - 1 && (
                        <circle
                          cx={point.x}
                          cy={activeY}
                          r="14"
                          fill="none"
                          stroke="#FF3845"
                          strokeWidth="1.5"
                          className="animate-ping origin-center"
                          style={{ transformOrigin: `${point.x}px ${activeY}px` }}
                        />
                      )}

                      {/* Active Halo */}
                      {isActive && (
                        <circle
                          cx={point.x}
                          cy={activeY}
                          r="12"
                          fill={viewMode === "seni" ? "#E5A93C" : "#FF3845"}
                          fillOpacity="0.25"
                          className="animate-pulse"
                        />
                      )}

                      {/* Node Circle */}
                      <circle
                        cx={point.x}
                        cy={activeY}
                        r={isActive ? "6" : "4.2"}
                        fill={isActive ? "#FFFFFF" : viewMode === "seni" ? "#E5A93C" : "#FF3845"}
                        stroke={viewMode === "seni" ? "#E5A93C" : "#FF3845"}
                        strokeWidth={isActive ? "3" : "1.8"}
                        className="transition-all duration-200"
                      />

                      {/* X-Axis Month Label */}
                      <text
                        x={point.x}
                        y="242"
                        textAnchor="middle"
                        fill={isActive ? "#FFFFFF" : "#8C8E97"}
                        fontSize={isActive ? "10.5" : "9.5"}
                        fontWeight={isActive ? "bold" : "normal"}
                        fontFamily="monospace"
                        className="transition-colors duration-200"
                      >
                        {locale === "en" ? (point.monthEn || point.month) : point.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Dashboard Footer: Interactive Discipline Legend & Verification */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              {/* Discipline Breakdown Pill Details */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C8E97]">
                  {locale === "bm" ? "Pecahan Aliran:" : "Discipline Breakdown:"}
                </span>

                {/* Total Trajectory Indicator */}
                {viewMode === "all" && (
                  <>
                    <div className="flex items-center gap-1.5 px-2 py-0.5">
                      <span className="w-3.5 h-0.5 rounded-full bg-white shadow-[0_0_8px_#FFFFFF]" />
                      <span className="font-semibold text-white">
                        {locale === "bm" ? "Jumlah Sesi" : "Total Sessions"}
                      </span>
                      <span className="text-[#8C8E97] font-mono">(14,250)</span>
                    </div>
                    <span className="text-white/20">•</span>
                  </>
                )}
                
                {/* Olahraga Pill */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "olahraga" ? "all" : "olahraga")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                    viewMode === "olahraga"
                      ? "bg-[#FF3845]/20 border border-[#FF3845]/40"
                      : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3845] shadow-[0_0_8px_#FF3845]" />
                  <span className="font-semibold text-white">Silat Olahraga</span>
                  <span className="text-[#8C8E97] font-mono">
                    (68% • 9,690 {locale === "bm" ? "Sesi" : "Sessions"})
                  </span>
                </button>

                <span className="text-white/20">•</span>

                {/* Seni Pill */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "seni" ? "all" : "seni")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                    viewMode === "seni"
                      ? "bg-[#E5A93C]/20 border border-[#E5A93C]/40"
                      : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] shadow-[0_0_8px_#E5A93C]" />
                  <span className="font-semibold text-white">Silat Seni</span>
                  <span className="text-[#8C8E97] font-mono">
                    (32% • 4,560 {locale === "bm" ? "Sesi" : "Sessions"})
                  </span>
                </button>
              </div>

              {/* Verified Platform Badge */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C8E97] shrink-0">
                <ShieldCheck size={14} className="text-[#22C55E]" />
                <span>
                  {locale === "bm"
                    ? "Piawaian Sukan Berprestasi Tinggi • Standard PERSILAT 2026"
                    : "High-Performance Sports Standard • PERSILAT 2026 Certified"}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
