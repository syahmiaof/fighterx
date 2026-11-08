"use client";

import { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  AlertCircle,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { calculateJurusScore } from "@/lib/guidelines/scoring";
import type { JurusCategory, JurusDeductions } from "@/lib/guidelines/types";

interface CategoryMeta {
  id: JurusCategory;
  name: string;
  tagline: string;
  participants: string;
  duration: string;
  elements: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "TUNGGAL",
    name: "Jurus Tunggal",
    tagline: "Solo Baku 100 Gerakan",
    participants: "1 Pesilat",
    duration: "Tepat 3:00 min (180s)",
    elements: "Tangan kosong (1-40), Golok (41-70), Toya (71-100)",
  },
  {
    id: "GANDA",
    name: "Jurus Ganda",
    tagline: "Pertarungan Koreografi Berpasangan",
    participants: "2 Pesilat",
    duration: "Tepat 3:00 min (180s)",
    elements: "Serangan, tangkisan, rampas senjata, akrobatik realistik",
  },
  {
    id: "REGU",
    name: "Jurus Regu",
    tagline: "Sinkronisasi Baku Trio",
    participants: "3 Pesilat",
    duration: "Tepat 3:00 min (180s)",
    elements: "100 gerakan tangan kosong seragam mikro-saat",
  },
  {
    id: "SOLO_BEBAS",
    name: "Solo Bebas",
    tagline: "Kreatif & Muzik Warisan",
    participants: "1 Pesilat",
    duration: "Tepat 3:00 min (180s)",
    elements: "Koreografi bebas, muzik tradisional, keris / tekpi / badik",
  },
];

export function JurusCalculator() {
  const [selectedCategory, setSelectedCategory] = useState<JurusCategory>("TUNGGAL");
  const [accuracyScore, setAccuracyScore] = useState<number>(9.9);
  const [expressionScore, setExpressionScore] = useState<number>(0.05);

  const [deductions, setDeductions] = useState<JurusDeductions>({
    timeOverUnderSeconds: 0,
    weaponDrops: 0,
    boundaryViolations: 0,
    costumeFaults: 0,
    movementFaults: 0,
  });

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const scoreCalculation = calculateJurusScore({
    category: selectedCategory,
    accuracyScore,
    expressionScore,
    deductions,
  });

  const handleReset = () => {
    setAccuracyScore(9.9);
    setExpressionScore(0.05);
    setDeductions({
      timeOverUnderSeconds: 0,
      weaponDrops: 0,
      boundaryViolations: 0,
      costumeFaults: 0,
      movementFaults: 0,
    });
  };

  return (
    <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(60,160,255,0.12)] border border-[rgba(60,160,255,0.35)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#64b7ff] backdrop-blur-sm">
            <Sparkles size={13} aria-hidden="true" />
            Rubrik Penilaian Seni PERSILAT 2026
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white font-[var(--font-athletic)] uppercase">
            Kalkulator Skor Jurus &amp; Seni
          </h3>
          <p className="text-xs text-[#a3a4ab] max-w-xl">
            Simulasi skor Nilai Kebenaran (Accuracy), Nilai Kemantapan (Expression), dan potongan rasmi untuk ralat masa, senjata jatuh, dan gelanggang.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-[#d6d6da] hover:text-white px-3.5 py-2 text-xs font-semibold backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all cursor-pointer"
          aria-label="Set semula rubrik jurus"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Set Semula
        </button>
      </div>

      {/* Category Selector Tabs */}
      <div className="mt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2.5">
          Pilih Kategori Acara Seni
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl p-3 text-left border transition-all cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? "border-[rgba(60,160,255,0.45)] bg-[rgba(60,160,255,0.12)] text-white shadow-[0_0_20px_rgba(60,160,255,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-[rgba(60,160,255,0.5)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] text-[#9a9ba2] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-[var(--font-athletic)] tracking-wide">
                    {cat.name}
                  </span>
                  {isSelected && <Check size={14} className="text-[#64b7ff]" aria-hidden="true" />}
                </div>
                <div className="mt-1 text-[11px] text-[#b4b5be] line-clamp-1">{cat.tagline}</div>
                <div className="mt-2 text-[10px] text-white/40 font-medium">{cat.participants}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Specification Chip */}
      <div className="mt-3.5 rounded-xl border border-[rgba(60,160,255,0.2)] bg-[rgba(60,160,255,0.04)] p-3 text-xs text-[#64b7ff]/90 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex flex-wrap items-center gap-y-1 gap-x-4">
        <span>
          <strong className="text-white">Tempoh:</strong> {activeCategoryMeta.duration}
        </span>
        <span>
          <strong className="text-white">Format:</strong> {activeCategoryMeta.elements}
        </span>
      </div>

      {/* Main Jurus Scoreboard */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.04] transition-all">
          <span className="block text-[11px] font-bold text-[#8d8e95] uppercase tracking-wider">
            Nilai Asas (Kebenaran + Kemantapan)
          </span>
          <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-white font-[var(--font-athletic)]">
            {(accuracyScore + expressionScore).toFixed(2)}
          </div>
          <span className="text-[10px] text-[#6d6e75]">
            Kebenaran: {accuracyScore.toFixed(2)} + Mantap: {expressionScore.toFixed(2)}
          </span>
        </div>

        <div className="rounded-xl border border-[rgba(255,56,69,0.25)] bg-[rgba(255,56,69,0.04)] backdrop-blur-md p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[rgba(255,56,69,0.07)] transition-all">
          <span className="block text-[11px] font-bold text-[#ff4d5a] uppercase tracking-wider">
            Jumlah Potongan Juri
          </span>
          <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#ff4d5a] font-[var(--font-athletic)]">
            {scoreCalculation.totalDeductions > 0 ? `−${scoreCalculation.totalDeductions.toFixed(2)}` : "0.00"}
          </div>
          <span className="text-[10px] text-[#6d6e75]">Masa + Senjata + Gelanggang + Pakaian</span>
        </div>

        <div className="rounded-xl border border-[rgba(60,160,255,0.35)] bg-[rgba(60,160,255,0.08)] backdrop-blur-md p-4 text-center shadow-[0_8px_32px_rgba(60,160,255,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="block text-[11px] font-bold text-[#64b7ff] uppercase tracking-wider">
            Skor Akhir Bersih (Final Net Score)
          </span>
          <div className="mt-1 text-4xl sm:text-5xl font-black text-white font-[var(--font-athletic)]">
            {scoreCalculation.netScore.toFixed(2)}
          </div>
          <span className="text-[11px] font-medium text-[#64b7ff]/80">Maksimum Standard: 9.90 – 10.00</span>
        </div>
      </div>

      {/* Accuracy & Expression Sliders */}
      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nilai Kebenaran */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.15] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Nilai Kebenaran (Accuracy Score)
              </span>
              <p className="text-[11px] text-[#A6A7AD]">Ketepatan susunan gerakan, sudut, dan teknik baku.</p>
            </div>
            <div className="text-2xl font-black text-white font-[var(--font-athletic)]">
              {accuracyScore.toFixed(2)}
            </div>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min="9.0"
              max="9.9"
              step="0.01"
              value={accuracyScore}
              onChange={(e) => setAccuracyScore(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
              aria-label="Slider Nilai Kebenaran"
            />
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>9.00 (Banyak ralat)</span>
              <span>9.50 (Sederhana)</span>
              <span>9.90 (Sempurna)</span>
            </div>
          </div>
        </div>

        {/* Nilai Kemantapan */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.15] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Nilai Kemantapan (Power &amp; Expression)
              </span>
              <p className="text-[11px] text-[#A6A7AD]">Tenaga ledak, stamina, irama gerak, dan penghayatan.</p>
            </div>
            <div className="text-2xl font-black text-[#64b7ff] font-[var(--font-athletic)]">
              +{expressionScore.toFixed(2)}
            </div>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min="0.0"
              max="0.1"
              step="0.01"
              value={expressionScore}
              onChange={(e) => setExpressionScore(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
              aria-label="Slider Nilai Kemantapan"
            />
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>0.00 (Standard)</span>
              <span>0.05 (Kuat &amp; Bertenaga)</span>
              <span>0.10 (Luar Biasa)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deductions Checklist / Counters (Frosted Glass) */}
      <div className="mt-7">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3 flex items-center gap-1.5">
          <AlertCircle size={14} className="text-[#ff4d5a]" aria-hidden="true" />
          Potongan Mata Kesalahan Rasmi (Official Deductions)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Dropped Weapon */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-md p-3.5 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-white">Senjata Terjatuh</span>
                <p className="text-[11px] text-[#A6A7AD]">−0.50 mata setiap kali senjata jatuh ke matras.</p>
              </div>
              <span className="text-lg font-bold text-[#ff4d5a] font-[var(--font-athletic)]">
                {deductions.weaponDrops > 0 ? `−${scoreCalculation.weaponDeduction.toFixed(2)}` : "0.00"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
              <span className="text-xs text-white/70">Bilangan Jatuh: {deductions.weaponDrops}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({ ...d, weaponDrops: Math.max(0, d.weaponDrops - 1) }))
                  }
                  disabled={deductions.weaponDrops === 0}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  aria-label="Kurangkan senjata jatuh"
                >
                  <Minus size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeductions((d) => ({ ...d, weaponDrops: d.weaponDrops + 1 }))}
                  className="w-7 h-7 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(225,6,0,0.3)]"
                  aria-label="Tambah senjata jatuh"
                >
                  <Plus size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Time Fault */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-md p-3.5 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-white">Ralat Masa (Kurang/Lebih)</span>
                <p className="text-[11px] text-[#A6A7AD]">−0.05 mata bagi setiap 5 saat lebih/kurang.</p>
              </div>
              <span className="text-lg font-bold text-[#ff4d5a] font-[var(--font-athletic)]">
                {deductions.timeOverUnderSeconds >= 5
                  ? `−${scoreCalculation.timeDeduction.toFixed(2)}`
                  : "0.00"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
              <span className="text-xs text-white/70">Lari Masa: {deductions.timeOverUnderSeconds}s</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      timeOverUnderSeconds: Math.max(0, d.timeOverUnderSeconds - 5),
                    }))
                  }
                  disabled={deductions.timeOverUnderSeconds === 0}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  aria-label="Kurangkan 5 saat"
                >
                  −5s
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      timeOverUnderSeconds: d.timeOverUnderSeconds + 5,
                    }))
                  }
                  className="w-7 h-7 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(225,6,0,0.3)] text-xs font-bold"
                  aria-label="Tambah 5 saat"
                >
                  +5s
                </button>
              </div>
            </div>
          </div>

          {/* Boundary Violation */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-md p-3.5 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-white">Keluar Gelanggang (10m x 10m)</span>
                <p className="text-[11px] text-[#A6A7AD]">−0.05 mata setiap kali terpijak luar garis.</p>
              </div>
              <span className="text-lg font-bold text-[#ff4d5a] font-[var(--font-athletic)]">
                {deductions.boundaryViolations > 0
                  ? `−${scoreCalculation.boundaryDeduction.toFixed(2)}`
                  : "0.00"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
              <span className="text-xs text-white/70">Bilangan Keluar: {deductions.boundaryViolations}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      boundaryViolations: Math.max(0, d.boundaryViolations - 1),
                    }))
                  }
                  disabled={deductions.boundaryViolations === 0}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  aria-label="Kurangkan keluar gelanggang"
                >
                  <Minus size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      boundaryViolations: d.boundaryViolations + 1,
                    }))
                  }
                  className="w-7 h-7 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(225,6,0,0.3)]"
                  aria-label="Tambah keluar gelanggang"
                >
                  <Plus size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Costume Malfunction */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-md p-3.5 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-white">Kesalahan Pakaian</span>
                <p className="text-[11px] text-[#A6A7AD]">−0.05 mata (tengkolok/samping tertanggal/jatuh).</p>
              </div>
              <span className="text-lg font-bold text-[#ff4d5a] font-[var(--font-athletic)]">
                {deductions.costumeFaults > 0
                  ? `−${scoreCalculation.costumeDeduction.toFixed(2)}`
                  : "0.00"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
              <span className="text-xs text-white/70">Bilangan Ralat: {deductions.costumeFaults}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      costumeFaults: Math.max(0, d.costumeFaults - 1),
                    }))
                  }
                  disabled={deductions.costumeFaults === 0}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  aria-label="Kurangkan ralat pakaian"
                >
                  <Minus size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      costumeFaults: d.costumeFaults + 1,
                    }))
                  }
                  className="w-7 h-7 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(225,6,0,0.3)]"
                  aria-label="Tambah ralat pakaian"
                >
                  <Plus size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Movement Accuracy Fault */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-md p-3.5 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-white">Kesalahan Gerakan</span>
                <p className="text-[11px] text-[#A6A7AD]">−0.01 mata setiap ralat jurus / salah urutan.</p>
              </div>
              <span className="text-lg font-bold text-[#ff4d5a] font-[var(--font-athletic)]">
                {deductions.movementFaults > 0
                  ? `−${scoreCalculation.movementDeduction.toFixed(2)}`
                  : "0.00"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
              <span className="text-xs text-white/70">Bilangan Ralat: {deductions.movementFaults}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      movementFaults: Math.max(0, d.movementFaults - 1),
                    }))
                  }
                  disabled={deductions.movementFaults === 0}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  aria-label="Kurangkan ralat gerakan"
                >
                  <Minus size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeductions((d) => ({
                      ...d,
                      movementFaults: d.movementFaults + 1,
                    }))
                  }
                  className="w-7 h-7 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(225,6,0,0.3)]"
                  aria-label="Tambah ralat gerakan"
                >
                  <Plus size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
