"use client";

import React, { useState, useMemo } from "react";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { PlatformAnnouncement } from "@/lib/admin/types";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AnnouncementModal } from "./announcement-modal";
import {
  Megaphone,
  Pin,
  PinOff,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Clock,
  Radio,
} from "lucide-react";

export function AnnouncementsFeed() {
  const { announcements } = useAdminState();
  const { addAnnouncement, toggleAnnouncementPin, deleteAnnouncement } =
    useAdminActions();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<PlatformAnnouncement | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPIs
  const stats = useMemo(() => {
    const total = announcements.length;
    const pinned = announcements.filter((a) => a.isPinned).length;
    const urgent = announcements.filter((a) => a.priority === "URGENT").length;
    const coachesTarget = announcements.filter((a) => a.targetAudience === "COACHES").length;
    return { total, pinned, urgent, coachesTarget };
  }, [announcements]);

  // Filtered & Sorted Announcements (Pinned first, then latest date)
  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((anc) => {
        if (selectedAudience !== "ALL" && anc.targetAudience !== selectedAudience) {
          return false;
        }
        if (selectedPriority !== "ALL" && anc.priority !== selectedPriority) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            anc.title.toLowerCase().includes(q) ||
            anc.content.toLowerCase().includes(q) ||
            anc.authorName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Then by date descending
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [announcements, selectedAudience, selectedPriority, searchQuery]);

  // Handler for adding announcement
  const handleSaveAnnouncement = (
    data: Omit<PlatformAnnouncement, "id">
  ) => {
    addAnnouncement(data);
    showToast(`Pengumuman "${data.title}" telah berjaya disiarkan.`);
  };

  // Handler for toggling pin
  const handleTogglePin = (id: string, currentlyPinned: boolean) => {
    toggleAnnouncementPin(id);
    showToast(
      currentlyPinned
        ? "Pengumuman dinyahsemat."
        : "Pengumuman berjaya disematkan di atas."
    );
  };

  // Handler for deleting
  const handleConfirmDelete = () => {
    if (announcementToDelete) {
      deleteAnnouncement(announcementToDelete.id);
      showToast("Pengumuman telah dipadam.");
      setAnnouncementToDelete(null);
    }
  };

  const getPriorityBadge = (priority: PlatformAnnouncement["priority"]) => {
    switch (priority) {
      case "URGENT":
        return <AdminBadge variant="danger" size="sm">URGENT</AdminBadge>;
      case "NORMAL":
        return <AdminBadge variant="info" size="sm">NORMAL</AdminBadge>;
      case "LOW":
        return <AdminBadge variant="neutral" size="sm">LOW</AdminBadge>;
    }
  };

  const getAudienceLabel = (aud: PlatformAnnouncement["targetAudience"]) => {
    switch (aud) {
      case "ALL":
        return "Semua (Kelab, Jurulatih & Atlet)";
      case "COACHES":
        return "Jurulatih Sahaja";
      case "ATHLETES":
        return "Atlet Sahaja";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/40 rounded-xl text-xs text-[#4ADE80] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#96989F] hover:text-white text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Jumlah Siaran</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {stats.total}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#E10600]/15 flex items-center justify-center text-[#FF555A]">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            Siaran platform aktif
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Disematkan (Pinned)</p>
              <h3 className="text-2xl font-black text-[#FBBF24] mt-1">
                {stats.pinned}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center text-[#FBBF24]">
              <Pin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#FBBF24]">
            Keutamaan paparan teratas
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Pengumuman Segera</p>
              <h3 className="text-2xl font-black text-[#F87171] mt-1">
                {stats.urgent}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/15 flex items-center justify-center text-[#F87171]">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#F87171]">
            Status URGENT aktif
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Khas Jurulatih</p>
              <h3 className="text-2xl font-black text-[#38BDF8] mt-1">
                {stats.coachesTarget}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            Sasaran kejurulatihan
          </div>
        </AdminCard>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96989F]" />
          <input
            type="text"
            placeholder="Cari pengumuman mengikut tajuk, mesej, atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Audience Filter */}
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="px-3 py-2 bg-[#202126] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:border-[#E10600]"
          >
            <option value="ALL">Semua Sasaran</option>
            <option value="COACHES">Jurulatih Sahaja</option>
            <option value="ATHLETES">Atlet Sahaja</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-[#202126] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:border-[#E10600]"
          >
            <option value="ALL">Semua Keutamaan</option>
            <option value="URGENT">URGENT</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Create CTA */}
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Cipta Pengumuman
          </AdminButton>
        </div>
      </div>

      {/* Broadcast Feed Cards List */}
      <div className="space-y-3.5">
        {filteredAnnouncements.map((anc) => (
          <AdminCard
            key={anc.id}
            glow={anc.isPinned ? "red" : "none"}
            className={`transition-all ${
              anc.isPinned ? "border-l-4 border-l-[#E10600] bg-[#1A1C22]" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                {/* Badges & Meta */}
                <div className="flex flex-wrap items-center gap-2">
                  {anc.isPinned && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30">
                      <Pin className="w-3 h-3" />
                      Disematkan
                    </span>
                  )}
                  {getPriorityBadge(anc.priority)}
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#202126] text-[#38BDF8]">
                    {getAudienceLabel(anc.targetAudience)}
                  </span>
                  <span className="text-xs text-[#96989F] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(anc.publishedAt).toLocaleDateString("ms-MY", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white leading-snug">
                  {anc.title}
                </h3>

                {/* Content */}
                <p className="text-xs text-[#C5C6CA] leading-relaxed whitespace-pre-wrap">
                  {anc.content}
                </p>

                {/* Author */}
                <div className="text-[11px] text-[#96989F] pt-1">
                  Disiarkan oleh: <span className="text-white font-medium">{anc.authorName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                <AdminButton
                  variant="ghost"
                  size="xs"
                  onClick={() => handleTogglePin(anc.id, anc.isPinned)}
                  leftIcon={
                    anc.isPinned ? (
                      <PinOff className="w-3.5 h-3.5 text-[#FBBF24]" />
                    ) : (
                      <Pin className="w-3.5 h-3.5 text-[#96989F]" />
                    )
                  }
                >
                  {anc.isPinned ? "Nyahsemat" : "Semat"}
                </AdminButton>

                <AdminButton
                  variant="danger"
                  size="xs"
                  onClick={() => setAnnouncementToDelete(anc)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Padam
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="p-12 text-center bg-[#17191E] border border-[#27272A] rounded-xl space-y-2">
            <Megaphone className="w-10 h-10 text-[#96989F] mx-auto" />
            <h4 className="text-sm font-bold text-white">Tiada Pengumuman Ditemui</h4>
            <p className="text-xs text-[#96989F]">
              Tiada siaran pengumuman yang sepadan dengan kriteria carian atau penapis anda.
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveAnnouncement}
      />

      {/* Delete Confirmation Modal */}
      {announcementToDelete && (
        <AdminModal
          isOpen={true}
          onClose={() => setAnnouncementToDelete(null)}
          title={
            <div className="flex items-center gap-2 text-[#F87171]">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
              <span>Sahkan Padam Pengumuman</span>
            </div>
          }
          description="Tindakan ini akan memadamkan pengumuman daripada siaran platform serta-merta."
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#E5E5E7] leading-relaxed">
              Adakah anda pasti mahu memadamkan pengumuman:{" "}
              <strong className="text-white">&ldquo;{announcementToDelete.title}&rdquo;</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#27272A]">
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setAnnouncementToDelete(null)}
              >
                Batal
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Padam Siaran
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
