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
import { useLanguage } from "@/lib/i18n";

export function PeriodizationMatrix() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [selectedPhaseCode, setSelectedPhaseCode] = useState<string>("GPP");

  const currentPhase: PeriodizationPhaseInfo =
    PERIODIZATION_PHASES.find((p) => p.code === selectedPhaseCode) || PERIODIZATION_PHASES[0];

  const getPhaseTitle = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.phase;
    switch (p.code) {
      case "GPP":
        return "General Preparation Phase (GPP)";
      case "SPP":
        return "Specific Preparation Phase (SPP)";
      case "PRE_COMP":
        return "Pre-Competition Phase";
      case "TAPERING":
        return "Tapering & Peak Phase";
      default:
        return p.phase;
    }
  };

  const getPhaseShortName = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.phase.replace("Fasa ", "");
    switch (p.code) {
      case "GPP":
        return "General Prep";
      case "SPP":
        return "Specific Prep";
      case "PRE_COMP":
        return "Pre-Comp";
      case "TAPERING":
        return "Tapering";
      default:
        return p.phase;
    }
  };

  const getDurationText = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.durationWeeks;
    return p.durationWeeks.replace("Minggu", "Weeks");
  };

  const getDescription = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.description;
    switch (p.code) {
      case "GPP":
        return "Develop foundational cardiovascular endurance, core muscular stability, shoulder and knee joint health, and correct biomechanical asymmetries.";
      case "SPP":
        return "Convert general fitness into sport-specific anaerobic glycolytic power, repeated high-intensity striking combinations, and takedown grappling endurance.";
      case "PRE_COMP":
        return "Live match simulation under official PERSILAT 2026 conditions, tactical decision-making under fatigue, and referee penalty management.";
      case "TAPERING":
        return "Systematic volume reduction (40-60%) while sustaining high combat intensity to maximize central nervous system supercompensation.";
      default:
        return p.description;
    }
  };

  const getEnergySystem = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.primaryEnergySystem;
    switch (p.code) {
      case "GPP":
        return "Aerobic Lipolytic & Alactic Base";
      case "SPP":
        return "Anaerobic Glycolytic & Lactate Tolerance";
      case "PRE_COMP":
        return "Intermittent ATP-CP & Glycolytic Flux";
      case "TAPERING":
        return "Neuromuscular CNS Restoration";
      default:
        return p.primaryEnergySystem;
    }
  };

  const getKeyWorkouts = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.keyWorkouts;
    switch (p.code) {
      case "GPP":
        return [
          "Zone 2 aerobic base running 3x weekly (45-60 min)",
          "Foundational compound strength: front squats & deadlifts",
          "Ankle and hip joint mobility 90/90 daily routines",
        ];
      case "SPP":
        return [
          "High-intensity interval training (HIIT) 1:2 to 1:3 ratio",
          "Explosive kick-striking combinations with medicine ball throws",
          "Specific catch and takedown grappling circuits (5s timer)",
        ];
      case "PRE_COMP":
        return [
          "3 rounds x 2 minutes live bout sparring with protective gear",
          "Corner coaching instruction and VAR card simulation",
          "Targeted defensive counter-striking against varied styles",
        ];
      case "TAPERING":
        return [
          "Short explosive sprint bursts (3-5s) with full recovery",
          "Sharpening solo jurus precision standard and fluidity",
          "Tactical visualization and corner response drilling",
        ];
      default:
        return p.keyWorkouts;
    }
  };

  const getNutrition = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.recommendedNutrition;
    switch (p.code) {
      case "GPP":
        return "High-complex carbohydrates (5-7g/kg), protein 1.8g/kg, baseline hydration 3L/day.";
      case "SPP":
        return "Targeted carbohydrate intake pre/post high-intensity sessions, electrolyte replenishment.";
      case "PRE_COMP":
        return "Controlled deficit if adjusting class weight, gut-residue manipulation 72h out.";
      case "TAPERING":
        return "Full glycogen replenishment, hyper-hydration with sodium balance, easily digestible meals.";
      default:
        return p.recommendedNutrition;
    }
  };

  const getRecovery = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.recoveryPriority;
    switch (p.code) {
      case "GPP":
        return "8+ hours slow-wave sleep, active recovery foam rolling, joint decompression.";
      case "SPP":
        return "Cold water immersion (10-15°C), sports massage for lower limbs, monitoring ACWR.";
      case "PRE_COMP":
        return "Stress mitigation, mental visualization, breathing exercises (box breathing 4-4-4-4).";
      case "TAPERING":
        return "Complete psychological rest, CNS recuperation, sleep extension to 9 hours.";
      default:
        return p.recoveryPriority;
    }
  };

  const getPrimaryMetric = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.primaryMetric;
    switch (p.code) {
      case "GPP":
        return "VO2max & 1-minute push-up benchmark";
      case "SPP":
        return "Lactate clearance & 6-minute combat stamina";
      case "PRE_COMP":
        return "Sparring points differential & strike speed";
      case "TAPERING":
        return "Reaction time & morning resting heart rate";
      default:
        return p.primaryMetric;
    }
  };

  const getFocus = (p: PeriodizationPhaseInfo) => {
    if (!isEn) return p.focus;
    switch (p.code) {
      case "GPP":
        return "Build aerobic capacity, core strength, joint stability, and pelvic mobility.";
      case "SPP":
        return "Enhance lactic tolerance, explosive striking power, and grapple dominance.";
      case "PRE_COMP":
        return "Tactical sharpness, rulebook compliance, and bout pacing strategy.";
      case "TAPERING":
        return "Peak nervous system readiness and eliminate residual muscular fatigue.";
      default:
        return p.focus;
    }
  };

  return (
    <div className="knowledge-tool-container rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555C] text-[11px] font-bold tracking-wider uppercase mb-2">
            <CalendarDays size={13} />
            <span>
              {isEn ? "Silat Athletic Periodisation Matrix" : "Matriks Periodisasi Sukan Silat"}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isEn ? "4-PHASE TOURNAMENT PERIODISATION" : "PERIODISASI 4 FASA KEJOHANAN"}
          </h3>
          <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1 max-w-2xl">
            {isEn
              ? "ISN sports science framework structuring the annual cycle into 4 progressive phases ensuring athletes attain peak physiological & neuromuscular performance."
              : "Rangka kerja sains sukan ISN membahagikan kitaran tahunan kepada 4 fasa progresif bagi memastikan atlet berada pada kemuncak fisiologi & neuromuskular."}
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono text-[#787A85] block uppercase">
            {isEn ? "Reference Standard" : "Standard Rujukan"}
          </span>
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
                <span className="text-[10px] text-[#A2A3AA]">
                  {phase.durationWeeks.split(" ")[0]} {isEn ? "Wks" : "Mggu"}
                </span>
              </div>
              <strong className="text-xs font-bold text-white block truncate">
                {getPhaseShortName(phase)}
              </strong>
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
                {isEn ? "ACTIVE PHASE:" : "FASA AKTIF:"} {currentPhase.code}
              </span>
              <span className="text-xs text-[#FF858B] font-mono font-bold">
                {isEn ? "Recommended Duration:" : "Tempoh Disyorkan:"} {getDurationText(currentPhase)}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {getPhaseTitle(currentPhase)}
            </h4>
            <p className="text-xs sm:text-sm text-[#C5C6CA] mt-1 leading-relaxed">
              {getDescription(currentPhase)}
            </p>
          </div>

          {/* Volume vs Intensity Dual Progress */}
          <div className="w-full md:w-72 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm space-y-3 shrink-0">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#8E9099] uppercase tracking-wider">
                  {isEn ? "Training Volume:" : "Volum Latihan:"}
                </span>
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
                <span className="text-[#8E9099] uppercase tracking-wider">
                  {isEn ? "Training Intensity:" : "Intensiti Latihan:"}
                </span>
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
              <span>{isEn ? "Energy System:" : "Sistem Tenaga:"}</span>
              <span className="text-amber-300 font-medium truncate max-w-[150px] text-right">
                {getEnergySystem(currentPhase)}
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
              <span>{isEn ? "Core Training Regimen" : "Menu Latihan Utama"}</span>
            </div>
            <ul className="space-y-2">
              {getKeyWorkouts(currentPhase).map((workout, idx) => (
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
              <span>{isEn ? "Nutrition Protocol" : "Protokol Pemakanan"}</span>
            </div>
            <p className="text-xs text-[#C5C6CA] leading-relaxed mb-3">
              {getNutrition(currentPhase)}
            </p>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#8E9099]">
              <strong className="text-white block mb-0.5">
                {isEn ? "Benchmark Metric:" : "Penanda Ujian:"}
              </strong>
              <span>{getPrimaryMetric(currentPhase)}</span>
            </div>
          </div>

          {/* Recovery Strategy */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-white uppercase tracking-wider">
              <Moon size={14} className="text-indigo-400" />
              <span>{isEn ? "Recovery Priority" : "Prioriti Pemulihan"}</span>
            </div>
            <p className="text-xs text-[#C5C6CA] leading-relaxed mb-3">
              {getRecovery(currentPhase)}
            </p>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#8E9099]">
              <strong className="text-white block mb-0.5">
                {isEn ? "Primary Focus:" : "Fokus Utama:"}
              </strong>
              <span>{getFocus(currentPhase)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
