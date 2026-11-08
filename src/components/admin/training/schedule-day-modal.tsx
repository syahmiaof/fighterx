"use client";

import React, { useState } from "react";
import type {
  WeeklyScheduleDay,
  ProgrammeMode,
  MultiDiscipline,
  ExerciseDefinition,
} from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { Dumbbell, Check, Clock, MapPin } from "lucide-react";

export interface ScheduleDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: WeeklyScheduleDay | null;
  exercises: ExerciseDefinition[];
  onSaveDay: (updatedDay: WeeklyScheduleDay) => void;
}

export function ScheduleDayModal({
  isOpen,
  onClose,
  day,
  exercises,
  onSaveDay,
}: ScheduleDayModalProps) {
  const [formData, setFormData] = useState<WeeklyScheduleDay | null>(null);

  const [prevDay, setPrevDay] = useState<WeeklyScheduleDay | null>(null);
  if (day && day !== prevDay) {
    setPrevDay(day);
    setFormData({
      ...day,
      exerciseIds: day.exerciseIds ? [...day.exerciseIds] : [],
    });
  }

  if (!formData || !day) return null;

  const handleToggleRestDay = (checked: boolean) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isRestDay: checked,
        mode: checked ? "Recovery" : prev.mode === "Recovery" ? "Normal" : prev.mode,
        intensity: checked ? "Rest" : prev.intensity === "Rest" ? "Medium" : prev.intensity,
        sessionCount: checked ? 0 : prev.sessionCount === 0 ? 1 : prev.sessionCount,
        timeSlot: checked ? "Sepanjang Hari" : prev.timeSlot || "20:30 - 22:00",
        location: checked ? "Rehat di Rumah" : prev.location || "Dewan Latihan Utama",
        exerciseIds: checked ? [] : prev.exerciseIds,
      };
    });
  };

  const handleToggleExercise = (exerciseId: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const current = prev.exerciseIds || [];
      const updated = current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId];
      return { ...prev, exerciseIds: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSaveDay(formData);
      onClose();
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Konfigurasi Hari: {formData.malayDayName || formData.dayOfWeek}</span>
          {formData.isRestDay && (
            <AdminBadge variant="success" size="sm">
              Hari Rehat
            </AdminBadge>
          )}
        </div>
      }
      description="Laraskan sesi latihan, mod operasi, intensiti, dan latihan sasaran untuk hari ini."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rest Day Switch Highlight */}
        <div className="bg-[#121316] border border-[#27272A] p-4 rounded-xl flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Status Hari Rehat / Pemulihan (Rest & Recovery Day)</span>
              {formData.isRestDay && (
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              )}
            </div>
            <p className="text-xs text-[#96989F] mt-0.5">
              Aktifkan ini untuk menandakan hari ini sebagai tempoh regenerasi fisiologi atlet mengikut garis panduan sukan.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRestDay}
              onChange={(e) => handleToggleRestDay(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#27272A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
          </label>
        </div>

        {/* Title & Slot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Tajuk / Fokus Sesi
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => prev && { ...prev, title: e.target.value })
              }
              placeholder="cth. Dril Tendangan & Sapuan Taktikal"
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3.5 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Slot Masa (Waktu Sesi)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
              <input
                type="text"
                value={formData.timeSlot || ""}
                onChange={(e) =>
                  setFormData((prev) => prev && { ...prev, timeSlot: e.target.value })
                }
                placeholder="cth. 20:30 - 22:30"
                className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg pl-9 pr-3.5 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Sessions Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Lokasi / Gelanggang
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData((prev) => prev && { ...prev, location: e.target.value })
                }
                placeholder="cth. Dewan Silat TVETMARA Besut"
                className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg pl-9 pr-3.5 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Bilangan Sesi Sehari
            </label>
            <select
              value={formData.sessionCount}
              onChange={(e) =>
                setFormData(
                  (prev) => prev && { ...prev, sessionCount: Number(e.target.value) }
                )
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3.5 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value={0}>0 Sesi (Rehat Penuh)</option>
              <option value={1}>1 Sesi</option>
              <option value={2}>2 Sesi (Pagi & Malam)</option>
              <option value={3}>3 Sesi (Kem Intensif)</option>
            </select>
          </div>
        </div>

        {/* Mode, Intensity & Discipline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Mod Operasi
            </label>
            <select
              value={formData.mode}
              onChange={(e) =>
                setFormData(
                  (prev) =>
                    prev && {
                      ...prev,
                      mode: e.target.value as ProgrammeMode,
                    }
                )
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value="Normal">Normal</option>
              <option value="Pre-Competition">Pre-Competition</option>
              <option value="Competition Week">Competition Week</option>
              <option value="Recovery">Recovery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Tahap Intensiti
            </label>
            <select
              value={formData.intensity}
              onChange={(e) =>
                setFormData(
                  (prev) =>
                    prev && {
                      ...prev,
                      intensity: e.target.value as "Low" | "Medium" | "High" | "Rest",
                    }
                )
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value="Rest">Rest (Rehat)</option>
              <option value="Low">Low (Rendah)</option>
              <option value="Medium">Medium (Sederhana)</option>
              <option value="High">High (Tinggi)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Disiplin Sasaran
            </label>
            <select
              value={formData.targetDiscipline}
              onChange={(e) =>
                setFormData(
                  (prev) =>
                    prev && {
                      ...prev,
                      targetDiscipline: e.target.value as MultiDiscipline,
                    }
                )
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value="Both">Kedua-dua (Seni & Olahraga)</option>
              <option value="Silat Seni">Silat Seni Sahaja</option>
              <option value="Silat Olahraga">Silat Olahraga Sahaja</option>
            </select>
          </div>
        </div>

        {/* Assigned Exercises Selector */}
        {!formData.isRestDay && (
          <div className="space-y-2 pt-2 border-t border-[#27272A]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#E10600]" />
                <span>Pilih Senaman / Latihan Ditugaskan ({formData.exerciseIds?.length || 0})</span>
              </label>
              <span className="text-[11px] text-[#96989F]">
                Klik untuk tambah/buang latihan dalam slot ini
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 admin-scrollbar">
              {exercises.map((ex) => {
                const isSelected = formData.exerciseIds?.includes(ex.id);
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => handleToggleExercise(ex.id)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[#E10600]/15 border-[#FF4D58]/60 text-white"
                        : "bg-[#1A1C22] border-[#27272A] text-[#96989F] hover:bg-[#202126] hover:text-white"
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold truncate">{ex.name}</div>
                      <div className="text-[10px] text-[#96989F] flex items-center gap-1.5 mt-0.5">
                        <span>{ex.code}</span>
                        <span>•</span>
                        <span>{ex.category}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#E10600] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
          <AdminButton type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton type="submit" variant="primary" size="sm">
            Simpan Perubahan Hari
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
