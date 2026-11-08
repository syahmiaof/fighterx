"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  BookOpen,
  Award,
  Trophy,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Layers,
  FileText,
} from "lucide-react";
import { useCoachState, useCoachActions } from "@/lib/coach/store";
import { CoachCard } from "@/components/coach/ui/coach-card";
import { CoachBadge } from "@/components/coach/ui/coach-badge";
import { CoachButton } from "@/components/coach/ui/coach-button";
import { CoachModal } from "@/components/coach/ui/coach-modal";

export function CoachMoreView() {
  const { coach, athletes, submissions } = useCoachState();
  const { resetDemoState } = useCoachActions();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetDemoState();
    setIsResetModalOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Pusat Kawalan &amp; Tetapan Jurulatih
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#ff3845]/20 text-[#ff555a] border border-[#ff3845]/40">
            Modul F
          </span>
        </div>
        <p className="mt-1 text-xs text-[#96989f]">
          Akses pantas ke profil bimbingan, sukatan latihan, garis panduan kejurulatihan kebangsaan dan kawalan demo.
        </p>
      </div>

      {resetSuccess && (
        <div className="rounded-lg border border-[#22c55e]/50 bg-[#22c55e]/15 p-4 flex items-center gap-3 text-xs text-[#4ade80]">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>Pangkalan data simulasi demo berjaya dikembalikan ke keadaan asal (28 atlet, 12 verifikasi tertangguh).</span>
        </div>
      )}

      {/* Coach Profile Card Summary */}
      <CoachCard glow className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-[#ff3845] bg-[#121316] flex-shrink-0">
              <Image
                src={coach.avatarUrl}
                alt={coach.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{coach.name}</h2>
                <CoachBadge variant="red" size="sm">
                  {coach.discipline}
                </CoachBadge>
              </div>
              <p className="text-xs text-[#c5c6ca] mt-0.5">{coach.title}</p>
              <p className="text-[11px] text-[#96989f]">{coach.club}</p>
            </div>
          </div>

          <Link href="/coach/profile">
            <CoachButton variant="outline" size="sm" icon={<User size={14} />}>
              Lihat Profil Penuh
            </CoachButton>
          </Link>
        </div>
      </CoachCard>

      {/* Portal Modules Quick Nav Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#96989f] mb-3">
          Modul &amp; Fungsi Utama Portal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          <Link href="/coach/profile" className="block">
            <CoachCard hoverable className="p-4 h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#e10600]/20 border border-[#e10600]/40 flex items-center justify-center text-[#ff555a]">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Profil &amp; Kredensial</h4>
                  <p className="text-[11px] text-[#96989f]">Sijil ISN &amp; PESAKA</p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <ChevronRight size={14} className="inline text-[#96989f]" />
              </div>
            </CoachCard>
          </Link>

          <Link href="/coach/assessments" className="block">
            <CoachCard hoverable className="p-4 h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#fbbf24]">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Penilaian &amp; Rubrik</h4>
                  <p className="text-[11px] text-[#96989f]">Modul D: Fizikal &amp; Seni</p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <ChevronRight size={14} className="inline text-[#96989f]" />
              </div>
            </CoachCard>
          </Link>

          <Link href="/coach/competitions" className="block">
            <CoachCard hoverable className="p-4 h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#60a5fa]">
                  <Trophy size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Kalendar Kejohanan</h4>
                  <p className="text-[11px] text-[#96989f]">Modul E: Roster Skuad</p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <ChevronRight size={14} className="inline text-[#96989f]" />
              </div>
            </CoachCard>
          </Link>

          <Link href="/coach/verification" className="block">
            <CoachCard hoverable className="p-4 h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#4ade80]">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Verifikasi Latihan</h4>
                  <p className="text-[11px] text-[#96989f]">{pendingCount} dalam semakan</p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <ChevronRight size={14} className="inline text-[#96989f]" />
              </div>
            </CoachCard>
          </Link>

          <Link href="/coach/athletes" className="block">
            <CoachCard hoverable className="p-4 h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-[#a78bfa]">
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Direktori Atlet</h4>
                  <p className="text-[11px] text-[#96989f]">{athletes.length} atlet skuad</p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <ChevronRight size={14} className="inline text-[#96989f]" />
              </div>
            </CoachCard>
          </Link>
        </div>
      </div>

      {/* Coaching Guidelines & Knowledge Hub */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#96989f] mb-3">
          Sport Science &amp; Garis Panduan Kejurulatihan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CoachCard className="p-4">
            <div className="flex items-start gap-3">
              <BookOpen size={20} className="text-[#ff3845] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">
                  Kurikulum &amp; Sukatan Silat Kebangsaan (PESAKA)
                </h4>
                <p className="mt-1 text-[11px] text-[#96989f] leading-relaxed">
                  Panduan rasmi gerak jurus tunggal, ganda, dan regu edisi pertandingan 2024-2027 beserta kriteria pemotongan markah juri.
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-[#ff555a] font-semibold cursor-pointer hover:underline">
                  <span>Muat Turun Dokumen PDF</span>
                  <ExternalLink size={12} />
                </div>
              </div>
            </div>
          </CoachCard>

          <CoachCard className="p-4">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-[#3b82f6] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">
                  Prosedur Ujian Kecergasan Fizikal ISN
                </h4>
                <p className="mt-1 text-[11px] text-[#96989f] leading-relaxed">
                  Standard Operasi Prosedur (SOP) untuk larian aerobik 6 minit, ujian kuasa tekan tubi 1 minit, dan mobiliti dorsifleksi buku lali.
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-[#60a5fa] font-semibold cursor-pointer hover:underline">
                  <span>Lihat Manual Standard</span>
                  <ExternalLink size={12} />
                </div>
              </div>
            </div>
          </CoachCard>
        </div>
      </div>

      {/* Demo Controls & System Info */}
      <CoachCard className="p-5 border-[#e10600]/30 bg-[#16171d]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-[#ff3845]" />
              <h3 className="text-sm font-bold text-white">Kawalan Simulasi &amp; Data Demo</h3>
            </div>
            <p className="mt-1 text-xs text-[#96989f] max-w-xl">
              Memulihkan pangkalan data tempatan ke keadaan asal (mock seed Cikgu Farid, 28 atlet, 12 verifikasi, dan rekod rubrik piawai).
            </p>
          </div>

          <CoachButton
            variant="danger"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={() => setIsResetModalOpen(true)}
          >
            Set Semula Data Demo
          </CoachButton>
        </div>
      </CoachCard>

      {/* Reset Confirmation Modal */}
      <CoachModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Sahkan Set Semula Data Demo"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#f59e0b]">
            <ShieldAlert size={28} className="flex-shrink-0" />
            <p className="text-xs text-white">
              Tindakan ini akan mengosongkan rekod verifikasi atau penilaian baharu yang dibuat dan memuatkan semula seed data asal.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <CoachButton variant="ghost" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Batal
            </CoachButton>
            <CoachButton variant="danger" size="sm" onClick={handleReset}>
              Ya, Set Semula Sekarang
            </CoachButton>
          </div>
        </div>
      </CoachModal>
    </div>
  );
}
