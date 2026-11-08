"use client";

import React, { useState, useMemo } from "react";
import { Search, Users, LayoutGrid, List } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { AthleteDirectoryTable } from "@/components/coach/athletes/athlete-directory-table";

export default function AthletesDirectoryPage() {
  const { athletes } = useCoachState();
  const [searchQuery, setSearchQuery] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("ALL");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filtered athletes
  const filteredAthletes = useMemo(() => {
    return athletes.filter((ath) => {
      // Search query (name, category, weightClass)
      if (
        searchQuery &&
        !ath.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ath.discipline.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ath.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Discipline filter
      if (disciplineFilter !== "ALL" && ath.discipline !== disciplineFilter) {
        return false;
      }

      // Consistency tier filter
      if (tierFilter !== "ALL" && ath.consistencyTier !== tierFilter) {
        return false;
      }

      return true;
    });
  }, [athletes, searchQuery, disciplineFilter, tierFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users size={26} className="text-[#ff3845]" />
            Pengurusan Atlet
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-[#c5c6ca] border border-white/20">
              {athletes.length} Atlet
            </span>
          </h1>
          <p className="text-xs text-[#96989f] mt-1">
            Direktori skuad, pemantauan konsistensi, kehadiran dan skor kesediaan
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-[#45464b]/60 bg-[#17191e] p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded ${
                viewMode === "table"
                  ? "bg-[#25272e] text-white"
                  : "text-[#96989f] hover:text-white"
              }`}
              title="Paparan Jadual"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${
                viewMode === "grid"
                  ? "bg-[#25272e] text-white"
                  : "text-[#96989f] hover:text-white"
              }`}
              title="Paparan Kad Grid"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#96989f]"
          />
          <input
            type="text"
            placeholder="Cari nama atlet, kelas berat, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#45464b]/60 bg-[#17191e] py-2 pl-10 pr-4 text-xs text-white placeholder-[#96989f] focus:border-[#ff3845] focus:outline-none focus:ring-1 focus:ring-[#ff3845]"
          />
        </div>

        {/* Discipline filter */}
        <div className="flex items-center gap-2">
          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            className="rounded-lg border border-[#45464b]/60 bg-[#17191e] py-2 px-3 text-xs text-white focus:border-[#ff3845] focus:outline-none"
          >
            <option value="ALL">Semua Disiplin</option>
            <option value="Silat Olahraga">Silat Olahraga</option>
            <option value="Silat Seni">Silat Seni</option>
          </select>

          {/* Tier filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-lg border border-[#45464b]/60 bg-[#17191e] py-2 px-3 text-xs text-white focus:border-[#ff3845] focus:outline-none"
          >
            <option value="ALL">Semua Tahap</option>
            <option value="KONSISTEN">Konsisten</option>
            <option value="SEDERHANA">Sederhana</option>
            <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
          </select>
        </div>
      </div>

      {/* Directory Table / Grid */}
      <AthleteDirectoryTable athletes={filteredAthletes} viewMode={viewMode} />
    </div>
  );
}
