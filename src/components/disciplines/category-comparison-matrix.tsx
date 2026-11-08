"use client";

import { useState } from "react";
import { COMPARISON_MATRIX } from "@/components/disciplines/disciplines-data";
import { Award, Scale, Swords } from "lucide-react";

export function CategoryComparisonMatrix() {
  const [viewMode, setViewMode] = useState<"ALL" | "SENI" | "OLAHRAGA">("ALL");

  return (
    <section id="overview" className="py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-wider mb-2">
            <Scale size={13} /> Matriks Perbandingan Komprehensif
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "var(--font-athletic)" }}
          >
            SILAT SENI VS. <span className="text-red-600">SILAT OLAHRAGA</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Perbandingan mendalam antara dua cabang utama sukan silat moden bagi memahami keunikan objektif latihan, peraturan kejohanan, dan profil kecergasan atlet.
          </p>

          {/* Toggle buttons */}
          <div className="mt-5 inline-flex p-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-[12px]">
            <button
              type="button"
              onClick={() => setViewMode("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                viewMode === "ALL"
                  ? "bg-[#e10600] border border-[#ff3845] text-white font-bold shadow-[0_0_14px_rgba(225,6,0,0.4)]"
                  : "text-[#b5b6bc] font-semibold hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              Semua Ciri (Bandingan)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("SENI")}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                viewMode === "SENI"
                  ? "bg-[#e10600] border border-[#ff3845] text-white font-bold shadow-[0_0_14px_rgba(225,6,0,0.4)]"
                  : "text-[#b5b6bc] font-semibold hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              Fokus Seni Sahaja
            </button>
            <button
              type="button"
              onClick={() => setViewMode("OLAHRAGA")}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                viewMode === "OLAHRAGA"
                  ? "bg-[#e10600] border border-[#ff3845] text-white font-bold shadow-[0_0_14px_rgba(225,6,0,0.4)]"
                  : "text-[#b5b6bc] font-semibold hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              Fokus Olahraga Sahaja
            </button>
          </div>
        </div>

        {/* Comparison Cards / Table Layout */}
        <div className="space-y-3">
          {COMPARISON_MATRIX.map((item, idx) => (
            <div
              key={item.feature}
              className="rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.4)] flex items-center justify-center text-[10px] font-bold text-[#ff4d5a]">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  {item.feature}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {(viewMode === "ALL" || viewMode === "SENI") && (
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[rgba(240,180,40,0.3)] transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Award size={14} className="text-[#ffd24c]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ffd24c]">
                        Silat Seni
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {item.seni}
                    </p>
                  </div>
                )}

                {(viewMode === "ALL" || viewMode === "OLAHRAGA") && (
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[rgba(255,56,69,0.3)] transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Swords size={14} className="text-[#ff4d5a]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d5a]">
                        Silat Olahraga
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {item.olahraga}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
