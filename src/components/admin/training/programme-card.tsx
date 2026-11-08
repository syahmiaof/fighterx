"use client";

import React from "react";
import Link from "next/link";
import type { MasterTrainingProgramme } from "@/lib/admin/types";
import {
  Layers,
  Award,
  Clock,
  Dumbbell,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";

export interface ProgrammeCardProps {
  programme: MasterTrainingProgramme;
  assignedClubsCount?: number;
  totalExercisesCount?: number;
  onTogglePublish?: () => void;
}

export function ProgrammeCard({
  programme,
  assignedClubsCount = 4,
  totalExercisesCount = 14,
}: ProgrammeCardProps) {
  const progressPercent = Math.round(
    (programme.activeWeek / programme.totalWeeks) * 100
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1C23] via-[#17191E] to-[#121316] border border-[#37383D] rounded-2xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Decorative red gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E10600]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5 pb-5 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E10600] text-white tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            {programme.frameworkVersion}
          </span>
          <AdminBadge variant="neutral" size="sm">
            Tahun {programme.year}
          </AdminBadge>
          <AdminBadge variant="info" size="sm">
            Versi {programme.version}.0
          </AdminBadge>
          <AdminBadge variant="success" size="sm" dot>
            {programme.isPublished ? "Diterbitkan & Aktif" : "Draf Pentadbir"}
          </AdminBadge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#96989F]">Disiplin:</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#202126] text-white border border-[#37383D]">
            Silat Seni & Olahraga ({programme.discipline})
          </span>
        </div>
      </div>

      {/* Title & Core Periodization Info */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            {programme.name}
          </h2>
          <p className="text-sm text-[#C5C6CA] leading-relaxed">
            {programme.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#96989F]">Fasa Semasa:</span>
              <span className="font-bold text-[#38BDF8] px-2 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/30">
                {programme.currentPhase}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#96989F]">Mod Operasi:</span>
              <span className="font-bold text-[#FF4D58] px-2 py-0.5 rounded bg-[#E10600]/15 border border-[#FF4D58]/40">
                {programme.activeMode}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#96989F]">
              <span>Kemas kini: {new Date(programme.updatedAt).toLocaleDateString("ms-MY")}</span>
            </div>
          </div>
        </div>

        {/* 52-Week Progress Bar Card */}
        <div className="bg-[#121316] border border-[#27272A] rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#96989F] font-medium">Kemajuan Makrosiklus 2027</span>
              <span className="font-bold text-white">{progressPercent}%</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-3 bg-[#202126] rounded-full overflow-hidden p-0.5 border border-[#27272A]">
              <div
                className="h-full bg-gradient-to-r from-[#E10600] to-[#FF4D58] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(225,6,0,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#96989F] pt-1">
              <span>Minggu {programme.activeWeek} (Semasa)</span>
              <span>{programme.totalWeeks} Minggu Keseluruhan</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27272A] grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-[#1A1C22]">
              <div className="text-[#96989F] text-[10px]">Fasa 1 (Jan-Jun)</div>
              <div className="font-bold text-white">M1 – M26</div>
            </div>
            <div className="p-2 rounded bg-[#1A1C22]">
              <div className="text-[#96989F] text-[10px]">Fasa 2 (Jul-Dis)</div>
              <div className="font-bold text-white">M27 – M52</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#141519] border border-[#27272A] p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Clock className="w-4 h-4 text-[#38BDF8]" />
            <span>Kitaran Mingguan</span>
          </div>
          <div className="text-xl font-bold text-white">
            {programme.totalWeeks} <span className="text-xs font-normal text-[#96989F]">Minggu</span>
          </div>
        </div>

        <div className="bg-[#141519] border border-[#27272A] p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Layers className="w-4 h-4 text-[#F59E0B]" />
            <span>Fasa Periodisasi</span>
          </div>
          <div className="text-xl font-bold text-white">
            2 <span className="text-xs font-normal text-[#96989F]">Fasa Utama</span>
          </div>
        </div>

        <div className="bg-[#141519] border border-[#27272A] p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <Dumbbell className="w-4 h-4 text-[#10B981]" />
            <span>Pustaka Senaman</span>
          </div>
          <div className="text-xl font-bold text-white">
            {totalExercisesCount} <span className="text-xs font-normal text-[#96989F]">Latihan</span>
          </div>
        </div>

        <div className="bg-[#141519] border border-[#27272A] p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#96989F] mb-1">
            <ClipboardList className="w-4 h-4 text-[#E10600]" />
            <span>Kelab Ditugaskan</span>
          </div>
          <div className="text-xl font-bold text-white">
            {assignedClubsCount} <span className="text-xs font-normal text-[#96989F]">Kelab</span>
          </div>
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[#27272A]">
        <div className="flex items-center gap-2 text-xs text-[#96989F]">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Kurikulum berpandukan garis panduan ISN & PESAKA Malaysia 2027</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/schedules">
            <AdminButton variant="secondary" size="sm" leftIcon={<Clock className="w-3.5 h-3.5" />}>
              Jadual Mikrosiklus
            </AdminButton>
          </Link>
          <Link href="/admin/exercises">
            <AdminButton variant="secondary" size="sm" leftIcon={<Dumbbell className="w-3.5 h-3.5" />}>
              Pustaka Senaman
            </AdminButton>
          </Link>
          <Link href="/admin/assignments">
            <AdminButton variant="primary" size="sm" leftIcon={<ClipboardList className="w-3.5 h-3.5" />}>
              Urus Tugasan Kelab
            </AdminButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
