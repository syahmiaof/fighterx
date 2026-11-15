"use client";

import { useState } from "react";
import { Droplets, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function SweatRateCalculator() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [preWeight, setPreWeight] = useState<number>(65.0);
  const [postWeight, setPostWeight] = useState<number>(63.8);
  const [fluidDrankMl, setFluidDrankMl] = useState<number>(600);
  const [durationMinutes, setDurationMinutes] = useState<number>(90);

  // Calculations
  const weightDiffKg = Number((preWeight - postWeight).toFixed(2));
  const fluidDrankL = Number((fluidDrankMl / 1000).toFixed(2));
  const totalSweatLossL = Math.max(0, Number((weightDiffKg + fluidDrankL).toFixed(2)));
  const durationHours = durationMinutes / 60;
  const hourlySweatRate = durationHours > 0 ? Number((totalSweatLossL / durationHours).toFixed(2)) : 0;
  const dehydrationPercent = preWeight > 0 ? Number(((weightDiffKg / preWeight) * 100).toFixed(2)) : 0;
  const recommendedRecoveryFluidL = Math.max(0, Number((weightDiffKg * 1.35).toFixed(2)));

  return (
    <div className="knowledge-tool-container rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555C] text-[11px] font-bold tracking-wider uppercase mb-2">
          <Droplets size={13} />
          <span>
            {isEn
              ? "National Sports Institute (ISN) Hydration Protocol"
              : "Protokol Hidrasi Institut Sukan Negara (ISN)"}
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide uppercase">
          {isEn ? "SWEAT RATE & REHYDRATION TEST" : "UJIAN KADAR PELUH & REHIDRASI"}
        </h3>
        <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1 max-w-2xl">
          {isEn
            ? "Hot and humid Malaysian dojo environments induce high sweat loss. Quantify individual sweat rates to prevent calf and quad cramps and preserve kicking reflexes."
            : "Suhu dewan gelanggang silat Malaysia yang panas dan lembap menyebabkan kehilangan peluh tinggi. Ukur kadar peluh peribadi untuk mencegah kekejangan otot betis/paha dan penurunan refleks sepakan."}
        </p>
      </div>

      {/* Input Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* Pre-Weight */}
        <div className="knowledge-frosted-subcard p-4 rounded-xl">
          <label className="text-xs font-bold text-[#A2A3AA] block uppercase tracking-wider mb-2">
            {isEn ? "Pre-Training Weight:" : "Berat Sebelum Latihan:"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={preWeight}
              onChange={(e) => setPreWeight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-lg font-bold font-mono text-white focus:outline-none focus:border-[#FF3845]"
            />
            <span className="text-xs font-bold text-[#8E9099]">KG</span>
          </div>
        </div>

        {/* Post-Weight */}
        <div className="knowledge-frosted-subcard p-4 rounded-xl">
          <label className="text-xs font-bold text-[#A2A3AA] block uppercase tracking-wider mb-2">
            {isEn ? "Post-Training Weight:" : "Berat Selepas Latihan:"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={postWeight}
              onChange={(e) => setPostWeight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-lg font-bold font-mono text-white focus:outline-none focus:border-[#FF3845]"
            />
            <span className="text-xs font-bold text-[#8E9099]">KG</span>
          </div>
        </div>

        {/* Fluid Drank */}
        <div className="knowledge-frosted-subcard p-4 rounded-xl">
          <label className="text-xs font-bold text-[#A2A3AA] block uppercase tracking-wider mb-2">
            {isEn ? "Fluid Drank During Session:" : "Air Diminum Semasa Sesi:"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="50"
              value={fluidDrankMl}
              onChange={(e) => setFluidDrankMl(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-lg font-bold font-mono text-white focus:outline-none focus:border-[#FF3845]"
            />
            <span className="text-xs font-bold text-[#8E9099]">ML</span>
          </div>
        </div>

        {/* Duration */}
        <div className="knowledge-frosted-subcard p-4 rounded-xl">
          <label className="text-xs font-bold text-[#A2A3AA] block uppercase tracking-wider mb-2">
            {isEn ? "Training Duration:" : "Tempoh Latihan:"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-lg font-bold font-mono text-white focus:outline-none focus:border-[#FF3845]"
            />
            <span className="text-xs font-bold text-[#8E9099]">
              {isEn ? "MINS" : "MINIT"}
            </span>
          </div>
        </div>
      </div>

      {/* Calculated Results Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Metric 1: Hourly Sweat Rate */}
        <div className="knowledge-frosted-subcard p-5 rounded-xl">
          <span className="text-xs text-[#8E9099] uppercase tracking-wider block mb-1">
            {isEn ? "Hourly Sweat Rate" : "Kadar Peluh Sejam"}
          </span>
          <div className="flex items-baseline gap-2">
            <strong className="text-3xl font-bold font-mono text-[#FF3845]">{hourlySweatRate}</strong>
            <span className="text-xs text-[#C5C6CA]">{isEn ? "Litres / Hour" : "Liter / Jam"}</span>
          </div>
          <p className="text-[11px] text-[#8E9099] mt-2">
            {isEn
              ? `Estimated fluid loss across ${durationMinutes} minutes of combat training.`
              : `Kehilangan peluh sebenar sepanjang ${durationMinutes} minit latihan.`}
          </p>
        </div>

        {/* Metric 2: Dehydration Level */}
        <div className="knowledge-frosted-subcard p-5 rounded-xl">
          <span className="text-xs text-[#8E9099] uppercase tracking-wider block mb-1">
            {isEn ? "Dehydration Level" : "Tahap Dehidrasi Badan"}
          </span>
          <div className="flex items-baseline gap-2">
            <strong
              className={`text-3xl font-bold font-mono ${
                dehydrationPercent > 2 ? "text-rose-400" : dehydrationPercent > 1 ? "text-amber-300" : "text-emerald-400"
              }`}
            >
              {dehydrationPercent}%
            </strong>
            <span className="text-xs text-[#C5C6CA]">{isEn ? "Body Weight" : "Berat Badan"}</span>
          </div>
          <p className="text-[11px] text-[#8E9099] mt-2">
            {dehydrationPercent > 2 ? (
              <span className="text-rose-300">
                {isEn
                  ? "WARNING: Dehydration >2% degrades striking power by 12%!"
                  : "AMARAN: Dehidrasi >2% mengurangkan kuasa sepakan 12%!"}
              </span>
            ) : (
              <span className="text-emerald-400">
                {isEn
                  ? "OPTIMAL: Inside safe physiological tolerance (<2%)."
                  : "STATUS BAIK: Dalam zon toleransi optimum (<2%)."}
              </span>
            )}
          </p>
        </div>

        {/* Metric 3: Recovery Fluid Goal */}
        <div className="knowledge-frosted-subcard p-5 rounded-xl">
          <span className="text-xs text-[#8E9099] uppercase tracking-wider block mb-1">
            {isEn ? "Recommended Fluid Replacement (ISN)" : "Cadangan Penggantian Cecair (ISN)"}
          </span>
          <div className="flex items-baseline gap-2">
            <strong className="text-3xl font-bold font-mono text-cyan-400">{recommendedRecoveryFluidL}</strong>
            <span className="text-xs text-[#C5C6CA]">
              {isEn ? "Litres (135% replacement)" : "Liter (135% gantian)"}
            </span>
          </div>
          <p className="text-[11px] text-[#8E9099] mt-2">
            {isEn
              ? "Ingest alongside sodium-rich sustenance within 2-4 hours post-workout."
              : "Ambil bersama hidangan bergaram natrium dalam tempoh 2-4 jam pasca latihan."}
          </p>
        </div>
      </div>

      {/* Guidelines Callout */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm text-xs text-[#A2A3AA] flex items-start gap-3">
        <Info size={16} className="text-[#FF3845] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block mb-0.5">
            {isEn ? "Silat Muscle Cramp Prevention Tip:" : "Petua Pencegahan Kram Otot Silat:"}
          </strong>
          <span>
            {isEn
              ? "If sweat leaves prominent white sodium rings on your tengkolok or uniform, you are a salty sweater. Introduce 1/4 tsp salt or an oral rehydration packet into your training canister during strenuous sparring bouts."
              : "Jika peluh anda meninggalkan tompokan putih pada tengkolok atau baju silat (baju layang), anda adalah seorang \"salty sweater\". Tambahkan 1/4 sudu teh garam atau paket rehidrasi ORS ke dalam botol minuman anda semasa sesi tanding berintensiti tinggi."}
          </span>
        </div>
      </div>
    </div>
  );
}
