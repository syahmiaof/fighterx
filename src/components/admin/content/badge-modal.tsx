"use client";

import React, { useState } from "react";
import type { GamificationBadge } from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import {
  ShieldCheck,
  Flame,
  Award,
  Trophy,
  Zap,
  Target,
  Swords,
  Crown,
  Heart,
  Star,
} from "lucide-react";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (badge: GamificationBadge) => void;
  badgeToEdit?: GamificationBadge | null;
}

const AVAILABLE_ICONS = [
  { name: "ShieldCheck", label: "Perisai", icon: ShieldCheck },
  { name: "Flame", label: "Api", icon: Flame },
  { name: "Award", label: "Anugerah", icon: Award },
  { name: "Trophy", label: "Trofi", icon: Trophy },
  { name: "Zap", label: "Kilat", icon: Zap },
  { name: "Target", label: "Sasaran", icon: Target },
  { name: "Swords", label: "Pedang", icon: Swords },
  { name: "Crown", label: "Mahkota", icon: Crown },
  { name: "Heart", label: "Kesihatan", icon: Heart },
  { name: "Star", label: "Bintang", icon: Star },
];

function BadgeForm({
  badgeToEdit,
  onClose,
  onSave,
}: {
  badgeToEdit?: GamificationBadge | null;
  onClose: () => void;
  onSave: (badge: GamificationBadge) => void;
}) {
  const [title, setTitle] = useState(badgeToEdit ? badgeToEdit.title : "");
  const [category, setCategory] = useState<
    "Attendance" | "Streak" | "Technical" | "Competition"
  >(badgeToEdit ? badgeToEdit.category : "Attendance");
  const [criteria, setCriteria] = useState(
    badgeToEdit ? badgeToEdit.criteria : ""
  );
  const [icon, setIcon] = useState(
    badgeToEdit ? badgeToEdit.icon : "ShieldCheck"
  );
  const [xp, setXp] = useState(badgeToEdit ? badgeToEdit.xp : 500);
  const [isSystemDefault, setIsSystemDefault] = useState(
    badgeToEdit ? badgeToEdit.isSystemDefault : false
  );
  const [isActive, setIsActive] = useState(
    badgeToEdit ? badgeToEdit.isActive : true
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Sila masukkan nama lencana.");
      return;
    }
    if (!criteria.trim()) {
      setError("Sila masukkan kriteria pencapaian lencana.");
      return;
    }
    if (xp < 50 || xp > 5000) {
      setError("Nilai XP mestilah antara 50 hingga 5,000 mata.");
      return;
    }

    const newBadge: GamificationBadge = {
      id: badgeToEdit ? badgeToEdit.id : `badge-${Date.now()}`,
      title: title.trim(),
      category,
      criteria: criteria.trim(),
      icon,
      xp: Number(xp),
      isSystemDefault,
      isActive,
    };

    onSave(newBadge);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-lg text-xs text-[#F87171]">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
          Nama Lencana <span className="text-[#FF3845]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="cth. Besi Waja (Kehadiran 100%)"
          className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
        />
      </div>

      {/* Category & XP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Kategori Lencana
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as
                  | "Attendance"
                  | "Streak"
                  | "Technical"
                  | "Competition"
              )
            }
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          >
            <option value="Attendance">Attendance (Kehadiran)</option>
            <option value="Streak">Streak (Konsistensi)</option>
            <option value="Technical">Technical (Penguasaan Teknik)</option>
            <option value="Competition">Competition (Kejohanan)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Ganjaran XP (Mata Pengalaman)
          </label>
          <input
            type="number"
            min={50}
            max={5000}
            step={50}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          />
        </div>
      </div>

      {/* Criteria */}
      <div>
        <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
          Kriteria Pencapaian <span className="text-[#FF3845]">*</span>
        </label>
        <textarea
          rows={3}
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          placeholder="Nyatakan syarat kelayakan atlet untuk membuka lencana ini..."
          className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600] resize-none"
        />
      </div>

      {/* Icon Selection */}
      <div>
        <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
          Pilih Ikon Lencana
        </label>
        <div className="grid grid-cols-5 gap-2">
          {AVAILABLE_ICONS.map((item) => {
            const IconComp = item.icon;
            const isSelected = icon === item.name;
            return (
              <button
                type="button"
                key={item.name}
                onClick={() => setIcon(item.name)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#E10600]/20 border-[#FF3845] text-white shadow-[0_0_12px_rgba(225,6,0,0.3)]"
                    : "bg-[#17191E] border-[#27272A] text-[#96989F] hover:text-white hover:border-[#37383D]"
                }`}
              >
                <IconComp className="w-5 h-5 mb-1" />
                <span className="text-[10px] truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Default & Active Toggles */}
      <div className="pt-2 border-t border-[#27272A] space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isSystemDefault}
            onChange={(e) => setIsSystemDefault(e.target.checked)}
            className="w-4 h-4 rounded border-[#37383D] text-[#E10600] focus:ring-[#E10600] bg-[#17191E]"
          />
          <div>
            <span className="text-xs font-semibold text-white">
              Lencana Lalai Sistem (System Default)
            </span>
            <p className="text-[11px] text-[#96989F]">
              Lencana teras FighterX yang tidak boleh dipadam oleh pengurus kelab.
            </p>
          </div>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-[#37383D] text-[#E10600] focus:ring-[#E10600] bg-[#17191E]"
          />
          <div>
            <span className="text-xs font-semibold text-white">
              Aktifkan Lencana Ini
            </span>
            <p className="text-[11px] text-[#96989F]">
              Atlet boleh memperoleh XP dan membuka lencana ini dalam modul latihan.
            </p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#27272A]">
        <AdminButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          Batal
        </AdminButton>
        <AdminButton type="submit" variant="primary" size="sm">
          {badgeToEdit ? "Simpan Perubahan" : "Cipta Lencana"}
        </AdminButton>
      </div>
    </form>
  );
}

export function BadgeModal({
  isOpen,
  onClose,
  onSave,
  badgeToEdit,
}: BadgeModalProps) {
  if (!isOpen) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        badgeToEdit ? "Kemaskini Lencana Gamifikasi" : "Cipta Lencana Baharu"
      }
      description="Konfigurasi parameter lencana, kriteria kelayakan atlet, ganjaran XP dan ikon rasmi."
      maxWidth="lg"
    >
      <BadgeForm
        key={badgeToEdit ? badgeToEdit.id : "new-badge"}
        badgeToEdit={badgeToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </AdminModal>
  );
}
