"use client";

import React, { useState } from "react";
import type {
  ProgrammeAssignment,
  MasterTrainingProgramme,
  AdminClub,
  CoachProfile,
} from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ClipboardList } from "lucide-react";

export interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  programmes: MasterTrainingProgramme[];
  clubs: AdminClub[];
  coaches: CoachProfile[];
  onAssign: (newAssignment: Omit<ProgrammeAssignment, "id">) => void;
}

export function AssignmentModal({
  isOpen,
  onClose,
  programmes,
  clubs,
  coaches,
  onAssign,
}: AssignmentModalProps) {
  const [programmeId, setProgrammeId] = useState<string>(() => programmes[0]?.id || "");
  const [clubId, setClubId] = useState<string>(() => clubs[0]?.id || "");
  const [coachId, setCoachId] = useState<string>(() => coaches[0]?.id || "");
  const [discipline, setDiscipline] = useState<"Silat Seni" | "Silat Olahraga" | "Both">("Both");
  const [targetCohort, setTargetCohort] = useState<"ALL" | "SENIOR" | "REMAJA" | "ELITE">("ALL");
  const [startDate, setStartDate] = useState("2027-01-01");
  const [endDate, setEndDate] = useState("2027-12-31");
  const [status, setStatus] = useState<"DRAFT" | "ASSIGNED" | "IN_PROGRESS">("ASSIGNED");

  if (programmes.length > 0 && !programmeId) {
    setProgrammeId(programmes[0].id);
  }
  if (clubs.length > 0 && !clubId) {
    setClubId(clubs[0].id);
  }
  if (coaches.length > 0 && !coachId) {
    setCoachId(coaches[0].id);
  }

  // When club is selected, attempt to auto-select coach if matching club
  const handleClubChange = (newClubId: string) => {
    setClubId(newClubId);
    const matchingCoach = coaches.find((c) => c.clubId === newClubId);
    if (matchingCoach) {
      setCoachId(matchingCoach.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProg = programmes.find((p) => p.id === programmeId);
    const selectedClub = clubs.find((c) => c.id === clubId);
    const selectedCoach = coaches.find((c) => c.id === coachId);

    const payload: Omit<ProgrammeAssignment, "id"> = {
      programmeId,
      programmeName: selectedProg?.name || "Program Latihan Induk Silat Kebangsaan 2027",
      clubId,
      clubName: selectedClub?.name || "Kelab Silat Berdaftar",
      discipline,
      coachId,
      coachName: selectedCoach?.name || "Ketua Jurulatih",
      targetCohort,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status,
    };

    onAssign(payload);
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#E10600]" />
          <span>Tugaskan Program Latihan kepada Kelab</span>
        </div>
      }
      description="Pautkan blok kurikulum periodisasi kebangsaan kepada kelab berdaftar dan ketua jurulatih bertauliah."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Programme Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
            Pilih Program Induk
          </label>
          <select
            value={programmeId}
            onChange={(e) => setProgrammeId(e.target.value)}
            className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            required
          >
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.frameworkVersion})
              </option>
            ))}
          </select>
        </div>

        {/* Club Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
            Kelab / Gelanggang Penerima
          </label>
          <select
            value={clubId}
            onChange={(e) => handleClubChange(e.target.value)}
            className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            required
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.state} ({c.type})
              </option>
            ))}
          </select>
        </div>

        {/* Head Coach Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
            Ketua Jurulatih Bertanggungjawab
          </label>
          <select
            value={coachId}
            onChange={(e) => setCoachId(e.target.value)}
            className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            required
          >
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.clubName})
              </option>
            ))}
          </select>
        </div>

        {/* Discipline & Cohort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Disiplin Silat
            </label>
            <select
              value={discipline}
              onChange={(e) =>
                setDiscipline(e.target.value as "Both" | "Silat Seni" | "Silat Olahraga")
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value="Both">Kedua-dua (Seni & Olahraga)</option>
              <option value="Silat Seni">Silat Seni Sahaja</option>
              <option value="Silat Olahraga">Silat Olahraga Sahaja</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Kohort Sasaran Atlet
            </label>
            <select
              value={targetCohort}
              onChange={(e) =>
                setTargetCohort(
                  e.target.value as "ALL" | "SENIOR" | "REMAJA" | "ELITE"
                )
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value="ALL">Semua Kohort (All)</option>
              <option value="REMAJA">Remaja (Youth 14-17)</option>
              <option value="SENIOR">Dewasa / Senior</option>
              <option value="ELITE">Skuad Elit Kejohanan</option>
            </select>
          </div>
        </div>

        {/* Date Ranges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Tarikh Mula Program
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Tarikh Tamat Program
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
            Status Tugasan
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "DRAFT" | "ASSIGNED" | "IN_PROGRESS")
            }
            className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
          >
            <option value="ASSIGNED">ASSIGNED (Ditugaskan & Sedia Dilaksana)</option>
            <option value="IN_PROGRESS">IN_PROGRESS (Sedang Berjalan)</option>
            <option value="DRAFT">DRAFT (Draf Percubaan)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
          <AdminButton type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton type="submit" variant="primary" size="sm">
            Sahkan Penugasan
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
