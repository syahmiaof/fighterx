"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeAlert,
  Check,
  CheckCircle2,
  Flag,
  HandFist,
  Medal,
  Swords,
  X,
  XCircle,
} from "lucide-react";
import { GuidelinesMotion } from "@/components/guidelines/guidelines-motion";
import { SiteHeader } from "@/components/site-header";
import { ScoringMatrixView } from "@/components/guidelines/scoring-matrix-view";
import { RulebookExplorer } from "@/components/guidelines/rulebook-explorer";
import { OfficialDisclaimer } from "@/components/guidelines/official-disclaimer";
import { useLanguage } from "@/lib/i18n";

function SectionTitle({
  id,
  badge,
  title,
  subtitle,
}: {
  id?: string;
  badge: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="guidelines-section-title mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
      <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-[#ff4d5a] bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] uppercase mb-2">
        {badge}
      </span>
      <h2
        id={id}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold font-athletic tracking-wide text-white uppercase"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#C5C6CA] mt-2 font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function GuidelinesView() {
  const { d, locale } = useLanguage();
  const isEn = locale === "en";

  const quickRules = [
    {
      badge: d.guidelines.coreRules.pointsBadge,
      badgeTone: "text-[#ffd24c] border-[rgba(240,180,40,0.35)] bg-[rgba(240,180,40,0.12)]",
      title: d.guidelines.coreRules.pointsTitle,
      largeValue: "1 · 2 · 3",
      description: d.guidelines.coreRules.pointsDesc,
      points: [
        d.guidelines.coreRules.pointsItem1,
        d.guidelines.coreRules.pointsItem2,
        d.guidelines.coreRules.pointsItem3,
      ],
    },
    {
      badge: d.guidelines.coreRules.grappleBadge,
      badgeTone: "text-[#ff4d5a] border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)]",
      title: d.guidelines.coreRules.grappleTitle,
      largeValue: "5.0s",
      description: d.guidelines.coreRules.grappleDesc,
      points: [
        d.guidelines.coreRules.grappleItem1,
        d.guidelines.coreRules.grappleItem2,
        d.guidelines.coreRules.grappleItem3,
      ],
    },
    {
      badge: d.guidelines.coreRules.targetBadge,
      badgeTone: "text-[#e5e5e7] border-white/20 bg-white/[0.08]",
      title: d.guidelines.coreRules.targetTitle,
      largeValue: "Vest",
      description: d.guidelines.coreRules.targetDesc,
      points: [
        d.guidelines.coreRules.targetItem1,
        d.guidelines.coreRules.targetItem2,
        d.guidelines.coreRules.targetItem3,
      ],
    },
    {
      badge: d.guidelines.coreRules.penaltyBadge,
      badgeTone: "text-[#64b7ff] border-[rgba(60,160,255,0.35)] bg-[rgba(60,160,255,0.12)]",
      title: d.guidelines.coreRules.penaltyTitle,
      largeValue: "-1 / DQ",
      description: d.guidelines.coreRules.penaltyDesc,
      points: [
        d.guidelines.coreRules.penaltyItem1,
        d.guidelines.coreRules.penaltyItem2,
        d.guidelines.coreRules.penaltyItem3,
      ],
    },
  ];

  const matchSteps = [
    {
      step: "01",
      icon: Flag,
      title: d.guidelines.flow.step1Title,
      desc: d.guidelines.flow.step1Desc,
    },
    {
      step: "02",
      icon: HandFist,
      title: d.guidelines.flow.step2Title,
      desc: d.guidelines.flow.step2Desc,
    },
    {
      step: "03",
      icon: Swords,
      title: d.guidelines.flow.step3Title,
      desc: d.guidelines.flow.step3Desc,
    },
    {
      step: "04",
      icon: Medal,
      title: d.guidelines.flow.step4Title,
      desc: d.guidelines.flow.step4Desc,
    },
  ];

  const dosList =
    locale === "en"
      ? [
          "Straight punches, palm thrusts, or knife-hand strikes to the protective body vest.",
          "Dynamic, balanced roundhouse (sabit), push (jejeg), or spinning back kicks to the torso.",
          "Sweeps (sapuan tegak/rebah) and scissor takedowns (guntingan) executed cleanly without double-falling.",
          "Catching opponent's striking limb and completing a takedown within the 5.0-second limit.",
          "Parrying, blocking, and body evasions using authentic silat guard postures (sikap pasang).",
          "Adhere strictly to all referee signals and return to designated corner during the 1-minute rest interval.",
        ]
      : [
          "Pukulan lurus, sanggah, atau layang ke kawasan pelindung vest.",
          "Sepakan sabit, jejag, atau belakang yang bertenaga dan seimbang.",
          "Sapuan kaki rebah/tegak dan guntingan pinggang yang sempurna.",
          "Tangkapan anggota lawan dan sempurnakan jatuhan dalam masa 5 saat.",
          "Menangkis dan mengelak serangan dengan kaedah pasang silat.",
          "Patuhi setiap arahan wasit dan kembali ke sudut semasa rehat 1 minit.",
        ];

  const dontsList =
    locale === "en"
      ? [
          "Any strike to the head, face, neck, throat, or groin (Severe foul / Warning / Direct DQ).",
          "Slamming opponent's neck or head directly onto the mat (Pile-driver — Immediate Direct DQ).",
          "Striking, kicking, or stepping on an opponent who has already fallen to the canvas.",
          "Striking after the referee calls 'TI' / 'HENTI' or after the round gong sounds.",
          "Direct knee stomps or joint hyperextension strikes (Hyperextension kick).",
          "Passive stalling exceeding 10 seconds without offensive intent (Referee verbal caution).",
        ]
      : [
          "Sebarang serangan ke kepala, muka, leher atau kemaluan (Potongan keras / DQ).",
          "Menghempas kepala lawan terus ke matras (Pile-driver — Terus DQ).",
          "Memukul, menendang, atau memijak lawan yang sudah jatuh ke matras.",
          "Menyerang selepas wasit menyebut 'TI' atau selepas gong pusingan berbunyi.",
          "Menyerang sendi lutut lawan secara terus (Hyperextension kick).",
          "Pasif lebih 10 saat tanpa inisiatif serangan (Teguran lisan wasit).",
        ];

  return (
    <main className="guidelines-page min-h-screen relative text-slate-100">
      <SiteHeader currentPage="guidelines" />

      <GuidelinesMotion>
        <div className="guidelines-wrap max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-12">
          {/* HERO SECTION */}
          <section
            className="relative pt-2 sm:pt-4 pb-6 sm:pb-8 border-b border-white/[0.08] mb-8 sm:mb-10 overflow-visible flex flex-col items-center justify-center min-h-[460px] lg:min-h-[500px]"
            aria-labelledby="guidelines-title"
          >
            <div className="relative z-20 w-full max-w-3xl mx-auto lg:translate-x-32 xl:translate-x-44 2xl:translate-x-48 flex flex-col items-center text-center px-2 sm:px-4">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 text-[#f3f2f3] text-[10px] sm:text-xs font-bold tracking-[0.38em] uppercase">
                <span className="w-10 sm:w-16 h-[1.5px] bg-[#FF3845] shrink-0" />
                <span>{d.guidelines.overline}</span>
                <span className="w-10 sm:w-16 h-[1.5px] bg-[#FF3845] shrink-0" />
              </div>

              <h1 id="guidelines-title" className="hero-display-title text-center mb-3 overflow-visible">
                <span className="guidelines-title-line block overflow-visible pr-3 pe-3 title-white text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-athletic uppercase italic font-black tracking-tight leading-[0.88]">
                  {d.guidelines.titleLine1}
                </span>
                <span className="guidelines-title-line block overflow-visible pr-3 pe-3 title-crimson text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-athletic uppercase italic font-black tracking-tight leading-[0.88] mt-1">
                  {d.guidelines.titleLine2}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#D4D5D9] max-w-lg mx-auto font-normal leading-relaxed text-center">
                {d.guidelines.subtitle}
              </p>
            </div>

            {/* Desktop Flank Character — Upper Body (Waist Up) */}
            <div className="hidden lg:flex absolute -left-4 xl:-left-6 2xl:left-0 bottom-0 h-[400px] lg:h-[440px] xl:h-[470px] w-auto flex-col items-center justify-end z-10 pointer-events-none select-none">
              <div className="relative h-full w-auto flex items-end justify-center">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(225,6,0,0.5)_0%,_rgba(255,56,69,0.18)_45%,_transparent_72%)] blur-2xl"
                  aria-hidden="true"
                />
                <Image
                  src="/assets/fighterx/guidelines-referee-waist-up.png"
                  alt="Wasit Silat Antarabangsa PERSILAT"
                  width={600}
                  height={492}
                  priority
                  className="relative z-10 object-contain h-full w-auto max-h-[470px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter contrast-[1.05]"
                />
              </div>
            </div>
          </section>

          {/* Bulletin Notice */}
          <div className="guidelines-motion-item mb-8 p-4 rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-md flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3845] animate-pulse shrink-0" />
            <p className="text-xs text-[#C5C6CA] leading-relaxed">
              {d.guidelines.bulletinNotice}
            </p>
          </div>

          {/* SECTION 1: 4 QUICK RULES CARDS */}
          <section id="teras-peraturan" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "TECHNICAL SUMMARY" : "RINGKASAN TEKNIKAL"}
              title={isEn ? "4 Core Pillars of Silat Olahraga Rules" : "4 Tunjang Utama Peraturan Silat Olahraga"}
              subtitle={
                isEn
                  ? "Official standards every athlete, coach, and referee must master before stepping onto the arena mat."
                  : "Piawaian rasmi yang wajib difahami setiap pesilat, jurulatih dan wasit sebelum melangkah masuk ke gelanggang."
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 guidelines-card-grid">
              {quickRules.map((rule) => (
                <div
                  key={rule.title}
                  className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-5 sm:p-6 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col justify-between transition-all"
                >
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-3 border ${rule.badgeTone}`}>
                      {rule.badge}
                    </span>
                    <h3 className="text-lg font-bold font-athletic text-white uppercase mb-1">
                      {rule.title}
                    </h3>
                    <div className="font-athletic text-3xl font-extrabold text-[#ff4d5a] mb-2">
                      {rule.largeValue}
                    </div>
                    <p className="text-xs text-[#C5C6CA] leading-relaxed mb-4">
                      {rule.description}
                    </p>
                  </div>
                  <ul className="space-y-1.5 pt-3 border-t border-white/[0.08] text-[11px] text-slate-300">
                    {rule.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-1.5">
                        <Check size={12} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: 2 COMPETITION FORMATS */}
          <section id="format-pertandingan" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "TWO DISCIPLINES" : "DUA DISIPLIN"}
              title={isEn ? "Competition Formats: Silat Olahraga & Silat Seni" : "Format Acara: Silat Olahraga & Silat Seni"}
              subtitle={
                isEn
                  ? "Match duration, scoring systems, and judging criteria between Silat Olahraga and Silat Seni."
                  : "Perbezaan masa perlawanan, kiraan mata, dan kriteria penilaian antara Silat Olahraga dan Silat Seni."
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 guidelines-card-grid">
              {/* Silat Olahraga Card */}
              <div className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-mono text-[#ff4d5a] font-bold uppercase tracking-widest block mb-2">
                  {isEn ? "SILAT OLAHRAGA DISCIPLINE" : "KATEGORI SILAT OLAHRAGA"}
                </span>
                <h3 className="text-2xl font-bold font-athletic text-white uppercase mb-4">
                  {d.guidelines.formats.tandingTitle}
                </h3>
                <ul className="space-y-3 text-xs text-[#D4D5D9]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                    <span>{d.guidelines.formats.tandingRounds}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                    <span>{d.guidelines.formats.tandingWeight}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                    <span>{d.guidelines.formats.tandingGear}</span>
                  </li>
                </ul>
              </div>

              {/* Silat Seni Card */}
              <div className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-mono text-[#ffd24c] font-bold uppercase tracking-widest block mb-2">
                  {isEn ? "SILAT SENI DISCIPLINE" : "KATEGORI SILAT SENI"}
                </span>
                <h3 className="text-2xl font-bold font-athletic text-white uppercase mb-4">
                  {d.guidelines.formats.seniTitle}
                </h3>
                <ul className="space-y-3 text-xs text-[#D4D5D9]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#ffd24c] shrink-0 mt-0.5" />
                    <span>{d.guidelines.formats.seniCategories}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#ffd24c] shrink-0 mt-0.5" />
                    <span>{d.guidelines.formats.seniTime}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#ffd24c] shrink-0 mt-0.5" />
                    <span>{d.guidelines.formats.seniWeapon}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 2B: MATCH FLOW STEPS */}
          <section id="aliran-perlawanan" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "MATCH FLOW" : "ALIRAN PERLAWANAN"}
              title={d.guidelines.flow.title}
              subtitle={d.guidelines.flow.subtitle}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 guidelines-card-grid">
              {matchSteps.map(({ step, icon: Icon, title, desc }) => (
                <div
                  key={step}
                  className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-5 sm:p-6 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xl font-bold text-[#FF3845]">{step}</span>
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845]">
                        <Icon size={16} />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white font-athletic uppercase mb-1.5">
                      {title}
                    </h3>
                    <p className="text-xs text-[#C5C6CA] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: SCORING MATRIX & RUBRICS */}
          <section id="pemarkahan-rasmi" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "OFFICIAL SCORING ARCHITECTURE" : "STRUKTUR PEMARKAHAN RASMI"}
              title={isEn ? "PERSILAT 2026 Points & Rubric System" : "Sistem Mata & Rubrik PERSILAT 2026"}
              subtitle={
                isEn
                  ? "Standardized Silat Olahraga points for strikes, kicks, and takedowns, alongside official Silat Seni judging rubrics."
                  : "Pecahan mata Silat Olahraga bagi pukulan, tendangan dan jatuhan serta rubrik penilaian juri untuk Silat Seni."
              }
            />

            <div className="guidelines-motion-item">
              <ScoringMatrixView />
            </div>
          </section>

          {/* SECTION 4: DOS & DON'TS */}
          <section id="zon-sasaran" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "ARENA CONDUCT" : "TATATERTIB GELANGGANG"}
              title={d.guidelines.dosAndDonts.title}
              subtitle={d.guidelines.dosAndDonts.subtitle}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 guidelines-card-grid">
              {/* DOS */}
              <div className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.08]">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/12 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase block">
                      {isEn ? "LEGAL ACTIONS" : "TINDAKAN SAH"}
                    </span>
                    <h3 className="text-xl font-bold text-white font-athletic uppercase">
                      {d.guidelines.dosAndDonts.legalTitle}
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {dosList.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                      <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DON'TS */}
              <div className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.08]">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a]">
                    <XCircle size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#ff4d5a] uppercase block">
                      {isEn ? "SEVERE FOULS" : "PELANGGARAN KERAS"}
                    </span>
                    <h3 className="text-xl font-bold text-white font-athletic uppercase">
                      {d.guidelines.dosAndDonts.illegalTitle}
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {dontsList.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                      <X size={15} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 5: PENALTY LADDER */}
          <section id="tatatertib-wasit" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "REFEREE ACTIONS" : "TINDAKAN WASIT"}
              title={d.guidelines.penalties.title}
              subtitle={d.guidelines.penalties.subtitle}
            />

            <div className="guidelines-motion-item rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <h3 className="text-lg font-bold text-white font-athletic uppercase mb-4">
                {isEn ? "PERSILAT 2026 Silat Olahraga Penalty Points Ladder" : "Tangga Potongan Mata Silat Olahraga PERSILAT 2026"}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 guidelines-motion-chips">
                <div className="guidelines-card p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#A6A7AD] uppercase block">
                    {isEn ? "CAUTION" : "BIMBINGAN"}
                  </span>
                  <div className="font-athletic text-2xl font-bold text-white my-1">0 pts</div>
                  <small className="text-[10px] text-[#A6A7AD] block">
                    {isEn ? "Verbal caution" : "Bimbingan lisan"}
                  </small>
                </div>
                <div className="guidelines-card p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ffd24c] uppercase block">
                    {isEn ? "REPRIMAND I" : "TEGURAN I"}
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ffd24c] my-1">−1 pt</div>
                  <small className="text-[10px] text-[#A6A7AD] block">
                    {isEn ? "Minor foul" : "Kesalahan ringan"}
                  </small>
                </div>
                <div className="guidelines-card p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ffd24c] uppercase block">
                    {isEn ? "REPRIMAND II" : "TEGURAN II"}
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ffd24c] my-1">−2 pts</div>
                  <small className="text-[10px] text-[#A6A7AD] block">
                    {isEn ? "Second foul" : "Kesalahan kedua"}
                  </small>
                </div>
                <div className="guidelines-card p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ff9e42] uppercase block">
                    {isEn ? "WARNING I" : "PERINGATAN I"}
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ff9e42] my-1">−5 pts</div>
                  <small className="text-[10px] text-[#A6A7AD] block">
                    {isEn ? "Tactical foul" : "Kesalahan taktikal"}
                  </small>
                </div>
                <div className="guidelines-card p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ff6b76] uppercase block">
                    {isEn ? "WARNING II" : "PERINGATAN II"}
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ff6b76] my-1">−10 pts</div>
                  <small className="text-[10px] text-[#A6A7AD] block">
                    {isEn ? "Final warning" : "Amaran keras"}
                  </small>
                </div>
                <div className="guidelines-card p-3.5 rounded-xl border border-[rgba(255,56,69,0.4)] bg-[rgba(255,56,69,0.08)] hover:bg-[rgba(255,56,69,0.12)] backdrop-blur-md text-center shadow-[0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ff8088] uppercase block">
                    {isEn ? "WARNING III" : "PERINGATAN III"}
                  </span>
                  <div className="font-athletic text-2xl font-extrabold text-[#ff4d5a] my-1">DQ</div>
                  <small className="text-[10px] text-[#ff8088] block font-semibold">
                    {isEn ? "Disqualified" : "Dibatalkan (DQ)"}
                  </small>
                </div>
              </div>

              {/* Direct DQ Alert Box */}
              <div className="guidelines-card rounded-xl border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.05)] p-4 sm:p-5 flex items-start gap-3.5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <BadgeAlert size={22} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs sm:text-sm font-bold block mb-1">
                    {d.guidelines.penalties.dqNoticeTitle}
                  </strong>
                  <p className="text-[11px] sm:text-xs text-[#ffccd0] leading-relaxed">
                    {d.guidelines.penalties.dqNoticeBody}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: RULEBOOK EXPLORER */}
          <section id="carian-peraturan" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "PERSILAT DATABASE" : "PANGKALAN DATA PERSILAT"}
              title={isEn ? "Tournament Rules & Weight Class Search" : "Carian Peraturan Kejohanan &amp; Kelas Berat"}
              subtitle={
                isEn
                  ? "Search official regulations, VAR protest card protocols, and official weight division tables."
                  : "Cari secara pantas mana-mana ketetapan undang-undang, protokol kad protes VAR, dan jadual had berat rasmi."
              }
            />
            <div className="guidelines-motion-item">
              <RulebookExplorer />
            </div>
          </section>

          {/* SECTION 7: CHECKLIST */}
          <section id="senarai-semak" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge={isEn ? "ARENA CHECKLIST" : "SENARAI SEMAK GELANGGANG"}
              title={d.guidelines.checklist.title}
              subtitle={d.guidelines.checklist.subtitle}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 guidelines-card-grid">
              {/* Checklist Athlete */}
              <div className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.035] hover:border-white/[0.15] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono text-[#ff4d5a] font-bold uppercase">
                    {isEn ? "FOR ATHLETES" : "UNTUK ATLET"}
                  </span>
                  <h3 className="text-lg font-bold text-white font-athletic uppercase">
                    {d.guidelines.checklist.athleteTab}
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Bring original identity card (MyKad) or passport for identity and age verification."
                        : "Bawa kad pengenalan (MyKad) atau pasport asal untuk pengesahan identiti dan umur."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Prepare valid medical certificate. Senior & Junior female athletes must declare non-pregnancy."
                        : "Sediakan sijil perubatan sah. Atlet wanita Senior & Junior wajib deklarasi tidak hamil."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Mandatory weigh-in every morning of the match; zero weight tolerance (0.00 kg)."
                        : "Wajib timbang berat setiap pagi perlawanan; tiada sebarang toleransi berat (0.00 kg)."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Use mandatory groin guard, shin guards, and mouthguard (especially if wearing dental braces)."
                        : "Gunakan pelindung kemaluan (groin guard), pelindung tulang kering (shin guards), dan mouthguard jika berpendakap gigi."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Nails must be cut short; any finger taping requires tournament doctor authorization."
                        : "Kuku mesti pendek; sebarang taping jari mesti mendapat kebenaran doktor kejohanan."}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Checklist Coach */}
              <div className="guidelines-card rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.035] hover:border-white/[0.15] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono text-[#ffd24c] font-bold uppercase">
                    {isEn ? "FOR COACHES" : "UNTUK JURULATIH"}
                  </span>
                  <h3 className="text-lg font-bold text-white font-athletic uppercase">
                    {d.guidelines.checklist.coachTab}
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Maximum 2 certified coaches in Silat Olahraga corner wearing official black silat uniform."
                        : "Maksimum 2 jurulatih bertauliah di sudut Silat Olahraga berpakaian seragam hitam rasmi silat."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Technical instructions may only be communicated during the 1-minute rest interval between rounds."
                        : "Arahan teknikal hanya boleh disampaikan ketika rehat 1 minit antara pusingan."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn ? (
                        <><strong>VAR Silat Olahraga:</strong> 2 protest cards per match (3 rounds); card returned if video review is successful.</>
                      ) : (
                        <><strong>VAR Silat Olahraga:</strong> 2 kad protes setiap perlawanan (3 pusingan); kad dipulangkan jika semakan video berjaya.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn ? (
                        <><strong>VAR Silat Seni:</strong> 1 protest card per performance before winner is declared; fact-checking penalties only.</>
                      ) : (
                        <><strong>VAR Silat Seni:</strong> 1 kad protes bagi setiap persembahan sebelum pemenang diumumkan; hanya untuk semakan fakta hukuman.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "Cards must be raised immediately following incident before bout restarts with MULAI command."
                        : "Kad mesti diangkat serta-merta selepas kejadian sebelum perlawanan dimulakan semula dengan arahan MULAI."}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 8: OFFICIAL DISCLAIMER */}
          <div className="guidelines-motion-item">
            <OfficialDisclaimer />
          </div>
        </div>
      </GuidelinesMotion>
    </main>
  );
}
