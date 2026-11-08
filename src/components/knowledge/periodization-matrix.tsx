"use client";

import { useState } from "react";
import {
  CalendarDays,
  Activity,
  CheckCircle2,
  Apple,
  Moon,
} from "lucide-react";
import { PERIODIZATION_PHASES, PeriodizationPhaseInfo } from "./knowledge-data";

export function PeriodizationMatrix() {
  const [selectedPhaseCode, setSelectedPhaseCode] = useState<string>("GPP");

  const currentPhase: PeriodizationPhaseInfo =
    PERIODIZATION_PHASES.find((p) => p.code === selectedPhaseCode) || PERIODIZATION_PHASES[0];

  return (
    <div className="knowledge-tool-container rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555C] text-[11px] font-bold tracking-wider uppercase mb-2">
            <CalendarDays size={13} />
            <span>Matriks Periodisasi Sukan Silat</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide uppercase">
            PERIODISASI 4 FASA KEJOHANAN
          </h3>
          <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1 max-w-2xl">
            Rangka kerja sains sukan ISN membahagikan kitaran tahunan kepada 4 fasa progresif bagi memastikan atlet berada pada kemuncak fisiologi &amp; neuromuskular.
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono text-[#787A85] block uppercase">Standard Rujukan</span>
          <span className="text-xs font-bold text-white">ISN &amp; PERSILAT Sports Science</span>
        </div>
      </div>

      {/* Phase Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
        {PERIODIZATION_PHASES.map((phase) => {
          const isActive = phase.code === selectedPhaseCode;
          return (
            <button
              key={phase.code}
              type="button"
              onClick={() => setSelectedPhaseCode(phase.code)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative ${
                isActive
                  ? "bg-[#1E2028]/80 border-[#FF3845] shadow-[0_4px_20px_rgba(225,6,0,0.25)] backdrop-blur-md"
                  : "bg-white/[0.03] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06] backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isActive ? "text-[#FF3845]" : "text-[#757782]"
                  }`}
                >
                  {phase.code}
                </span>
                <span className="text-[10px] text-[#A2A3AA]">{phase.durationWeeks.split(" ")[0]} Mggu</span>
              </div>
              <strong className="text-xs font-bold text-white block truncate">{phase.phase.replace("Fasa ", "")}</strong>
              {isActive && (
                <div className="absolute -bottom-px left-4 right-4 h-0.5 bg-[#FF3845] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Phase Details Display */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-5 sm:p-6 space-y-6">
        {/* Top Phase Overview */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E10600] text-white">
                FASA AKTIF: {currentPhase.code}
              </span>
              <span className="text-xs text-[#FF858B] font-mono font-bold">
                Tempoh Disyorkan: {currentPhase.durationWeeks}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold font-athletic text-white uppercase tracking-wide">
              {currentPhase.phase}
            </h4>
            <p className="text-xs sm:text-sm text-[#C5C6CA] mt-1 leading-relaxed">
              {currentPhase.description}
            </p>
          </div>

          {/* Volume vs Intensity Dual Progress */}
          <div className="w-full md:w-72 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm space-y-3 shrink-0">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#8E9099] uppercase tracking-wider">Volum Latihan:</span>
                <span className="text-white font-mono">{currentPhase.volumePercentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentPhase.volumePercentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#8E9099] uppercase tracking-wider">Intensiti Latihan:</span>
                <span className="text-[#FF555C] font-mono">{currentPhase.intensityPercentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E10600] to-[#FF3845] rounded-full transition-all duration-500"
                  style={{ width: `${currentPhase.intensityPercentage}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-[#7A7C85]">
              <span>Sistem Tenaga:</span>
              <span className="text-amber-300 font-medium truncate max-w-[150px] text-right">
                {currentPhase.primaryEnergySystem}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid: Workouts, Nutrition, Recovery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
          {/* Key Workouts */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-white uppercase tracking-wider">
              <Activity size={14} className="text-[#FF3845]" />
              <span>Menu Latihan Utama</span>
            </div>
            <ul className="space-y-2">
              {currentPhase.keyWorkouts.map((workout, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#B5B6BD] leading-tight">
                  <CheckCircle2 size={13} className="text-[#FF3845] shrink-0 mt-0.5" />
                  <span>{workout}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrition Protocol */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-white uppercase tracking-wider">
              <Apple size={14} className="text-emerald-400" />
              <span>Protokol Pemakanan</span>
            </div>
            <p className="text-xs text-[#C5C6CA] leading-relaxed mb-3">
              {currentPhase.recommendedNutrition}
            </p>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#8E9099]">
              <strong className="text-white block mb-0.5">Penanda Ujian:</strong>
              <span>{currentPhase.primaryMetric}</span>
            </div>
          </div>

          {/* Recovery Strategy */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-white uppercase tracking-wider">
              <Moon size={14} className="text-indigo-400" />
              <span>Prioriti Pemulihan</span>
            </div>
            <p className="text-xs text-[#C5C6CA] leading-relaxed mb-3">
              {currentPhase.recoveryPriority}
            </p>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#8E9099]">
              <strong className="text-white block mb-0.5">Fokus Utama:</strong>
              <span>{currentPhase.focus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
