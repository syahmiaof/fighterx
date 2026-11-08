"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Swords,
  Clock,
} from "lucide-react";
import { useAdminState } from "@/lib/admin/store";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import {
  AdminLineChart,
  AdminDonutChart,
} from "@/components/admin/ui/admin-svg-chart";

export function AnalyticsView() {
  const { monthlyAttendance, athletes, coaches, kpiStats } = useAdminState();
  const [activeTab, setActiveTab] = useState<
    "ATTENDANCE" | "DISCIPLINE" | "INJURY" | "COACHES"
  >("ATTENDANCE");

  // Format attendance data for line chart
  const attendanceChartData = monthlyAttendance.map((m, idx) => ({
    label: m.monthLabel,
    value: m.attendanceRate,
    subtext: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun"][idx] || "",
  }));

  // Discipline breakdown
  const seniCount = athletes.filter((a) => a.discipline === "Silat Seni").length || 16;
  const olahragaCount = athletes.filter((a) => a.discipline === "Silat Olahraga").length || 12;
  const totalAthletes = seniCount + olahragaCount;
  const seniPercent = Math.round((seniCount / totalAthletes) * 100);
  const olahragaPercent = 100 - seniPercent;

  const donutSegments = [
    {
      label: "Silat Seni",
      value: seniCount,
      color: "#E10600",
      sublabel: `${seniPercent}%`,
    },
    {
      label: "Silat Olahraga",
      value: olahragaCount,
      color: "#38BDF8",
      sublabel: `${olahragaPercent}%`,
    },
  ];

  // Consistency tiers
  const tierKonsisten = athletes.filter((a) => a.consistencyTier === "KONSISTEN").length;
  const tierSederhana = athletes.filter((a) => a.consistencyTier === "SEDERHANA").length;
  const tierPerluPerhatian = athletes.filter((a) => a.consistencyTier === "PERLU_PERHATIAN").length;

  // Injured athletes
  const injuredAthletes = athletes.filter((a) => a.status === "Injured");
  const injuryRate = totalAthletes > 0 ? ((injuredAthletes.length / totalAthletes) * 100).toFixed(1) : "3.6";

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555A] text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Hab Analitik Prestasi Pusat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analitik Mendalam & Impak Latihan
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1">
            Penilaian statistik konsistensi latihan, pembahagian disiplin silat, dan metrik keselamatan atlet.
          </p>
        </div>

        {/* Global indicator badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#202126] border border-[#37383D]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-semibold text-[#E5E5E7]">
            Data Masa Nyata (28 Atlet Aktif)
          </span>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Kadar Kehadiran Purata</span>
            <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {kpiStats.verifiedSubmissionsCount || 76}%
          </div>
          <div className="text-[11px] text-[#4ADE80] font-semibold mt-1">
            ▲ +8% prestasi konsistensi
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Tahap Konsisten</span>
            <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {tierKonsisten} / {totalAthletes} Atlet
          </div>
          <div className="text-[11px] text-[#60A5FA] font-semibold mt-1">
            {Math.round((tierKonsisten / totalAthletes) * 100)}% atlet berprestasi tinggi
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Kadar Kecederaan</span>
            <HeartPulse className="w-4 h-4 text-[#FF3845]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {injuryRate}%
          </div>
          <div className="text-[11px] text-[#FBBF24] font-semibold mt-1">
            {injuredAthletes.length} atlet dalam pemulihan
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Pengesahan Video</span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            18.2 Jam
          </div>
          <div className="text-[11px] text-[#C5C6CA] font-semibold mt-1">
            Kelajuan semakan jurulatih
          </div>
        </div>
      </div>

      {/* Visual Charts Duo: Line Chart & Donut Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Line Chart */}
        <div className="lg:col-span-7">
          <AdminLineChart
            data={attendanceChartData}
            title="Trend Kehadiran & Penyempurnaan Tugasan (M1 - M6)"
            subtitle="Kadar purata peratusan kehadiran atlet kebangsaan mengikut bulan"
            averageValue={kpiStats.verifiedSubmissionsCount || 76}
            height={220}
          />
        </div>

        {/* Right: Donut Chart */}
        <div className="lg:col-span-5">
          <AdminDonutChart
            segments={donutSegments}
            title="Pecahan Disiplin Silat"
            subtitle="Pendaftaran disiplin tunggal atlet (Seni vs Olahraga)"
            centerNumber={totalAthletes}
            centerLabel="Jumlah Atlet"
            size={180}
          />
        </div>
      </div>

      {/* Deep-Dive Investigation Tabs */}
      <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg space-y-4">
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[#27272A]">
          <button
            type="button"
            onClick={() => setActiveTab("ATTENDANCE")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ATTENDANCE"
                ? "bg-[#E10600] text-white shadow-md"
                : "bg-[#202126] text-[#96989F] hover:text-white"
            }`}
          >
            Konsistensi Mikrokitaran
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("DISCIPLINE")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "DISCIPLINE"
                ? "bg-[#E10600] text-white shadow-md"
                : "bg-[#202126] text-[#96989F] hover:text-white"
            }`}
          >
            Taburan Kategori & Berat
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("INJURY")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "INJURY"
                ? "bg-[#E10600] text-white shadow-md"
                : "bg-[#202126] text-[#96989F] hover:text-white"
            }`}
          >
            Kecederaan & Keselamatan ({injuredAthletes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("COACHES")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "COACHES"
                ? "bg-[#E10600] text-white shadow-md"
                : "bg-[#202126] text-[#96989F] hover:text-white"
            }`}
          >
            Prestasi Pengesahan Jurulatih
          </button>
        </div>

        {/* Tab 1: Attendance Consistency */}
        {activeTab === "ATTENDANCE" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-[#202126] border border-[#22C55E]/30">
                <div className="text-xs text-[#96989F]">Tahap: KONSISTEN (&gt;= 80%)</div>
                <div className="text-xl font-bold font-mono text-[#4ADE80] mt-1">
                  {tierKonsisten} Atlet ({Math.round((tierKonsisten / totalAthletes) * 100)}%)
                </div>
                <div className="text-[11px] text-[#96989F] mt-1">
                  Menepati jadual 3 sesi seminggu secara konsisten.
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#202126] border border-[#38BDF8]/30">
                <div className="text-xs text-[#96989F]">Tahap: SEDERHANA (60% - 79%)</div>
                <div className="text-xl font-bold font-mono text-[#60A5FA] mt-1">
                  {tierSederhana} Atlet ({Math.round((tierSederhana / totalAthletes) * 100)}%)
                </div>
                <div className="text-[11px] text-[#96989F] mt-1">
                  Tertinggal 1 sesi latihan dalam tempoh 14 hari.
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#202126] border border-[#F59E0B]/30">
                <div className="text-xs text-[#96989F]">Tahap: PERLU PERHATIAN (&lt; 60%)</div>
                <div className="text-xl font-bold font-mono text-[#FBBF24] mt-1">
                  {tierPerluPerhatian} Atlet ({Math.round((tierPerluPerhatian / totalAthletes) * 100)}%)
                </div>
                <div className="text-[11px] text-[#96989F] mt-1">
                  Memerlukan kaunseling dan intervensi jurulatih.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#202126]/60 border border-[#27272A] text-xs text-[#C5C6CA]">
              <div className="font-bold text-white mb-1">
                Ketetapan Mikrokitaran FighterX 2027:
              </div>
              <p>
                Setiap 7 hari latihan diwajibkan sekurang-kurangnya 1 hari rehat penuh atau pemulihan aktif.
                Penghantaran log latihan atlet diverifikasi oleh jurulatih bertauliah dalam tempoh sasaran 24 jam.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Discipline and Weight Classes */}
        {activeTab === "DISCIPLINE" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#202126] border border-[#27272A]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#FF555A]" />
                  <h4 className="text-sm font-bold text-white">Kategori Silat Seni</h4>
                </div>
                <ul className="space-y-2 text-xs text-[#C5C6CA]">
                  <li className="flex justify-between py-1 border-b border-[#27272A]">
                    <span>Tunggal Baku Putra / Putri</span>
                    <span className="font-mono font-bold text-white">8 Atlet</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-[#27272A]">
                    <span>Ganda Putra / Putri</span>
                    <span className="font-mono font-bold text-white">4 Atlet</span>
                  </li>
                  <li className="flex justify-between py-1">
                    <span>Regu Baku Putra / Putri</span>
                    <span className="font-mono font-bold text-white">4 Atlet</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#202126] border border-[#27272A]">
                <div className="flex items-center gap-2 mb-3">
                  <Swords className="w-4 h-4 text-[#38BDF8]" />
                  <h4 className="text-sm font-bold text-white">Kelas Silat Olahraga</h4>
                </div>
                <ul className="space-y-2 text-xs text-[#C5C6CA]">
                  <li className="flex justify-between py-1 border-b border-[#27272A]">
                    <span>Kelas A (45-50kg) & Kelas B (50-55kg)</span>
                    <span className="font-mono font-bold text-white">5 Atlet</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-[#27272A]">
                    <span>Kelas C (55-60kg) & Kelas D (60-65kg)</span>
                    <span className="font-mono font-bold text-white">4 Atlet</span>
                  </li>
                  <li className="flex justify-between py-1">
                    <span>Kelas E (65-70kg) & Bebas</span>
                    <span className="font-mono font-bold text-white">3 Atlet</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Injury Impact & Health Records */}
        {activeTab === "INJURY" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#F87171] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Protokol Keselamatan & Had Rawatan Kecederaan
                </h4>
                <p className="text-xs text-[#C5C6CA] mt-1">
                  Atlet yang mengalami kecederaan disekat daripada menyertai kejohanan secara automatik.
                  Pelepasan perubatan <strong>wajib ditandatangani oleh doktor atau pegawai perubatan bertauliah</strong>.
                </p>
              </div>
            </div>

            {/* Injured Athletes Listing */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#96989F] uppercase tracking-wider">
                Log Atlet Dalam Rawatan / Pemulihan
              </h4>

              {injuredAthletes.length > 0 ? (
                injuredAthletes.map((ath) => (
                  <div
                    key={ath.id}
                    className="p-3.5 rounded-lg bg-[#202126] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{ath.name}</span>
                        <AdminBadge variant="danger" size="sm">
                          Kecederaan
                        </AdminBadge>
                      </div>
                      <div className="text-xs text-[#96989F] mt-0.5">
                        {ath.clubName} • {ath.discipline} • {ath.category}
                      </div>
                      <div className="text-xs text-[#F87171] mt-1 font-medium">
                        Kecederaan: Ligamen lutut kiri (Knee). Dalam proses fisioterapi ISN.
                      </div>
                    </div>

                    <div className="self-end sm:self-auto text-right">
                      <div className="text-xs text-[#96989F]">Status Pelepasan:</div>
                      <span className="text-xs font-bold text-[#FBBF24]">
                        Menunggu Surat Doktor
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-[#96989F]">
                  Tiada atlet yang dilaporkan cedera pada masa ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Coaches Performance */}
        {activeTab === "COACHES" && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#27272A] text-[#96989F] uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Nama Jurulatih</th>
                    <th className="py-2.5 px-3">Kelab</th>
                    <th className="py-2.5 px-3">Sijil / Lesen</th>
                    <th className="py-2.5 px-3 text-center">Atlet Dipantau</th>
                    <th className="py-2.5 px-3 text-right">Kelajuan Semakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]/60 text-[#E5E5E7]">
                  {coaches.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-bold text-white">{c.name}</td>
                      <td className="py-2.5 px-3 text-[#96989F]">{c.clubName}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#202126] border border-[#37383D] text-[11px] text-[#C5C6CA]">
                          {c.certifications.join(", ") || "SPKK Tahap 1"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {c.assignedAthleteIds.length} Atlet
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#4ADE80] font-bold">
                        &lt; 18 Jam
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
