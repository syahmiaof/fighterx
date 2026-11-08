"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { CoachProfile } from "@/lib/admin/types";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";
import { AdminSearchFilter } from "@/components/admin/ui/admin-search-filter";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { DisciplineBadge } from "@/components/admin/people/discipline-badge";
import { CoachAthleteAssignmentModal } from "@/components/admin/people/coach-athlete-assignment-modal";
import {
  Users,
  Award,
  ShieldCheck,
  ArrowUpDown,
  ExternalLink,
  UserPlus,
  Mail,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

export function CoachDirectoryTable() {
  const router = useRouter();
  const { coaches, clubs } = useAdminState();
  const { updateCoachStatus } = useAdminActions();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedClub, setSelectedClub] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "athletesCount">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Assignment Modal State (when clicking "Urus Skuad" for a coach)
  const [assignModalCoachId, setAssignModalCoachId] = useState<string | null>(null);

  // Status Change Confirmation Modal
  const [statusModalCoach, setStatusModalCoach] = useState<CoachProfile | null>(null);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = coaches.length;
    const active = coaches.filter((c) => c.status === "Active").length;
    const totalAssignedAthletes = coaches.reduce(
      (acc, c) => acc + c.assignedAthleteIds.length,
      0
    );
    const avgPerCoach = total > 0 ? (totalAssignedAthletes / total).toFixed(1) : "0";

    return { total, active, totalAssignedAthletes, avgPerCoach };
  }, [coaches]);

  // Filtered and Sorted Coaches
  const filteredCoaches = useMemo(() => {
    return coaches
      .filter((c) => {
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = c.name.toLowerCase().includes(q);
          const matchesClub = c.clubName.toLowerCase().includes(q);
          const matchesEmail = c.email.toLowerCase().includes(q);
          const matchesCert = c.certifications.some((cert) =>
            cert.toLowerCase().includes(q)
          );
          if (!matchesName && !matchesClub && !matchesEmail && !matchesCert) {
            return false;
          }
        }

        // Discipline Filter
        if (selectedDiscipline !== "ALL") {
          if (c.discipline !== selectedDiscipline && c.discipline !== "Both") {
            return false;
          }
        }

        // Club Filter
        if (selectedClub !== "ALL" && c.clubId !== selectedClub) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "athletesCount") {
          comparison = a.assignedAthleteIds.length - b.assignedAthleteIds.length;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [coaches, searchQuery, selectedDiscipline, selectedClub, sortBy, sortOrder]);

  const toggleSort = (field: "name" | "athletesCount") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  const handleToggleStatus = (coach: CoachProfile) => {
    const nextStatus = coach.status === "Active" ? "Inactive" : "Active";
    updateCoachStatus(coach.id, nextStatus);
    setStatusModalCoach(null);
  };

  const columns: Column<CoachProfile>[] = [
    {
      key: "coach",
      header: (
        <button
          onClick={() => toggleSort("name")}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <span>Nama Jurulatih & Hubungan</span>
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (coach) => {
        const initials = coach.name
          .replace("Cikgu ", "")
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("");

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#27272A] to-[#141519] border border-[#38BDF8]/40 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div>
              <Link
                href={`/admin/coaches/${coach.id}`}
                className="font-bold text-white hover:text-[#FF3845] transition-colors line-clamp-1 text-sm inline-block"
              >
                {coach.name}
              </Link>
              <div className="text-[11px] text-[#96989F] flex items-center gap-2">
                <span>{coach.clubName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {coach.email}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "discipline",
      header: "Disiplin Pembimbing",
      cell: (coach) => (
        <DisciplineBadge discipline={coach.discipline} size="sm" />
      ),
    },
    {
      key: "certifications",
      header: "Persijilan & Tauliah (SPKK)",
      cell: (coach) => (
        <div className="flex flex-wrap gap-1 max-w-[260px]">
          {coach.certifications.slice(0, 2).map((cert, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full"
            >
              {cert}
            </span>
          ))}
          {coach.certifications.length > 2 && (
            <span className="text-[10px] text-[#96989F] self-center">
              +{coach.certifications.length - 2} lagi
            </span>
          )}
        </div>
      ),
    },
    {
      key: "roster",
      header: (
        <button
          onClick={() => toggleSort("athletesCount")}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <span>Atlet Skuad</span>
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (coach) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#202126] border border-[#37383D] flex items-center justify-center font-bold text-white text-xs">
            {coach.assignedAthleteIds.length}
          </div>
          <span className="text-xs text-[#96989F]">Atlet Berdaftar</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (coach) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setStatusModalCoach(coach);
          }}
          title="Klik untuk kemas kini status"
          className="cursor-pointer"
        >
          {coach.status === "Active" ? (
            <AdminBadge variant="success" size="sm" dot pulseDot>
              Aktif
            </AdminBadge>
          ) : (
            <AdminBadge variant="neutral" size="sm">
              Tidak Aktif
            </AdminBadge>
          )}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Tindakan",
      headerClassName: "text-right",
      className: "text-right whitespace-nowrap",
      cell: (coach) => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              setAssignModalCoachId(coach.id);
            }}
            title="Tugaskan Atlet Baharu ke Skuad Ini"
            leftIcon={<UserPlus className="w-3.5 h-3.5 text-[#4ADE80]" />}
          >
            Tugaskan Atlet
          </AdminButton>

          <Link href={`/admin/coaches/${coach.id}`}>
            <AdminButton
              variant="secondary"
              size="xs"
              rightIcon={<ExternalLink className="w-3 h-3" />}
            >
              Profil
            </AdminButton>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-[#96989F] block">Jumlah Jurulatih</span>
            <span className="text-2xl font-bold text-white tracking-tight mt-1 block">
              {stats.total}
            </span>
            <span className="text-[11px] text-[#96989F]">Diiktiraf PESAKA</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#202126] border border-[#37383D] flex items-center justify-center text-[#FF3845]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-[#96989F] block">Jurulatih Aktif</span>
            <span className="text-2xl font-bold text-[#4ADE80] tracking-tight mt-1 block">
              {stats.active}
            </span>
            <span className="text-[11px] text-[#4ADE80]">Berlesen & Aktif</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#202126] border border-[#37383D] flex items-center justify-center text-[#4ADE80]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-[#96989F] block">Atlet Terbimbing</span>
            <span className="text-2xl font-bold text-[#38BDF8] tracking-tight mt-1 block">
              {stats.totalAssignedAthletes}
            </span>
            <span className="text-[11px] text-[#96989F]">Dalam Skuad Latihan</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#202126] border border-[#37383D] flex items-center justify-center text-[#38BDF8]">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-[#96989F] block">Nisbah Atlet / Jurulatih</span>
            <span className="text-2xl font-bold text-[#FBBF24] tracking-tight mt-1 block">
              1 : {stats.avgPerCoach}
            </span>
            <span className="text-[11px] text-[#96989F]">Nisbah Pembimbing Unggul</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#202126] border border-[#37383D] flex items-center justify-center text-[#FBBF24]">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Role Integrity Safeguard Banner */}
      <div className="p-4 bg-[#17191E] border border-[#37383D] rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#FF3845] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#C5C6CA] leading-relaxed">
          <span className="font-bold text-white block">
            Struktur Integriti Peranan Platform (Zero CLUB_ADMIN Invariant)
          </span>
          Sistem FighterX mengekalkan tiga peranan rasmi secara ketat:{" "}
          <strong className="text-white">ADMIN</strong>,{" "}
          <strong className="text-white">COACH</strong>, dan{" "}
          <strong className="text-white">ATHLETE</strong>. Tiada peranan <code className="text-[#FF555A]">CLUB_ADMIN</code> diperkenalkan. Semua verifikasi silat kebangsaan, penugasan atlet merentas kelab, dan pengurusan program latihan induk dikawal selia secara berpusat oleh Pentadbir Platform bersama Ketua Jurulatih Berlesen.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <AdminSearchFilter
        placeholder="Cari jurulatih mengikut nama, emel, kelab atau persijilan..."
        onSearch={setSearchQuery}
        chips={[
          { id: "ALL", label: "Semua Jurulatih", count: coaches.length },
          { id: "Silat Seni", label: "Silat Seni" },
          { id: "Silat Olahraga", label: "Silat Olahraga" },
          { id: "Both", label: "Seni & Olahraga" },
        ]}
        activeChip={selectedDiscipline}
        onChipChange={setSelectedDiscipline}
      >
        {/* Club Dropdown */}
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:border-[#FF3845] focus:outline-none max-w-[200px] truncate"
        >
          <option value="ALL">Semua Kelab</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </AdminSearchFilter>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={filteredCoaches}
        keyExtractor={(c) => c.id}
        emptyTitle="Tiada Jurulatih Dijumpai"
        emptyDescription="Tiada profil jurulatih yang sepadan dengan carian atau penapis kelab semasa."
        onRowClick={(item) => router.push(`/admin/coaches/${item.id}`)}
        renderMobileCard={(coach) => (
          <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-white text-base">{coach.name}</h4>
                <p className="text-xs text-[#96989F]">{coach.clubName}</p>
                <div className="mt-1">
                  <DisciplineBadge discipline={coach.discipline} size="sm" />
                </div>
              </div>
              <div>
                {coach.status === "Active" ? (
                  <AdminBadge variant="success" size="sm" dot>
                    Aktif
                  </AdminBadge>
                ) : (
                  <AdminBadge variant="neutral" size="sm">
                    Tidak Aktif
                  </AdminBadge>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-[#202126] rounded-lg border border-[#37383D] text-xs space-y-1">
              <span className="text-[10px] text-[#96989F] uppercase block font-semibold">
                Persijilan Disahkan:
              </span>
              <div className="flex flex-wrap gap-1">
                {coach.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/20"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#96989F]">
                Skuad: <strong className="text-white">{coach.assignedAthleteIds.length} Atlet</strong>
              </span>

              <div className="flex items-center gap-2">
                <AdminButton
                  variant="ghost"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAssignModalCoachId(coach.id);
                  }}
                >
                  Tugaskan Atlet
                </AdminButton>
                <Link href={`/admin/coaches/${coach.id}`}>
                  <AdminButton variant="secondary" size="xs">
                    Profil
                  </AdminButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      />

      {/* Assignment Modal */}
      {assignModalCoachId && (
        <CoachAthleteAssignmentModal
          isOpen={Boolean(assignModalCoachId)}
          onClose={() => setAssignModalCoachId(null)}
          coachId={assignModalCoachId}
        />
      )}

      {/* Status Modal */}
      {statusModalCoach && (
        <AdminModal
          isOpen={Boolean(statusModalCoach)}
          onClose={() => setStatusModalCoach(null)}
          title="Tukar Status Jurulatih"
          description={`Tukar status akaun dan tugas bimbingan untuk ${statusModalCoach.name}.`}
          maxWidth="sm"
          footer={
            <>
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setStatusModalCoach(null)}
              >
                Batal
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={() => handleToggleStatus(statusModalCoach)}
              >
                Sahkan Pertukaran
              </AdminButton>
            </>
          }
        >
          <div className="space-y-3 text-xs text-[#C5C6CA]">
            <p>
              Status semasa:{" "}
              <strong className="text-white">{statusModalCoach.status}</strong>
            </p>
            <p>
              Adakah anda pasti ingin menukar status jurulatih ini kepada{" "}
              <strong className="text-[#FF555A]">
                {statusModalCoach.status === "Active" ? "Tidak Aktif" : "Aktif"}
              </strong>
              ?
            </p>
            {statusModalCoach.status === "Active" && (
              <p className="text-[#FBBF24] p-2 bg-[#F59E0B]/10 rounded border border-[#F59E0B]/20">
                Jurulatih yang tidak aktif tidak dapat mengesahkan penghantaran bukti latihan atlet sehingga status diaktifkan semula.
              </p>
            )}
          </div>
        </AdminModal>
      )}
    </div>
  );
}
