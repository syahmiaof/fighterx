"use client";

import { useState } from "react";
import {
  EQUIPMENT_LIST,
  type EquipmentItem,
} from "@/components/disciplines/disciplines-data";
import { Award, BookOpen, ShieldCheck, Swords } from "lucide-react";

export function EquipmentBreakdown() {
  const [filterType, setFilterType] = useState<"ALL" | "SENI" | "OLAHRAGA">("ALL");

  const filteredItems = EQUIPMENT_LIST.filter((item) => {
    if (filterType === "ALL") return true;
    return item.category === filterType;
  });

  return (
    <section id="equipment" className="py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={13} /> Peralatan &amp; Keselamatan Atlet
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "var(--font-athletic)" }}
          >
            PERALATAN RASMI &amp; <span className="text-red-600">STANDARD PERSILAT</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Setiap senjata seni dan peralatan perlindungan tanding wajib mematuhi spesifikasi ketat PERSILAT 2026 demi keselamatan atlet dan ketulenan persembahan.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterType === "ALL"
                  ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:-translate-y-0.5"
              }`}
            >
              Semua Peralatan ({EQUIPMENT_LIST.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("SENI")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterType === "SENI"
                  ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:-translate-y-0.5"
              }`}
            >
              Peralatan Silat Seni
            </button>
            <button
              type="button"
              onClick={() => setFilterType("OLAHRAGA")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterType === "OLAHRAGA"
                  ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  : "bg-white/[0.035] backdrop-blur-[8px] border border-white/[0.08] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:-translate-y-0.5"
              }`}
            >
              Peralatan Silat Olahraga
            </button>
          </div>
        </div>

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item: EquipmentItem) => {
            const isSeni = item.category === "SENI";
            return (
              <div
                key={item.id}
                className="rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isSeni
                          ? "bg-[rgba(240,180,40,0.12)] text-[#ffd24c] border border-[rgba(240,180,40,0.35)]"
                          : "bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] border border-[rgba(255,56,69,0.35)]"
                      }`}
                    >
                      {isSeni ? <Award size={11} /> : <Swords size={11} />}
                      {isSeni ? "Silat Seni" : "Silat Olahraga"}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-neutral-500">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    {item.purpose}
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Spesifikasi Teknikal:
                    </span>
                    <p className="text-[11px] text-neutral-300 leading-snug mt-0.5">
                      {item.specs}
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-neutral-400 pt-1">
                    <BookOpen size={12} className="flex-none mt-0.5 text-neutral-400" />
                    <span>{item.ruleCitation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
