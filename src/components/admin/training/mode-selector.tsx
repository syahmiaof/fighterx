"use client";

import React from "react";
import type { ProgrammeMode } from "@/lib/admin/types";
import { Activity, Zap, Trophy, HeartPulse, Check } from "lucide-react";

export interface ModeSelectorProps {
  currentMode: ProgrammeMode;
  onModeSelect: (mode: ProgrammeMode) => void;
  disabled?: boolean;
}

interface ModeConfig {
  mode: ProgrammeMode;
  label: string;
  badgeText: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClasses: string;
  borderClasses: string;
  badgeClasses: string;
}

const MODES: ModeConfig[] = [
  {
    mode: "Normal",
    label: "Normal / Piawai",
    badgeText: "Kitaran Asas",
    description: "Volume & intensiti periodisasi berfasa mingguan standard mengikut kurikulum.",
    icon: Activity,
    activeClasses: "bg-[#1E293B]/60 border-[#38BDF8] text-white shadow-[0_0_20px_rgba(56,189,248,0.2)]",
    borderClasses: "border-[#27272A] hover:border-[#38BDF8]/40 hover:bg-[#1A1C22]",
    badgeClasses: "text-[#38BDF8] bg-[#38BDF8]/15 border-[#38BDF8]/30",
  },
  {
    mode: "Pre-Competition",
    label: "Pra-Pertandingan",
    badgeText: "Intensiti Tinggi",
    description: "Dril taktikal intensif, simulasi gelanggang sebenar dan peningkatan daya tahan puncak.",
    icon: Zap,
    activeClasses: "bg-[#451A03]/60 border-[#F59E0B] text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    borderClasses: "border-[#27272A] hover:border-[#F59E0B]/40 hover:bg-[#1A1C22]",
    badgeClasses: "text-[#FBBF24] bg-[#F59E0B]/15 border-[#F59E0B]/30",
  },
  {
    mode: "Competition Week",
    label: "Minggu Pertandingan",
    badgeText: "Fasa Puncak",
    description: "Penurunan isipadu (tapering), penjagaan berat timbang, strategi mental dan ketajaman reaksi.",
    icon: Trophy,
    activeClasses: "bg-[#4C0519]/70 border-[#E10600] text-white shadow-[0_0_24px_rgba(225,6,0,0.35)]",
    borderClasses: "border-[#27272A] hover:border-[#E10600]/50 hover:bg-[#1A1C22]",
    badgeClasses: "text-[#FF4D58] bg-[#E10600]/20 border-[#FF4D58]/40",
  },
  {
    mode: "Recovery",
    label: "Pemulihan / Rehat",
    badgeText: "Regenerasi",
    description: "Pemulihan aktif, mobiliti sendi, terapi ais, dan regenerasi kardiometabolik atlet.",
    icon: HeartPulse,
    activeClasses: "bg-[#064E3B]/60 border-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    borderClasses: "border-[#27272A] hover:border-[#10B981]/40 hover:bg-[#1A1C22]",
    badgeClasses: "text-[#34D399] bg-[#10B981]/15 border-[#10B981]/30",
  },
];

export function ModeSelector({
  currentMode,
  onModeSelect,
  disabled = false,
}: ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
            <span>Konfigurasi Mod Latihan Aktif (Active Mode)</span>
          </h4>
          <p className="text-xs text-[#96989F]">
            Pilih mod operasi mikro untuk menyelaraskan isipadu beban dan protokol latihan seluruh kelab.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#96989F]">Mod Semasa:</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E10600]/20 text-[#FF4D58] border border-[#FF4D58]/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D58] animate-pulse" />
            {currentMode}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MODES.map((item) => {
          const isSelected = currentMode === item.mode;
          const Icon = item.icon;

          return (
            <button
              key={item.mode}
              type="button"
              disabled={disabled}
              onClick={() => onModeSelect(item.mode)}
              className={`relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex flex-col justify-between group ${
                isSelected ? item.activeClasses : item.borderClasses
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-white/10 text-white"
                          : "bg-[#202126] text-[#96989F] group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeClasses}`}
                    >
                      {item.badgeText}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#E10600] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="text-sm font-bold text-white mb-1">
                  {item.label}
                </div>
                <p className="text-xs text-[#96989F] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-[#96989F]">Status:</span>
                <span
                  className={
                    isSelected
                      ? "font-semibold text-white"
                      : "text-[#6B7280] group-hover:text-[#96989F]"
                  }
                >
                  {isSelected ? "Aktif Sekarang" : "Klik untuk pilih"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
