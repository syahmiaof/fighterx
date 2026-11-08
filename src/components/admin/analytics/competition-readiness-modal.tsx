"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import type { CompetitionEvent } from "@/lib/admin/types";
import { useAdminActions } from "@/lib/admin/store";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";

export interface CompetitionReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: CompetitionEvent | null;
}

export function CompetitionReadinessModal({
  isOpen,
  onClose,
  competition,
}: CompetitionReadinessModalProps) {
  const { updateAthleteMedicalClearance } = useAdminActions();

  // Active athlete being cleared manually
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [officerName, setOfficerName] = useState("");
  const [clearanceNotes, setClearanceNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!competition) return null;

  const athletes = competition.readinessReview;

  const handleClearanceSubmit = (athleteId: string) => {
    if (!officerName.trim()) {
      setFormError("Nama pegawai perubatan atau doktor bertauliah wajib diisi.");
      return;
    }

    try {
      updateAthleteMedicalClearance(
        competition.id,
        athleteId,
        true,
        officerName.trim(),
        clearanceNotes.trim() || "Pelepasan fizikal disahkan selepas penilaian ortopedik."
      );
      setSuccessMessage("Pelepasan perubatan manual berjaya direkodkan!");
      setSelectedAthleteId(null);
      setOfficerName("");
      setClearanceNotes("");
      setFormError(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Ralat merekod pelepasan.");
    }
  };

  const handleRevokeClearance = (athleteId: string) => {
    try {
      updateAthleteMedicalClearance(
        competition.id,
        athleteId,
        false,
        "Pegawai Perubatan ISN",
        "Pelepasan ditarik balik susulan pemeriksaan semula."
      );
      setSuccessMessage("Pelepasan perubatan telah dibatalkan.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Ralat membatalkan pelepasan.");
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Semakan Kesediaan Kontinjen: ${competition.title}`}
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Anti-Cheat & Medical Integrity Guardrail Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E1214] to-[#17191E] border border-[#FF3845]/40 shadow-md">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#E10600]/20 text-[#FF555A] mt-0.5 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Mandat Integriti Perubatan Silat Kebangsaan
                <AdminBadge variant="danger" size="sm">
                  Ditegah Pelepasan Automatik
                </AdminBadge>
              </h4>
              <p className="text-xs text-[#C5C6CA] mt-1 leading-relaxed">
                Platform FighterX dan sistem AI Lekir ditegah secara tegas daripada memberikan
                pelepasan perubatan automatik kepada atlet yang cedera. Setiap atlet berisiko tinggi
                wajib mendapatkan pengesahan manual bertulis daripada Pegawai Perubatan ISN atau
                doktor bertauliah sebelum dibenarkan bertanding.
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#4ADE80] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Global Stats of Kontinjen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#202126] border border-[#27272A]">
            <div className="text-[11px] text-[#96989F]">Jumlah Atlet</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {athletes.length} Orang
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#202126] border border-[#27272A]">
            <div className="text-[11px] text-[#96989F]">Cergas Bertanding</div>
            <div className="text-xl font-bold font-mono text-[#4ADE80] mt-0.5">
              {athletes.filter((a) => a.isCleared).length} Orang
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#202126] border border-[#27272A]">
            <div className="text-[11px] text-[#96989F]">Perlu Pelepasan</div>
            <div className="text-xl font-bold font-mono text-[#F87171] mt-0.5">
              {athletes.filter((a) => a.medicalClearanceRequired && !a.isCleared).length} Orang
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#202126] border border-[#27272A]">
            <div className="text-[11px] text-[#96989F]">Status Berat Badan</div>
            <div className="text-xl font-bold font-mono text-[#60A5FA] mt-0.5">
              {athletes.filter((a) => a.weightStatus === "OK").length} / {athletes.length} OK
            </div>
          </div>
        </div>

        {/* Athlete Roster Readiness Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Senarai Calon Atlet & Status Kelulusan
          </div>

          {athletes.map((ath) => {
            const isManualSigning = selectedAthleteId === ath.athleteId;
            const needsClearance = ath.medicalClearanceRequired && !ath.isCleared;

            return (
              <div
                key={ath.athleteId}
                className={`p-4 rounded-xl border ${
                  needsClearance
                    ? "bg-[#1E1416] border-[#EF4444]/40"
                    : "bg-[#202126] border-[#27272A]"
                } space-y-3 transition-colors`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                        needsClearance
                          ? "bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/40"
                          : "bg-[#22C55E]/20 text-[#4ADE80] border-[#22C55E]/40"
                      }`}
                    >
                      {ath.athleteName.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {ath.athleteName}
                        </span>
                        <AdminBadge
                          variant={ath.discipline === "Silat Seni" ? "warning" : "info"}
                          size="sm"
                        >
                          {ath.discipline}
                        </AdminBadge>
                      </div>
                      <div className="text-xs text-[#96989F] mt-0.5">
                        {ath.clubName} • {ath.category}
                      </div>
                    </div>
                  </div>

                  {/* Readiness Score & Weight Badge */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-[10px] text-[#96989F] uppercase">Skor Kesediaan</div>
                      <span className="text-sm font-mono font-bold text-white">
                        {ath.readinessScore}%
                      </span>
                    </div>

                    <AdminBadge
                      variant={
                        ath.weightStatus === "OK"
                          ? "success"
                          : ath.weightStatus === "Over"
                          ? "warning"
                          : "info"
                      }
                      size="sm"
                    >
                      Berat: {ath.weightStatus}
                    </AdminBadge>
                  </div>
                </div>

                {/* Medical Clearance Status Banner */}
                {ath.medicalClearanceRequired ? (
                  <div className="p-3 rounded-lg bg-[#17191E] border border-[#27272A] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {ath.isCleared ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-[#F87171]" />
                        )}
                        <span
                          className={`text-xs font-bold ${
                            ath.isCleared ? "text-[#4ADE80]" : "text-[#F87171]"
                          }`}
                        >
                          {ath.isCleared
                            ? "Pelepasan Perubatan Manual DILULUSKAN"
                            : "Pelepasan Perubatan Diperlukan (Kecederaan Disahkan)"}
                        </span>
                      </div>

                      {ath.isCleared ? (
                        <button
                          type="button"
                          onClick={() => handleRevokeClearance(ath.athleteId)}
                          className="text-[11px] text-[#F87171] hover:underline"
                        >
                          Tarik Balik Pelepasan
                        </button>
                      ) : (
                        !isManualSigning && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAthleteId(ath.athleteId);
                              setFormError(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#E10600] hover:bg-[#FF3845] text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Tandatangan Pelepasan Manual
                          </button>
                        )
                      )}
                    </div>

                    {ath.clearanceNotes && (
                      <div className="text-[11px] text-[#C5C6CA] italic bg-[#202126] p-2 rounded border border-[#27272A]">
                        Catatan: {ath.clearanceNotes}
                      </div>
                    )}

                    {ath.isCleared && ath.clearedBy && (
                      <div className="text-[10px] text-[#96989F] font-mono">
                        Dilepaskan secara sah oleh: <strong>{ath.clearedBy}</strong> ({ath.clearedAt ? new Date(ath.clearedAt).toLocaleDateString("ms-MY") : "Terkini"})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[#4ADE80] flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Status Kesihatan: Cergas & Tiada Rekod Kecederaan Aktif</span>
                  </div>
                )}

                {/* Inline Manual Sign-Off Form for Injured Athlete */}
                {isManualSigning && (
                  <div className="p-4 rounded-xl bg-[#281A1D] border border-[#FF3845] space-y-3 animate-in fade-in">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#FF3845]" />
                      Borang Pengesahan Pelepasan Perubatan Manual
                    </div>

                    {formError && (
                      <div className="text-xs text-[#F87171] bg-[#EF4444]/20 p-2 rounded border border-[#EF4444]/30">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-[#C5C6CA] mb-1">
                        Nama Pegawai Perubatan / Doktor Bertauliah *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Dr. Wan Zulkifli (Pakar Ortopedik ISN)"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#17191E] border border-[#37383D] rounded-lg text-xs text-white placeholder-[#96989F] focus:outline-none focus:border-[#FF3845]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#C5C6CA] mb-1">
                        Catatan Kelulusan & Had Fizikal
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Nyatakan status kestabilan ligamen, had impak atau syarat pelepasan bertanding..."
                        value={clearanceNotes}
                        onChange={(e) => setClearanceNotes(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#17191E] border border-[#37383D] rounded-lg text-xs text-white placeholder-[#96989F] focus:outline-none focus:border-[#FF3845]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <AdminButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAthleteId(null);
                          setFormError(null);
                        }}
                      >
                        Batal
                      </AdminButton>
                      <AdminButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleClearanceSubmit(ath.athleteId)}
                        className="flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4" />
                        Sahkan Pelepasan Manual
                      </AdminButton>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#27272A] flex items-center justify-between">
          <span className="text-[11px] text-[#96989F]">
            Pelepasan disahkan akan disimpan ke dalam rekod audit pertandingan rasmi.
          </span>
          <AdminButton variant="outline" size="sm" onClick={onClose}>
            Tutup
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
}
