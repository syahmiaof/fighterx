"use client";

import React, { useState, useMemo } from "react";
import type { ClubApplication, ApplicationStatus } from "@/lib/admin/types";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";
import { AdminBadge, type AdminBadgeVariant } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminSearchFilter } from "@/components/admin/ui/admin-search-filter";
import { ApplicationDetailModal } from "./application-detail-modal";
import {
  Phone,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";

type FilterTab = "ALL" | ApplicationStatus;
type SortOption = "date_desc" | "date_asc" | "name_asc" | "name_desc";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: AdminBadgeVariant; dot: boolean; pulse: boolean }
> = {
  PENDING: { label: "Menunggu Kelulusan", variant: "warning", dot: true, pulse: true },
  UNDER_REVIEW: { label: "Sedang Disemak", variant: "info", dot: true, pulse: false },
  NEEDS_INFORMATION: { label: "Perlu Maklumat", variant: "accent", dot: true, pulse: false },
  APPROVED: { label: "Diluluskan", variant: "success", dot: true, pulse: false },
  REJECTED: { label: "Ditolak", variant: "danger", dot: false, pulse: false },
};

export function ApplicationsTable() {
  const { applications } = useAdminState();
  const { reviewApplication } = useAdminActions();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  // Selected modal application
  const [selectedApp, setSelectedApp] = useState<ClubApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status counts
  const counts = useMemo(() => {
    const res: Record<string, number> = {
      ALL: applications.length,
      PENDING: 0,
      UNDER_REVIEW: 0,
      NEEDS_INFORMATION: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    applications.forEach((app) => {
      if (res[app.status] !== undefined) {
        res[app.status]++;
      }
    });
    return res;
  }, [applications]);

  // Filtered & sorted applications
  const filteredApps = useMemo(() => {
    let result = [...applications];

    // Status tab filter
    if (activeTab !== "ALL") {
      result = result.filter((app) => app.status === activeTab);
    }

    // Organization type filter
    if (selectedType !== "ALL") {
      result = result.filter((app) => app.clubType === selectedType);
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.clubName.toLowerCase().includes(q) ||
          app.picFullName.toLowerCase().includes(q) ||
          app.picEmail.toLowerCase().includes(q) ||
          app.picPhoneNumber.toLowerCase().includes(q) ||
          app.state.toLowerCase().includes(q) ||
          app.district.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
      if (sortBy === "date_asc") {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      if (sortBy === "name_asc") {
        return a.clubName.localeCompare(b.clubName);
      }
      if (sortBy === "name_desc") {
        return b.clubName.localeCompare(a.clubName);
      }
      return 0;
    });

    return result;
  }, [applications, activeTab, selectedType, searchQuery, sortBy]);

  // Keep selectedApp updated in real-time if store state updates
  const activeModalApp = useMemo(() => {
    if (!selectedApp) return null;
    return applications.find((a) => a.id === selectedApp.id) || selectedApp;
  }, [selectedApp, applications]);

  const handleOpenReview = (app: ClubApplication) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const columns: Column<ClubApplication>[] = [
    {
      key: "club",
      header: "Kelab & Lokasi",
      cell: (app) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm hover:text-[#FF3845] transition-colors">
              {app.clubName}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#202126] border border-[#37383D] text-[#C5C6CA]">
              {app.clubType}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#96989F]">
            <MapPin className="w-3 h-3 text-[#FF3845] flex-shrink-0" />
            <span>
              {app.district}, {app.state}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "pic",
      header: "Wakil Pemohon (PIC)",
      cell: (app) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-semibold text-white">{app.picFullName}</p>
          <p className="text-[11px] text-[#96989F]">{app.picPosition}</p>
          <div className="flex items-center gap-2 text-[11px] text-[#C5C6CA] pt-0.5">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#38BDF8]" />
              {app.picPhoneNumber}
            </span>
            <span className="text-[#37383D]">•</span>
            <span className="truncate max-w-[140px] text-[#96989F]">{app.picEmail}</span>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Tarikh Hantar",
      cell: (app) => (
        <div className="text-xs space-y-0.5">
          <p className="font-medium text-[#E5E5E7] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#96989F]" />
            {new Date(app.submittedAt).toLocaleDateString("ms-MY", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-[10px] text-[#96989F]">
            {new Date(app.submittedAt).toLocaleTimeString("ms-MY", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (app) => {
        const conf = statusConfig[app.status] || {
          label: app.status,
          variant: "neutral",
          dot: false,
          pulse: false,
        };
        return (
          <div className="flex flex-col gap-1 items-start">
            <AdminBadge
              variant={conf.variant}
              size="sm"
              dot={conf.dot}
              pulseDot={conf.pulse}
            >
              {conf.label}
            </AdminBadge>
            {app.documents.length > 0 && (
              <span className="text-[10px] text-[#96989F]">
                {app.documents.length} dokumen dilampirkan
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: <span className="sr-only">Tindakan</span>,
      className: "text-right",
      cell: (app) => (
        <div className="flex items-center justify-end gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenReview(app);
            }}
            leftIcon={<Eye className="w-3.5 h-3.5 text-[#FF3845]" />}
          >
            Semak
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#96989F] uppercase tracking-wider">
            Semua Permohonan
          </span>
          <p className="text-2xl font-bold text-white">{counts.ALL}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#F59E0B]/35 rounded-xl space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.1)]">
          <span className="text-[11px] font-semibold text-[#FBBF24] uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
            Menunggu
          </span>
          <p className="text-2xl font-bold text-[#FBBF24]">{counts.PENDING}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#38BDF8]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#60A5FA] uppercase tracking-wider">
            Sedang Semak
          </span>
          <p className="text-2xl font-bold text-[#60A5FA]">{counts.UNDER_REVIEW}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#FF3845]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#FF555A] uppercase tracking-wider">
            Perlu Maklumat
          </span>
          <p className="text-2xl font-bold text-[#FF555A]">{counts.NEEDS_INFORMATION}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#22C55E]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#4ADE80] uppercase tracking-wider">
            Diluluskan
          </span>
          <p className="text-2xl font-bold text-[#4ADE80]">{counts.APPROVED}</p>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#EF4444]/30 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#F87171] uppercase tracking-wider">
            Ditolak
          </span>
          <p className="text-2xl font-bold text-[#F87171]">{counts.REJECTED}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <AdminSearchFilter
        placeholder="Cari mengikut nama kelab, pemohon, negeri, daerah, no. telefon..."
        onSearch={setSearchQuery}
        chips={[
          { id: "ALL", label: "Semua", count: counts.ALL },
          { id: "PENDING", label: "Menunggu", count: counts.PENDING },
          { id: "UNDER_REVIEW", label: "Sedang Semak", count: counts.UNDER_REVIEW },
          { id: "NEEDS_INFORMATION", label: "Perlu Info", count: counts.NEEDS_INFORMATION },
          { id: "APPROVED", label: "Diluluskan", count: counts.APPROVED },
          { id: "REJECTED", label: "Ditolak", count: counts.REJECTED },
        ]}
        activeChip={activeTab}
        onChipChange={(chipId) => setActiveTab(chipId as FilterTab)}
      >
        <div className="flex items-center gap-2">
          {/* Organization Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:outline-none focus:border-[#FF3845] cursor-pointer"
          >
            <option value="ALL">Semua Jenis Organisasi</option>
            <option value="CLUB">Kelab (CLUB)</option>
            <option value="ACADEMY">Akademi (ACADEMY)</option>
            <option value="ASSOCIATION">Persatuan (ASSOCIATION)</option>
            <option value="OTHER">Lain-lain (OTHER)</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:outline-none focus:border-[#FF3845] cursor-pointer"
          >
            <option value="date_desc">Terkini Dihantar</option>
            <option value="date_asc">Terawal Dihantar</option>
            <option value="name_asc">Nama Kelab (A-Z)</option>
            <option value="name_desc">Nama Kelab (Z-A)</option>
          </select>
        </div>
      </AdminSearchFilter>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={filteredApps}
        keyExtractor={(item) => item.id}
        onRowClick={handleOpenReview}
        emptyTitle="Tiada Permohonan Dijumpai"
        emptyDescription="Tiada permohonan pendaftaran kelab yang sepadan dengan penapis atau carian anda."
        renderMobileCard={(app) => {
          const conf = statusConfig[app.status] || {
            label: app.status,
            variant: "neutral",
            dot: false,
            pulse: false,
          };
          return (
            <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl space-y-3 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{app.clubName}</h4>
                  <p className="text-xs text-[#96989F]">
                    {app.district}, {app.state}
                  </p>
                </div>
                <AdminBadge
                  variant={conf.variant}
                  size="sm"
                  dot={conf.dot}
                  pulseDot={conf.pulse}
                >
                  {conf.label}
                </AdminBadge>
              </div>

              <div className="text-xs space-y-1 py-2 border-y border-[#202126] text-[#C5C6CA]">
                <p>
                  <span className="text-[#96989F]">Pemohon:</span> {app.picFullName} (
                  {app.picPosition})
                </p>
                <p>
                  <span className="text-[#96989F]">Telefon:</span> {app.picPhoneNumber}
                </p>
                <p>
                  <span className="text-[#96989F]">Dihantar:</span>{" "}
                  {new Date(app.submittedAt).toLocaleDateString("ms-MY")}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#96989F]">
                  {app.documents.length} dokumen dilampirkan
                </span>
                <AdminButton
                  variant="secondary"
                  size="xs"
                  onClick={() => handleOpenReview(app)}
                  leftIcon={<Eye className="w-3 h-3 text-[#FF3845]" />}
                >
                  Semak Permohonan
                </AdminButton>
              </div>
            </div>
          );
        }}
      />

      {/* Review Modal */}
      <ApplicationDetailModal
        application={activeModalApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReview={reviewApplication}
      />
    </div>
  );
}
