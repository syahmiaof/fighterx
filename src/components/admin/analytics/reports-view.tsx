"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Printer,
  Search,
  Building2,
  Calendar,
  Sparkles,
  Swords,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useAdminState } from "@/lib/admin/store";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";

interface ClubComplianceRow {
  id: string;
  rank: number;
  clubName: string;
  state: string;
  totalAthletes: number;
  attendanceRate: number;
  verificationVelocityHours: number;
  complianceScore: number;
  status: "CEMERLANG" | "BAIK" | "SEDERHANA";
}

export function ReportsView() {
  const { clubs, kpiStats } = useAdminState();

  // Filters
  const [dateRange, setDateRange] = useState<"MONTH" | "QUARTER" | "YEAR">("MONTH");
  const [selectedClubId, setSelectedClubId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Build ranking rows from actual clubs in store
  const rankingData: ClubComplianceRow[] = useMemo(() => {
    const list = clubs.map((club) => {
      // Deterministic realistic metrics derived from club attributes
      const baseAttendance = 70 + ((club.name.length * 3) % 25);
      const velocity = 12 + ((club.name.length * 2) % 16);
      const compliance = Math.min(100, Math.round((baseAttendance * 0.7) + (30 - velocity)));
      const status: "CEMERLANG" | "BAIK" | "SEDERHANA" =
        compliance >= 85 ? "CEMERLANG" : compliance >= 75 ? "BAIK" : "SEDERHANA";

      return {
        id: club.id,
        rank: 0,
        clubName: club.name,
        state: club.state,
        totalAthletes: club.memberCount || 6,
        attendanceRate: baseAttendance,
        verificationVelocityHours: velocity,
        complianceScore: compliance,
        status,
      };
    });

    // Sort by compliance score descending
    list.sort((a, b) => b.complianceScore - a.complianceScore);
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    return list;
  }, [clubs]);

  // Filtered rows
  const filteredData = useMemo(() => {
    return rankingData.filter((row) => {
      if (selectedClubId !== "ALL" && row.id !== selectedClubId) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = row.clubName.toLowerCase().includes(q);
        const matchesState = row.state.toLowerCase().includes(q);
        if (!matchesName && !matchesState) return false;
      }
      return true;
    });
  }, [rankingData, selectedClubId, searchQuery]);

  // Export CSV Functionality (Genuine CSV generation and download)
  const handleExportCSV = () => {
    const headers = [
      "Kedudukan",
      "Nama Kelab",
      "Negeri",
      "Jumlah Atlet",
      "Kadar Kehadiran (%)",
      "Kelajuan Pengesahan (Jam)",
      "Skor Kepatuhan (%)",
      "Taraf Prestasi",
    ];

    const rows = filteredData.map((d) => [
      d.rank,
      `"${d.clubName}"`,
      `"${d.state}"`,
      d.totalAthletes,
      d.attendanceRate,
      d.verificationVelocityHours,
      d.complianceScore,
      d.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Laporan_Prestasi_FighterX_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF Simulation (Triggers window.print with styling)
  const handleExportPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const columns: Column<ClubComplianceRow>[] = [
    {
      header: "Kedudukan",
      key: "rank",
      className: "w-16 font-mono font-bold text-center",
      cell: (row) => (
        <span
          className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-black text-xs ${
            row.rank === 1
              ? "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40"
              : row.rank === 2
              ? "bg-[#C5C6CA]/20 text-white border border-[#C5C6CA]/40"
              : row.rank === 3
              ? "bg-[#E10600]/20 text-[#FF555A] border border-[#FF3845]/40"
              : "text-[#96989F]"
          }`}
        >
          #{row.rank}
        </span>
      ),
    },
    {
      header: "Nama Kelab / Organisasi",
      key: "clubName",
      cell: (row) => (
        <div>
          <div className="font-bold text-white text-sm">{row.clubName}</div>
          <div className="text-[11px] text-[#96989F]">{row.state}</div>
        </div>
      ),
    },
    {
      header: "Jumlah Atlet",
      key: "totalAthletes",
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-xs text-[#E5E5E7] font-semibold">
          {row.totalAthletes} Atlet
        </span>
      ),
    },
    {
      header: "Kadar Kehadiran",
      key: "attendanceRate",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-[#202126] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                row.attendanceRate >= 80
                  ? "bg-[#22C55E]"
                  : row.attendanceRate >= 70
                  ? "bg-[#38BDF8]"
                  : "bg-[#F59E0B]"
              }`}
              style={{ width: `${row.attendanceRate}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-white">
            {row.attendanceRate}%
          </span>
        </div>
      ),
    },
    {
      header: "Kelajuan Pengesahan",
      key: "verificationVelocityHours",
      className: "text-center",
      cell: (row) => (
        <span className="font-mono text-xs text-[#96989F]">
          ~{row.verificationVelocityHours} Jam
        </span>
      ),
    },
    {
      header: "Skor Kepatuhan",
      key: "complianceScore",
      className: "text-center",
      cell: (row) => (
        <span
          className={`font-mono text-sm font-black ${
            row.complianceScore >= 85
              ? "text-[#4ADE80]"
              : row.complianceScore >= 75
              ? "text-[#60A5FA]"
              : "text-[#FBBF24]"
          }`}
        >
          {row.complianceScore}/100
        </span>
      ),
    },
    {
      header: "Taraf",
      key: "status",
      className: "text-right",
      cell: (row) => (
        <AdminBadge
          variant={
            row.status === "CEMERLANG"
              ? "success"
              : row.status === "BAIK"
              ? "info"
              : "warning"
          }
          size="sm"
        >
          {row.status}
        </AdminBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555A] text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Laporan Platform & Audit Pematuhan Silat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Laporan Prestasi & Kepatuhan Organisasi
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1">
            Penjanaan laporan rasmi berkaitan kadar kehadiran atlet, kelajuan pengesahan jurulatih dan audit kelab.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#96989F]" />
            Cetak / PDF
          </AdminButton>

          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Eksport CSV
          </AdminButton>
        </div>
      </div>

      {/* Primary Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Purata Kehadiran</span>
            <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {kpiStats.verifiedSubmissionsCount || 76}%
          </div>
          <div className="text-[11px] text-[#4ADE80] font-semibold mt-1">
            ▲ +8% berbanding suku lepas
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Kelajuan Pengesahan</span>
            <Clock className="w-4 h-4 text-[#60A5FA]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            18.2 Jam
          </div>
          <div className="text-[11px] text-[#60A5FA] font-semibold mt-1">
            Purata masa jurulatih semak video
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Kepatuhan Silat Seni</span>
            <Sparkles className="w-4 h-4 text-[#FF555A]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            88.4%
          </div>
          <div className="text-[11px] text-[#FF555A] font-semibold mt-1">
            16 atlet aktif berdaftar
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] shadow-md">
          <div className="flex items-center justify-between text-xs text-[#96989F] mb-1">
            <span>Kepatuhan Silat Olahraga</span>
            <Swords className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            81.6%
          </div>
          <div className="text-[11px] text-[#38BDF8] font-semibold mt-1">
            12 atlet aktif berdaftar
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96989F]" />
          <input
            type="text"
            placeholder="Cari nama kelab atau negeri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-white placeholder-[#96989F] focus:outline-none focus:border-[#FF3845]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date range filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#96989F]">
            <Calendar className="w-3.5 h-3.5" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as "MONTH" | "QUARTER" | "YEAR")}
              className="bg-[#202126] border border-[#37383D] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF3845]"
            >
              <option value="MONTH">Bulan Ini (Mac 2027)</option>
              <option value="QUARTER">Suku Tahunan Q1 2027</option>
              <option value="YEAR">Sepanjang Tahun 2027</option>
            </select>
          </div>

          {/* Club Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#96989F]">
            <Building2 className="w-3.5 h-3.5" />
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              className="bg-[#202126] border border-[#37383D] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF3845]"
            >
              <option value="ALL">Semua Kelab ({clubs.length})</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Kedudukan Prestasi & Kepatuhan Kelab
            </h3>
            <p className="text-xs text-[#96989F]">
              Disusun mengikut skor kepatuhan penghantaran bukti dan kadar pengesahan jurulatih
            </p>
          </div>
          <span className="text-xs text-[#96989F] font-mono">
            {filteredData.length} Organisasi Dipaparkan
          </span>
        </div>

        {filteredData.length > 0 ? (
          <AdminTable columns={columns} data={filteredData} keyExtractor={(r) => r.id} />
        ) : (
          <div className="py-12 text-center rounded-xl bg-[#202126]/40 border border-[#27272A] border-dashed">
            <AlertCircle className="w-10 h-10 text-[#F59E0B] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Tiada Data Padanan</h4>
            <p className="text-xs text-[#96989F] mt-1 max-w-sm mx-auto">
              Tiada kelab yang menepati kriteria carian atau tapisan yang dipilih. Sila tetapkan semula tapisan anda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedClubId("ALL");
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-[#282A32] text-xs font-semibold text-white hover:bg-[#37383D]"
            >
              Kosongkan Tapisan
            </button>
          </div>
        )}
      </div>

      {/* Discipline Comparison Summary Table */}
      <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg space-y-4">
        <div className="pb-3 border-b border-[#27272A]">
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF3845]" />
            Perbandingan Metrik: Silat Seni vs Silat Olahraga
          </h3>
          <p className="text-xs text-[#96989F]">
            Analisis silang antara disiplin persembahan teknikal dan tempur gelanggang
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[#96989F] uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Metrik Penilaian</th>
                <th className="py-2.5 px-3 text-[#FF555A] font-bold">Silat Seni</th>
                <th className="py-2.5 px-3 text-[#38BDF8] font-bold">Silat Olahraga</th>
                <th className="py-2.5 px-3 text-right">Varians / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/60 text-[#E5E5E7]">
              <tr>
                <td className="py-2.5 px-3 font-semibold">Jumlah Atlet Didaftarkan</td>
                <td className="py-2.5 px-3 font-mono font-bold">16 Orang (57.1%)</td>
                <td className="py-2.5 px-3 font-mono font-bold">12 Orang (42.9%)</td>
                <td className="py-2.5 px-3 text-right text-[#96989F]">Disiplin tunggal dipatuhi 100%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Kadar Penghantaran Video</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#4ADE80]">94.2%</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#4ADE80]">91.8%</td>
                <td className="py-2.5 px-3 text-right text-[#4ADE80]">+2.4% Seni lebih konsisten</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Purata Skor Penilaian Teknikal</td>
                <td className="py-2.5 px-3 font-mono font-bold">86.5 / 100 (Cemerlang)</td>
                <td className="py-2.5 px-3 font-mono font-bold">82.1 / 100 (Baik)</td>
                <td className="py-2.5 px-3 text-right text-[#96989F]">Standard PERSILAT & Wasit</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Kadar Kecederaan Atlet</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#4ADE80]">0.0% (Tiada)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#F87171]">8.3% (1 Atlet - Ligamen)</td>
                <td className="py-2.5 px-3 text-right text-[#FBBF24]">Amirul Haziq (Pelepasan Tertangguh)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
