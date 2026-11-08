"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { ExerciseDefinition } from "@/lib/admin/types";
import {
  Dumbbell,
  Calendar,
  Clock,
  Layers,
  CheckCircle2,
  Video,
  Activity,
} from "lucide-react";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ExerciseLibraryTable } from "@/components/admin/training/exercise-library-table";

export default function AdminExercisesPage() {
  const state = useAdminState();
  const actions = useAdminActions();

  const [notification, setNotification] = useState<string | null>(null);

  const handleAddExercise = (data: Omit<ExerciseDefinition, "id">) => {
    actions.addExercise(data);
    setNotification(`Senaman "${data.name}" (${data.code}) berjaya didaftarkan ke dalam pustaka.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdateExercise = (
    id: string,
    updates: Partial<ExerciseDefinition>
  ) => {
    actions.updateExercise(id, updates);
    setNotification("Perubahan definisi senaman berjaya dikemas kini.");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteExercise = (id: string) => {
    actions.deleteExercise(id);
    setNotification("Senaman telah diarkibkan daripada paparan utama.");
    setTimeout(() => setNotification(null), 4000);
  };

  // Stats calculation
  const totalExercises = state.exercises.length;
  const videoRequiredCount = state.exercises.filter(
    (e) => e.evidenceRequirements?.videoRequired
  ).length;
  const seniCount = state.exercises.filter(
    (e) => e.discipline === "Silat Seni" || e.discipline === "Shared"
  ).length;
  const olahragaCount = state.exercises.filter(
    (e) => e.discipline === "Silat Olahraga" || e.discipline === "Shared"
  ).length;

  return (
    <div className="space-y-7">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1.5">
            <Link href="/admin" className="hover:text-white transition-colors">
              Papan Pemuka
            </Link>
            <span>/</span>
            <Link
              href="/admin/programmes"
              className="hover:text-white transition-colors"
            >
              Program Latihan
            </Link>
            <span>/</span>
            <span className="text-[#E10600]">Pustaka Senaman Kebangsaan</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2.5">
            <Dumbbell className="w-7 h-7 text-[#E10600]" />
            Pustaka Senaman & Modul Prestasi Silat
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1 max-w-3xl leading-relaxed">
            Katalog modul latihan berpusat dengan konfigurasi metrik boleh ubah (jarak, masa, ulangan, pace, hold time) dan keperluan bukti rakaman atlet (video, foto, log GPS, catatan refleksi).
          </p>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/programmes">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Calendar className="w-4 h-4 text-[#E10600]" />}
            >
              Master Programme 2027
            </AdminButton>
          </Link>
          <Link href="/admin/schedules">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Clock className="w-4 h-4 text-[#38BDF8]" />}
            >
              Jadual Mikrosiklus
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/50 text-[#34D399] p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-white hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Exercise Library KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Dumbbell className="w-4 h-4 text-[#E10600]" />
            <span>Jumlah Senaman</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalExercises}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Modul standard platform</div>
        </div>

        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Video className="w-4 h-4 text-[#38BDF8]" />
            <span>Wajib Video</span>
          </div>
          <div className="text-2xl font-bold text-white">{videoRequiredCount}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Pengesahan rakaman visual</div>
        </div>

        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Layers className="w-4 h-4 text-[#F59E0B]" />
            <span>Modul Seni</span>
          </div>
          <div className="text-2xl font-bold text-white">{seniCount}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Jurus, langkah & senjata</div>
        </div>

        <div className="bg-[#17191E] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Activity className="w-4 h-4 text-[#10B981]" />
            <span>Modul Olahraga</span>
          </div>
          <div className="text-2xl font-bold text-white">{olahragaCount}</div>
          <div className="text-[11px] text-[#96989F] mt-0.5">Kombat, tendangan & sapuan</div>
        </div>
      </div>

      {/* Main Exercise Library Interactive Table */}
      <ExerciseLibraryTable
        exercises={state.exercises}
        onAddExercise={handleAddExercise}
        onUpdateExercise={handleUpdateExercise}
        onDeleteExercise={handleDeleteExercise}
      />
    </div>
  );
}
