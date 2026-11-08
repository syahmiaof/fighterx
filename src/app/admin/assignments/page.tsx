"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminState, ADMIN_LOCAL_STORAGE_KEY } from "@/lib/admin/store";
import type { ProgrammeAssignment } from "@/lib/admin/types";
import {
  ClipboardList,
  Calendar,
  Search,
  Plus,
  CheckCircle2,
  Building,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AssignmentModal } from "@/components/admin/training/assignment-modal";

export default function AdminAssignmentsPage() {
  const state = useAdminState();

  // Store assignments state locally, initialized with state.assignments
  const [assignments, setAssignments] = useState<ProgrammeAssignment[]>(
    state.assignments
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [notification, setNotification] = useState<string | null>(null);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
        return false;
      }
      if (selectedDiscipline !== "ALL" && item.discipline !== selectedDiscipline) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchClub = item.clubName.toLowerCase().includes(query);
        const matchCoach = item.coachName.toLowerCase().includes(query);
        const matchProg = item.programmeName.toLowerCase().includes(query);
        return matchClub || matchCoach || matchProg;
      }
      return true;
    });
  }, [assignments, selectedStatus, selectedDiscipline, searchQuery]);

  const handleCreateAssignment = (
    newAssignmentData: Omit<ProgrammeAssignment, "id">
  ) => {
    const newEntry: ProgrammeAssignment = {
      ...newAssignmentData,
      id: `assign-${Date.now()}`,
    };

    const updated = [newEntry, ...assignments];
    setAssignments(updated);

    // Persist to local storage if available
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(ADMIN_LOCAL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.assignments = updated;
          localStorage.setItem(ADMIN_LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Failed to sync assignment to localStorage:", e);
      }
    }

    setNotification(
      `Program berjaya ditugaskan kepada kelab "${newEntry.clubName}".`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStatusChange = (
    id: string,
    newStatus: ProgrammeAssignment["status"]
  ) => {
    const updated = assignments.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAssignments(updated);

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(ADMIN_LOCAL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.assignments = updated;
          localStorage.setItem(ADMIN_LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Failed to sync assignment status:", e);
      }
    }

    setNotification("Status tugasan berjaya dikemas kini.");
    setTimeout(() => setNotification(null), 4000);
  };

  // Stats calculation
  const totalCount = assignments.length;
  const inProgressCount = assignments.filter((a) => a.status === "IN_PROGRESS").length;
  const assignedCount = assignments.filter((a) => a.status === "ASSIGNED").length;
  const uniqueClubsCount = new Set(assignments.map((a) => a.clubId)).size;

  return (
    <div className="space-y-7">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1.5">
            <Link href="/admin" className="hover:text-white transition-colors">
              Papan Pemuka
            </Link>
            <span>/</span>
            <Link
              href="/admin/programmes"
              className="hover:text-white transition-colors"
            >
              Program Latihan
            </Link>
            <span>/</span>
            <span className="text-[#E10600]">Tugasan Program Kelab & Jurulatih</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-[#E10600]" />
            Tugasan Program Latihan Kelab & Jurulatih
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1 max-w-3xl leading-relaxed">
            Pengagihan blok kurikulum latihan kebangsaan FighterX 2027 kepada kelab-kelab berdaftar, penetapan ketua jurulatih bertauliah, dan pemantauan status pelaksanaan kohort atlet.
          </p>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/programmes">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Calendar className="w-4 h-4 text-[#E10600]" />}
            >
              Master Programme 2027
            </AdminButton>
          </Link>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Tugaskan Program Baharu
          </AdminButton>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/50 text-[#34D399] p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-white hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <ClipboardList className="w-4 h-4 text-[#E10600]" />
            <span>Jumlah Tugasan</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalCount}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Semua rekod penugasan</div>
        </div>

        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Building className="w-4 h-4 text-[#38BDF8]" />
            <span>Kelab Terlibat</span>
          </div>
          <div className="text-2xl font-bold text-white">{uniqueClubsCount}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Kelab aktif menerima program</div>
        </div>

        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Sedang Berjalan</span>
          </div>
          <div className="text-2xl font-bold text-white">{inProgressCount}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Dalam fasa pelaksanaan aktif</div>
        </div>

        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <UserCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>Ditugaskan Baru</span>
          </div>
          <div className="text-2xl font-bold text-white">{assignedCount}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Menunggu pengesahan jurulatih</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mengikut kelab, ketua jurulatih atau program..."
            className="w-full bg-[#121316] border border-[#37383D] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#121316] border border-[#37383D] rounded-lg px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DRAFT">DRAFT</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="bg-[#121316] border border-[#37383D] rounded-lg px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-none"
          >
            <option value="ALL">Semua Disiplin</option>
            <option value="Both">Kedua-dua (Seni & Olahraga)</option>
            <option value="Silat Seni">Silat Seni</option>
            <option value="Silat Olahraga">Silat Olahraga</option>
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      {filteredAssignments.length > 0 ? (
        <div className="bg-[#17191E] border border-[#27272A] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto admin-scrollbar">
            <table className="w-full text-left text-xs text-[#E5E5E7]">
              <thead className="bg-[#141519] border-b border-[#27272A] text-[#96989F] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Kelab / Gelanggang</th>
                  <th className="py-3.5 px-4">Ketua Jurulatih</th>
                  <th className="py-3.5 px-4">Program Latihan</th>
                  <th className="py-3.5 px-4">Disiplin & Kohort</th>
                  <th className="py-3.5 px-4">Tempoh Pelaksanaan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/70">
                {filteredAssignments.map((a) => {
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-[#1D1F25] transition-colors"
                    >
                      {/* Club Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                          <span>{a.clubName}</span>
                        </div>
                        <div className="text-[10px] text-[#96989F] mt-0.5">
                          ID: {a.clubId}
                        </div>
                      </td>

                      {/* Coach Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>{a.coachName}</span>
                        </div>
                        <div className="text-[10px] text-[#96989F] mt-0.5">
                          Jurulatih Berlesen
                        </div>
                      </td>

                      {/* Programme Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#E5E5E7]">
                          {a.programmeName}
                        </div>
                        <div className="text-[10px] text-[#E10600] font-semibold mt-0.5">
                          FighterX 2027 Framework
                        </div>
                      </td>

                      {/* Discipline & Cohort */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#38BDF8]">
                            {a.discipline}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#C5C6CA] mt-0.5">
                          Kohort:{" "}
                          <span className="font-bold text-white px-1.5 py-0.2 rounded bg-[#202126]">
                            {a.targetCohort}
                          </span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-white">
                          {new Date(a.startDate).toLocaleDateString("ms-MY")} –{" "}
                          {new Date(a.endDate).toLocaleDateString("ms-MY")}
                        </div>
                        <div className="text-[10px] text-[#96989F] mt-0.5">
                          Kitaran 12 Bulan
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            a.status === "IN_PROGRESS"
                              ? "bg-[#10B981]/15 text-[#34D399] border-[#10B981]/35"
                              : a.status === "ASSIGNED"
                              ? "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/35"
                              : a.status === "COMPLETED"
                              ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/35"
                              : "bg-[#94A3B8]/15 text-[#C5C6CA] border-[#94A3B8]/25"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {a.status === "ASSIGNED" && (
                            <AdminButton
                              variant="secondary"
                              size="xs"
                              onClick={() => handleStatusChange(a.id, "IN_PROGRESS")}
                            >
                              Mula Latihan
                            </AdminButton>
                          )}
                          {a.status === "IN_PROGRESS" && (
                            <AdminButton
                              variant="ghost"
                              size="xs"
                              onClick={() => handleStatusChange(a.id, "COMPLETED")}
                            >
                              Selesai
                            </AdminButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#17191E] border border-[#27272A] rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#202126] text-[#96989F] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Tiada Rekod Penugasan</h4>
          <p className="text-xs text-[#96989F] max-w-sm mx-auto">
            Tiada program ditugaskan yang sepadan dengan tapisan semasa.
          </p>
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedStatus("ALL");
              setSelectedDiscipline("ALL");
              setSearchQuery("");
            }}
          >
            Kosongkan Tapisan
          </AdminButton>
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        programmes={state.programmes}
        clubs={state.clubs}
        coaches={state.coaches}
        onAssign={handleCreateAssignment}
      />
    </div>
  );
}
