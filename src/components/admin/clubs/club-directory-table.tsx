"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type {
  AdminClub,
  SaaSClubSubscriptionStatus,
} from "@/lib/admin/types";
import { useAdminState } from "@/lib/admin/store";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";
import { AdminBadge, type AdminBadgeVariant } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminSearchFilter } from "@/components/admin/ui/admin-search-filter";
import { ClubDetailModal } from "./club-detail-modal";
import {
  Users,
  UserCheck,
  MapPin,
  Eye,
  FileCheck,
  ChevronRight,
} from "lucide-react";

const subStatusBadgeConfig: Record<
  SaaSClubSubscriptionStatus,
  { label: string; variant: AdminBadgeVariant; dot: boolean }
> = {
  ACTIVE: { label: "Aktif (RM20/bln)", variant: "success", dot: true },
  TRIALING: { label: "Percubaan 30 Hari", variant: "warning", dot: true },
  PAST_DUE: { label: "Tertunggak", variant: "danger", dot: true },
  NOT_STARTED: { label: "Belum Bermula", variant: "neutral", dot: false },
  EXPIRED: { label: "Tamat Tempoh", variant: "neutral", dot: false },
  CANCELED: { label: "Dibatalkan", variant: "neutral", dot: false },
};

export function ClubDirectoryTable() {
  const { clubs, applications } = useAdminState();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedSubStatus, setSelectedSubStatus] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Detail Modal state
  const [selectedClub, setSelectedClub] = useState<AdminClub | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aggregated KPI Stats
  const stats = useMemo(() => {
    let activeSubs = 0;
    let trialingSubs = 0;
    let pastDueSubs = 0;
    let totalAthletes = 0;
    let totalCoaches = 0;

    clubs.forEach((club) => {
      if (club.subscriptionStatus === "ACTIVE") activeSubs++;
      if (club.subscriptionStatus === "TRIALING") trialingSubs++;
      if (club.subscriptionStatus === "PAST_DUE") pastDueSubs++;
      totalAthletes += club.memberCount || 0;
      totalCoaches += club.coachCount || 0;
    });

    return {
      totalClubs: clubs.length,
      activeSubs,
      trialingSubs,
      pastDueSubs,
      totalAthletes,
      totalCoaches,
    };
  }, [clubs]);

  // Pending applications count
  const pendingCount = useMemo(() => {
    return applications.filter((a) => a.status === "PENDING").length;
  }, [applications]);

  // Filtered Clubs list
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      // Discipline filter
      if (selectedDiscipline !== "ALL" && club.discipline !== selectedDiscipline) {
        return false;
      }

      // Subscription status filter
      if (
        selectedSubStatus !== "ALL" &&
        club.subscriptionStatus !== selectedSubStatus
      ) {
        return false;
      }

      // Organization type filter
      if (selectedType !== "ALL" && club.type !== selectedType) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          club.name.toLowerCase().includes(q) ||
          club.registrationNumber.toLowerCase().includes(q) ||
          club.state.toLowerCase().includes(q) ||
          club.district.toLowerCase().includes(q) ||
          club.contactPerson.toLowerCase().includes(q) ||
          club.email.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [clubs, selectedDiscipline, selectedSubStatus, selectedType, searchQuery]);

  // Modal active club updated from current store state
  const activeModalClub = useMemo(() => {
    if (!selectedClub) return null;
    return clubs.find((c) => c.id === selectedClub.id) || selectedClub;
  }, [selectedClub, clubs]);

  const handleOpenClub = (club: AdminClub) => {
    setSelectedClub(club);
    setIsModalOpen(true);
  };

  const columns: Column<AdminClub>[] = [
    {
      key: "club",
      header: "Kelab & No. Pendaftaran",
      cell: (club) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm hover:text-[#FF3845] transition-colors">
              {club.name}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#202126] border border-[#37383D] text-[#C5C6CA]">
              {club.type}
            </span>
          </div>
          <p className="font-mono text-xs text-[#96989F]">{club.registrationNumber}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Lokasi & Negeri",
      cell: (club) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-medium text-[#E5E5E7] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF3845] flex-shrink-0" />
            <span>{club.district}</span>
          </p>
          <p className="text-[11px] text-[#96989F] pl-5">{club.state}</p>
        </div>
      ),
    },
    {
      key: "discipline",
      header: "Disiplin Silat",
      cell: (club) => (
        <div className="space-y-1">
          <span
            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
              club.discipline === "Both"
                ? "bg-[#E10600]/15 text-[#FF555A] border border-[#FF3845]/30"
                : club.discipline === "Silat Seni"
                ? "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30"
                : "bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30"
            }`}
          >
            {club.discipline}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-[#96989F]">
            <span>Seni: {club.seniAthletesCount}</span>
            <span>•</span>
            <span>Olahraga: {club.olahragaAthletesCount}</span>
          </div>
        </div>
      ),
    },
    {
      key: "members",
      header: "Keahlian",
      cell: (club) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{club.memberCount} Pesilat</span>
          </p>
          <p className="text-[11px] text-[#96989F] flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>{club.coachCount} Jurulatih</span>
          </p>
        </div>
      ),
    },
    {
      key: "subscription",
      header: "Langganan SaaS",
      cell: (club) => {
        const conf = subStatusBadgeConfig[club.subscriptionStatus] || {
          label: club.subscriptionStatus,
          variant: "neutral",
          dot: false,
        };
        return (
          <div className="space-y-1">
            <AdminBadge variant={conf.variant} size="sm" dot={conf.dot}>
              {conf.label}
            </AdminBadge>
            <p className="text-[10px] text-[#96989F]">RM20 / bulan</p>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: <span className="sr-only">Tindakan</span>,
      className: "text-right",
      cell: (club) => (
        <div className="flex items-center justify-end gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenClub(club);
            }}
            leftIcon={<Eye className="w-3.5 h-3.5 text-[#FF3845]" />}
          >
            Profil
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#96989F] uppercase tracking-wider">
            Jumlah Kelab
          </span>
          <p className="text-2xl font-bold text-white">{stats.totalClubs}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#22C55E]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#4ADE80] uppercase tracking-wider">
            Langganan Aktif
          </span>
          <p className="text-2xl font-bold text-[#4ADE80]">{stats.activeSubs}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#F59E0B]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#FBBF24] uppercase tracking-wider">
            Percubaan (30 Hari)
          </span>
          <p className="text-2xl font-bold text-[#FBBF24]">{stats.trialingSubs}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#EF4444]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#F87171] uppercase tracking-wider">
            Tertunggak
          </span>
          <p className="text-2xl font-bold text-[#F87171]">{stats.pastDueSubs}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#38BDF8]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#60A5FA] uppercase tracking-wider">
            Jumlah Pesilat
          </span>
          <p className="text-2xl font-bold text-[#60A5FA]">{stats.totalAthletes}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#C5C6CA] uppercase tracking-wider">
            Jumlah Jurulatih
          </span>
          <p className="text-2xl font-bold text-white">{stats.totalCoaches}</p>
        </div>
      </div>

      {/* Quick Action Pending Applications Banner if any */}
      {pendingCount > 0 && (
        <div className="p-4 bg-gradient-to-r from-[#F59E0B]/15 via-[#17191E] to-[#17191E] border border-[#F59E0B]/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#F59E0B]/20 text-[#FBBF24]">
              <FileCheck className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">
                {pendingCount} Permohonan Kelab Baharu Menanti Kelulusan
              </h4>
              <p className="text-xs text-[#C5C6CA]">
                Kelulusan permohonan akan secara automatik mendaftarkan kelab ke direktori ini dan mengaktifkan percubaan percuma 30 hari.
              </p>
            </div>
          </div>

          <Link href="/admin/clubs/applications">
            <AdminButton
              variant="primary"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Semak Permohonan ({pendingCount})
            </AdminButton>
          </Link>
        </div>
      )}

      {/* Filter and Search Bar */}
      <AdminSearchFilter
        placeholder="Cari mengikut nama kelab, no. pendaftaran, negeri, daerah, atau wakil..."
        onSearch={setSearchQuery}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Discipline Filter */}
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:outline-none focus:border-[#FF3845] cursor-pointer"
          >
            <option value="ALL">Semua Disiplin</option>
            <option value="Both">Kedua-dua (Both)</option>
            <option value="Silat Seni">Silat Seni Sahaja</option>
            <option value="Silat Olahraga">Silat Olahraga Sahaja</option>
          </select>

          {/* Subscription Status Filter */}
          <select
            value={selectedSubStatus}
            onChange={(e) => setSelectedSubStatus(e.target.value)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:outline-none focus:border-[#FF3845] cursor-pointer"
          >
            <option value="ALL">Semua Status Langganan</option>
            <option value="ACTIVE">Aktif (ACTIVE)</option>
            <option value="TRIALING">Percubaan (TRIALING)</option>
            <option value="PAST_DUE">Tertunggak (PAST_DUE)</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:outline-none focus:border-[#FF3845] cursor-pointer"
          >
            <option value="ALL">Semua Jenis</option>
            <option value="CLUB">Kelab (CLUB)</option>
            <option value="ACADEMY">Akademi (ACADEMY)</option>
            <option value="ASSOCIATION">Persatuan (ASSOCIATION)</option>
          </select>
        </div>
      </AdminSearchFilter>

      {/* Organization Directory Table */}
      <AdminTable
        columns={columns}
        data={filteredClubs}
        keyExtractor={(item) => item.id}
        onRowClick={handleOpenClub}
        emptyTitle="Tiada Kelab Dijumpai"
        emptyDescription="Tiada rekod kelab atau organisasi yang sepadan dengan kriteria carian anda."
        renderMobileCard={(club) => {
          const conf = subStatusBadgeConfig[club.subscriptionStatus] || {
            label: club.subscriptionStatus,
            variant: "neutral",
            dot: false,
          };
          return (
            <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl space-y-3 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{club.name}</h4>
                  <p className="text-xs text-[#96989F] font-mono">
                    {club.registrationNumber}
                  </p>
                </div>
                <AdminBadge variant={conf.variant} size="sm" dot={conf.dot}>
                  {conf.label}
                </AdminBadge>
              </div>

              <div className="text-xs space-y-1 py-2 border-y border-[#202126] text-[#C5C6CA]">
                <p>
                  <span className="text-[#96989F]">Lokasi:</span> {club.district},{" "}
                  {club.state}
                </p>
                <p>
                  <span className="text-[#96989F]">Disiplin:</span> {club.discipline} (Seni:{" "}
                  {club.seniAthletesCount}, Olahraga: {club.olahragaAthletesCount})
                </p>
                <p>
                  <span className="text-[#96989F]">Keahlian:</span> {club.memberCount} Pesilat,{" "}
                  {club.coachCount} Jurulatih
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#96989F]">
                  Wakil: {club.contactPerson}
                </span>
                <AdminButton
                  variant="secondary"
                  size="xs"
                  onClick={() => handleOpenClub(club)}
                  leftIcon={<Eye className="w-3 h-3 text-[#FF3845]" />}
                >
                  Lihat Profil
                </AdminButton>
              </div>
            </div>
          );
        }}
      />

      {/* Club Detail Modal */}
      <ClubDetailModal
        club={activeModalClub}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
