"use client";

import { useState, useMemo } from "react";
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { WEIGHT_CATEGORIES_PERSILAT, WeightCategoryOption } from "./knowledge-data";

export function WeightCutPlanner() {
  const [currentWeight, setCurrentWeight] = useState<number>(64.5);
  const [targetCategoryCode, setTargetCategoryCode] = useState<string>("C");
  const [prepWeeks, setPrepWeeks] = useState<number>(6);

  const selectedCategory: WeightCategoryOption =
    WEIGHT_CATEGORIES_PERSILAT.find((c) => c.code === targetCategoryCode) || WEIGHT_CATEGORIES_PERSILAT[2];

  const targetWeight = selectedCategory.maxKg;
  const weightToLose = Math.max(0, Number((currentWeight - targetWeight).toFixed(2)));
  const percentageLoss = Number(((weightToLose / currentWeight) * 100).toFixed(1));
  const weeklyRateKg = Number((weightToLose / prepWeeks).toFixed(2));
  const weeklyRatePercent = Number(((weeklyRateKg / currentWeight) * 100).toFixed(2));

  const safetyEvaluation = useMemo(() => {
    if (weightToLose <= 0) {
      return {
        level: "optimal",
        title: "BERAT DALAM ZON SASARAN",
        desc: "Berat anda sudah berada dalam had kelas yang dipilih. Fokus kepada mengekalkan komposisi otot dan tenaga.",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      };
    }
    if (weeklyRatePercent <= 0.8) {
      return {
        level: "safe",
        title: "PELAN SELAMAT & BERTAULIAH (ISN & ACSM)",
        desc: `Kadar penurunan ${weeklyRatePercent}%/minggu (<0.8%) mengekalkan 98% jisim otot tanpa menjejaskan refleks bertanding.`,
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      };
    }
    if (weeklyRatePercent <= 1.0) {
      return {
        level: "moderate",
        title: "SEDERHANA: PERLUKAN PENGAWASAN JURULATIH",
        desc: `Kadar penurunan ${weeklyRatePercent}%/minggu (0.8-1.0%) berada di paras amaran atas. Pantau kualiti tidur dan paras hidrasi harian.`,
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      };
    }
    const nextCatIndex = WEIGHT_CATEGORIES_PERSILAT.findIndex((c) => c.code === selectedCategory.code) + 1;
    const nextCategoryLabel = nextCatIndex < WEIGHT_CATEGORIES_PERSILAT.length
      ? `Kelas ${WEIGHT_CATEGORIES_PERSILAT[nextCatIndex].code}`
      : "kategori lebih tinggi";

    return {
      level: "danger",
      title: "BAHAYA: RISIKO DEHIDRASI EKSTREM & KEKUATAN MERUDUM",
      desc: `Kadar ${weeklyRatePercent}%/minggu melebihi had selamat. Anda disyorkan menambah tempoh persediaan kepada 8 minggu atau naik ke ${nextCategoryLabel}.`,
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/40",
    };
  }, [weightToLose, weeklyRatePercent, selectedCategory]);

  return (
    <div className="knowledge-tool-container rounded-2xl p-6 lg:p-8">
      {/* Tool Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555C] text-[11px] font-bold tracking-wider uppercase mb-2">
          <Scale size={13} />
          <span>Kalkulator Saintifik PERSILAT 2026</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide uppercase">
          PERANCANG WEIGHT-CUT BERJADUAL
        </h3>
        <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1 max-w-2xl">
          Elakkan crash dieting dan sauna ekstrem. Rancang pemotongan berat berperingkat tanpa dehidrasi akut berpandukan konsensus Institut Sukan Negara (ISN) dan Kod Perubatan PERSILAT.
        </p>
      </div>

      {/* Input Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {/* Current Weight Input */}
        <div className="knowledge-frosted-subcard p-4 rounded-xl">
          <label className="text-xs font-bold text-[#A2A3AA] block uppercase tracking-wider mb-2">
            Berat Semasa (kg):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="35"
              max="150"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-lg font-bold font-mono text-white focus:outline-none focus:border-[#FF3845]"
            />
            <span className="text-sm font-bold text-[#8E9099]">KG</span>
          </div>
          <span className="text-[10px] text-[#6E7079] block mt-1.5">Timbang waktu pagi selepas buang air.</span>
        </div>

        {/* Target Weight Category Dropdown */}
        <div className="knowledge-frosted-subcard p-4 rounded-xl">
          <label className="text-xs font-bold text-[#A2A3AA] block uppercase tracking-wider mb-2">
            Sasaran Kelas PERSILAT:
          </label>
          <select
            value={targetCategoryCode}
            onChange={(e) => setTargetCategoryCode(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm text-sm font-bold text-white focus:outline-none focus:border-[#FF3845]"
          >
            {WEIGHT_CATEGORIES_PERSILAT.map((cat) => (
              <option key={cat.code} value={cat.code} className="bg-[#12141a] text-white">
                {cat.name} ({cat.gender})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-[#6E7079] block mt-1.5">
            Had berat maksimum: <strong className="text-white">{targetWeight} kg</strong>
          </span>
        </div>

        {/* Weeks Available Input */}
        <div className="knowledge-frosted-subcard p-4 rounded-xl">
          <label className="text-xs font-bold text-[#A2A3AA] block uppercase tracking-wider mb-2">
            Tempoh Minggu Hingga Timbang:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="16"
              value={prepWeeks}
              onChange={(e) => setPrepWeeks(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-lg font-bold font-mono text-white focus:outline-none focus:border-[#FF3845]"
            />
            <span className="text-sm font-bold text-[#8E9099]">MINGGU</span>
          </div>
          <span className="text-[10px] text-[#6E7079] block mt-1.5">Standard optimum ISN: 4 hingga 6 minggu.</span>
        </div>
      </div>

      {/* Dynamic Results & Safety Assessment Banner */}
      <div className={`p-5 rounded-xl border backdrop-blur-md ${safetyEvaluation.badgeColor} mb-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            {safetyEvaluation.level === "danger" ? (
              <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
            ) : (
              <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            )}
            <div>
              <strong className="text-xs font-bold uppercase tracking-wider block">
                {safetyEvaluation.title}
              </strong>
              <p className="text-xs mt-0.5 leading-relaxed">{safetyEvaluation.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0 pl-7 sm:pl-0">
            <div>
              <span className="text-[10px] block text-[#8E9099] uppercase">Jumlah Potongan:</span>
              <strong className="text-base text-white">{weightToLose} kg ({percentageLoss}%)</strong>
            </div>
            <div>
              <span className="text-[10px] block text-[#8E9099] uppercase">Kadar Seminggu:</span>
              <strong className="text-base text-white">{weeklyRateKg} kg/mggu</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Week-by-Week 4-Phase Step Timeline */}
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar size={15} className="text-[#FF3845]" /> Pelan Tindakan Berperingkat 4 Fasa
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Phase 1 */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <span className="text-[10px] font-mono text-[#FF555C] font-bold block mb-1">
              FASA 1 · MINGGU {prepWeeks} HINGGA {Math.max(1, prepWeeks - 2)}
            </span>
            <strong className="text-xs font-bold text-white block mb-1.5">Defisit Kalori Terkawal</strong>
            <p className="text-[11px] text-[#A2A3AA] leading-relaxed">
              Defisit 300-500 kcal/hari daripada karbohidrat halus. Kekalkan protein tinggi 2.0g/kg untuk memelihara jisim otot.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <span className="text-[10px] font-mono text-[#FF555C] font-bold block mb-1">
              FASA 2 · MINGGU 3 HINGGA 2
            </span>
            <strong className="text-xs font-bold text-white block mb-1.5">Penurunan Lemak Submaksimum</strong>
            <p className="text-[11px] text-[#A2A3AA] leading-relaxed">
              Kekalkan pengambilan air 3-4L sehari. Jangan hadkan garam natrium lagi bagi mengelakkan kekejangan awal latihan.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <span className="text-[10px] font-mono text-[#FF555C] font-bold block mb-1">
              FASA 3 · 72 JAM PRA-TIMBANG
            </span>
            <strong className="text-xs font-bold text-white block mb-1.5">Gut Residue Manipulation</strong>
            <p className="text-[11px] text-[#A2A3AA] leading-relaxed">
              Tukar kepada diet rendah serat (nasi putih, sup ayam jernih). Menurunkan 1.0-1.5 kg sisa usus tanpa sentuh air otot.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="knowledge-frosted-subcard p-4 rounded-xl">
            <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
              FASA 4 · PASCA TIMBANG RASA
            </span>
            <strong className="text-xs font-bold text-white block mb-1.5">Rehidrasi &amp; Refueling</strong>
            <p className="text-[11px] text-[#A2A3AA] leading-relaxed">
              Minum larutan ORS 500ml perlahan-lahan dalam 15 minit pertama. Pulihkan karbohidrat glikogen 2 jam sebelum perlawanan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
