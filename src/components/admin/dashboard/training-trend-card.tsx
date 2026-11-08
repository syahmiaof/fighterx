"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  Users,
  Target,
  Swords,
  Sparkles,
} from "lucide-react";
import { useAdminState } from "@/lib/admin/store";
import { AdminLineChart } from "@/components/admin/ui/admin-svg-chart";

export function TrainingTrendCard() {
  const { monthlyAttendance, athletes, kpiStats } = useAdminState();
  const [activeTab, setActiveTab] = useState<"TREND" | "DISCIPLINE">("TREND");

  // Format attendance data for AdminLineChart
  const chartData = monthlyAttendance.map((m, idx) => ({
    label: m.monthLabel,
    value: m.attendanceRate,
    subtext: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun"][idx] || "",
  }));

  // Calculate discipline distribution from athletes in store
  const seniCount = athletes.filter((a) => a.discipline === "Silat Seni").length || 16;
  const olahragaCount = athletes.filter((a) => a.discipline === "Silat Olahraga").length || 12;
  const total = seniCount + olahragaCount;
  const seniPercent = Math.round((seniCount / total) * 100);
  const olahragaPercent = 100 - seniPercent;

  return (
    <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg flex flex-col justify-between">
      {/* Card Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272A] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#E10600]/20 text-[#FF555A] border border-[#FF3845]/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Statistik Latihan & Kehadiran Atlet
            </h3>
            <p className="text-xs text-[#96989F]">
              Pemantauan penyempurnaan mikrokitaran dan pecahan disiplin 2027
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#202126] p-1 rounded-lg border border-[#27272A] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("TREND")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === "TREND"
                ? "bg-[#E10600] text-white shadow-md"
                : "text-[#96989F] hover:text-white"
            }`}
          >
            Trend Bulanan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DISCIPLINE")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === "DISCIPLINE"
                ? "bg-[#E10600] text-white shadow-md"
                : "text-[#96989F] hover:text-white"
            }`}
          >
            Pecahan Disiplin
          </button>
        </div>
      </div>

      {/* Main Visual Section */}
      {activeTab === "TREND" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Highlight Metric 1: Kehadiran Purata */}
            <div className="p-3.5 rounded-xl bg-[#202126] border border-[#27272A] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#96989F] uppercase tracking-wider">
                  Kehadiran Purata
                </div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  {kpiStats.verifiedSubmissionsCount || 76}%
                </div>
                <div className="text-[11px] text-[#4ADE80] flex items-center gap-1 font-semibold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% vs Bulan Lepas
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#E10600]/15 flex items-center justify-center text-[#FF3845] border border-[#FF3845]/30">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Highlight Metric 2: Penyempurnaan Tugasan */}
            <div className="p-3.5 rounded-xl bg-[#202126] border border-[#27272A] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#96989F] uppercase tracking-wider">
                  Pengesahan Video
                </div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  188 / 195
                </div>
                <div className="text-[11px] text-[#60A5FA] flex items-center gap-1 font-semibold mt-1">
                  <Target className="w-3 h-3" />
                  Kadar 96.4% Sah
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#38BDF8]/15 flex items-center justify-center text-[#60A5FA] border border-[#38BDF8]/30">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Highlight Metric 3: Mikrokitaran Aktif */}
            <div className="p-3.5 rounded-xl bg-[#202126] border border-[#27272A] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#96989F] uppercase tracking-wider">
                  Mikrokitaran Semasa
                </div>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  Minggu 6
                </div>
                <div className="text-[11px] text-[#FBBF24] flex items-center gap-1 font-semibold mt-1">
                  <Sparkles className="w-3 h-3" />
                  Blok 1 (Asas Fizikal)
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#F59E0B]/15 flex items-center justify-center text-[#FBBF24] border border-[#F59E0B]/30">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <AdminLineChart
            data={chartData}
            title="Trend Penyempurnaan Latihan 6 Bulan (M1 - M6)"
            subtitle="Purata kadar kehadiran dan penghantaran video latihan atlet"
            averageValue={kpiStats.verifiedSubmissionsCount || 76}
            height={200}
            className="!p-4 !bg-[#131418] !border-[#27272A]"
          />

          {/* Microcycle Progress Bar Requirement */}
          <div className="p-3.5 rounded-xl bg-[#202126]/80 border border-[#27272A]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3845] animate-pulse" />
                Kemajuan Mikrokitaran: Minggu 6 Blok 1 (Fasa 1)
              </span>
              <span className="font-bold text-[#FF555A] font-mono">76% Lengkap</span>
            </div>
            <div className="w-full h-2.5 bg-[#17191E] rounded-full overflow-hidden border border-[#27272A]">
              <div
                className="h-full bg-gradient-to-r from-[#E10600] to-[#FF3845] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(225,6,0,0.6)]"
                style={{ width: "76%" }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#96989F] mt-1.5">
              <span>Isnin: Kardio 6-Minit</span>
              <span>Rabu: Rutin Seni/Olahraga</span>
              <span>Jumaat: Kekuatan & Teras</span>
              <span className="text-[#4ADE80]">Ahad: Rehat Sah</span>
            </div>
          </div>
        </div>
      ) : (
        /* Discipline Breakdown View */
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Silat Seni Box */}
            <div className="p-4 rounded-xl bg-[#202126] border border-[#FF3845]/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#E10600]/20 text-[#FF555A]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Silat Seni</h4>
                    <span className="text-[11px] text-[#96989F]">Tunggal, Ganda, Regu</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-[#FF555A] font-mono">
                  {seniCount}
                </span>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs text-[#C5C6CA]">
                  <span>Pecahan Populasi:</span>
                  <span className="font-bold text-white">{seniPercent}%</span>
                </div>
                <div className="w-full h-2 bg-[#17191E] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E10600] rounded-full"
                    style={{ width: `${seniPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#96989F] pt-1">
                  Fokus: Jurus Baku, Ketepatan Gerak, Irama & Jiwa Pendekar
                </div>
              </div>
            </div>

            {/* Silat Olahraga Box */}
            <div className="p-4 rounded-xl bg-[#202126] border border-[#38BDF8]/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#38BDF8]/20 text-[#60A5FA]">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Silat Olahraga</h4>
                    <span className="text-[11px] text-[#96989F]">Kelas Tanding A - J</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-[#60A5FA] font-mono">
                  {olahragaCount}
                </span>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs text-[#C5C6CA]">
                  <span>Pecahan Populasi:</span>
                  <span className="font-bold text-white">{olahragaPercent}%</span>
                </div>
                <div className="w-full h-2 bg-[#17191E] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#38BDF8] rounded-full"
                    style={{ width: `${olahragaPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#96989F] pt-1">
                  Fokus: Daya Serangan, Sapuan Kaki, Takedown & Ketahanan Gelanggang
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1A1C23] border border-[#27272A] text-xs text-[#C5C6CA] flex items-center justify-between">
            <span>
              Peraturan Sistem: <strong>Disiplin Tunggal Sahaja</strong> dikuatkuasakan bagi setiap atlet.
            </span>
            <span className="font-mono text-[#4ADE80] font-bold">100% Pematuhan</span>
          </div>
        </div>
      )}
    </div>
  );
}
