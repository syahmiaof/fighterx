"use client";

import React, { useState } from "react";
import { Calendar, ChevronRight, Flag, Target } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/admin-badge";

export interface Timeline52WeeksProps {
  activeWeek: number;
  totalWeeks?: number;
  onSelectWeek?: (weekNumber: number) => void;
  selectedWeekNumber?: number;
}

interface WeekMetadata {
  week: number;
  phase: "Phase 1: Jan - Jun" | "Phase 2: Jul - Dis";
  month: string;
  focusTitle: string;
  intensityTier: "Asas" | "Sederhana" | "Tinggi" | "Puncak" | "Pemulihan";
  modeHint: "Normal" | "Pre-Competition" | "Competition Week" | "Recovery";
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mac", "Apr", "Mei", "Jun",
  "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"
];

function generateWeekData(): WeekMetadata[] {
  return Array.from({ length: 52 }, (_, i) => {
    const week = i + 1;
    const isPhase1 = week <= 26;
    const monthIndex = Math.min(11, Math.floor((week - 1) / 4.33));
    const month = MONTH_NAMES[monthIndex];

    let intensityTier: "Asas" | "Sederhana" | "Tinggi" | "Puncak" | "Pemulihan" = "Sederhana";
    let modeHint: "Normal" | "Pre-Competition" | "Competition Week" | "Recovery" = "Normal";
    let focusTitle = "";

    if (week === 12) {
      intensityTier = "Tinggi";
      modeHint = "Normal";
      focusTitle = "Mikrosiklus 12: Pengukuhan Daya Tahan Kardiovaskular & Kuda-Kuda Rendah";
    } else if (week <= 8) {
      intensityTier = "Asas";
      modeHint = "Normal";
      focusTitle = `Fasa Asas Fizikal (M${week}): Peningkatan Aerobik & Kekuatan Teras Isometrik`;
    } else if (week <= 24) {
      intensityTier = "Tinggi";
      modeHint = "Normal";
      focusTitle = `Fasa Asas Lanjutan (M${week}): Kelajuan Langkah 8 Arah & Ketangkasan Sapuan`;
    } else if (week === 25 || week === 26) {
      intensityTier = "Pemulihan";
      modeHint = "Recovery";
      focusTitle = `Penilaian Pertengahan Tahun & Pemulihan Aktif (M${week})`;
    } else if (week >= 36 && week <= 40) {
      intensityTier = "Puncak";
      modeHint = "Pre-Competition";
      focusTitle = `Fasa Pra-Pertandingan Kebangsaan (M${week}): Simulasi Bouts & Jurus Seragam`;
    } else if (week === 41 || week === 42) {
      intensityTier = "Puncak";
      modeHint = "Competition Week";
      focusTitle = `Kejuaraan Kebangsaan Silat 2027 (M${week}) — Tapering & Match Readiness`;
    } else if (week >= 50) {
      intensityTier = "Pemulihan";
      modeHint = "Recovery";
      focusTitle = `Transisi Akhir Tahun (M${week}): Pemulihan Holistik & Ujian Kecergasan`;
    } else {
      intensityTier = "Tinggi";
      modeHint = "Normal";
      focusTitle = `Fasa Taktikal Sukan (M${week}): Kombinasi Tendangan T & Pemilihan Senjata`;
    }

    return {
      week,
      phase: isPhase1 ? "Phase 1: Jan - Jun" : "Phase 2: Jul - Dis",
      month,
      focusTitle,
      intensityTier,
      modeHint,
    };
  });
}

export function Timeline52Weeks({
  activeWeek = 12,
  onSelectWeek,
  selectedWeekNumber,
}: Timeline52WeeksProps) {
  const [internalSelectedWeek, setInternalSelectedWeek] = useState<number>(activeWeek);
  const currentSelectedWeek = selectedWeekNumber ?? internalSelectedWeek;
  const weeksData = generateWeekData();
  const activeWeekInfo = weeksData[currentSelectedWeek - 1] || weeksData[0];

  const handleWeekClick = (weekNum: number) => {
    setInternalSelectedWeek(weekNum);
    onSelectWeek?.(weekNum);
  };

  return (
    <div className="bg-[#17191E] border border-[#27272A] rounded-xl p-5 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E10600]" />
              Garisan Masa Periodisasi Tahunan 2027 (52 Minggu)
            </span>
            <AdminBadge variant="accent" size="sm">
              FighterX 2027 Framework
            </AdminBadge>
          </div>
          <p className="text-xs text-[#96989F]">
            Visualisasi makrosiklus tahunan dari Minggu 1 hingga Minggu 52 merangkumi Fasa 1 (Jan - Jun) dan Fasa 2 (Jul - Dis).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs bg-[#202126] px-3 py-1.5 rounded-lg border border-[#37383D]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E10600] animate-pulse" />
            <span className="text-white font-semibold">M{activeWeek}</span>
            <span className="text-[#96989F]">(Aktif Semasa)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-[#202126] px-3 py-1.5 rounded-lg border border-[#37383D]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
            <span className="text-[#E5E5E7]">Terpilih: M{currentSelectedWeek}</span>
          </div>
        </div>
      </div>

      {/* Phase Headers (Phase 1 vs Phase 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#121316] border border-[#38BDF8]/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-[#38BDF8] flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5" /> FASA 1: ASAS FIZIKAL & KEMAHIRAN ASAS
            </span>
            <span className="text-[11px] text-[#96989F]">Januari – Jun (M1 - M26)</span>
          </div>
          <p className="text-[11px] text-[#C5C6CA]">
            Kapasiti aerobik, VO2 Max, kekuatan teras isometrik, mobiliti pergelangan sendi & jurus tapak asas silat.
          </p>
        </div>

        <div className="bg-[#121316] border border-[#E10600]/25 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-[#FF4D58] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> FASA 2: SPESIFIK SUKAN & TAKTIKAL TEMPUR
            </span>
            <span className="text-[11px] text-[#96989F]">Julai – Disember (M27 - M52)</span>
          </div>
          <p className="text-[11px] text-[#C5C6CA]">
            Taktikal perlawanan Olahraga, kombat counter-attack, jurus senjata seni (golok/toya), dan simulasi kejohanan.
          </p>
        </div>
      </div>

      {/* 52-Week Visual Matrix */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#96989F] mb-2 px-1">
          <span>Minggu 1</span>
          <span className="text-[#38BDF8] font-semibold">Pemisah Pertengahan Fasa (M26/M27)</span>
          <span>Minggu 52</span>
        </div>

        <div className="grid grid-cols-13 sm:grid-cols-26 lg:grid-cols-52 gap-1 bg-[#101115] p-2.5 rounded-lg border border-[#27272A] overflow-x-auto">
          {weeksData.map((item) => {
            const isActive = item.week === activeWeek;
            const isSelected = item.week === currentSelectedWeek;
            const isPhase1 = item.week <= 26;

            let bgClass = "bg-[#1E2026] text-[#96989F] hover:bg-[#2A2C35] hover:text-white";
            let borderClass = "border-transparent";

            if (isActive) {
              bgClass = "bg-[#E10600] text-white font-extrabold shadow-[0_0_10px_rgba(225,6,0,0.6)]";
              borderClass = "border-[#FF555A]";
            } else if (isSelected) {
              bgClass = "bg-[#38BDF8] text-[#08090B] font-bold";
              borderClass = "border-white";
            } else if (isPhase1) {
              borderClass = "border-[#38BDF8]/15";
            } else {
              borderClass = "border-[#E10600]/20";
            }

            return (
              <button
                key={item.week}
                type="button"
                onClick={() => handleWeekClick(item.week)}
                title={`Minggu ${item.week} (${item.month}): ${item.focusTitle}`}
                className={`h-9 min-w-[20px] rounded flex flex-col items-center justify-center text-[10px] border transition-all duration-150 cursor-pointer ${bgClass} ${borderClass}`}
              >
                <span>{item.week}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Week Inspector Detail Card */}
      {activeWeekInfo && (
        <div className="bg-[#121316] border border-[#37383D] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#27272A] text-white">
                Minggu {activeWeekInfo.week} / 52 ({activeWeekInfo.month})
              </span>
              <span className="text-xs text-[#38BDF8] font-semibold">
                {activeWeekInfo.phase}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  activeWeekInfo.intensityTier === "Puncak"
                    ? "bg-[#E10600]/20 text-[#FF4D58] border-[#FF4D58]/40"
                    : activeWeekInfo.intensityTier === "Tinggi"
                    ? "bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40"
                    : activeWeekInfo.intensityTier === "Pemulihan"
                    ? "bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40"
                    : "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40"
                }`}
              >
                Intensiti: {activeWeekInfo.intensityTier}
              </span>
              {activeWeekInfo.week === activeWeek && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E10600] text-white animate-pulse">
                  Minggu Aktif Semasa
                </span>
              )}
            </div>

            <h5 className="text-sm font-semibold text-white">
              {activeWeekInfo.focusTitle}
            </h5>
            <p className="text-xs text-[#96989F]">
              Diselaraskan dengan jadual mikrosiklus mingguan (Isnin hingga Ahad) mengikut 4 mod latihan kebangsaan.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/admin/schedules"
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-[#202126] text-white border border-[#37383D] hover:bg-[#2A2C35] hover:border-[#E10600]/50 transition-colors"
            >
              <span>Urus Jadual Mikrosiklus</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#E10600]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
