"use client";

import React, { useState } from "react";
import type { WeeklyTop10Entry } from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface LeaderboardDisqualifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteEntry: WeeklyTop10Entry | null;
  onConfirm: (athleteId: string, reason: string) => void;
}

export function LeaderboardDisqualifyModal({
  isOpen,
  onClose,
  athleteEntry,
  onConfirm,
}: LeaderboardDisqualifyModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!athleteEntry) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Sebab pembatalan penyertaan adalah mandatori bagi tujuan audit.");
      return;
    }
    onConfirm(athleteEntry.athleteId, reason.trim());
    setReason("");
    setError(null);
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-[#F87171]">
          <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
          <span>Batalkan Kelayakan Papan Pendahulu Mingguan</span>
        </div>
      }
      description="Tindakan tadbir urus anti-penipuan & integriti papan pendahulu FighterX."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F87171]">
            <AlertTriangle className="w-4 h-4" />
            <span>Perhatian Integriti Sukan</span>
          </div>
          <p className="text-xs text-[#E5E5E7] leading-relaxed">
            Anda sedang membatalkan kelayakan atlet{" "}
            <span className="font-bold text-white">{athleteEntry.athleteName}</span>{" "}
            ({athleteEntry.clubName}) daripada Kedudukan Mingguan #{athleteEntry.rank}.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Sebab Pembatalan Kelayakan (Audit Rekod) <span className="text-[#FF3845]">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="cth. Kelajuan penghantaran bukti video meragukan / Bukti bukan di bawah pengawasan jurulatih / Pelanggaran etika pesilat..."
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600] resize-none"
          />
          {error && <p className="text-xs text-[#F87171] mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#27272A]">
          <AdminButton variant="ghost" size="sm" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton
            variant="danger"
            size="sm"
            onClick={handleConfirm}
          >
            Sahkan Pembatalan Kelayakan
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
}
