"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { WeeklyScheduleDay } from "@/lib/admin/types";
import {
  Clock,
  Calendar,
  AlertTriangle,
  Dumbbell,
  CheckCircle2,
  Info,
} from "lucide-react";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ScheduleGrid } from "@/components/admin/training/schedule-grid";

export default function AdminSchedulesPage() {
  const state = useAdminState();
  const actions = useAdminActions();

  const activeProgramme =
    state.programmes.find((p) => p.id === state.activeProgrammeId) ||
    state.programmes[0];

  const currentSchedule =
    activeProgramme?.weeklySchedules?.[0] || {
      id: "sched-default",
      programmeId: activeProgramme?.id || "prog-2027-master",
      weekNumber: 12,
      microcycleFocus:
        "Mikrosiklus 12: Pengukuhan Daya Tahan Kardiovaskular & Kuda-Kuda Rendah",
      days: [],
    };

  const [isSaving, setIsSaving] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSaveSchedule = (updatedDays: WeeklyScheduleDay[]) => {
    setIsSaving(true);
    const result = actions.updateWeeklySchedule(currentSchedule.id, updatedDays);
    setIsSaving(false);

    if (result.success) {
      setGlobalMessage({
        type: "success",
        text: result.message || "Jadual mikrosiklus berjaya dikemas kini dalam pangkalan data.",
      });
    } else {
      setGlobalMessage({
        type: "error",
        text:
          result.error ||
          "Gagal mengemas kini jadual. Sila pastikan sekurang-kurangnya 1 hari rehat/pemulihan disediakan.",
      });
    }

    setTimeout(() => {
      setGlobalMessage(null);
    }, 5000);
  };

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
            <span className="text-[#E10600]">Jadual Mingguan Mikrosiklus</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-[#E10600]" />
            Perancang Jadual Mikrosiklus Mingguan (Isnin – Ahad)
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1 max-w-3xl leading-relaxed">
            Pengurusan jadual sesi latihan harian 7-hari merangkumi waktu sesi, gelanggang, intensiti fisiologi, disiplin sasaran, dan penguatkuasaan hari rehat wajib mengikut piawaian sains sukan kebangsaan.
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
          <Link href="/admin/exercises">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Dumbbell className="w-4 h-4 text-[#10B981]" />}
            >
              Pustaka Senaman ({state.exercises.length})
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Global Status Banner */}
      {globalMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border shadow-lg ${
            globalMessage.type === "success"
              ? "bg-[#10B981]/15 border-[#10B981]/50 text-[#34D399]"
              : "bg-[#EF4444]/15 border-[#EF4444]/50 text-[#F87171]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {globalMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            )}
            <span>{globalMessage.text}</span>
          </div>
          <button
            onClick={() => setGlobalMessage(null)}
            className="text-white hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Microcycle Grid & Enforcement */}
      {currentSchedule.days.length > 0 ? (
        <ScheduleGrid
          schedule={currentSchedule}
          exercises={state.exercises}
          onSaveSchedule={handleSaveSchedule}
          isSaving={isSaving}
        />
      ) : (
        <div className="bg-[#17191E] border border-[#27272A] rounded-xl p-8 text-center text-[#96989F]">
          Tiada jadual harian ditemui untuk program ini.
        </div>
      )}

      {/* Scientific Reference Guardrail Note */}
      <div className="bg-[#121316] border border-[#27272A] rounded-xl p-5 flex items-start gap-4 text-xs text-[#96989F] leading-relaxed">
        <Info className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-semibold">
            Nota Protokol Keselamatan & Pemulihan (Recovery Guardrail):
          </strong>
          <p>
            Sistem FighterX menguatkuasakan perlindungan fisiologi atlet secara automatik. Sebarang jadual mingguan yang tidak menetapkan sekurang-kurangnya satu (1) hari rehat atau pemulihan aktif akan disekat oleh pengesahan integriti pelayan bagi mematuhi garis panduan pemulihan glikogen dan pencegahan kecederaan ligamen/otot.
          </p>
        </div>
      </div>
    </div>
  );
}
