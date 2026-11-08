"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Check, Sparkles } from "lucide-react";
import { useAdminState } from "@/lib/admin/store";

export function DashboardHero() {
  const { programmes, activeProgrammeId } = useAdminState();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeProg =
    programmes.find((p) => p.id === activeProgrammeId) || programmes[0];

  const programOptions = [
    {
      id: "prog-2027-master",
      label: "Program Aktif: Sesi Januari - Disember 2027",
      sublabel: "Fasa 1 (Jan-Jun) & Fasa 2 (Jul-Dis) • 28 Atlet",
      year: "2027",
    },
    {
      id: "prog-sukma-peak",
      label: "Program Elit: Kemuncak SUKMA Terengganu 2027",
      sublabel: "Fasa Pra-Pertandingan • 12 Atlet Terpilih",
      year: "2027",
    },
    {
      id: "prog-remaja-base",
      label: "Program Pembangunan: Bakat Remaja Zon Pantai Timur",
      sublabel: "Fasa Asas Fizikal • 16 Atlet Remaja",
      year: "2027",
    },
  ];

  const [selectedProgram, setSelectedProgram] = useState(programOptions[0]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17191E] via-[#1A1C23] to-[#121317] border border-[#27272A] p-6 lg:p-8 mb-8 shadow-2xl">
      {/* Decorative Red Atmospheric Mist & Radial Glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-[#E10600]/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#FF3845]/10 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Atmospheric Silat Silhouette SVG */}
      <div
        className="absolute right-4 lg:right-16 bottom-0 top-0 w-64 lg:w-96 flex items-center justify-end pointer-events-none select-none opacity-20 lg:opacity-35"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 320 280"
          className="h-full w-auto object-contain filter drop-shadow-[0_0_20px_rgba(225,6,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Silat Martial Artist Dynamic Silhouette (Kuda-kuda & Pasang) */}
          <path
            d="M178 32 C178 42, 168 50, 158 50 C148 50, 140 42, 140 32 C140 22, 148 14, 158 14 C168 14, 178 22, 178 32 Z"
            fill="url(#silatGrad)"
          />
          {/* Tengkolok / Tanjak Headgear Silhouette */}
          <path
            d="M152 14 L165 4 L162 14 Z"
            fill="#FF3845"
            opacity="0.9"
          />
          {/* Torso & Arms (Pasang Stance) */}
          <path
            d="M142 52 L172 52 L185 75 L228 62 L245 74 L212 92 L185 88 L182 125 L132 125 L130 88 L98 94 L82 80 L115 64 L138 72 Z"
            fill="url(#silatGrad)"
          />
          {/* Samping & Bengkung (Waist Sash) */}
          <path
            d="M130 120 L184 120 L195 155 L120 155 Z"
            fill="#E10600"
            opacity="0.8"
          />
          {/* Front Extended Leg (Deep Stance) */}
          <path
            d="M135 150 L105 185 L70 215 L52 240 L85 244 L118 215 L145 180 Z"
            fill="url(#silatGrad)"
          />
          {/* Rear Grounded Leg */}
          <path
            d="M175 150 L205 188 L238 220 L275 245 L252 248 L218 222 L185 185 Z"
            fill="url(#silatGrad)"
          />
          <defs>
            <linearGradient id="silatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#C5C6CA" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#E10600" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Headline & Mission Statement */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555A] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FighterX Admin V1 // Portal Pengurusan Pusat</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Selamat Datang, Admin{" "}
            <span className="text-[#E10600] font-black inline-block">{"//"}</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#C5C6CA] leading-relaxed max-w-xl">
            Panel pengurusan kelab, atlet, latihan, pertandingan dan kewangan.
            Pantau status kesediaan atlet kebangsaan serta kelulusan kelab dalam satu hab berpusat.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#96989F]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              Sistem Dalam Talian
            </span>
            <span>•</span>
            <span>Kerangka Kerja: <strong>FighterX 2027</strong></span>
            <span>•</span>
            <span>Mod: <strong className="text-white">{activeProg?.activeMode || "Normal"}</strong></span>
          </div>
        </div>

        {/* Right Side: Active Program Switcher Pill Dropdown */}
        <div className="relative self-start lg:self-auto">
          <div className="text-xs uppercase font-bold text-[#96989F] mb-1.5 tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FF3845]" />
            Program Latihan Aktif
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-[#202126] hover:bg-[#282A32] border border-[#37383D] hover:border-[#FF3845]/50 rounded-xl text-left transition-all duration-200 shadow-lg min-w-[280px] sm:min-w-[320px] focus:outline-none focus:ring-2 focus:ring-[#FF3845]"
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-[#E10600]/20 text-[#FF555A] flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                    {selectedProgram.label.replace("Program Aktif: ", "")}
                  </div>
                  <div className="text-[11px] text-[#96989F] truncate">
                    {selectedProgram.sublabel}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#96989F] flex-shrink-0 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-full sm:w-80 bg-[#1D1F25] border border-[#37383D] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                role="listbox"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#96989F] border-b border-[#27272A] uppercase tracking-wider">
                  Pilih Sesi Latihan Rasmi
                </div>
                {programOptions.map((prog) => {
                  const isSelected = prog.id === selectedProgram.id;
                  return (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => {
                        setSelectedProgram(prog);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 text-left flex items-start justify-between gap-2 hover:bg-[#282A32] transition-colors ${
                        isSelected ? "bg-[#282A32]/80 border-l-2 border-[#E10600]" : ""
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold leading-tight ${
                            isSelected ? "text-[#FF555A]" : "text-white"
                          }`}
                        >
                          {prog.label}
                        </div>
                        <div className="text-[11px] text-[#96989F] mt-0.5 leading-snug">
                          {prog.sublabel}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
