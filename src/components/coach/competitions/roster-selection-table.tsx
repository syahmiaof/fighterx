"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Check,
  Scale,
  AlertTriangle,
  UserCheck,
  UserMinus,
  Search,
} from "lucide-react";
import { useCoachState, useCoachActions } from "@/lib/coach/store";
import type { CompetitionRosterItem, WeightStatus } from "@/lib/coach/types";
import { CoachBadge } from "@/components/coach/ui/coach-badge";
import { CoachButton } from "@/components/coach/ui/coach-button";

interface RosterSelectionTableProps {
  competitionId: string;
  roster: CompetitionRosterItem[];
}

type RosterFilter = "Semua" | "Terpilih" | "Belum Dipilih" | "Siap Tanding";

export function RosterSelectionTable({
  competitionId,
  roster,
}: RosterSelectionTableProps) {
  const { athletes } = useCoachState();
  const { updateCompetitionRoster } = useCoachActions();
  const [filter, setFilter] = useState<RosterFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const athleteMap = useMemo(() => {
    const map = new Map<string, (typeof athletes)[0]>();
    for (const a of athletes) {
      map.set(a.id, a);
    }
    return map;
  }, [athletes]);

  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      const athlete = athleteMap.get(item.athleteId);
      const name = item.athleteName || athlete?.name || item.athleteId;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = name.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesCat) return false;
      }

      if (filter === "Terpilih" && !item.isSelected) return false;
      if (filter === "Belum Dipilih" && item.isSelected) return false;
      if (filter === "Siap Tanding" && (item.weightStatus !== "Ok" || item.readinessScore < 80)) {
        return false;
      }

      return true;
    });
  }, [roster, athleteMap, filter, searchQuery]);

  const handleToggle = (athleteId: string, currentSelected: boolean) => {
    updateCompetitionRoster(competitionId, athleteId, !currentSelected);
  };

  const weightBadgeVariant = (ws: WeightStatus) => {
    switch (ws) {
      case "Ok":
        return "green";
      case "Over":
        return "red";
      case "Under":
        return "yellow";
    }
  };

  const selectedCount = roster.filter((r) => r.isSelected).length;

  return (
    <div className="space-y-4">
      {/* Roster Controls: Filter Tabs, Search, and Selected Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121316] p-3 rounded-lg border border-[#45464b]/40">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {(["Semua", "Terpilih", "Belum Dipilih", "Siap Tanding"] as RosterFilter[]).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#25272e] text-white shadow-sm border border-[#ff3845]/40"
                    : "text-[#96989f] hover:text-white"
                }`}
              >
                {tab}
                {tab === "Terpilih" && ` (${selectedCount})`}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-60">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#96989f]" />
          <input
            type="text"
            placeholder="Cari atlet dalam skuad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#45464b] bg-[#1a1c22] py-1 pl-8 pr-2.5 text-xs text-white placeholder-[#96989f] focus:border-[#ff3845] focus:outline-none"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto rounded-lg border border-[#45464b]/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#121316] text-[#96989f] uppercase tracking-wider text-[10px] border-b border-[#45464b]/50">
            <tr>
              <th className="py-3 px-4 font-semibold">Atlet</th>
              <th className="py-3 px-4 font-semibold">Kategori Pertandingan</th>
              <th className="py-3 px-4 font-semibold text-center">Status Berat</th>
              <th className="py-3 px-4 font-semibold text-center">Skor Kesiagaan</th>
              <th className="py-3 px-4 font-semibold text-center">Status Skuad</th>
              <th className="py-3 px-4 font-semibold text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#45464b]/30 bg-[#17191e]/60">
            {filteredRoster.map((item) => {
              const athlete = athleteMap.get(item.athleteId);
              const name = item.athleteName || athlete?.name || item.athleteId;
              const category = item.category || athlete?.category || "Silat Olahraga";
              const currentWeight = item.currentWeightKg || athlete?.currentWeightKg || 55;
              const maxWeight = item.targetMaxWeightKg || athlete?.targetWeightKg || 55;
              const isInjured = athlete?.status === "Injured";

              return (
                <tr
                  key={item.athleteId}
                  className={`hover:bg-[#1f2127]/80 transition-colors ${
                    item.isSelected ? "bg-[#ff3845]/5" : ""
                  }`}
                >
                  {/* Athlete Info */}
                  <td className="py-3.5 px-4 font-medium text-white">
                    <Link
                      href={`/coach/athletes/${item.athleteId}`}
                      className="hover:text-[#ff3845] transition-colors"
                    >
                      <div className="font-semibold text-white flex items-center gap-2">
                        {name}
                        {isInjured && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#ff555a] bg-[#e10600]/20 px-1.5 py-0.2 rounded">
                            <AlertTriangle size={10} /> Cedera
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#96989f]">
                        ID: {item.athleteId} • {athlete?.discipline || "Silat"}
                      </div>
                    </Link>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-[#c5c6ca]">
                    <div>{category}</div>
                    <div className="text-[10px] text-[#96989f]">
                      Had Maks: {maxWeight} kg
                    </div>
                  </td>

                  {/* Weight Status */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <CoachBadge variant={weightBadgeVariant(item.weightStatus)} size="sm">
                        <Scale size={11} />
                        {item.weightStatus === "Ok" ? "Berat Ok" : item.weightStatus === "Over" ? "Lebih Had" : "Bawah Had"}
                      </CoachBadge>
                      <span className="text-[10px] text-[#96989f]">
                        {currentWeight} kg
                      </span>
                    </div>
                  </td>

                  {/* Readiness Score */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-xs font-bold text-white">
                        {item.readinessScore}%
                      </span>
                      <div className="w-16 h-1.5 bg-[#202126] rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            item.readinessScore >= 80
                              ? "bg-[#22c55e]"
                              : item.readinessScore >= 60
                              ? "bg-[#f59e0b]"
                              : "bg-[#e10600]"
                          }`}
                          style={{ width: `${item.readinessScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Selection Status */}
                  <td className="py-3.5 px-4 text-center">
                    {item.isSelected ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4ade80] bg-[#22c55e]/15 px-2.5 py-0.5 rounded-full border border-[#22c55e]/40">
                        <Check size={12} /> Terpilih
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[#96989f] bg-[#202126] px-2 py-0.5 rounded-full border border-[#45464b]/40">
                        Simpanan
                      </span>
                    )}
                  </td>

                  {/* Toggle Button */}
                  <td className="py-3.5 px-4 text-right">
                    <CoachButton
                      variant={item.isSelected ? "danger" : "primary"}
                      size="sm"
                      icon={item.isSelected ? <UserMinus size={13} /> : <UserCheck size={13} />}
                      onClick={() => handleToggle(item.athleteId, item.isSelected)}
                    >
                      {item.isSelected ? "Keluarkan" : "Pilih Skuad"}
                    </CoachButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
