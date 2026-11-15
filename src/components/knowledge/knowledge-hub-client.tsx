"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  CalendarDays,
  ShieldCheck,
  ExternalLink,
  Users,
  Award,
  Activity,
  Sparkles,
  Target,
  BookMarked,
  Scale,
  Dumbbell,
  Droplets,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  User,
  HeartHandshake,
} from "lucide-react";
import {
  SCIENTIFIC_CITATIONS,
  WEIGHT_CATEGORIES_PERSILAT,
  KnowledgeArticle,
} from "./knowledge-data";
import { CitationsDrawer } from "./citations-drawer";
import { KnowledgePillarsGrid } from "./knowledge-pillars-grid";
import { UnifiedPeriodizationRoadmap } from "./unified-periodization-roadmap";
import { PracticalToolsPanel } from "./practical-tools-panel";
import { RoleKnowledgeVault } from "./role-knowledge-vault";

export function KnowledgeHubClient() {
  const { dict, locale } = useLanguage();
  const isEn = locale === "en";
  const kd = dict.knowledge;

  // Modals & Drawers state
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);
  const [citationsDrawerOpen, setCitationsDrawerOpen] = useState(false);
  const [weightTableExpanded, setWeightTableExpanded] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const articleModalRef = useRef<HTMLDivElement>(null);
  const articleCloseBtnRef = useRef<HTMLButtonElement>(null);
  const articleTriggerRef = useRef<HTMLElement | null>(null);

  // Focus trap, Escape key, and trigger restoration for Article Reader modal
  useEffect(() => {
    if (!activeArticle) return;

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      articleCloseBtnRef.current?.focus();
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setActiveArticle(null);
        return;
      }

      if (e.key === "Tab") {
        if (!articleModalRef.current) return;
        const focusables = Array.from(
          articleModalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !articleModalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !articleModalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      articleTriggerRef.current?.focus();
    };
  }, [activeArticle]);

  const handleOpenArticle = (article: KnowledgeArticle) => {
    articleTriggerRef.current = (document.activeElement as HTMLElement) || null;
    setActiveArticle(article);
  };

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
        // 1. Hero title cinematic sweep & text reveals
        gsap.fromTo(
          ".knowledge-hero-title",
          { y: 40, autoAlpha: 0, filter: "blur(6px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, ease: "power4.out", clearProps: "transform,filter", delay: 0.05 }
        );
        gsap.fromTo(
          ".knowledge-hero-overline",
          { y: -16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", clearProps: "transform", delay: 0.15 }
        );
        gsap.fromTo(
          ".knowledge-hero-desc",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", clearProps: "transform", delay: 0.25 }
        );
        gsap.fromTo(
          ".hero-quote-callout",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", clearProps: "transform", delay: 0.35 }
        );
        gsap.fromTo(
          ".knowledge-hero-actions",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65, ease: "power2.out", clearProps: "transform", delay: 0.45 }
        );
        gsap.fromTo(
          ".accreditation-pill",
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.05, ease: "power2.out", clearProps: "transform", delay: 0.55 }
        );

        // 2. Hero 4 KPI Stat Cards
        const statCards = gsap.utils.toArray<HTMLElement>(".knowledge-stat-card");
        if (statCards.length > 0) {
          gsap.fromTo(
            statCards,
            {
              opacity: 0,
              y: 20,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 14px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 14px)",
              duration: 0.9,
              stagger: 0.08,
              ease: "expo.out",
              delay: 0.3,
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              onComplete: () => {
                statCards.forEach(cleanInline);
              },
            }
          );
        }

        // 3. Quick Jump Bar entrance
        gsap.fromTo(
          ".quick-nav-pill",
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            clearProps: "transform,opacity",
            delay: 0.5,
          }
        );
      });

      return () => media.revert();
    },
    { scope: heroRef }
  );

  return (
    <div ref={heroRef} className="min-h-screen text-white pb-24">
      {/* 1. EXECUTIVE HERO HEADER */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 border-b border-white/[0.08] overflow-hidden">
        {/* Atmospheric ambient glow */}
        <div
          className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[920px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.14),transparent_70%)] blur-3xl opacity-70"
          aria-hidden="true"
        />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Title, Subtitle, Description, Accreditation Badges */}
            <div className="lg:col-span-7">
              <div className="knowledge-hero-overline">
                <span className="accent-rule" aria-hidden="true" />
                <span className="overline-text">{kd.overline}</span>
                <span className="accent-rule" aria-hidden="true" />
              </div>

              <h1 className="knowledge-hero-title mb-4" aria-label="Sport Science">
                <span className="title-white">SPORT</span>{" "}
                <em className="title-crimson">SCIENCE</em>
              </h1>

              <div className="text-sm sm:text-base font-semibold text-[#FF555C] tracking-wide mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF3845]" />
                <span>{kd.subtitle}</span>
              </div>

              <p className="knowledge-hero-desc text-sm sm:text-base text-[#D1D1D6] mt-1 leading-relaxed max-w-2xl font-normal">
                {kd.description}
              </p>

              {/* Exact quote callout matching homepage athletic design language */}
              <div className="hero-quote-callout mt-4 mb-6" role="note" aria-label={kd.quote}>
                <span className="hero-quote-rule" aria-hidden="true" />
                <blockquote className="hero-quote-text">
                  &ldquo;{kd.quote}&rdquo;
                </blockquote>
                <span className="hero-quote-rule" aria-hidden="true" />
              </div>

              {/* Primary Action Buttons */}
              <div className="knowledge-hero-actions mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#tunjang-sains-sukan"
                  className="btn-crimson px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Dumbbell size={14} />
                  <span>{isEn ? "Explore 4 Pillars" : "Terokai 4 Tunjang"}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setCitationsDrawerOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#FF3845]/60 text-xs font-bold text-white flex items-center gap-2 transition-all backdrop-blur-sm cursor-pointer"
                >
                  <BookMarked size={14} className="text-[#FF3845]" />
                  <span>{kd.ctaCitations}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#E10600]/20 text-[#FF555C] font-mono">
                    {SCIENTIFIC_CITATIONS.length}
                  </span>
                </button>
              </div>

              {/* Official Scientific Accreditation Badges */}
              <div className="mt-7 pt-5 border-t border-white/[0.08]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8C95] block mb-2.5">
                  {isEn ? "Certified to Official Benchmarks:" : "Diperakui Berdasarkan Standard Rasmi:"}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://isn.gov.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <Award size={12} className="text-[#FF3845]" />
                    <span>ISN Bukit Jalil</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>

                  <a
                    href="https://worldpencaksilat.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <ShieldCheck size={12} className="text-[#FF3845]" />
                    <span>PERSILAT Medical Code 2026</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>

                  <a
                    href="https://bjsm.bmj.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <Activity size={12} className="text-[#FF3845]" />
                    <span>IOC &amp; BJSM Consensus</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>

                  <a
                    href="https://nsc.gov.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <Target size={12} className="text-[#FF3845]" />
                    <span>MSN Malaysia</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: 4-Metric Performance Statistics Matrix */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                {/* Metric 1 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#ff4d5a] mb-2.5">
                    <CalendarDays size={20} />
                    <span className="category-tag badge-crimson font-mono font-bold">
                      {isEn ? "6 + 6 Months" : "6 + 6 Bulan"}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    {isEn ? "52 WEEKS" : "52 MINGGU"}
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    {isEn ? "Annual Periodisation" : "Periodisasi Tahunan"}
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    {isEn
                      ? "Block 1 (Physical Foundation) & Block 2 (Peak Performance)."
                      : "Blok 1 (Asas Fizikal) & Blok 2 (Kemuncak Prestasi)."}
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#e5e5e7] mb-2.5">
                    <Activity size={20} />
                    <span className="category-tag badge-silver font-mono font-bold">
                      {isEn ? "2 Sessions" : "2 Sesi"}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    {isEn ? "6 BASELINE TESTS" : "6 BASELINE"}
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    {isEn ? "Physical Assessments" : "Ujian Penilaian Fizikal"}
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    {isEn
                      ? "Stamina, Core, Mobility, Power, Technique, Readiness."
                      : "Stamina, Teras, Mobiliti, Letupan, Teknik, Readiness."}
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#64b7ff] mb-2.5">
                    <Users size={20} />
                    <span className="category-tag badge-blue font-mono font-bold">
                      {isEn ? "Targeted" : "Bukan Rawak"}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    {isEn ? "5 PRIORITIES" : "5 PRIORITI"}
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    {isEn ? "Athlete Grouping" : "Pengelompokan Atlet"}
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    Endurance, Strength, Movement, Tech, Recovery.
                  </p>
                </div>

                {/* Metric 4 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#ffd24c] mb-2.5">
                    <ShieldCheck size={20} />
                    <span className="category-tag badge-gold font-mono font-bold">
                      Peer-Reviewed
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    100% LEGIT
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    {isEn ? "Scientific Evidence" : "Bukti Saintifik"}
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    {isEn
                      ? "Official ISN, PERSILAT 2026 & BJSM/IOC standards."
                      : "Garis panduan rasmi ISN, PERSILAT 2026 & BJSM/IOC."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Jump Bar */}
          <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7E8088] shrink-0 mr-1 hidden sm:inline">
              {isEn ? "QUICK JUMP:" : "LALUAN PANTAS:"}
            </span>

            <a
              href="#tunjang-sains-sukan"
              className="quick-nav-pill px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-red-500/40 text-[#C7C8CE] hover:text-white backdrop-blur-sm"
            >
              <Dumbbell size={13} className="text-[#FF3845]" />
              <span>{isEn ? "1. 4 Core Pillars" : "1. 4 Tunjang Sains"}</span>
            </a>

            <a
              href="#pelan-periodisasi-2027"
              className="quick-nav-pill px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-red-500/40 text-[#C7C8CE] hover:text-white backdrop-blur-sm"
            >
              <CalendarDays size={13} className="text-[#FF3845]" />
              <span>{isEn ? "2. Periodisation 2027" : "2. Roadmap 2027"}</span>
            </a>

            <a
              href="#alat-praktikal-sains"
              className="quick-nav-pill px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-red-500/40 text-[#C7C8CE] hover:text-white backdrop-blur-sm"
            >
              <Scale size={13} className="text-[#FF3845]" />
              <span>{isEn ? "3. Safe Weight Cut & Sweat" : "3. Alat Praktikal"}</span>
            </a>

            <a
              href="#pustaka-panduan"
              className="quick-nav-pill px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-red-500/40 text-[#C7C8CE] hover:text-white backdrop-blur-sm"
            >
              <Users size={13} className="text-[#FF3845]" />
              <span>{isEn ? "4. Role-Based Guides" : "4. Panduan Peranan"}</span>
            </a>

            <a
              href="#jadual-kelas-berat"
              className="quick-nav-pill px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-red-500/40 text-[#C7C8CE] hover:text-white backdrop-blur-sm"
            >
              <ShieldCheck size={13} className="text-[#FF3845]" />
              <span>{isEn ? "5. PERSILAT Classes" : "5. Kelas Berat PERSILAT"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SECTION 2: 4 CORE PILLARS GRID */}
      <KnowledgePillarsGrid />

      {/* 3. SECTION 3: UNIFIED 52-WEEK PERIODIZATION ROADMAP */}
      <UnifiedPeriodizationRoadmap />

      {/* 4. SECTION 4: PRACTICAL PERFORMANCE TOOLS */}
      <PracticalToolsPanel />

      {/* 5. SECTION 5: ROLE-BASED KNOWLEDGE VAULT */}
      <RoleKnowledgeVault onOpenArticle={handleOpenArticle} />

      {/* 6. SECTION 6: COLLAPSIBLE ANNEX - PERSILAT WEIGHT STANDARDS & SOURCE BANNER */}
      <section id="jadual-kelas-berat" className="py-14 border-b border-white/[0.08] scroll-mt-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Collapsible Accordion Header */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-[16px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF555C] mb-1">
                  <ShieldCheck size={14} className="text-[#FF3845]" />
                  <span>{isEn ? "OFFICIAL TOURNAMENT STANDARD" : "STANDARD KELAS BERAT TANDING RASMI"}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-athletic uppercase tracking-wide text-white">
                  {isEn ? "PERSILAT 2026 TANDING WEIGHT CLASS STANDARDS" : "STANDARD KELAS BERAT TANDING PERSILAT 2026"}
                </h3>
                <p className="text-xs text-[#A2A3AA] mt-1">
                  {isEn
                    ? "Official weight brackets for Senior Category (Men & Women) with 0.00 kg tolerance."
                    : "Piawaian rasmi kategori Dewasa (Putera & Puteri). Timbang rasmi 1 hari sebelum kejohanan dengan toleransi 0.00 kg."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setWeightTableExpanded((prev) => !prev)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <span>{weightTableExpanded ? (isEn ? "Hide Table" : "Tutup Jadual") : (isEn ? "View 11 Classes" : "Lihat 11 Kelas")}</span>
                {weightTableExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Expandable Content */}
            {weightTableExpanded && (
              <div className="mt-6 pt-6 border-t border-white/[0.08] animate-in fade-in duration-300">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {WEIGHT_CATEGORIES_PERSILAT.map((wc) => (
                    <div
                      key={wc.code}
                      className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 text-center hover:border-red-500/40 transition-colors"
                    >
                      <span className="text-xs font-bold font-athletic text-[#FF3845] block">
                        {isEn ? `CLASS ${wc.code}` : `KELAS ${wc.code}`}
                      </span>
                      <span className="text-xs text-white font-mono block mt-1 font-bold">
                        {wc.minKg} - {wc.maxKg} kg
                      </span>
                      <span className="text-[10px] text-[#7A7C85] block mt-0.5">
                        {isEn ? (wc.gender === "Putera" ? "Male" : wc.gender === "Puteri" ? "Female" : "Open") : wc.gender}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3.5 rounded-xl border border-[rgba(255,56,69,0.3)] bg-[rgba(255,56,69,0.05)] backdrop-blur-md flex items-center gap-2.5 text-xs text-[#FF858B]">
                  <ShieldCheck size={16} className="shrink-0 text-[#FF3845]" />
                  <span>
                    {isEn
                      ? "PERSILAT 2026: Official weigh-in is conducted 1 day before tournament begins with 0.00 kg tolerance. Safe weight category compliance is mandatory."
                      : "PERSILAT 2026: Timbang berat rasmi dilakukan 1 hari sebelum kejohanan bermula dengan toleransi 0.00 kg. Pematuhan had berat badan selamat adalah mandatori mengikut Kod Perubatan."}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Official Source & Scope Banner */}
          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-black/80 via-[#12141a]/90 to-black/80 p-5 sm:p-6 backdrop-blur-[16px] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#FF4D5A] shrink-0">
                <BookMarked size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF555C] block">
                  OFFICIAL SOURCE &amp; SCOPE
                </span>
                <strong className="text-xs sm:text-sm font-bold text-white block uppercase tracking-wide font-athletic">
                  INTERNATIONAL PENCAK SILAT COMPETITION REGULATIONS YEAR 2026
                </strong>
                <p className="text-[11px] text-[#8E9099] mt-0.5">
                  worldpencaksilat.org · International Pencak Silat Federation (PERSILAT) &amp; PESAKA Malaysia.
                </p>
              </div>
            </div>

            <a
              href="https://worldpencaksilat.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-red-500/40 text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              <span>Visit World Pencak Silat (PERSILAT)</span>
              <ExternalLink size={12} className="text-[#8E9099]" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. FULL ARTICLE READER MODAL */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-reader-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveArticle(null);
          }}
        >
          <div
            ref={articleModalRef}
            className="knowledge-modal-shell relative w-full max-w-4xl max-h-[92vh] rounded-2xl overflow-hidden flex flex-col bg-[#0e1015] border border-white/[0.12] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] bg-white/[0.02] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-red-500/40 bg-red-500/10 text-[#FF4D5A]">
                    {isEn ? activeArticle.categoryLabelEn || activeArticle.categoryLabel : activeArticle.categoryLabel}
                  </span>
                  <span className="text-xs text-[#8E9099] flex items-center gap-1">
                    <Clock size={12} />
                    {isEn ? activeArticle.readTimeEn || activeArticle.readTime : activeArticle.readTime}
                  </span>
                </div>
                <h3
                  id="article-reader-title"
                  className="text-xl sm:text-2xl font-bold font-athletic uppercase text-white tracking-wide"
                >
                  {isEn ? activeArticle.titleEn || activeArticle.title : activeArticle.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1">
                  {isEn ? activeArticle.subtitleEn || activeArticle.subtitle : activeArticle.subtitle}
                </p>
                <div className="mt-2 text-[11px] text-[#7A7C85]">
                  <span>Semakan Saintifik: </span>
                  <strong className="text-[#C7C8CE]">
                    {isEn ? activeArticle.reviewedByEn || activeArticle.reviewedBy : activeArticle.reviewedBy}
                  </strong>
                </div>
              </div>

              <button
                ref={articleCloseBtnRef}
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Tutup artikel"
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#A2A3AA] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#D4D5D9] leading-relaxed">
              {/* Summary Callout */}
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-[#FFD5D7]">
                <strong className="text-white block font-bold mb-1 uppercase tracking-wider">
                  {isEn ? "EXECUTIVE SUMMARY" : "RINGKASAN EKSEKUTIF SAINS SUKAN"}
                </strong>
                <p>{isEn ? activeArticle.summaryEn || activeArticle.summary : activeArticle.summary}</p>
              </div>

              {/* Problem / Solution / Action Cards */}
              {(activeArticle.fieldProblem || activeArticle.scientificSolution || activeArticle.actionStepToday) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                  {activeArticle.fieldProblem && (
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                        1. REALITI GELANGGANG
                      </span>
                      <p className="text-xs text-[#D4D5D9]">
                        {isEn ? activeArticle.fieldProblemEn || activeArticle.fieldProblem : activeArticle.fieldProblem}
                      </p>
                    </div>
                  )}

                  {activeArticle.scientificSolution && (
                    <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
                        2. PENYELESAIAN SAINS
                      </span>
                      <p className="text-xs text-[#D4D5D9]">
                        {isEn ? activeArticle.scientificSolutionEn || activeArticle.scientificSolution : activeArticle.scientificSolution}
                      </p>
                    </div>
                  )}

                  {activeArticle.actionStepToday && (
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        3. TINDAKAN HARI INI
                      </span>
                      <p className="text-xs text-[#D4D5D9]">
                        {isEn ? activeArticle.actionStepTodayEn || activeArticle.actionStepToday : activeArticle.actionStepToday}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Key Takeaways */}
              {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <Sparkles size={14} className="text-[#FF3845]" />
                    <span>{isEn ? "Key Practical Takeaways" : "Prinsip Utama Yang Wajib Diingat"}</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {(isEn ? activeArticle.keyTakeawaysEn || activeArticle.keyTakeaways : activeArticle.keyTakeaways).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Article Sections */}
              {(isEn ? activeArticle.sectionsEn || activeArticle.sections : activeArticle.sections).map((section, sIdx) => (
                <div key={sIdx} className="space-y-3 pt-3 border-t border-white/[0.06]">
                  <h4 className="text-base font-bold font-athletic uppercase text-white tracking-wide">
                    {section.heading}
                  </h4>

                  {section.content && section.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-[#C5C6CA]">
                      {p}
                    </p>
                  ))}

                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-[#A2A3AA]">
                      {section.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  {/* Callout if any */}
                  {section.callout && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 ${
                        section.callout.type === "warning"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                          : section.callout.type === "tip"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border-[#FF3845]/40 bg-[#FF3845]/10 text-[#FFD5D7]"
                      }`}
                    >
                      {section.callout.type === "warning" ? (
                        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info size={18} className="text-[#FF3845] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block text-xs font-bold uppercase tracking-wider mb-0.5">
                          {section.callout.title}
                        </strong>
                        <p className="text-xs leading-normal">{section.callout.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Table if any */}
                  {section.table && (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.05] text-white">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3 font-bold border-b border-white/10">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05] bg-white/[0.02]">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.05]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 text-[#B0B1B8]">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {/* Citations List */}
              {activeArticle.citations && activeArticle.citations.length > 0 && (
                <div className="pt-6 border-t border-white/[0.08]">
                  <h4 className="text-xs font-bold text-[#8E9099] uppercase tracking-wider mb-3">
                    {isEn ? "Scientific & Technical References" : "Sumber Rujukan Saintifik & Teknikal"}
                  </h4>
                  <div className="space-y-2">
                    {activeArticle.citations.map((cit) => (
                      <div key={cit.id} className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[11px] text-[#8E9099]">
                        <strong className="text-white block">{cit.title}</strong>
                        <span>
                          {cit.authors} ({cit.year}). <em>{cit.journal}</em>. {cit.volumeOrDetails}.
                        </span>
                        <p className="mt-1 text-[#FF858B] italic">&ldquo;{cit.keyFinding}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
              <Link
                href={`/knowledge/${activeArticle.slug}`}
                className="text-xs text-[#A2A3AA] hover:text-white flex items-center gap-1.5"
              >
                <span>{isEn ? "Open in separate page" : "Buka dalam halaman berasingan"}</span>
                <ExternalLink size={12} />
              </Link>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#E10600] text-white hover:bg-[#FF3845] transition-colors cursor-pointer"
              >
                {isEn ? "Finish Reading" : "Selesai Membaca"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CITATIONS DRAWER */}
      <CitationsDrawer
        isOpen={citationsDrawerOpen}
        onClose={() => setCitationsDrawerOpen(false)}
      />
    </div>
  );
}
