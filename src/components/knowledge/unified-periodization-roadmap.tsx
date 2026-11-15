"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Target,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  ArrowRight,
  User,
} from "lucide-react";
import {
  MASTER_FRAMEWORK_MONTHS,
  BASELINE_ASSESSMENTS,
  COMPETITION_POLICIES,
  FrameworkMonth,
} from "./knowledge-data";
import { useLanguage } from "@/lib/i18n";

export function UnifiedPeriodizationRoadmap() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeBlock, setActiveBlock] = useState<1 | 2>(1);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1);
  const [activeSubView, setActiveSubView] = useState<"months" | "baseline" | "policy">("months");

  const filteredMonths = MASTER_FRAMEWORK_MONTHS.filter((m) => m.block === activeBlock);

  const toggleMonth = (mIdx: number) => {
    setExpandedMonth((prev) => (prev === mIdx ? null : mIdx));
  };

  return (
    <section id="pelan-periodisasi-2027" className="py-14 border-b border-white/[0.08] scroll-mt-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF3845]/40 bg-[#FF3845]/10 text-[#FF3845] text-xs font-bold tracking-wider uppercase mb-2">
              <Target size={13} />
              <span>{isEn ? "52-WEEK NATIONAL FRAMEWORK 2027" : "KERANGKA PERIODISASI KEBANGSAAN 2027"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-athletic uppercase tracking-wide text-white">
              {isEn ? "Unified Annual Training Roadmap" : "Roadmap Latihan Tahunan 52-Minggu"}
            </h2>
            <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1.5 max-w-2xl leading-relaxed">
              {isEn
                ? "A structured 6 + 6 month periodisation cycle harmonising home routines, gym S&C, and arena sparring per ISN and PERSILAT 2026 standards."
                : "Kitaran 6 + 6 bulan yang menyelaraskan latihan kendiri di rumah, gimnasium, dan gelanggang mengikut piawaian ISN dan PERSILAT 2026."}
            </p>
          </div>

          {/* Sub-View Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubView("months")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === "months"
                  ? "bg-[#E10600] text-white shadow-sm"
                  : "text-[#8E9099] hover:text-white"
              }`}
            >
              {isEn ? "12-Month Calendar" : "Kalendar 12-Bulan"}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView("baseline")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === "baseline"
                  ? "bg-[#E10600] text-white shadow-sm"
                  : "text-[#8E9099] hover:text-white"
              }`}
            >
              {isEn ? "6 Baseline Tests" : "6 Ujian Baseline"}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView("policy")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === "policy"
                  ? "bg-[#E10600] text-white shadow-sm"
                  : "text-[#8E9099] hover:text-white"
              }`}
            >
              {isEn ? "Tournament Tapering Policy" : "Polisi Tapering Kejohanan"}
            </button>
          </div>
        </div>

        {/* VIEW 1: 12-MONTH CALENDAR (BLOK 1 vs BLOK 2) */}
        {activeSubView === "months" && (
          <div className="space-y-6">
            {/* Block 1 / Block 2 Selector Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveBlock(1);
                  setExpandedMonth(1);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md flex items-center justify-between ${
                  activeBlock === 1
                    ? "bg-white/[0.07] border-[#E10600]/50 shadow-[0_0_20px_rgba(225,6,0,0.15)] ring-1 ring-[#E10600]"
                    : "bg-white/[0.025] border-white/[0.08] hover:bg-white/[0.04]"
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    FASA 1 · BULAN 1 HINGGA 6
                  </span>
                  <h3 className="text-base font-bold font-athletic text-white uppercase">
                    Blok 1: Asas Kecergasan &amp; Kekuatan Fizikal
                  </h3>
                  <p className="text-xs text-[#A2A3AA]">Januari – Jun 2027 (Kecergasan aerobik, teras &amp; mobiliti)</p>
                </div>
                <span className="font-athletic text-2xl font-black text-white px-3 py-1 rounded-lg bg-black/40 border border-white/10 shrink-0 ml-2">
                  BLOK 1
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveBlock(2);
                  setExpandedMonth(7);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md flex items-center justify-between ${
                  activeBlock === 2
                    ? "bg-white/[0.07] border-[#E10600]/50 shadow-[0_0_20px_rgba(225,6,0,0.15)] ring-1 ring-[#E10600]"
                    : "bg-white/[0.025] border-white/[0.08] hover:bg-white/[0.04]"
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF4D5A] block mb-1">
                    FASA 2 · BULAN 7 HINGGA 12
                  </span>
                  <h3 className="text-base font-bold font-athletic text-white uppercase">
                    Blok 2: Pra-Kejohanan &amp; Kemuncak Prestasi (Peaking)
                  </h3>
                  <p className="text-xs text-[#A2A3AA]">Julai – Disember 2027 (Kuasa anaerobik, taktikal &amp; taper)</p>
                </div>
                <span className="font-athletic text-2xl font-black text-white px-3 py-1 rounded-lg bg-black/40 border border-white/10 shrink-0 ml-2">
                  BLOK 2
                </span>
              </button>
            </div>

            {/* 6 Months Accordion Cards */}
            <div className="space-y-3">
              {filteredMonths.map((m) => {
                const isExpanded = expandedMonth === m.monthIndex;

                return (
                  <div
                    key={m.monthIndex}
                    className={`rounded-2xl border transition-all backdrop-blur-[16px] overflow-hidden ${
                      isExpanded
                        ? "bg-white/[0.04] border-white/20 shadow-xl"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/10"
                    }`}
                  >
                    {/* Header Row */}
                    <button
                      type="button"
                      onClick={() => toggleMonth(m.monthIndex)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="font-athletic text-2xl sm:text-3xl font-black text-white px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 shrink-0">
                          {m.monthCode}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm sm:text-base font-bold font-athletic text-white uppercase tracking-wide">
                              {m.monthName}: {m.theme}
                            </span>
                            {m.highlightTag && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E10600]/20 text-[#FF555A] border border-[#E10600]/40">
                                {m.highlightTag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#A2A3AA] line-clamp-1">{m.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Vol / Intensity Bar Badges */}
                        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#C5C6CA]">
                          <span>Vol: <strong className="text-white">{m.volumePercentage}%</strong></span>
                          <span>•</span>
                          <span>Intensiti: <strong className="text-[#FF4D5A]">{m.intensityPercentage}%</strong></span>
                        </div>
                        {isExpanded ? <ChevronUp size={18} className="text-[#FF4D5A]" /> : <ChevronDown size={18} className="text-[#8E9099]" />}
                      </div>
                    </button>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-white/[0.06] space-y-4 text-xs">
                        {/* Focus Areas Pills */}
                        <div>
                          <span className="text-[10px] font-mono text-[#8E9099] uppercase tracking-wider block mb-1.5 font-bold">
                            FOKUS LATIHAN UTAMA:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {m.focusAreas.map((f, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-slate-200 text-xs"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Dual Column: Tugasan Atlet vs Panduan Jurulatih */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {/* Atlet Column */}
                          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                            <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2 mb-2 font-athletic">
                              <User size={13} className="text-[#FF4D5A]" />
                              <span>Tugasan Atlet (Kendiri &amp; Rumah):</span>
                            </h4>
                            <ul className="space-y-1.5 text-[11px] text-[#C5C6CA]">
                              {m.fighterxTasks.athlete.map((task, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Coach Column */}
                          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                            <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2 mb-2 font-athletic">
                              <ShieldCheck size={13} className="text-amber-400" />
                              <span>Tindakan Jurulatih &amp; Semakan:</span>
                            </h4>
                            <ul className="space-y-1.5 text-[11px] text-[#C5C6CA]">
                              {m.fighterxTasks.coach.map((task, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Milestone Footnote */}
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-[#8E9099]">
                          <span>
                            <strong>Pencapaian Akhir Bulan:</strong> {m.milestone}
                          </span>
                          {m.reviewGate && (
                            <span className="font-bold text-amber-300">
                              🔒 {m.reviewGate}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: 6 BASELINE PHYSICAL TESTS */}
        {activeSubView === "baseline" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#E10600]/10 border border-[#E10600]/30 text-xs text-[#D4D5D9] flex items-center justify-between">
              <span>
                <strong>Bateri Ujian Standard ISN:</strong> Diuji secara berkala setiap 6–8 minggu untuk mengukur kemajuan kardiovaskular, daya tahan otot, dan mobiliti.
              </span>
              <span className="font-mono text-[11px] font-bold text-[#FF4D5A]">
                6 Penilaian Disahkan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BASELINE_ASSESSMENTS.map((test) => (
                <div
                  key={test.id}
                  className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        {test.session.split(" ")[0]} {test.session.split(" ")[1]}
                      </span>
                      <span className="text-xs text-[#8E9099] font-mono font-bold">{test.unit}</span>
                    </div>

                    <h4 className="text-base font-bold font-athletic text-white uppercase mb-1">
                      {test.title}
                    </h4>
                    <p className="text-xs text-[#A2A3AA] leading-relaxed mb-4">
                      {test.protocolSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono text-[#8E9099] uppercase tracking-wider block mb-2 font-bold">
                      GRED PENILAIAN ISN:
                    </span>
                    <div className="space-y-1">
                      {test.scoringRubric.slice(0, 3).map((r, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className="text-[#C5C6CA]">{r.tier}:</span>
                          <strong className="text-white font-mono">{r.standard}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: TOURNAMENT TAPERING POLICY */}
        {activeSubView === "policy" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPETITION_POLICIES.map((policy) => (
              <div
                key={policy.priority}
                className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${policy.badgeColor}`}>
                      PRIORITI {policy.priority}
                    </span>
                    <span className="text-xs text-[#8E9099] font-bold">{policy.type}</span>
                  </div>

                  <h4 className="text-lg font-bold font-athletic text-white uppercase mb-2">
                    {policy.label}
                  </h4>

                  <div className="space-y-2 text-xs text-[#A2A3AA] mb-4">
                    <p><strong>Sasaran:</strong> {policy.targetEvents.join(", ")}</p>
                    <p><strong>Protokol Taper:</strong> {policy.taperProtocol}</p>
                    <p><strong>Pelarasan Beban:</strong> {policy.loadAdjustment}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono text-[#8E9099] uppercase tracking-wider block mb-2 font-bold">
                    PERATURAN MINGGU PERLAWANAN:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-[#C5C6CA]">
                    {policy.fightWeekRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 size={12} className="text-[#FF4D5A] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
