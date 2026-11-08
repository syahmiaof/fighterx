"use client";

import React, { useState, useMemo } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  Building,
  Users,
  Search,
  ShieldAlert,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type {
  CompetitionEvent,
  CompetitionClassification,
  CompetitionStatus,
} from "@/lib/admin/types";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { CompetitionReadinessModal } from "./competition-readiness-modal";

export function CompetitionCalendarView() {
  const { competitions } = useAdminState();
  const { updateCompetitionStatus } = useAdminActions();

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | CompetitionStatus>("ALL");
  const [selectedClassification, setSelectedClassification] = useState<
    "ALL" | CompetitionClassification
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedCompForReview, setSelectedCompForReview] =
    useState<CompetitionEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status options for lifecycle transition dropdown
  const statusOptions: CompetitionStatus[] = [
    "Draft",
    "Open",
    "Active",
    "Completed",
  ];

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      if (selectedStatus !== "ALL" && comp.status !== selectedStatus) return false;
      if (
        selectedClassification !== "ALL" &&
        comp.classification !== selectedClassification
      )
        return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = comp.title.toLowerCase().includes(q);
        const matchesLocation = comp.location.toLowerCase().includes(q);
        const matchesOrganizer = comp.organizer.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocation && !matchesOrganizer) return false;
      }
      return true;
    });
  }, [competitions, selectedStatus, selectedClassification, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555A] text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Pengurusan Kejohanan & Kalendar Acara Rasmi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kalendar Pertandingan & Kesediaan Kontinjen
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1">
            Penjadualan kejohanan Silat peringkat Kebangsaan, Negeri dan Zon serta audit kesediaan atlet.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <AdminBadge variant="accent" size="md">
            {competitions.length} Acara Berjadual
          </AdminBadge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#17191E] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96989F]" />
          <input
            type="text"
            placeholder="Cari nama kejohanan, lokasi atau penganjur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-white placeholder-[#96989F] focus:outline-none focus:border-[#FF3845]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Classification Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#96989F]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedClassification}
              onChange={(e) =>
                setSelectedClassification(
                  e.target.value as "ALL" | CompetitionClassification
                )
              }
              className="bg-[#202126] border border-[#37383D] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF3845]"
            >
              <option value="ALL">Semua Klasifikasi</option>
              <option value="Major">Major (Kategori A)</option>
              <option value="Development">Development (Kategori B)</option>
              <option value="Exposure">Exposure (Kategori C)</option>
            </select>
          </div>

          {/* Lifecycle Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#96989F]">
            <Clock className="w-3.5 h-3.5" />
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as "ALL" | CompetitionStatus)
              }
              className="bg-[#202126] border border-[#37383D] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF3845]"
            >
              <option value="ALL">Semua Status Kitaran</option>
              <option value="Draft">Draf (Persediaan)</option>
              <option value="Open">Pendaftaran Dibuka</option>
              <option value="Active">Sedang Berlangsung</option>
              <option value="Completed">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Competitions Cards Listing */}
      <div className="space-y-4">
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map((comp) => {
            const hasInjured = comp.readinessReview.some(
              (r) => r.medicalClearanceRequired && !r.isCleared
            );

            return (
              <div
                key={comp.id}
                className="rounded-xl bg-[#17191E] border border-[#27272A] hover:border-[#37383D] p-5 shadow-lg space-y-4 transition-all"
              >
                {/* Header Row: Title, Category Badges & Lifecycle Status Dropdown */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#27272A]">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <AdminBadge
                        variant={
                          comp.classification === "Major"
                            ? "danger"
                            : comp.classification === "Development"
                            ? "warning"
                            : "info"
                        }
                        size="sm"
                      >
                        {comp.levelBadge || comp.classification}
                      </AdminBadge>

                      <span className="text-xs font-semibold text-[#96989F]">
                        Klasifikasi: <strong>{comp.classification}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {comp.title}
                    </h3>
                  </div>

                  {/* Lifecycle Status Switcher */}
                  <div className="flex items-center gap-3 self-start lg:self-auto">
                    <div className="text-xs text-[#96989F]">Status Kitaran:</div>
                    <select
                      value={comp.status}
                      onChange={(e) =>
                        updateCompetitionStatus(
                          comp.id,
                          e.target.value as CompetitionStatus
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                        comp.status === "Open"
                          ? "bg-[#22C55E]/15 text-[#4ADE80] border-[#22C55E]/40"
                          : comp.status === "Active"
                          ? "bg-[#FF3845]/20 text-[#FF555A] border-[#FF3845]/50 animate-pulse"
                          : comp.status === "Completed"
                          ? "bg-[#94A3B8]/15 text-[#C5C6CA] border-[#94A3B8]/30"
                          : "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/40"
                      }`}
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st} className="bg-[#17191E] text-white">
                          {st === "Draft"
                            ? "Draf (Persediaan)"
                            : st === "Open"
                            ? "Pendaftaran Dibuka"
                            : st === "Active"
                            ? "Sedang Berlangsung"
                            : "Selesai"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#C5C6CA]">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-[#96989F] font-bold block">
                        Tarikh Kejohanan
                      </span>
                      <span className="font-semibold text-white">{comp.dates}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-[#96989F] font-bold block">
                        Lokasi / Gelanggang
                      </span>
                      <span className="font-semibold text-white">{comp.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-[#96989F] font-bold block">
                        Penganjur Rasmi
                      </span>
                      <span className="font-semibold text-white">{comp.organizer}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase text-[#96989F] font-bold block">
                        Kelab & Atlet Dicalonkan
                      </span>
                      <span className="font-semibold text-white">
                        {comp.participatingClubIds.length} Kelab • {comp.readinessReview.length} Atlet
                      </span>
                    </div>
                  </div>
                </div>

                {/* Readiness Review Action Bar */}
                <div className="p-3.5 rounded-xl bg-[#202126] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {hasInjured ? (
                      <div className="flex items-center gap-2 text-xs text-[#F87171] font-semibold">
                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Amaran: Terdapat atlet cedera yang <strong>memerlukan pelepasan perubatan manual</strong>.
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-[#4ADE80] font-semibold">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Semua calon atlet disahkan cergas bertanding.</span>
                      </div>
                    )}
                  </div>

                  <AdminButton
                    variant={hasInjured ? "primary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCompForReview(comp);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 self-end sm:self-auto text-xs"
                  >
                    <span>Semak Kesediaan Kontinjen</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </AdminButton>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center rounded-xl bg-[#202126]/40 border border-[#27272A] border-dashed">
            <Trophy className="w-10 h-10 text-[#96989F] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Tiada Pertandingan Dijumpai</h4>
            <p className="text-xs text-[#96989F] mt-1 max-w-sm mx-auto">
              Sila ubah carian atau kriteria tapisan untuk melihat senarai pertandingan lain.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <CompetitionReadinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        competition={selectedCompForReview}
      />
    </div>
  );
}
