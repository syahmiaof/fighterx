"use client";

import React, { useState } from "react";
import {
  Scale,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Info,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function PracticalToolsPanel() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeTool, setActiveTool] = useState<"weight" | "sweat">("weight");

  // State for Weight Cut Calculator
  const [currentWeight, setCurrentWeight] = useState<number>(62);
  const [targetWeight, setTargetWeight] = useState<number>(58);
  const [weeksRemaining, setWeeksRemaining] = useState<number>(4);

  // State for Sweat Rate Calculator
  const [preWeight, setPreWeight] = useState<number>(60);
  const [postWeight, setPostWeight] = useState<number>(58.8);
  const [fluidIntake, setFluidIntake] = useState<number>(0.5); // Liter
  const [durationMinutes, setDurationMinutes] = useState<number>(90);

  // Calculations for Weight Cut
  const weightToLose = Math.max(0, currentWeight - targetWeight);
  const percentageLoss = currentWeight > 0 ? (weightToLose / currentWeight) * 100 : 0;
  const weeklyRate = weeksRemaining > 0 ? weightToLose / weeksRemaining : weightToLose;

  const getWeightStatus = (pct: number) => {
    if (pct <= 5.0) {
      return {
        label: isEn ? "SAFE & OPTIMAL ZONE (< 5%)" : "ZON SELAMAT & OPTIMUM (< 5%)",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
        message: isEn
          ? "Within safe limits. Minimal risk of explosive power reduction or electrolyte imbalance."
          : "Dalam lingkungan had selamat ISN. Risiko minimum kehilangan daya letupan atau kekejangan otot.",
        recommendation: isEn
          ? "Target 0.5 - 1.0 kg loss per week via moderate caloric adjustment."
          : "Sasarkan penurunan 0.5 – 1.0 kg seminggu melalui pelarasan defisit kalori sederhana.",
      };
    } else if (pct <= 8.0) {
      return {
        label: isEn ? "CAUTION ZONE (5% – 8%)" : "ZON BERJAGA-JAGA (5% – 8%)",
        color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
        message: isEn
          ? "Moderate risk. Power output may drop by 10-15%. Requires strict electrolyte and hydration monitoring."
          : "Risiko sederhana. Daya sepakan berisiko turun 10–15%. Wajib pantau hidrasi dan paras natrium dengan ketat.",
        recommendation: isEn
          ? "Start 6 to 8 weeks early. Avoid drastic water restrictions or sauna suits."
          : "Mulakan 6 hingga 8 minggu lebih awal. Jangan guna sut sauna atau larangan air keterlaluan.",
      };
    } else {
      return {
        label: isEn ? "DANGER / SEVERE RISK (> 8%)" : "BAHAYA DEHIDRASI / KESIHATAN (> 8%)",
        color: "text-[#FF4D5A] border-red-500/40 bg-red-500/10",
        message: isEn
          ? "Severe risk of acute kidney injury, cognitive slowdown, and DQ. Violates PERSILAT Medical Code."
          : "Risiko tinggi kecederaan ginjal akut, refleks perlahan, dan pitam di matras. Bertentangan dengan Kod Perubatan PERSILAT.",
        recommendation: isEn
          ? "Consult coach to move up a weight category. Do not attempt rapid water cut."
          : "Pertimbangkan untuk naik kelas berat badan seterusnya demi kesihatan dan keselamatan jangka panjang pesilat.",
      };
    }
  };

  const weightStatus = getWeightStatus(percentageLoss);

  // Calculations for Sweat Rate
  // Weight lost in kg ≈ fluid lost in Liters + fluid drank
  const rawWeightDeficit = Math.max(0, preWeight - postWeight);
  const totalFluidLossLiters = rawWeightDeficit + fluidIntake;
  const sweatRatePerHour = durationMinutes > 0 ? (totalFluidLossLiters / (durationMinutes / 60)) : 0;
  const replacementTargetLiters = totalFluidLossLiters * 1.5; // 150% ISN replenishment guideline

  return (
    <section id="alat-praktikal-sains" className="py-14 border-b border-white/[0.08] scroll-mt-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-[#FF4D5A] bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] uppercase mb-2.5">
            {isEn ? "PRACTICAL PERFORMANCE TOOLS" : "ALAT PENGIRAAN PANTAS"}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-athletic uppercase tracking-wide text-white">
            {isEn ? "Athlete Safety & Hydration Calculators" : "Kalkulator Keselamatan Berat & Hidrasi"}
          </h2>
          <p className="text-xs sm:text-sm text-[#A2A3AA] mt-2 leading-relaxed">
            {isEn
              ? "Simple, actionable calculations for coaches and athletes to prevent dangerous rapid dehydration."
              : "Kiraan ringkas dan tepat untuk memastikan proses penurunan berat badan dan hidrasi mematuhi piawaian perubatan sukan."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTool("weight")}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-athletic text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTool === "weight"
                ? "bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.3)] border border-[#FF3845]"
                : "bg-white/[0.04] text-[#C5C6CA] hover:text-white border border-white/[0.08]"
            }`}
          >
            <Scale size={16} />
            <span>{isEn ? "Safe Weight Cut Zone" : "Zon Selamat Potongan Berat"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("sweat")}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-athletic text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTool === "sweat"
                ? "bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.3)] border border-[#FF3845]"
                : "bg-white/[0.04] text-[#C5C6CA] hover:text-white border border-white/[0.08]"
            }`}
          >
            <Droplets size={16} />
            <span>{isEn ? "Sweat Rate & Hydration" : "Kadar Peluh & Rehidrasi"}</span>
          </button>
        </div>

        {/* TOOL 1: WEIGHT CUT CALCULATOR */}
        {activeTool === "weight" && (
          <div className="rounded-2xl border border-white/[0.12] bg-white/[0.025] p-6 sm:p-8 backdrop-blur-[20px] shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-5">
                <h3 className="text-base font-bold font-athletic text-white uppercase tracking-wide flex items-center gap-2">
                  <Scale size={18} className="text-[#FF4D5A]" />
                  <span>Masukkan Data Berat Badan</span>
                </h3>

                <div>
                  <div className="flex justify-between text-xs text-[#C5C6CA] mb-1.5 font-medium">
                    <span>Berat Badan Semasa (kg):</span>
                    <strong className="text-white font-mono">{currentWeight} kg</strong>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={110}
                    step={0.5}
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="w-full accent-[#E10600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#C5C6CA] mb-1.5 font-medium">
                    <span>Had Berat Sasaran / Kategori (kg):</span>
                    <strong className="text-white font-mono">{targetWeight} kg</strong>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={110}
                    step={0.5}
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    className="w-full accent-[#E10600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#C5C6CA] mb-1.5 font-medium">
                    <span>Masa Berbaki Hingga Timbang (Minggu):</span>
                    <strong className="text-white font-mono">{weeksRemaining} minggu</strong>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={weeksRemaining}
                    onChange={(e) => setWeeksRemaining(Number(e.target.value))}
                    className="w-full accent-[#E10600] cursor-pointer"
                  />
                </div>
              </div>

              {/* Outputs & Safety Status */}
              <div className="flex flex-col justify-between p-5 rounded-xl bg-black/50 border border-white/[0.08]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#8E9099] uppercase tracking-wider font-bold">
                      STATUS KESELAMATAN:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${weightStatus.color}`}>
                      {weightStatus.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-[#8E9099] block">Jumlah Perlu Turun</span>
                      <strong className="text-xl font-athletic font-black text-white">{weightToLose.toFixed(1)} kg</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-[#8E9099] block">Peratus Jisim Tubuh</span>
                      <strong className={`text-xl font-athletic font-black ${percentageLoss > 8 ? "text-[#FF4D5A]" : percentageLoss > 5 ? "text-amber-400" : "text-emerald-400"}`}>
                        {percentageLoss.toFixed(1)}%
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-[#D4D5D9] leading-relaxed mb-3">
                    {weightStatus.message}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.08] text-[11px] text-[#A2A3AA]">
                  <strong className="text-white block mb-0.5">Syor Tindakan Jurulatih:</strong>
                  <span>{weightStatus.recommendation} (Kadar mingguan: {weeklyRate.toFixed(2)} kg/minggu).</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: SWEAT RATE CALCULATOR */}
        {activeTool === "sweat" && (
          <div className="rounded-2xl border border-white/[0.12] bg-white/[0.025] p-6 sm:p-8 backdrop-blur-[20px] shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-4">
                <h3 className="text-base font-bold font-athletic text-white uppercase tracking-wide flex items-center gap-2">
                  <Droplets size={18} className="text-blue-400" />
                  <span>Ujian Timbang Peluh Latihan</span>
                </h3>

                <div>
                  <div className="flex justify-between text-xs text-[#C5C6CA] mb-1 font-medium">
                    <span>Berat Sebelum Latihan (kg):</span>
                    <strong className="text-white font-mono">{preWeight} kg</strong>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={100}
                    step={0.1}
                    value={preWeight}
                    onChange={(e) => setPreWeight(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#C5C6CA] mb-1 font-medium">
                    <span>Berat Selepas Latihan (kg):</span>
                    <strong className="text-white font-mono">{postWeight} kg</strong>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={0.1}
                    value={postWeight}
                    onChange={(e) => setPostWeight(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#C5C6CA] mb-1 font-medium">
                    <span>Cecair Diminum Semasa Sesi (Liter):</span>
                    <strong className="text-white font-mono">{fluidIntake} L</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.1}
                    value={fluidIntake}
                    onChange={(e) => setFluidIntake(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#C5C6CA] mb-1 font-medium">
                    <span>Durasi Sesi Latihan (Minit):</span>
                    <strong className="text-white font-mono">{durationMinutes} minit</strong>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={180}
                    step={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Outputs */}
              <div className="flex flex-col justify-between p-5 rounded-xl bg-black/50 border border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-mono text-[#8E9099] uppercase tracking-wider block font-bold mb-3">
                    KEPUTUSAN KADAR PELUH &amp; REHIDRASI
                  </span>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-[#8E9099] block">Jumlah Peluh Hilang</span>
                      <strong className="text-xl font-athletic font-black text-blue-400">
                        {totalFluidLossLiters.toFixed(2)} Liter
                      </strong>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-[#8E9099] block">Kadar Per Jam</span>
                      <strong className="text-xl font-athletic font-black text-white">
                        {sweatRatePerHour.toFixed(2)} L/jam
                      </strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-[#D4D5D9] mb-3">
                    <span className="font-bold text-blue-300 block mb-1">
                      💧 Sasaran Minum Selepas Latihan:
                    </span>
                    <span>
                      Minum <strong>{replacementTargetLiters.toFixed(2)} Liter</strong> air + garam elektrolit dalam masa 2 jam untuk menggantikan 150% defisit cecair mengikut piawaian ISN.
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#8E9099] pt-2 border-t border-white/[0.06]">
                  *Dehidrasi melebihi 2% berat badan menurunkan daya tahan anaerobik sepakan sebanyak 18%.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
