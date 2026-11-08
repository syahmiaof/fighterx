"use client";

import React, { useState } from "react";
import type { PlatformAnnouncement } from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { Pin, Megaphone, AlertCircle } from "lucide-react";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcementData: Omit<PlatformAnnouncement, "id">) => void;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  onSave,
}: AnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "URGENT">("NORMAL");
  const [targetAudience, setTargetAudience] = useState<"ALL" | "COACHES" | "ATHLETES">("ALL");
  const [isPinned, setIsPinned] = useState(false);
  const [authorName, setAuthorName] = useState("Pentadbir Utama FighterX");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Sila masukkan tajuk pengumuman.");
      return;
    }
    if (!content.trim()) {
      setError("Sila masukkan mesej / isi kandungan pengumuman.");
      return;
    }
    if (!authorName.trim()) {
      setError("Nama pegawai / bahagian penyiar adalah mandatori.");
      return;
    }

    const payload: Omit<PlatformAnnouncement, "id"> = {
      title: title.trim(),
      content: content.trim(),
      priority,
      targetAudience,
      publishedAt: new Date().toISOString(),
      isPinned,
      isActive: true,
      authorName: authorName.trim(),
    };

    onSave(payload);
    // Reset form
    setTitle("");
    setContent("");
    setPriority("NORMAL");
    setTargetAudience("ALL");
    setIsPinned(false);
    setError(null);
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#FF3845]" />
          <span>Siarkan Pengumuman Platform Baharu</span>
        </div>
      }
      description="Siaran langsung makluman rasmi kepada kelab, jurulatih, dan atlet silat berdaftar."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-lg text-xs text-[#F87171] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Tajuk Pengumuman <span className="text-[#FF3845]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="cth. Kemas Kini Peraturan Pertandingan Silat Kebangsaan 2027"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
          />
        </div>

        {/* Priority & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
              Tahap Keutamaan (Priority)
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "LOW" | "NORMAL" | "URGENT")
              }
              className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
            >
              <option value="NORMAL">NORMAL (Biasa / Makluman Am)</option>
              <option value="URGENT">URGENT (Penting / Tersegera)</option>
              <option value="LOW">LOW (Rendah / Arkib)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
              Sasaran Penerima (Audience)
            </label>
            <select
              value={targetAudience}
              onChange={(e) =>
                setTargetAudience(
                  e.target.value as "ALL" | "COACHES" | "ATHLETES"
                )
              }
              className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
            >
              <option value="ALL">ALL (Semua Kelab, Jurulatih & Atlet)</option>
              <option value="COACHES">COACHES (Jurulatih Berdaftar Sahaja)</option>
              <option value="ATHLETES">ATHLETES (Pesilat Berdaftar Sahaja)</option>
            </select>
          </div>
        </div>

        {/* Author Name */}
        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Penyiar / Bahagian <span className="text-[#FF3845]">*</span>
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="cth. Pentadbir Utama FighterX / Bahagian Teknikal"
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
          />
        </div>

        {/* Content Body */}
        <div>
          <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
            Mesej / Kandungan Siaran <span className="text-[#FF3845]">*</span>
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Taip butiran pengumuman rasmi di sini..."
            className="w-full px-3.5 py-2.5 bg-[#17191E] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600] resize-none"
          />
        </div>

        {/* Pin to Top Checkbox */}
        <div className="pt-2 border-t border-[#27272A]">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-[#37383D] text-[#E10600] focus:ring-[#E10600] bg-[#17191E]"
            />
            <div className="flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="text-xs font-semibold text-white">
                Sematkan Pengumuman di Atas (Pin to Top)
              </span>
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
            Siarkan Pengumuman
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
