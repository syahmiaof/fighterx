"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { AthleteProfile, AthleteDiscipline, AthleteStatus } from "@/lib/admin/types";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";
import { AdminSearchFilter } from "@/components/admin/ui/admin-search-filter";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { DisciplineBadge } from "@/components/admin/people/discipline-badge";
import { CoachAthleteAssignmentModal } from "@/components/admin/people/coach-athlete-assignment-modal";
import {
  Users,
  Swords,
  Sparkles,
  Flame,
  Activity,
  ArrowUpDown,
  ExternalLink,
  UserCheck,
  AlertTriangle,
  HeartPulse,
  Award,
} from "lucide-react";

export function AthleteDirectoryTable() {
  const router = useRouter();
  const { athletes, clubs } = useAdminState();
  const { updateAthleteDiscipline, updateAthleteStatus } = useAdminActions();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedClub, setSelectedClub] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "attendance" | "completion" | "streak">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Assignment Modal State
  const [assignModalAthleteId, setAssignModalAthleteId] = useState<string | null>(null);

  // Strict Single Discipline Switch Modal State
  const [disciplineModalAthlete, setDisciplineModalAthlete] = useState<AthleteProfile | null>(null);
  const [targetDiscipline, setTargetDiscipline] = useState<AthleteDiscipline>("Silat Seni");
  const [disciplineNotice, setDisciplineNotice] = useState<string | null>(null);

  // Quick Status Modal State
  const [statusModalAthlete, setStatusModalAthlete] = useState<AthleteProfile | null>(null);
  const [targetStatus, setTargetStatus] = useState<AthleteStatus>("Active");

  // KPI calculations
  const stats = useMemo(() => {
    const total = athletes.length;
    const seniCount = athletes.filter((a) => a.discipline === "Silat Seni").length;
    const olahragaCount = athletes.filter((a) => a.discipline === "Silat Olahraga").length;
    const activeCount = athletes.filter((a) => a.status === "Active").length;
    const injuredCount = athletes.filter((a) => a.status === "Injured").length;
    const avgAttendance =
      total > 0
        ? Math.round(
            athletes.reduce((acc, a) => acc + (a.attendanceRate || 0), 0) / total
          )
        : 0;

    return { total, seniCount, olahragaCount, activeCount, injuredCount, avgAttendance };
  }, [athletes]);

  // Filtered & Sorted Athletes
  const filteredAthletes = useMemo(() => {
    return athletes
      .filter((a) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = a.name.toLowerCase().includes(q);
          const matchesIC = a.icNumber.toLowerCase().includes(q);
          const matchesClub = a.clubName.toLowerCase().includes(q);
          const matchesCategory = a.category.toLowerCase().includes(q);
          const matchesCoach = a.assignedCoachName.toLowerCase().includes(q);
          if (!matchesName && !matchesIC && !matchesClub && !matchesCategory && !matchesCoach) {
            return false;
          }
        }

        // Discipline filter
        if (selectedDiscipline !== "ALL" && a.discipline !== selectedDiscipline) {
          return false;
        }

        // Status filter
        if (selectedStatus !== "ALL" && a.status !== selectedStatus) {
          return false;
        }

        // Club filter
        if (selectedClub !== "ALL" && a.clubId !== selectedClub) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "attendance") {
          comparison = (a.attendanceRate || 0) - (b.attendanceRate || 0);
        } else if (sortBy === "completion") {
          comparison = (a.completionRate || 0) - (b.completionRate || 0);
        } else if (sortBy === "streak") {
          comparison = (a.streakWeeks || 0) - (b.streakWeeks || 0);
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [athletes, searchQuery, selectedDiscipline, selectedStatus, selectedClub, sortBy, sortOrder]);

  const toggleSort = (field: "name" | "attendance" | "completion" | "streak") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  const handleOpenDisciplineModal = (athlete: AthleteProfile) => {
    setDisciplineModalAthlete(athlete);
    // Suggest the other discipline
    const other: AthleteDiscipline =
      athlete.discipline === "Silat Seni" ? "Silat Olahraga" : "Silat Seni";
    setTargetDiscipline(other);
    setDisciplineNotice(null);
  };

  const handleConfirmDisciplineSwitch = () => {
    if (!disciplineModalAthlete) return;
    try {
      updateAthleteDiscipline(disciplineModalAthlete.id, targetDiscipline);
      setDisciplineNotice(`Disiplin berjaya ditukar kepada ${targetDiscipline}.`);
      setTimeout(() => {
        setDisciplineModalAthlete(null);
        setDisciplineNotice(null);
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ralat menukar disiplin";
      setDisciplineNotice(msg);
    }
  };

  const handleConfirmStatusChange = () => {
    if (!statusModalAthlete) return;
    updateAthleteStatus(statusModalAthlete.id, targetStatus);
    setStatusModalAthlete(null);
  };

  // Helper for Status Badge styling
  const renderStatusBadge = (status: AthleteStatus) => {
    switch (status) {
      case "Active":
        return (
          <AdminBadge variant="success" size="sm" dot pulseDot>
            Aktif
          </AdminBadge>
        );
      case "Injured":
        return (
          <AdminBadge variant="danger" size="sm" dot>
            Kecederaan
          </AdminBadge>
        );
      case "Resting":
        return (
          <AdminBadge variant="warning" size="sm" dot>
            Rehat
          </AdminBadge>
        );
      case "Suspended":
        return (
          <AdminBadge variant="neutral" size="sm">
            Digantung
          </AdminBadge>
        );
      default:
        return <AdminBadge variant="neutral">{status}</AdminBadge>;
    }
  };

  // Helper for Consistency Tier
  const renderConsistencyBadge = (tier: "KONSISTEN" | "SEDERHANA" | "PERLU_PERHATIAN") => {
    switch (tier) {
      case "KONSISTEN":
        return (
          <span className="text-[10px] font-bold text-[#4ADE80] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Award className="w-2.5 h-2.5" /> Konsisten
          </span>
        );
      case "SEDERHANA":
        return (
          <span className="text-[10px] font-bold text-[#FBBF24] bg-[#F59E0B]/15 border border-[#F59E0B]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            Sederhana
          </span>
        );
      case "PERLU_PERHATIAN":
        return (
          <span className="text-[10px] font-bold text-[#F87171] bg-[#EF4444]/15 border border-[#EF4444]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            Perlu Perhatian
          </span>
        );
    }
  };

  // Columns for Desktop Table
  const columns: Column<AthleteProfile>[] = [
    {
      key: "athlete",
      header: (
        <button
          onClick={() => toggleSort("name")}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <span>Atlet & Kategori</span>
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (athlete) => {
        const initials = athlete.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("");

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#27272A] to-[#17191E] border border-[#FF3845]/30 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div>
              <Link
                href={`/admin/athletes/${athlete.id}`}
                className="font-bold text-white hover:text-[#FF3845] transition-colors line-clamp-1 text-sm inline-block"
              >
                {athlete.name}
              </Link>
              <div className="text-[11px] text-[#96989F] flex items-center gap-2">
                <span>{athlete.category}</span>
                <span>•</span>
                <span className="font-mono text-[10px]">{athlete.icNumber}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "discipline",
      header: "Disiplin (Tunggal)",
      cell: (athlete) => (
        <div className="space-y-1">
          <DisciplineBadge discipline={athlete.discipline} size="sm" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDisciplineModal(athlete);
            }}
            title="Tukar Disiplin (Enforce Single Discipline)"
            className="text-[10px] text-[#96989F] hover:text-white block hover:underline cursor-pointer"
          >
            Tukar Disiplin
          </button>
        </div>
      ),
    },
    {
      key: "club",
      header: "Kelab & Jurulatih",
      cell: (athlete) => (
        <div className="space-y-0.5">
          <p className="text-xs text-[#E5E5E7] font-medium line-clamp-1 max-w-[200px]">
            {athlete.clubName}
          </p>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#96989F]">Jurulatih:</span>
            {athlete.assignedCoachName && athlete.assignedCoachName !== "Tiada Jurulatih" ? (
              <span className="text-white font-medium">
                {athlete.assignedCoachName}
              </span>
            ) : (
              <span className="text-[#F87171] italic text-[10px]">
                Belum Ditugaskan
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "attendance",
      header: (
        <button
          onClick={() => toggleSort("attendance")}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <span>Kehadiran</span>
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (athlete) => (
        <div className="space-y-1 min-w-[100px]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">{athlete.attendanceRate}%</span>
            {renderConsistencyBadge(athlete.consistencyTier)}
          </div>
          <div className="w-full bg-[#202126] rounded-full h-1.5 overflow-hidden border border-[#27272A]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                athlete.attendanceRate >= 85
                  ? "bg-[#22C55E]"
                  : athlete.attendanceRate >= 70
                  ? "bg-[#F59E0B]"
                  : "bg-[#EF4444]"
              }`}
              style={{ width: `${athlete.attendanceRate}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "streak",
      header: (
        <button
          onClick={() => toggleSort("streak")}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <span>Streak</span>
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: (athlete) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-[#FFB020]">
          <Flame className="w-4 h-4 text-[#FF3845] fill-[#FF3845]" />
          <span>{athlete.streakWeeks} mg</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (athlete) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setStatusModalAthlete(athlete);
            setTargetStatus(athlete.status);
          }}
          title="Klik untuk kemas kini status"
          className="cursor-pointer group"
        >
          {renderStatusBadge(athlete.status)}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Tindakan",
      headerClassName: "text-right",
      className: "text-right whitespace-nowrap",
      cell: (athlete) => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              setAssignModalAthleteId(athlete.id);
            }}
            title="Tugaskan / Reassign Jurulatih"
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-[#38BDF8]" />}
          >
            Jurulatih
          </AdminButton>

          <Link href={`/admin/athletes/${athlete.id}`}>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Jumlah Atlet</span>
            <Users className="w-4 h-4 text-[#FF3845]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {stats.total}
            </span>
            <span className="text-[11px] text-[#96989F] block">8 Kelab Berdaftar</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Silat Seni</span>
            <Sparkles className="w-4 h-4 text-[#A5B4FC]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#A5B4FC] tracking-tight">
              {stats.seniCount}
            </span>
            <span className="text-[11px] text-[#96989F] block">Disiplin Tunggal</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Silat Olahraga</span>
            <Swords className="w-4 h-4 text-[#FF555A]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#FF555A] tracking-tight">
              {stats.olahragaCount}
            </span>
            <span className="text-[11px] text-[#96989F] block">Disiplin Tunggal</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Purata Kehadiran</span>
            <Activity className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#4ADE80] tracking-tight">
              {stats.avgAttendance}%
            </span>
            <span className="text-[11px] text-[#96989F] block">Latihan Mingguan</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Status Aktif</span>
            <Activity className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {stats.activeCount}
            </span>
            <span className="text-[11px] text-[#4ADE80] block">Siap Bertanding</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#96989F] text-xs">
            <span>Kecederaan / Rehat</span>
            <HeartPulse className="w-4 h-4 text-[#F87171]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#F87171] tracking-tight">
              {stats.injuredCount}
            </span>
            <span className="text-[11px] text-[#96989F] block">Pemulihan / Rawatan</span>
          </div>
        </div>
      </div>

      {/* Strict Single-Discipline Enforcement Banner */}
      <div className="p-3.5 bg-[#17191E] border border-[#818CF8]/30 rounded-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#818CF8] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#C5C6CA] leading-relaxed">
          <span className="font-bold text-white block">
            Penguatkuasaan Disiplin Tunggal (Strict Single-Discipline Rule)
          </span>
          Setiap atlet Silat FighterX hanya didaftarkan khusus di bawah satu disiplin sahaja: sama ada{" "}
          <strong className="text-[#A5B4FC]">Silat Seni (Jurus Tunggal/Ganda/Regu)</strong> atau{" "}
          <strong className="text-[#FF555A]">Silat Olahraga (Tanding Kelas A-J)</strong>. Pendaftaran berganda (dual enrollment) disekat sepenuhnya bagi mematuhi piawaian sukan prestasi tinggi kebangsaan.
        </div>
      </div>

      {/* Search & Filters Bar */}
      <AdminSearchFilter
        placeholder="Cari atlet mengikut nama, No. IC, kelab, kategori atau jurulatih..."
        onSearch={setSearchQuery}
        chips={[
          { id: "ALL", label: "Semua Disiplin", count: athletes.length },
          { id: "Silat Seni", label: "Silat Seni", count: stats.seniCount },
          { id: "Silat Olahraga", label: "Silat Olahraga", count: stats.olahragaCount },
        ]}
        activeChip={selectedDiscipline}
        onChipChange={setSelectedDiscipline}
      >
        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:border-[#FF3845] focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="Active">Aktif</option>
            <option value="Injured">Kecederaan</option>
            <option value="Resting">Rehat</option>
            <option value="Suspended">Digantung</option>
          </select>

          {/* Club Dropdown */}
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="h-10 px-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-[#E5E5E7] focus:border-[#FF3845] focus:outline-none max-w-[180px] truncate"
          >
            <option value="ALL">Semua Kelab</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </AdminSearchFilter>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={filteredAthletes}
        keyExtractor={(item) => item.id}
        emptyTitle="Tiada Atlet Dijumpai"
        emptyDescription="Tiada rekod atlet yang sepadan dengan kriteria carian atau penapis disiplin semasa."
        onRowClick={(item) => router.push(`/admin/athletes/${item.id}`)}
        renderMobileCard={(athlete) => (
          <div className="p-4 bg-[#17191E] border border-[#27272A] rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-white text-base">
                  {athlete.name}
                </h4>
                <p className="text-xs text-[#96989F]">{athlete.category}</p>
                <p className="text-[11px] text-[#C5C6CA] font-medium mt-0.5">
                  {athlete.clubName}
                </p>
              </div>
              <div className="text-right space-y-1">
                {renderStatusBadge(athlete.status)}
                <div>
                  <DisciplineBadge discipline={athlete.discipline} size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#202126] text-center text-xs">
              <div>
                <span className="text-[#96989F] block text-[10px]">Kehadiran</span>
                <span className="font-bold text-white">{athlete.attendanceRate}%</span>
              </div>
              <div>
                <span className="text-[#96989F] block text-[10px]">Penyelesaian</span>
                <span className="font-bold text-white">{athlete.completionRate}%</span>
              </div>
              <div>
                <span className="text-[#96989F] block text-[10px]">Streak</span>
                <span className="font-bold text-[#FFB020]">{athlete.streakWeeks} mg</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#96989F]">
                Jurulatih: <strong className="text-white">{athlete.assignedCoachName || "Tiada"}</strong>
              </span>

              <div className="flex items-center gap-2">
                <AdminButton
                  variant="ghost"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAssignModalAthleteId(athlete.id);
                  }}
                >
                  Tukar Jurulatih
                </AdminButton>
                <Link href={`/admin/athletes/${athlete.id}`}>
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
      {assignModalAthleteId && (
        <CoachAthleteAssignmentModal
          isOpen={Boolean(assignModalAthleteId)}
          onClose={() => setAssignModalAthleteId(null)}
          athleteId={assignModalAthleteId}
        />
      )}

      {/* Strict Single Discipline Switch Modal */}
      {disciplineModalAthlete && (
        <AdminModal
          isOpen={Boolean(disciplineModalAthlete)}
          onClose={() => setDisciplineModalAthlete(null)}
          title="Tukar Disiplin Atlet (Peraturan Disiplin Tunggal)"
          description={`Penguatkuasaan peraturan FighterX: Atlet ${disciplineModalAthlete.name} hanya boleh berdaftar dalam satu disiplin secara eksklusif.`}
          maxWidth="md"
          footer={
            <>
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setDisciplineModalAthlete(null)}
              >
                Batal
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleConfirmDisciplineSwitch}
              >
                Sahkan Pertukaran Disiplin
              </AdminButton>
            </>
          }
        >
          <div className="space-y-4">
            {disciplineNotice && (
              <div className="p-3 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-xs text-[#4ADE80]">
                {disciplineNotice}
              </div>
            )}

            <div className="p-3 bg-[#202126] border border-[#37383D] rounded-lg text-xs space-y-1">
              <span className="text-[#96989F] block text-[10px] uppercase font-semibold">
                Disiplin Semasa:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm">
                  {disciplineModalAthlete.discipline}
                </span>
                <DisciplineBadge discipline={disciplineModalAthlete.discipline} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">
                Pilih Disiplin Baharu (Tunggal & Eksklusif):
              </label>

              <div className="space-y-2">
                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    targetDiscipline === "Silat Seni"
                      ? "bg-[#202126] border-[#818CF8] shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                      : "bg-[#17191E] border-[#27272A] hover:bg-[#1D1F25]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="strict-discipline-choice"
                      value="Silat Seni"
                      checked={targetDiscipline === "Silat Seni"}
                      onChange={() => setTargetDiscipline("Silat Seni")}
                      className="w-4 h-4 text-[#818CF8] focus:ring-[#818CF8]"
                    />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Silat Seni
                      </span>
                      <span className="text-xs text-[#96989F]">
                        Kategori Tunggal, Ganda, Regu & Solo Kreatif
                      </span>
                    </div>
                  </div>
                  <DisciplineBadge discipline="Silat Seni" size="sm" />
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    targetDiscipline === "Silat Olahraga"
                      ? "bg-[#202126] border-[#FF3845] shadow-[0_0_12px_rgba(225,6,0,0.25)]"
                      : "bg-[#17191E] border-[#27272A] hover:bg-[#1D1F25]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="strict-discipline-choice"
                      value="Silat Olahraga"
                      checked={targetDiscipline === "Silat Olahraga"}
                      onChange={() => setTargetDiscipline("Silat Olahraga")}
                      className="w-4 h-4 text-[#E10600] focus:ring-[#FF3845]"
                    />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Silat Olahraga
                      </span>
                      <span className="text-xs text-[#96989F]">
                        Pertarungan Tanding Bebas Mengikut Kelas Berat Badan (A-J)
                      </span>
                    </div>
                  </div>
                  <DisciplineBadge discipline="Silat Olahraga" size="sm" />
                </label>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[11px] text-[#F87171] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Perhatian:</strong> Pendaftaran dwi-disiplin (Seni DAN Olahraga) diharamkan dalam pangkalan data FighterX untuk memastikan pematuhan kuota kategori SUKMA dan kejuaraan kebangsaan.
              </span>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Quick Status Modal */}
      {statusModalAthlete && (
        <AdminModal
          isOpen={Boolean(statusModalAthlete)}
          onClose={() => setStatusModalAthlete(null)}
          title="Kemas Kini Status Atlet"
          description={`Ubah status penyertaan dan latihan untuk ${statusModalAthlete.name}.`}
          maxWidth="sm"
          footer={
            <>
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setStatusModalAthlete(null)}
              >
                Batal
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleConfirmStatusChange}
              >
                Simpan Status
              </AdminButton>
            </>
          }
        >
          <div className="space-y-3">
            <div className="space-y-2">
              {(["Active", "Injured", "Resting", "Suspended"] as AthleteStatus[]).map(
                (st) => (
                  <label
                    key={st}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      targetStatus === st
                        ? "bg-[#202126] border-[#FF3845]"
                        : "bg-[#17191E] border-[#27272A] hover:bg-[#1D1F25]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="athlete-status-choice"
                        value={st}
                        checked={targetStatus === st}
                        onChange={() => setTargetStatus(st)}
                        className="w-4 h-4 text-[#E10600] focus:ring-[#FF3845]"
                      />
                      <span className="text-sm font-semibold text-white">
                        {st === "Active"
                          ? "Aktif (Sedia Bertanding)"
                          : st === "Injured"
                          ? "Kecederaan (Rawatan / Fisioterapi)"
                          : st === "Resting"
                          ? "Rehat / Cuti Latihan"
                          : "Digantung (Tindakan Tatatertib)"}
                      </span>
                    </div>
                    {renderStatusBadge(st)}
                  </label>
                )
              )}
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
