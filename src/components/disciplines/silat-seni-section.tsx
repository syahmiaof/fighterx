"use client";

import { useState } from "react";
import { SENI_CATEGORIES } from "@/components/disciplines/disciplines-data";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";

export function SilatSeniSection() {
  const [activeCategory, setActiveCategory] = useState<string>("tunggal");

  const category = SENI_CATEGORIES.find((c) => c.id === activeCategory) || SENI_CATEGORIES[0];

  return (
    <section id="silat-seni" className="py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(240,180,40,0.35)] bg-[rgba(240,180,40,0.12)] text-[#ffd24c] text-xs font-bold uppercase tracking-wider mb-2">
            <Award size={13} /> Disiplin Silat Seni
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "var(--font-athletic)" }}
          >
            WARISAN &amp; <span className="text-amber-500">JURUS BAKU KEBANGSAAN</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Silat Seni mengangkat ketinggian martabat pusaka warisan Melayu melalui kesempurnaan gerak, ketajaman mata bilah, dan keharmonian jiwa pahlawan.
          </p>

          {/* 4 Category Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2" role="tablist">
            {SENI_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                      : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:-translate-y-0.5"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Detail Box */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Top metadata strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd24c]">
                Kategori Rasmi PERSILAT
              </span>
              <h3
                className="text-2xl sm:text-3xl font-display font-bold uppercase text-white mt-0.5"
                style={{ fontFamily: "var(--font-athletic)" }}
              >
                {category.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">{category.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 text-xs text-[#a5a6ad] backdrop-blur-sm">
                <Users size={14} className="text-[#ffd24c]" />
                <span>{category.participants}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 text-xs text-[#a5a6ad] backdrop-blur-sm">
                <Clock size={14} className="text-[#ff4d5a]" />
                <span>Masa: {category.duration}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed max-w-4xl mb-6">
            {category.overview}
          </p>

          {/* Highlights */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {category.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-[#d1d1d5] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <CheckCircle2 size={15} className="text-[#ffd24c] flex-none mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* Tunggal 100 Jurus 3-Phase Interactive Breakdown */}
          {category.phases && (
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#ffd24c]" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  Rangkaian 100 Jurus Baku Tunggal (3 Fasa)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.phases.map((phase) => (
                  <div
                    key={phase.title}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[12px] p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[rgba(240,180,40,0.4)] hover:bg-white/[0.04] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[rgba(240,180,40,0.12)] text-[#ffd24c] border border-[rgba(240,180,40,0.35)]">
                          {phase.range}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          {phase.count} Gerakan
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-white mb-1">{phase.title}</h5>
                      <p className="text-[11px] font-semibold text-[#ffd24c]/90 mb-2">
                        Senjata: {phase.weapon}
                      </p>
                      <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                        {phase.description}
                      </p>
                    </div>

                    <div className="border-t border-white/[0.06] pt-2.5 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Teknik Kunci:
                      </p>
                      <ul className="text-[11px] text-neutral-300 list-disc pl-4 space-y-0.5">
                        {phase.keyTechniques.map((tech, tIdx) => (
                          <li key={tIdx}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rubrics: Kebenaran vs Kemantapan & Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[12px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffd24c] flex items-center gap-2 mb-3">
                <Award size={15} /> Rubrik Pemarkahan Juri (PERSILAT)
              </h4>
              <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.06] text-xs text-[#d1d1d5] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="font-bold text-white mb-1">1. Nilai Kebenaran (Accuracy)</p>
                  <p>{category.rubrics.kebenaran}</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.06] text-xs text-[#d1d1d5] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="font-bold text-white mb-1">2. Nilai Kemantapan (Expression &amp; Power)</p>
                  <p>{category.rubrics.kemantapan}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-[rgba(255,56,69,0.04)] backdrop-blur-[12px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,56,69,0.08)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#ff4d5a] flex items-center gap-2 mb-3">
                <AlertTriangle size={15} /> Peraturan Pemotongan Mata &amp; Penalti
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                {category.rubrics.deductions.map((deduct, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="text-[#ff4d5a] font-bold flex-none">•</span>
                    <span>{deduct}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
