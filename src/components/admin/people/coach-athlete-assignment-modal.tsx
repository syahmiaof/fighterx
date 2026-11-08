"use client";

import React, { useState, useMemo } from "react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { DisciplineBadge } from "@/components/admin/people/discipline-badge";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import {
  UserCheck,
  UserX,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Filter,
} from "lucide-react";

export interface CoachAthleteAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When assigning a coach to a specific athlete */
  athleteId?: string;
  /** When adding an athlete to a specific coach's roster */
  coachId?: string;
  onSuccess?: (msg: string) => void;
}

export function CoachAthleteAssignmentModal({
  isOpen,
  onClose,
  athleteId,
  coachId,
  onSuccess,
}: CoachAthleteAssignmentModalProps) {
  const { athletes, coaches } = useAdminState();
  const { assignAthleteCoach } = useAdminActions();

  // Find target entities if specified
  const targetAthlete = useMemo(
    () => athletes.find((a) => a.id === athleteId),
    [athletes, athleteId]
  );

  const targetCoach = useMemo(
    () => coaches.find((c) => c.id === coachId),
    [coaches, coachId]
  );

  // When assigning coach to an athlete: selected coach ID (or "" for unassigned)
  const [selectedCoachId, setSelectedCoachId] = useState<string>(
    targetAthlete?.assignedCoachId || ""
  );

  // When assigning athlete to a coach: selected athlete ID
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>("");

  // Filter option: prefer same club coaches
  const [onlySameClub, setOnlySameClub] = useState<boolean>(true);

  // Submission / Loading feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Keep state synchronized when modal opens or target changes
  const [prevSyncKey, setPrevSyncKey] = useState("");
  const syncKey = isOpen ? `${targetAthlete?.id || "none"}-${targetCoach?.id || "none"}` : "";
  if (isOpen && syncKey !== prevSyncKey) {
    setPrevSyncKey(syncKey);
    if (targetAthlete) {
      setSelectedCoachId(targetAthlete.assignedCoachId || "");
    }
    setSelectedAthleteId("");
    setFeedback(null);
  }

  // Filtered coaches for target athlete
  const availableCoaches = useMemo(() => {
    if (!targetAthlete) return coaches;
    if (onlySameClub && targetAthlete.clubId) {
      const sameClubList = coaches.filter(
        (c) => c.clubId === targetAthlete.clubId
      );
      if (sameClubList.length > 0) return sameClubList;
    }
    return coaches;
  }, [coaches, targetAthlete, onlySameClub]);

  // Available athletes for target coach (athletes from the same club or any club)
  const availableAthletesForCoach = useMemo(() => {
    if (!targetCoach) return athletes;
    if (onlySameClub && targetCoach.clubId) {
      return athletes.filter((a) => a.clubId === targetCoach.clubId);
    }
    return athletes;
  }, [athletes, targetCoach, onlySameClub]);

  const handleSave = () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (targetAthlete) {
        // Mode A: Reassign coach to this athlete
        const coachToAssign = selectedCoachId === "unassigned" ? "" : selectedCoachId;
        assignAthleteCoach(targetAthlete.id, coachToAssign);
        const coachObj = coaches.find((c) => c.id === coachToAssign);
        const msg = coachToAssign
          ? `Atlet ${targetAthlete.name} berjaya ditugaskan kepada ${coachObj?.name || "Jurulatih"}.`
          : `Penugasan jurulatih untuk atlet ${targetAthlete.name} telah dinyah-tetapkan.`;
        setFeedback({ type: "success", text: msg });
        if (onSuccess) onSuccess(msg);
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 900);
      } else if (targetCoach) {
        // Mode B: Assign selected athlete to this coach
        if (!selectedAthleteId) {
          setFeedback({
            type: "error",
            text: "Sila pilih seorang atlet untuk ditugaskan.",
          });
          setIsSubmitting(false);
          return;
        }
        const athleteObj = athletes.find((a) => a.id === selectedAthleteId);
        assignAthleteCoach(selectedAthleteId, targetCoach.id);
        const msg = `Atlet ${athleteObj?.name || "Atlet"} berjaya ditugaskan ke skuad ${targetCoach.name}.`;
        setFeedback({ type: "success", text: msg });
        if (onSuccess) onSuccess(msg);
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 900);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Ralat ketika menyimpan penugasan.";
      setFeedback({ type: "error", text: errorMsg });
      setIsSubmitting(false);
    }
  };

  const isAssigningToAthlete = Boolean(targetAthlete);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#FF3845]" />
          <span>
            {isAssigningToAthlete
              ? "Urus Penugasan Jurulatih Atlet"
              : "Tugaskan Atlet ke Skuad Jurulatih"}
          </span>
        </div>
      }
      description={
        isAssigningToAthlete
          ? `Pilih jurulatih pembimbing untuk atlet ${targetAthlete?.name}. Rekod penugasan dikemas kini secara reaktif merentas platform.`
          : `Pilih atlet untuk dimasukkan ke dalam skuad bimbingan ${targetCoach?.name}.`
      }
      maxWidth="xl"
      footer={
        <>
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            loading={isSubmitting}
            onClick={handleSave}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Sahkan Penugasan
          </AdminButton>
        </>
      }
    >
      <div className="space-y-5">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-center gap-2.5 ${
              feedback.type === "success"
                ? "bg-[#22C55E]/15 border-[#22C55E]/40 text-[#4ADE80]"
                : "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#F87171]"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Mode A: Target Athlete Context Card */}
        {targetAthlete && (
          <div className="p-4 bg-[#202126] border border-[#37383D] rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-[#96989F] uppercase tracking-wider">
                  Maklumat Atlet
                </span>
                <h4 className="text-base font-bold text-white">
                  {targetAthlete.name}
                </h4>
              </div>
              <DisciplineBadge discipline={targetAthlete.discipline} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#17191E] rounded-lg border border-[#27272A]">
                <span className="text-[#96989F] block text-[10px]">Kelab:</span>
                <span className="text-[#E5E5E7] font-medium truncate block">
                  {targetAthlete.clubName}
                </span>
              </div>
              <div className="p-2 bg-[#17191E] rounded-lg border border-[#27272A]">
                <span className="text-[#96989F] block text-[10px]">
                  Kategori:
                </span>
                <span className="text-[#E5E5E7] font-medium truncate block">
                  {targetAthlete.category}
                </span>
              </div>
            </div>

            <div className="text-xs flex items-center justify-between pt-1 text-[#C5C6CA]">
              <span>Jurulatih Semasa:</span>
              <span className="font-semibold text-white">
                {targetAthlete.assignedCoachName || "Tiada Jurulatih"}
              </span>
            </div>
          </div>
        )}

        {/* Mode B: Target Coach Context Card */}
        {targetCoach && (
          <div className="p-4 bg-[#202126] border border-[#37383D] rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-[#96989F] uppercase tracking-wider">
                  Maklumat Jurulatih
                </span>
                <h4 className="text-base font-bold text-white">
                  {targetCoach.name}
                </h4>
              </div>
              <DisciplineBadge discipline={targetCoach.discipline} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#17191E] rounded-lg border border-[#27272A]">
                <span className="text-[#96989F] block text-[10px]">Kelab:</span>
                <span className="text-[#E5E5E7] font-medium truncate block">
                  {targetCoach.clubName}
                </span>
              </div>
              <div className="p-2 bg-[#17191E] rounded-lg border border-[#27272A]">
                <span className="text-[#96989F] block text-[10px]">
                  Roster Semasa:
                </span>
                <span className="text-[#E5E5E7] font-medium block">
                  {targetCoach.assignedAthleteIds.length} Atlet Berdaftar
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Same-club toggle */}
        <div className="flex items-center justify-between text-xs px-1">
          <label
            htmlFor="club-filter-toggle"
            className="flex items-center gap-2 cursor-pointer text-[#C5C6CA] hover:text-white"
          >
            <input
              id="club-filter-toggle"
              type="checkbox"
              checked={onlySameClub}
              onChange={(e) => setOnlySameClub(e.target.checked)}
              className="w-4 h-4 rounded border-[#37383D] bg-[#202126] text-[#E10600] focus:ring-[#FF3845]"
            />
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#96989F]" />
              Hadkan kepada kelab yang sama sahaja
            </span>
          </label>
          <span className="text-[11px] text-[#96989F]">
            {isAssigningToAthlete
              ? `${availableCoaches.length} pilihan jurulatih`
              : `${availableAthletesForCoach.length} pilihan atlet`}
          </span>
        </div>

        {/* Selection Options List */}
        {isAssigningToAthlete ? (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">
              Pilih Jurulatih Baharu:
            </label>

            <div className="space-y-2 max-h-60 overflow-y-auto admin-scrollbar pr-1">
              {/* Option to Unassign */}
              <label
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedCoachId === "" || selectedCoachId === "unassigned"
                    ? "bg-[#202126] border-[#FF3845] shadow-[0_0_12px_rgba(225,6,0,0.25)]"
                    : "bg-[#17191E] border-[#27272A] hover:bg-[#1D1F25] hover:border-[#37383D]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="coach-assignment-choice"
                    value="unassigned"
                    checked={
                      selectedCoachId === "" || selectedCoachId === "unassigned"
                    }
                    onChange={() => setSelectedCoachId("unassigned")}
                    className="w-4 h-4 text-[#E10600] focus:ring-[#FF3845] bg-[#202126] border-[#37383D]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-[#F87171]" />
                      <span className="text-sm font-semibold text-white">
                        Tiada Jurulatih (Nyah-tetapkan)
                      </span>
                    </div>
                    <p className="text-xs text-[#96989F]">
                      Keluarkan atlet daripada sebarang skuad jurulatih buat sementara waktu
                    </p>
                  </div>
                </div>
                <AdminBadge variant="neutral" size="sm">
                  Bebas
                </AdminBadge>
              </label>

              {/* Coach Options */}
              {availableCoaches.map((coach) => {
                const isSelected = selectedCoachId === coach.id;
                const isCurrent =
                  targetAthlete?.assignedCoachId === coach.id;

                return (
                  <label
                    key={coach.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#202126] border-[#FF3845] shadow-[0_0_12px_rgba(225,6,0,0.25)]"
                        : "bg-[#17191E] border-[#27272A] hover:bg-[#1D1F25] hover:border-[#37383D]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="coach-assignment-choice"
                        value={coach.id}
                        checked={isSelected}
                        onChange={() => setSelectedCoachId(coach.id)}
                        className="w-4 h-4 text-[#E10600] focus:ring-[#FF3845] bg-[#202126] border-[#37383D]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {coach.name}
                          </span>
                          {isCurrent && (
                            <AdminBadge variant="info" size="sm">
                              Semasa
                            </AdminBadge>
                          )}
                        </div>
                        <p className="text-xs text-[#96989F]">
                          {coach.clubName} • {coach.assignedAthleteIds.length} atlet
                        </p>
                        {coach.certifications && coach.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {coach.certifications.slice(0, 2).map((cert, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-[#A5B4FC] bg-[#6366F1]/10 px-1.5 py-0.2 rounded border border-[#6366F1]/20"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <DisciplineBadge discipline={coach.discipline} size="sm" />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ) : (
          /* Selection for Coach: pick an athlete */
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">
              Pilih Atlet untuk Ditugaskan:
            </label>

            <div className="space-y-2 max-h-60 overflow-y-auto admin-scrollbar pr-1">
              {availableAthletesForCoach.map((athlete) => {
                const isSelected = selectedAthleteId === athlete.id;
                const isAlreadyInRoster =
                  targetCoach?.assignedAthleteIds.includes(athlete.id);

                return (
                  <label
                    key={athlete.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#202126] border-[#FF3845] shadow-[0_0_12px_rgba(225,6,0,0.25)]"
                        : "bg-[#17191E] border-[#27272A] hover:bg-[#1D1F25] hover:border-[#37383D]"
                    } ${isAlreadyInRoster ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="athlete-assignment-choice"
                        value={athlete.id}
                        disabled={isAlreadyInRoster}
                        checked={isSelected}
                        onChange={() => setSelectedAthleteId(athlete.id)}
                        className="w-4 h-4 text-[#E10600] focus:ring-[#FF3845] bg-[#202126] border-[#37383D]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {athlete.name}
                          </span>
                          {isAlreadyInRoster && (
                            <AdminBadge variant="success" size="sm">
                              Sudah Dalam Roster
                            </AdminBadge>
                          )}
                        </div>
                        <p className="text-xs text-[#96989F]">
                          {athlete.clubName} • {athlete.category}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <DisciplineBadge discipline={athlete.discipline} size="sm" />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Role Integrity Notice */}
        <div className="p-3 bg-[#17191E] border border-[#27272A] rounded-lg text-[11px] text-[#96989F] leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FF3845] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Integriti Peranan FighterX:</strong> Skuad dan penugasan atlet dikawal selia terus oleh Pentadbir Pusat dan Jurulatih Berlesen tanpa sebarang peranan perantara seperti <code className="text-[#FF555A]">CLUB_ADMIN</code>.
          </span>
        </div>
      </div>
    </AdminModal>
  );
}
