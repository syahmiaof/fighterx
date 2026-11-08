"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Shield,
  Activity,
  Search,
  Clock,
} from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import type { CompetitionCategory, CompetitionStatus } from "@/lib/coach/types";
import { CoachCard } from "@/components/coach/ui/coach-card";
import { CoachBadge } from "@/components/coach/ui/coach-badge";
import { CoachButton } from "@/components/coach/ui/coach-button";

type FilterTier = "Semua" | "Major" | "Development" | "Exposure";

export function CompetitionListView() {
  const { competitions, athletes } = useCoachState();
  const [tierFilter, setTierFilter] = useState<FilterTier>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((c) => {
      if (tierFilter !== "Semua" && c.category !== tierFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesLoc = c.location.toLowerCase().includes(q);
        const matchesBody = c.sanctioningBody?.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesLoc && !matchesBody) return false;
      }
      return true;
    });
  }, [competitions, tierFilter, searchQuery]);

  // Overall athlete readiness stats
  const readinessStats = useMemo(() => {
    const totalAthletes = athletes.length;
    const fitCount = athletes.filter((a) => (a.readinessScore ?? 0) >= 80).length;
    const activeCount = athletes.filter((a) => a.status === "Active").length;
    const injuredCount = athletes.filter((a) => a.status === "Injured").length;
    const avgReadiness =
      totalAthletes > 0
        ? Math.round(athletes.reduce((sum, a) => sum + (a.readinessScore ?? 75), 0) / totalAthletes)
        : 0;

    return { totalAthletes, fitCount, activeCount, injuredCount, avgReadiness };
  }, [athletes]);

  const categoryBadgeVariant = (cat: CompetitionCategory) => {
    switch (cat) {
      case "Major":
        return "red";
      case "Development":
        return "yellow";
      case "Exposure":
        return "blue";
    }
  };

  const statusBadgeVariant = (status: CompetitionStatus) => {
    switch (status) {
      case "Pendaftaran Dibuka":
        return "blue";
      case "Persiapan":
        return "yellow";
      case "Selesai":
        return "green";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Pengurusan Pertandingan Skuad
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#ff3845]/20 text-[#ff555a] border border-[#ff3845]/40">
              Modul E
            </span>
          </div>
          <p className="mt-1 text-xs text-[#96989f]">
            Kalendar kejohanan silat, pemilihan senarai skuad utama, semakan had berat dan kesiagaan atlet.
          </p>
        </div>
      </div>

      {/* Squad Readiness Overview Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Kejohanan Aktif</span>
            <Trophy size={16} className="text-[#ff555a]" />
          </div>
          <div className="text-2xl font-black text-white">{competitions.length}</div>
          <span className="text-[10px] text-[#96989f]">Sirkit Kebangsaan &amp; Zon</span>
        </CoachCard>

        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Kesiagaan Purata</span>
            <Activity size={16} className="text-[#22c55e]" />
          </div>
          <div className="text-2xl font-black text-white">{readinessStats.avgReadiness}%</div>
          <span className="text-[10px] text-[#4ade80]">Tahap optimum skuad</span>
        </CoachCard>

        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Atlet Siap Tanding</span>
            <Users size={16} className="text-[#3b82f6]" />
          </div>
          <div className="text-2xl font-black text-white">
            {readinessStats.fitCount} <span className="text-xs font-normal text-[#96989f]">/ {readinessStats.totalAthletes}</span>
          </div>
          <span className="text-[10px] text-[#60a5fa]">Skor kesiagaan &ge; 80%</span>
        </CoachCard>

        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Status Cedera</span>
            <Shield size={16} className="text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-black text-white">
            {readinessStats.injuredCount} <span className="text-xs font-normal text-[#96989f]">Atlet</span>
          </div>
          <span className="text-[10px] text-[#fbbf24]">Dalam fasa pemulihan</span>
        </CoachCard>
      </div>

      {/* Filter Tabs & Search */}
      <CoachCard className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#121316] border border-[#45464b]/60 rounded-lg overflow-x-auto scrollbar-none">
            {(["Semua", "Major", "Development", "Exposure"] as FilterTier[]).map((tab) => {
              const isActive = tierFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setTierFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#25272e] text-white shadow-sm border border-[#ff3845]/40"
                      : "text-[#96989f] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#96989f]" />
            <input
              type="text"
              placeholder="Cari kejohanan atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#45464b] bg-[#121316] py-1.5 pl-9 pr-3 text-xs text-white placeholder-[#96989f] focus:border-[#ff3845] focus:outline-none"
            />
          </div>
        </div>
      </CoachCard>

      {/* Competitions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompetitions.map((comp) => {
          const selectedRosterCount = comp.roster.filter((r) => r.isSelected).length;
          const fitCount = comp.roster.filter((r) => r.weightStatus === "Ok" && r.readinessScore >= 80).length;

          return (
            <CoachCard key={comp.id} hoverable className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <CoachBadge variant={categoryBadgeVariant(comp.category)} size="sm">
                      {comp.category}
                    </CoachBadge>
                    <CoachBadge variant={statusBadgeVariant(comp.status)} size="sm">
                      {comp.status}
                    </CoachBadge>
                  </div>
                  {comp.sanctioningBody && (
                    <span className="text-[10px] text-[#96989f] bg-[#121316] px-2 py-0.5 rounded border border-[#45464b]/40">
                      {comp.sanctioningBody}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#ff3845] transition-colors">
                  {comp.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-[#c5c6ca]">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#96989f] flex-shrink-0" />
                    <span>{comp.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#96989f] flex-shrink-0" />
                    <span>{comp.location}</span>
                  </div>
                  {comp.registrationDeadline && (
                    <div className="flex items-center gap-2 text-[#fbbf24]">
                      <Clock size={13} className="flex-shrink-0" />
                      <span>Tarikh Tutup: {comp.registrationDeadline}</span>
                    </div>
                  )}
                </div>

                {/* Skuad Stats Box */}
                <div className="mt-4 p-3 rounded-lg bg-[#121316] border border-[#45464b]/40 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#96989f] block">Skuad Terpilih</span>
                    <span className="text-white font-bold text-sm">
                      {selectedRosterCount} <span className="text-[10px] font-normal text-[#96989f]">/ {comp.roster.length} Atlet</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#96989f] block">Calon Sedia Tanding</span>
                    <span className="text-[#4ade80] font-bold text-sm">
                      {fitCount} <span className="text-[10px] font-normal text-[#96989f]">Layak</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#45464b]/40 flex items-center justify-between">
                <span className="text-xs text-[#96989f]">
                  {comp.roster.length} calon tersenarai
                </span>
                <Link href={`/coach/competitions/${comp.id}`}>
                  <CoachButton variant="primary" size="sm" icon={<Users size={14} />}>
                    Urus Skuad &amp; Roster
                  </CoachButton>
                </Link>
              </div>
            </CoachCard>
          );
        })}
      </div>
    </div>
  );
}
