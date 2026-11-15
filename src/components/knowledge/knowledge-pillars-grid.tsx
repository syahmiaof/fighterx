"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Clock,
  Apple,
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export interface PillarData {
  id: string;
  icon: typeof Dumbbell;
  title: string;
  titleEn: string;
  tagline: string;
  taglineEn: string;
  accentColor: string;
  badgeTone: string;
  keyMetric: string;
  keyMetricLabel: string;
  highlights: string[];
  highlightsEn: string[];
  isnStandard: string;
  isnStandardEn: string;
}

export function KnowledgePillarsGrid() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const pillars: PillarData[] = [
    {
      id: "conditioning",
      icon: Dumbbell,
      title: "Kekuatan & Kondisi (S&C)",
      titleEn: "Strength & Conditioning",
      tagline: "Letupan Daya, Pliometrik & Mobiliti Sendi",
      taglineEn: "Rate of Force Development & Joint Mobility",
      accentColor: "#E10600",
      badgeTone: "border-red-500/40 bg-red-500/10 text-[#FF4D5A]",
      keyMetric: "+22%",
      keyMetricLabel: isEn ? "Kick Speed with RFD Training" : "Kelajuan Sepakan dengan Latihan RFD",
      highlights: [
        "Latihan Pliometrik & RFD (Rate of Force Development) meningkatkan kuasa letupan sepakan sabit dan tindak balas pasang.",
        "Rutin mobiliti sendi panggul 90/90 dan regangan dinamik pasang menambah julat pergerakan aktif (AROM) sebanyak 14°.",
        "Kekuatan eksentrik hamstring dan teras (core) mengurangkan risiko kecederaan non-contact sehingga 65%.",
      ],
      highlightsEn: [
        "Plyometric & RFD training boosts explosive power for roundhouse kicks and rapid guard stance counters.",
        "90/90 hip mobility routines and dynamic silat stance stretches increase active range of motion by 14°.",
        "Eccentric hamstring and core stability reduce non-contact lower-limb injury risk by up to 65%.",
      ],
      isnStandard: "ISN Malaysia S&C Protocol (2026) · JSS Review 2020",
      isnStandardEn: "ISN Malaysia S&C Protocol (2026) · JSS Review 2020",
    },
    {
      id: "periodization",
      icon: Clock,
      title: "Periodisasi & Kawalan Beban",
      titleEn: "Periodisation & Load Control",
      tagline: "Kitaran 52-Minggu & Tapering Supercompensation",
      taglineEn: "52-Week Cycle & Supercompensation Tapering",
      accentColor: "#F59E0B",
      badgeTone: "border-amber-500/40 bg-amber-500/10 text-amber-400",
      keyMetric: "0.8 – 1.3",
      keyMetricLabel: isEn ? "Optimal ACWR 'Sweet Spot'" : "Zon Selamat ACWR (Nisbah Beban Kerja)",
      highlights: [
        "Mengelakkan overtraining dan lesu kronik dengan memanipulasi nisbah volum dan intensiti mengikut fasa mesokitar.",
        "Fasa Tapering 10–14 hari sebelum kejohanan menurunkan volum 40–60% sambil mengekalkan intensiti tinggi untuk kemuncak tenaga.",
        "Memantau beban kerja mingguan menggunakan Skor RPE (Borg CR-10) x Durasi Sesi (Minit) bagi setiap atlet kelab.",
      ],
      highlightsEn: [
        "Prevents overtraining and burnout by systematically undulating volume and intensity across mesocycles.",
        "10–14 day pre-tournament taper cuts volume by 40–60% while maintaining high intensity for peak neuromuscular state.",
        "Weekly load monitoring via Session-RPE (Borg CR-10 x Duration in Minutes) across squad rosters.",
      ],
      isnStandard: "BJSM ACWR Consensus 2021 · Kerangka Kebangsaan 2027",
      isnStandardEn: "BJSM ACWR Consensus 2021 · National Framework 2027",
    },
    {
      id: "nutrition",
      icon: Apple,
      title: "Nutrisi & Pengurusan Berat",
      titleEn: "Nutrition & Weight Cut",
      tagline: "Zon Selamat Maksimum 5% & Hidrasi Laktat",
      taglineEn: "Max 5% Safe Zone & Lactate Hydration",
      accentColor: "#10B981",
      badgeTone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
      keyMetric: "< 5.0%",
      keyMetricLabel: isEn ? "Max Safe Rapid Weight Loss" : "Had Selamat Potongan Berat Pantas",
      highlights: [
        "Penurunan berat badan mendadak melebihi 5% jisim badan terbukti merosakkan fungsi ginjal dan melemahkan kuasa tendangan sehingga 28%.",
        "Protokol pemotongan berat berperingkat 4–6 minggu mengutamakan defisit kalori sederhana dan pengekalan jisim otot bersih (lean mass).",
        "Ujian kadar peluh individu menentukan kuantiti penggantian cecair + elektrolit (natrium) semasa tempoh rehat 1 minit perlawanan.",
      ],
      highlightsEn: [
        "Rapid weight loss exceeding 5% body mass degrades kidney filtration and reduces explosive kicking power by up to 28%.",
        "Gradual 4–6 week weight management prioritizes moderate calorie deficit while preserving lean muscle mass.",
        "Individual sweat rate testing calculates mandatory fluid + sodium electrolyte replenishment during 1-min intervals.",
      ],
      isnStandard: "PERSILAT Medical Code 2026 · ACSM Position Stand",
      isnStandardEn: "PERSILAT Medical Code 2026 · ACSM Position Stand",
    },
    {
      id: "baseline",
      icon: Activity,
      title: "Ujian Baseline & Pemantauan",
      titleEn: "Baseline Testing & Metrics",
      tagline: "6 Ujian Kecergasan Piawai ISN",
      taglineEn: "6 ISN Standardised Fitness Tests",
      accentColor: "#3B82F6",
      badgeTone: "border-blue-500/40 bg-blue-500/10 text-blue-400",
      keyMetric: "6 UJIAN",
      keyMetricLabel: isEn ? "Periodic Benchmark Tests" : "Ujian Penilaian Berkala",
      highlights: [
        "Larian 6 Minit menguji daya tahan aerobik asas dan keupayaan penyingkiran asid laktat darah (8–12 mmol/L).",
        "Ujian Push-up 1 Minit dan Plank mengukur ketahanan kekuatan teras untuk menstabilkan vest semasa menerima impak pukulan.",
        "Ujian Knee to Wall (Buku Lali) menilai mobiliti dorsifleksi untuk mencegah kecederaan ligamen lutut semasa sapuan dan guntingan.",
      ],
      highlightsEn: [
        "6-Minute Run measures aerobic foundation and lactate clearance capacity during high-intensity combat (8–12 mmol/L).",
        "1-Minute Push-up and Plank tests assess core strength endurance to brace and stabilize torso against vest strikes.",
        "Knee-to-Wall ankle dorsiflexion test evaluates joint mobility to prevent ACL/MCL knee strains during sweeps and scissors.",
      ],
      isnStandard: "Bateri Ujian ISN Malaysia 2026 · Sesi A & B",
      isnStandardEn: "ISN Malaysia Testing Battery 2026 · Sessions A & B",
    },
  ];

  const [activePillarId, setActivePillarId] = useState<string>("conditioning");
  const activePillar = pillars.find((p) => p.id === activePillarId) || pillars[0];
  const IconComponent = activePillar.icon;

  return (
    <section id="tunjang-sains-sukan" className="py-12 border-b border-white/[0.08] scroll-mt-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-[#FF4D5A] bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] uppercase mb-2.5">
            {isEn ? "THE 4 PILLARS OF PERFORMANCE" : "4 TUNJANG PRESTASI PENDEKAR"}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-athletic uppercase tracking-wide text-white">
            {isEn ? "Core Pillars of Modern Silat Sports Science" : "4 Tunjang Utama Sains Sukan Silat"}
          </h2>
          <p className="text-xs sm:text-sm text-[#A2A3AA] mt-2 leading-relaxed">
            {isEn
              ? "Click on any pillar below to inspect the scientific findings, training protocols, and official ISN benchmarks."
              : "Klik mana-mana tunjang di bawah untuk melihat rumusan sains, protokol latihan, dan penanda aras rasmi ISN."}
          </p>
        </div>

        {/* 4 Cards Grid (Interactive Selection) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {pillars.map((pillar) => {
            const isSelected = pillar.id === activePillarId;
            const Icon = pillar.icon;

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarId(pillar.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 backdrop-blur-[16px] cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? "bg-white/[0.06] border-white/30 shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(225,6,0,0.2)] scale-[1.02]"
                    : "bg-white/[0.025] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {/* Active Indicator Top Strip */}
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E10600] to-[#FF4D5A]"
                    style={{ backgroundColor: pillar.accentColor }}
                  />
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isSelected ? "bg-white/10 text-white" : "bg-white/5 text-[#A2A3AA]"
                      }`}
                      style={{ color: isSelected ? pillar.accentColor : undefined }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      className={`font-athletic text-2xl font-black ${
                        isSelected ? "text-white" : "text-[#8E9099]"
                      }`}
                    >
                      {pillar.keyMetric}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-athletic text-white uppercase tracking-wide mb-1">
                    {isEn ? pillar.titleEn : pillar.title}
                  </h3>
                  <p className="text-xs text-[#A2A3AA] leading-relaxed line-clamp-2">
                    {isEn ? pillar.taglineEn : pillar.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? "text-white" : "text-[#767882]"}>
                    {isEn ? "View Protocol" : "Lihat Protokol"}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${
                      isSelected ? "translate-x-1 text-[#FF4D5A]" : "text-[#767882] group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Insights Drawer/Card for Active Pillar */}
        <div className="rounded-2xl border border-white/[0.12] bg-gradient-to-r from-black/80 via-[#12141a]/90 to-black/80 p-6 sm:p-8 backdrop-blur-[20px] shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div className="flex items-start sm:items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 shrink-0 shadow-inner"
                style={{ color: activePillar.accentColor }}
              >
                <IconComponent size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${activePillar.badgeTone}`}>
                    {isEn ? "OFFICIAL PROTOCOL" : "PROTOKOL SAINS RASMI"}
                  </span>
                  <span className="text-xs text-[#8E9099] font-mono">
                    {activePillar.isnStandard}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-athletic text-white uppercase tracking-wide">
                  {isEn ? activePillar.titleEn : activePillar.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] p-3 rounded-xl shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-[#8E9099] uppercase tracking-wider block font-bold">
                  {isEn ? "KEY PERFORMANCE BENEFIT" : "FAEDAH PRESTASI UTAMA"}
                </span>
                <span className="text-xs text-white font-medium">
                  {activePillar.keyMetricLabel}
                </span>
              </div>
              <span
                className="font-athletic text-3xl font-black px-2.5 py-1 rounded-lg bg-black/40 border border-white/10"
                style={{ color: activePillar.accentColor }}
              >
                {activePillar.keyMetric}
              </span>
            </div>
          </div>

          {/* 3 Actionable Bullet Points */}
          <div className="mt-6">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#FF4D5A] font-bold mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              <span>{isEn ? "Scientific Application in Training" : "Aplikasi Saintifik Dalam Sesi Latihan Gelanggang"}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(isEn ? activePillar.highlightsEn : activePillar.highlights).map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 hover:bg-white/[0.04] transition-colors"
                >
                  <CheckCircle2 size={16} className="text-[#FF4D5A] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#D4D5D9] leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
