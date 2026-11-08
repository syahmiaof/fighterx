"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { ProgrammeMode } from "@/lib/admin/types";
import {
  Calendar,
  Layers,
  Dumbbell,
  ClipboardList,
  Clock,
  CheckCircle2,
  Flag,
  Target,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ProgrammeCard } from "@/components/admin/training/programme-card";
import { ModeSelector } from "@/components/admin/training/mode-selector";
import { Timeline52Weeks } from "@/components/admin/training/timeline-52-weeks";

export default function AdminProgrammesPage() {
  const state = useAdminState();
  const actions = useAdminActions();

  // Selected programme or active programme
  const activeProgramme =
    state.programmes.find((p) => p.id === state.activeProgrammeId) ||
    state.programmes[0];

  const [selectedWeek, setSelectedWeek] = useState<number>(
    activeProgramme?.activeWeek || 12
  );
  const [modeChangeSuccess, setModeChangeSuccess] = useState<string | null>(null);

  if (!activeProgramme) {
    return (
      <div className="p-8 text-center text-[#96989F]">
        Tiada program latihan ditemui. Sila muat semula sistem.
      </div>
    );
  }

  const handleModeChange = (newMode: ProgrammeMode) => {
    actions.updateProgrammeMode(newMode, activeProgramme.id);
    setModeChangeSuccess(`Mod operasi berjaya ditukar kepada "${newMode}".`);
    setTimeout(() => setModeChangeSuccess(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1.5">
            <Link href="/admin" className="hover:text-white transition-colors">
              Papan Pemuka
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Program Latihan</span>
            <span>/</span>
            <span className="text-[#E10600]">Master Programme 2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-[#E10600]" />
            Program Latihan Induk Silat Kebangsaan 2027
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1 max-w-3xl leading-relaxed">
            Kurikulum periodisasi berpusat kebangsaan FighterX 2027 yang mengawal selia fasa persediaan fizikal, taktikal gelanggang, dan mod operasi dinamik bagi seluruh kelab dan atlet di Malaysia.
          </p>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/schedules">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Clock className="w-4 h-4 text-[#38BDF8]" />}
            >
              Jadual Mikrosiklus
            </AdminButton>
          </Link>
          <Link href="/admin/exercises">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Dumbbell className="w-4 h-4 text-[#10B981]" />}
            >
              Pustaka Senaman
            </AdminButton>
          </Link>
          <Link href="/admin/assignments">
            <AdminButton
              variant="primary"
              size="sm"
              leftIcon={<ClipboardList className="w-4 h-4" />}
            >
              Tugasan Kelab ({state.assignments.length})
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Mode Change Notification Banner */}
      {modeChangeSuccess && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{modeChangeSuccess}</span>
          </div>
          <button
            onClick={() => setModeChangeSuccess(null)}
            className="text-white hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 1. Programme Hero Overview Card */}
      <ProgrammeCard
        programme={activeProgramme}
        assignedClubsCount={state.assignments.length}
        totalExercisesCount={state.exercises.length}
      />

      {/* 2. Active Mode Configuration (4 Operating Modes) */}
      <div className="bg-[#17191E] border border-[#27272A] rounded-2xl p-6 sm:p-7 space-y-4">
        <ModeSelector
          currentMode={activeProgramme.activeMode}
          onModeSelect={handleModeChange}
        />
      </div>

      {/* 3. 52-Week Visual Periodization Timeline */}
      <Timeline52Weeks
        activeWeek={activeProgramme.activeWeek}
        totalWeeks={activeProgramme.totalWeeks}
        selectedWeekNumber={selectedWeek}
        onSelectWeek={(wk) => setSelectedWeek(wk)}
      />

      {/* 4. Two-Phase Detailed Periodization Architecture */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E10600]" />
            Struktur Periodisasi Tahunan 2027 (2 Fasa Utama)
          </h3>
          <p className="text-xs text-[#96989F]">
            Pembahagian saintifik bagi memastikan atlet mencapai kemuncak prestasi (peaking) menjelang kejohanan utama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phase 1 Card */}
          <div className="bg-[#17191E] border border-[#38BDF8]/30 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5" />
                  FASA 1: JANUARI – JUN (26 MINGGU)
                </span>
                <AdminBadge variant="info" size="sm">
                  Foundational
                </AdminBadge>
              </div>

              <h4 className="text-lg font-bold text-white">
                Asas Fizikal, Mobiliti & Pengukuhan Kemahiran Asas
              </h4>

              <p className="text-xs text-[#C5C6CA] leading-relaxed">
                Menumpukan kepada pembinaan tapak fisiologi yang kukuh melalui peningkatan kapasiti aerobik (VO2 Max), kekuatan teras isometrik (plank endurance), keanjalan sendi, dan kestabilan kuda-kuda asas silat.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#27272A]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#96989F]">
                  Fokus Modul Latihan Fasa 1:
                </div>
                <ul className="text-xs text-[#C5C6CA] space-y-1.5 list-disc list-inside">
                  <li>Larian Ujian VO2 Max 6-Minit & Pecutan Interval 400m</li>
                  <li>Kekuatan Teras: Ujian Plank Isometrik & Russian Twist</li>
                  <li>Mobiliti Sendi & Regangan Dinamik Paha / Pinggul</li>
                  <li>Pengukuhan Jurus Wajib Asas Silat Seni 1–3</li>
                  <li>Asas Langkah 8 Arah & Kuda-Kuda Rendah Olahraga</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-xs">
              <span className="text-[#96989F]">Status:</span>
              <span className="text-[#38BDF8] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fasa Aktif Semasa
              </span>
            </div>
          </div>

          {/* Phase 2 Card */}
          <div className="bg-[#17191E] border border-[#E10600]/30 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#E10600]/20 text-[#FF4D58] border border-[#FF4D58]/40 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  FASA 2: JULAI – DISEMBER (26 MINGGU)
                </span>
                <AdminBadge variant="accent" size="sm">
                  Tactical & Specific
                </AdminBadge>
              </div>

              <h4 className="text-lg font-bold text-white">
                Spesifik Sukan, Taktikal Gelanggang & Kemuncak Pertandingan
              </h4>

              <p className="text-xs text-[#C5C6CA] leading-relaxed">
                Peralihan kepada ketajaman bertanding. Silat Olahraga menumpukan kepada taktik perlawanan, masa tindak balas, sapuan jatuh, dan pengurusan berat badan. Silat Seni memfokuskan kepada tempo, penghalusan jurus senjata, dan ekspresi persembahan.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#27272A]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#96989F]">
                  Fokus Modul Latihan Fasa 2:
                </div>
                <ul className="text-xs text-[#C5C6CA] space-y-1.5 list-disc list-inside">
                  <li>Simulasi Pertandingan Sebenar (Sparring Bouts 3 Pusingan)</li>
                  <li>Dril Sapuan Hadapan, Rebah & Takedown Reaksi</li>
                  <li>Kombinasi Tendangan T Pantas & Serangan Balas (Counter)</li>
                  <li>Koreografi Jurus Senjata Golok, Parang & Toya</li>
                  <li>Protokol Tapering & Peaking Menjelang SUKMA / Kejohanan Kebangsaan</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-xs">
              <span className="text-[#96989F]">Status:</span>
              <span className="text-[#FF4D58] font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Menunggu Permulaan Julai 2027
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
