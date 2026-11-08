"use client";

import React from "react";
import type { WeeklyScheduleDay } from "@/lib/admin/types";
import { ShieldCheck, AlertTriangle, HeartPulse } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";

export interface RestDayEnforcementBannerProps {
  days: WeeklyScheduleDay[];
  onAutoFixRestDay?: () => void;
}

export function RestDayEnforcementBanner({
  days,
  onAutoFixRestDay,
}: RestDayEnforcementBannerProps) {
  // Enforced guardrail calculation
  const restDays = days.filter(
    (d) => d.isRestDay || d.mode === "Recovery" || d.intensity === "Rest"
  );
  const restDaysCount = restDays.length;
  const isValid = restDaysCount >= 1;

  const restDayNames = restDays
    .map((d) => d.malayDayName || d.dayOfWeek)
    .join(", ");

  if (isValid) {
    return (
      <div className="bg-[#052E16]/80 border border-[#10B981]/40 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Pematuhan Sains Sukan Sah: {restDaysCount} Hari Rehat / Pemulihan Dikesan
              </h4>
              <AdminBadge variant="success" size="sm" dot pulseDot>
                Piawaian Dipatuhi
              </AdminBadge>
            </div>

            <p className="text-xs text-[#A7F3D0] leading-relaxed">
              Jadual mikrosiklus 7-hari merangkumi hari rehat/pemulihan pada:{" "}
              <strong className="text-white underline decoration-[#10B981]">{restDayNames}</strong>. Ini mematuhi garis panduan regenerasi asid laktik, pemulihan glikogen otot, dan keseimbangan sistem saraf simpatetik atlet.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white">Nisbah Kerja : Rehat</div>
            <div className="text-[11px] text-[#A7F3D0]">
              {7 - restDaysCount} Hari Latihan : {restDaysCount} Hari Rehat
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center text-[#34D399]">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#450A0A]/90 border border-[#EF4444] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_24px_rgba(239,68,68,0.3)] animate-pulse">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/60 text-[#F87171] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-extrabold text-white tracking-wide">
              AMARAN KESELAMATAN: Tiada Hari Rehat / Pemulihan Ditetapkan! (0 / 7 Hari)
            </h4>
            <AdminBadge variant="danger" size="sm" dot pulseDot>
              Pelanggaran Guardrail
            </AdminBadge>
          </div>

          <p className="text-xs text-[#FECACA] leading-relaxed">
            Perancangan 7 hari latihan berturut-turut tanpa rehat menyalahi prinsip sains sukan dan kurikulum FighterX 2027. Sekurang-kurangnya 1 hari rehat/pemulihan (contoh: Jumaat atau Ahad) wajib ditetapkan untuk mengelakkan sindrom lebihan beban latihan (overtraining syndrome) dan kecederaan tisu otot.
          </p>
        </div>
      </div>

      {onAutoFixRestDay && (
        <div className="shrink-0">
          <AdminButton
            type="button"
            variant="danger"
            size="sm"
            onClick={onAutoFixRestDay}
            leftIcon={<HeartPulse className="w-3.5 h-3.5" />}
          >
            Tetapkan Ahad Sebagai Hari Rehat
          </AdminButton>
        </div>
      )}
    </div>
  );
}
