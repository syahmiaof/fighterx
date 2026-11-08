"use client";

import React, { useState } from "react";
import type {
  WeeklyScheduleDay,
  ProgrammeWeeklySchedule,
  ExerciseDefinition,
} from "@/lib/admin/types";
import {
  Clock,
  MapPin,
  Dumbbell,
  ShieldCheck,
  Edit2,
  HeartPulse,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ScheduleDayModal } from "./schedule-day-modal";
import { RestDayEnforcementBanner } from "./rest-day-enforcement-banner";

export interface ScheduleGridProps {
  schedule: ProgrammeWeeklySchedule;
  exercises: ExerciseDefinition[];
  onSaveSchedule: (updatedDays: WeeklyScheduleDay[]) => void;
  isSaving?: boolean;
}

export function ScheduleGrid({
  schedule,
  exercises,
  onSaveSchedule,
  isSaving = false,
}: ScheduleGridProps) {
  const [days, setDays] = useState<WeeklyScheduleDay[]>(schedule.days);
  const [editingDay, setEditingDay] = useState<WeeklyScheduleDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleEditDay = (day: WeeklyScheduleDay) => {
    setEditingDay(day);
    setIsModalOpen(true);
  };

  const handleSaveDay = (updatedDay: WeeklyScheduleDay) => {
    const updatedDays = days.map((d) =>
      d.dayOfWeek === updatedDay.dayOfWeek ? updatedDay : d
    );
    setDays(updatedDays);
    onSaveSchedule(updatedDays);
    setSaveFeedback({
      type: "success",
      message: `Perubahan hari ${updatedDay.malayDayName || updatedDay.dayOfWeek} telah disimpan.`,
    });
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  const handleAutoFixRestDay = () => {
    // Automatically turn Sunday (Ahad) into a rest day if none exists
    const updatedDays = days.map((d) => {
      if (d.dayOfWeek === "Sunday") {
        return {
          ...d,
          isRestDay: true,
          mode: "Recovery" as const,
          intensity: "Rest" as const,
          sessionCount: 0,
          title: "Hari Rehat Wajib Penuh (Fisiologi & Mental)",
          timeSlot: "Sepanjang Hari",
          location: "Rehat di Rumah",
          exerciseIds: [],
        };
      }
      return d;
    });
    setDays(updatedDays);
    onSaveSchedule(updatedDays);
    setSaveFeedback({
      type: "success",
      message: "Hari Ahad telah ditetapkan sebagai Hari Rehat Wajib Penuh.",
    });
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  // Lookup map for fast exercise resolution
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  return (
    <div className="space-y-6">
      {/* Enforcement Banner */}
      <RestDayEnforcementBanner
        days={days}
        onAutoFixRestDay={handleAutoFixRestDay}
      />

      {/* Save Feedback Banner */}
      {saveFeedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            saveFeedback.type === "success"
              ? "bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]"
              : "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#F87171]"
          }`}
        >
          <span>{saveFeedback.message}</span>
          <button
            onClick={() => setSaveFeedback(null)}
            className="text-white hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Schedule Header Card */}
      <div className="bg-[#17191E] border border-[#27272A] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#E10600] text-white uppercase tracking-wider">
              Mikrosiklus Mingguan
            </span>
            <AdminBadge variant="neutral" size="sm">
              Minggu {schedule.weekNumber}
            </AdminBadge>
            <AdminBadge variant="info" size="sm">
              7 Hari (Isnin – Ahad)
            </AdminBadge>
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            {schedule.microcycleFocus}
          </h3>
          <p className="text-xs text-[#96989F]">
            Setiap hari mempunyai perincian mod, intensiti, lokasi, serta senaman sasaran yang dipadankan dengan silibus kebangsaan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <AdminButton
            variant="primary"
            size="sm"
            loading={isSaving}
            onClick={() => onSaveSchedule(days)}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Simpan Seluruh Mikrosiklus
          </AdminButton>
        </div>
      </div>

      {/* 7-Day Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map((day) => {
          const isRest = day.isRestDay || day.mode === "Recovery" || day.intensity === "Rest";
          const assignedExercises = (day.exerciseIds || [])
            .map((id) => exerciseMap.get(id))
            .filter(Boolean) as ExerciseDefinition[];

          return (
            <div
              key={day.dayOfWeek}
              className={`relative rounded-xl border flex flex-col justify-between transition-all duration-200 overflow-hidden ${
                isRest
                  ? "bg-[#0B1E17] border-[#10B981]/40 shadow-[0_4px_20px_rgba(16,185,129,0.1)]"
                  : day.intensity === "High"
                  ? "bg-[#1A181C] border-[#E10600]/30 hover:border-[#E10600]/60"
                  : "bg-[#17191E] border-[#27272A] hover:border-[#37383D]"
              }`}
            >
              {/* Day Top Bar */}
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${
                  isRest
                    ? "bg-[#064E3B]/40 border-[#10B981]/20"
                    : "bg-[#141519] border-[#27272A]"
                }`}
              >
                <div>
                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>{day.malayDayName || day.dayOfWeek}</span>
                    <span className="text-[10px] text-[#96989F] font-normal">
                      ({day.dayOfWeek})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isRest ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 flex items-center gap-1">
                      <HeartPulse className="w-3 h-3" />
                      REHAT
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        day.intensity === "High"
                          ? "bg-[#E10600]/20 text-[#FF4D58] border-[#FF4D58]/40"
                          : day.intensity === "Medium"
                          ? "bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40"
                          : "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40"
                      }`}
                    >
                      {day.intensity}
                    </span>
                  )}
                </div>
              </div>

              {/* Day Content */}
              <div className="p-4 space-y-3.5 flex-1">
                {/* Session Title */}
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                    {day.title || (isRest ? "Hari Rehat Fisiologi" : "Sesi Latihan")}
                  </h4>
                </div>

                {/* Meta details */}
                <div className="space-y-1.5 text-xs text-[#96989F]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                    <span className="text-[#E5E5E7] truncate">{day.timeSlot || "Belum Ditetapkan"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                    <span className="text-[#C5C6CA] truncate">{day.location || "Pusat Latihan"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#96989F]">Mod:</span>
                    <span className="text-[11px] font-semibold text-white px-2 py-0.5 rounded bg-[#202126]">
                      {day.mode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#96989F]">Disiplin:</span>
                    <span className="text-[11px] font-semibold text-[#38BDF8]">
                      {day.targetDiscipline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#96989F]">Bilangan Sesi:</span>
                    <span className="text-[11px] font-bold text-white">
                      {day.sessionCount} Sesi
                    </span>
                  </div>
                </div>

                {/* Assigned Exercises Section */}
                <div className="pt-2 border-t border-[#27272A]/70">
                  <div className="flex items-center justify-between text-[11px] text-[#96989F] mb-1.5">
                    <span className="flex items-center gap-1 font-semibold text-[#C5C6CA]">
                      <Dumbbell className="w-3 h-3 text-[#E10600]" />
                      Latihan Sasaran
                    </span>
                    <span>{assignedExercises.length} modul</span>
                  </div>

                  {assignedExercises.length > 0 ? (
                    <div className="space-y-1 max-h-24 overflow-y-auto admin-scrollbar pr-1">
                      {assignedExercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="text-[10px] p-1.5 rounded bg-[#1A1C22] border border-[#27272A] flex items-center justify-between text-[#C5C6CA]"
                        >
                          <span className="truncate font-medium">{ex.name}</span>
                          <span className="text-[9px] text-[#96989F] shrink-0 ml-1">
                            {ex.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] italic text-[#6B7280] py-1">
                      {isRest ? "Tiada modul beban (Rehat penuh)" : "Tiada latihan ditugaskan"}
                    </div>
                  )}
                </div>
              </div>

              {/* Day Card Footer Action */}
              <div className="p-3 bg-[#141519] border-t border-[#27272A] flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280]">
                  {isRest ? "Protokol Pemulihan" : "Kitaran Latihan"}
                </span>
                <AdminButton
                  variant="secondary"
                  size="xs"
                  onClick={() => handleEditDay(day)}
                  leftIcon={<Edit2 className="w-3 h-3 text-[#E10600]" />}
                >
                  Sunting Hari
                </AdminButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Day Modal */}
      <ScheduleDayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        day={editingDay}
        exercises={exercises}
        onSaveDay={handleSaveDay}
      />
    </div>
  );
}
