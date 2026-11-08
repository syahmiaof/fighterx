"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  Plus,
  Search,
  ChevronRight,
  Award,
  Target,
  FileText,
} from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import type { AssessmentRating, AssessmentType } from "@/lib/coach/types";
import { CoachCard } from "@/components/coach/ui/coach-card";
import { CoachBadge } from "@/components/coach/ui/coach-badge";
import { CoachButton } from "@/components/coach/ui/coach-button";
import { CoachModal } from "@/components/coach/ui/coach-modal";
import { AssessmentForm } from "@/components/coach/assessments/assessment-form";

type FilterTab = "Semua" | "Fizikal" | "Seni" | "Olahraga";

export function AssessmentListView() {
  const { assessments, athletes } = useCoachState();
  const [filterTab, setFilterTab] = useState<FilterTab>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<AssessmentType>("BASELINE_PHYSICAL");

  // Athlete lookup helper
  const athleteMap = useMemo(() => {
    const map = new Map<string, (typeof athletes)[0]>();
    for (const a of athletes) {
      map.set(a.id, a);
    }
    return map;
  }, [athletes]);

  // Filtered assessments
  const filteredAssessments = useMemo(() => {
    return assessments.filter((asm) => {
      // Type filter
      if (filterTab === "Fizikal" && asm.type !== "BASELINE_PHYSICAL") return false;
      if (filterTab === "Seni" && asm.type !== "TECHNICAL_SENI") return false;
      if (filterTab === "Olahraga" && asm.type !== "TECHNICAL_OLAHRAGA") return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = asm.athleteName.toLowerCase().includes(q);
        const matchesNotes = asm.notes?.toLowerCase().includes(q) ?? false;
        const matchesCycle = asm.cycle?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesNotes && !matchesCycle) return false;
      }

      return true;
    });
  }, [assessments, filterTab, searchQuery]);

  const ratingBadgeVariant = (r: AssessmentRating) => {
    switch (r) {
      case "CEMERLANG":
        return "green";
      case "BAIK":
        return "blue";
      case "MEMUASKAN":
        return "yellow";
      case "PERLU_BIMBINGAN":
        return "red";
    }
  };

  const getTypeName = (t: AssessmentType) => {
    switch (t) {
      case "BASELINE_PHYSICAL":
        return "Fizikal Baseline";
      case "TECHNICAL_SENI":
        return "Silat Seni";
      case "TECHNICAL_OLAHRAGA":
        return "Silat Olahraga";
    }
  };

  const openNewAssessmentModal = (type: AssessmentType = "BASELINE_PHYSICAL") => {
    setPreselectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Penilaian &amp; Rubrik Prestasi
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#ff3845]/20 text-[#ff555a] border border-[#ff3845]/40">
              Modul D
            </span>
          </div>
          <p className="mt-1 text-xs text-[#96989f]">
            Piawaian ujian berkala kecergasan asas (ISN) dan rubrik teknikal silat seni &amp; olahraga skuad.
          </p>
        </div>

        <CoachButton
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => openNewAssessmentModal("BASELINE_PHYSICAL")}
        >
          Cipta Penilaian Baharu
        </CoachButton>
      </div>

      {/* Rubric Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Physical Rubric */}
        <CoachCard hoverable className="p-4 cursor-pointer" onClick={() => openNewAssessmentModal("BASELINE_PHYSICAL")}>
          <div className="flex items-center justify-between mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#60a5fa]">
              <Activity size={18} />
            </div>
            <CoachBadge variant="blue" size="sm">ISN Standard</CoachBadge>
          </div>
          <h3 className="text-sm font-bold text-white">Fizikal Baseline 2027</h3>
          <p className="mt-1 text-[11px] text-[#96989f] line-clamp-2">
            Larian 6 minit, push-up 1 minit, ujian ketahanan teras (plank) &amp; mobiliti knee-to-wall.
          </p>
          <div className="mt-3 pt-3 border-t border-[#45464b]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#c5c6ca]">4 Parameter Asas</span>
            <span className="text-[#ff555a] font-semibold flex items-center gap-1">
              Uji Sekarang <ChevronRight size={13} />
            </span>
          </div>
        </CoachCard>

        {/* Silat Seni Technical Rubric */}
        <CoachCard hoverable className="p-4 cursor-pointer" onClick={() => openNewAssessmentModal("TECHNICAL_SENI")}>
          <div className="flex items-center justify-between mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#fbbf24]">
              <Award size={18} />
            </div>
            <CoachBadge variant="yellow" size="sm">Seni Silat</CoachBadge>
          </div>
          <h3 className="text-sm font-bold text-white">Teknikal Silat Seni</h3>
          <p className="mt-1 text-[11px] text-[#96989f] line-clamp-2">
            Rubrik jurus tunggal/ganda/regu, ketepatan bukaan pasang, stamina 3 minit &amp; ekspresi daya seni.
          </p>
          <div className="mt-3 pt-3 border-t border-[#45464b]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#c5c6ca]">Skor 1 - 10 Piawai</span>
            <span className="text-[#ff555a] font-semibold flex items-center gap-1">
              Uji Sekarang <ChevronRight size={13} />
            </span>
          </div>
        </CoachCard>

        {/* Silat Olahraga Technical Rubric */}
        <CoachCard hoverable className="p-4 cursor-pointer" onClick={() => openNewAssessmentModal("TECHNICAL_OLAHRAGA")}>
          <div className="flex items-center justify-between mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#e10600]/20 border border-[#e10600]/50 flex items-center justify-center text-[#ff555a]">
              <Target size={18} />
            </div>
            <CoachBadge variant="red" size="sm">Tanding</CoachBadge>
          </div>
          <h3 className="text-sm font-bold text-white">Teknikal Silat Olahraga</h3>
          <p className="mt-1 text-[11px] text-[#96989f] line-clamp-2">
            Kelajuan serangan sabit/tumbukan, elakan pantas, kawalan jarak &amp; taktikal bantingan/jatuhan.
          </p>
          <div className="mt-3 pt-3 border-t border-[#45464b]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#c5c6ca]">Skor 1 - 10 Piawai</span>
            <span className="text-[#ff555a] font-semibold flex items-center gap-1">
              Uji Sekarang <ChevronRight size={13} />
            </span>
          </div>
        </CoachCard>
      </div>

      {/* Filter Tabs & Search Bar */}
      <CoachCard className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121316] border border-[#45464b]/60 rounded-lg overflow-x-auto scrollbar-none">
            {(["Semua", "Fizikal", "Seni", "Olahraga"] as FilterTab[]).map((tab) => {
              const isActive = filterTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
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

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#96989f]"
            />
            <input
              type="text"
              placeholder="Cari atlet, kitaran, atau catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#45464b] bg-[#121316] py-1.5 pl-9 pr-3 text-xs text-white placeholder-[#96989f] focus:border-[#ff3845] focus:outline-none"
            />
          </div>
        </div>
      </CoachCard>

      {/* Assessment History Table */}
      <CoachCard className="overflow-hidden">
        <div className="p-4 border-b border-[#45464b]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Log Rekod Penilaian Skuad</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#202126] text-[#c5c6ca] border border-[#45464b]/60">
              {filteredAssessments.length} Rekod
            </span>
          </div>
          <span className="text-[11px] text-[#96989f]">Dikemaskini secara masa nyata</span>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="mx-auto text-[#96989f] mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-white">Tiada rekod penilaian dijumpai</h4>
            <p className="text-xs text-[#96989f] mt-1">
              Sila tukar penapis carian atau rekodkan ujian penilaian baharu untuk skuad.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121316]/70 text-[#96989f] uppercase tracking-wider text-[10px] border-b border-[#45464b]/40">
                <tr>
                  <th className="py-3 px-4 font-semibold">Atlet</th>
                  <th className="py-3 px-4 font-semibold">Jenis Penilaian</th>
                  <th className="py-3 px-4 font-semibold">Kitaran</th>
                  <th className="py-3 px-4 font-semibold">Tarikh</th>
                  <th className="py-3 px-4 font-semibold text-center">Skor Komposit</th>
                  <th className="py-3 px-4 font-semibold text-center">Penarafan</th>
                  <th className="py-3 px-4 font-semibold text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#45464b]/30">
                {filteredAssessments.map((asm) => {
                  const athlete = athleteMap.get(asm.athleteId);
                  return (
                    <tr
                      key={asm.id}
                      className="hover:bg-[#1f2127]/60 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-medium text-white">
                        <Link
                          href={`/coach/athletes/${asm.athleteId}`}
                          className="hover:text-[#ff3845] transition-colors"
                        >
                          <div className="font-semibold">{asm.athleteName}</div>
                          {athlete && (
                            <div className="text-[11px] text-[#96989f]">
                              {athlete.discipline} • {athlete.category}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#e5e5e7]">
                          {getTypeName(asm.type)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#c5c6ca]">
                        {asm.cycle || "Baseline Q1"}
                      </td>
                      <td className="py-3.5 px-4 text-[#96989f]">
                        {asm.date}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-black text-white text-sm">
                          {asm.totalScore}
                        </span>
                        <span className="text-[10px] text-[#96989f]">/100</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <CoachBadge variant={ratingBadgeVariant(asm.rating)} size="sm">
                          {asm.rating}
                        </CoachBadge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/coach/assessments/${asm.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff555a] hover:text-[#ff3845] transition-colors bg-[#ff3845]/10 hover:bg-[#ff3845]/20 px-2.5 py-1 rounded-md border border-[#ff3845]/30"
                        >
                          Lihat / Rekod
                          <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CoachCard>

      {/* Record Assessment Modal */}
      <CoachModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cipta &amp; Rekod Penilaian Atlet Baharu"
        maxWidth="lg"
      >
        <AssessmentForm
          initialType={preselectedType}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </CoachModal>
    </div>
  );
}
