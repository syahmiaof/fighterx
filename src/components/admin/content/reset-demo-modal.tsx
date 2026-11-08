"use client";

import React, { useState } from "react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ResetDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDemoModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetDemoModalProps) {
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const targetPhrase = "RESET";

  const handleConfirm = () => {
    if (confirmPhrase.trim().toUpperCase() === targetPhrase) {
      onConfirm();
      setConfirmPhrase("");
      onClose();
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-[#F87171]">
          <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          <span>Tetap Semula Data Demonstrasi (Reset Demo State)</span>
        </div>
      }
      description="Tindakan ini akan memadamkan semua perubahan tempatan dan memulihkan data asal pangkalan data demo."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl space-y-2">
          <p className="text-xs text-[#E5E5E7] leading-relaxed">
            Semua perubahan status permohonan kelab, rekod langganan SaaS, artikel kurikulum, pengumuman, dan tetapan Lekir Bot yang disimpan dalam storan pelayar anda akan dipulihkan kepada nilai benih asal (initial mock seed).
          </p>
          <p className="text-xs text-[#F87171] font-semibold">
            Tindakan ini tidak boleh dibatalkan selepas pengesahan.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Sila taip &ldquo;<strong className="text-white">RESET</strong>&rdquo; untuk mengesahkan:
          </label>
          <input
            type="text"
            value={confirmPhrase}
            onChange={(e) => setConfirmPhrase(e.target.value)}
            placeholder="RESET"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] font-mono focus:outline-none focus:border-[#EF4444]"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#27272A]">
          <AdminButton variant="ghost" size="sm" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton
            variant="danger"
            size="sm"
            disabled={confirmPhrase.trim().toUpperCase() !== targetPhrase}
            onClick={handleConfirm}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Sahkan Tetap Semula
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
}
