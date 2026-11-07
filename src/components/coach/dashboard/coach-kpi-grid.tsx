"use client";

import React from "react";
import Link from "next/link";
import { Users, ClipboardCheck, CheckCircle2, Trophy } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { CoachCard } from "../ui/coach-card";

export function CoachKPIGrid() {
  const { kpis } = useCoachState();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* 1. Jumlah Atlet */}
      <CoachCard className="p-4 sm:p-5 flex flex-col justify-between" hoverable>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#96989f] tracking-wide">
            Jumlah Atlet
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e10600]/15 text-[#ff555a] border border-[#e10600]/30">
            <Users size={16} />
          </div>
        </div>

        <div className="mt-3">
          <div className="font-teko text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
            {kpis.totalAthletes}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#4ade80]">
            <span>▲ +{kpis.totalAthletesChange}</span>
            <span className="text-[#96989f]">berbanding bulan lepas</span>
          </div>
        </div>
      </CoachCard>

      {/* 2. Dalam Verifikasi (Highlighted with crimson border/glow) */}
      <Link href="/coach/verification" className="block focus:outline-none">
        <CoachCard
          className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer border-[#ff3845] shadow-[0_0_20px_rgba(225,6,0,0.28)] bg-gradient-to-br from-[#261214]/90 to-[#17191e]/90"
          hoverable
          glow
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#ff555a] tracking-wide flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3845] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e10600]"></span>
              </span>
              Dalam Verifikasi
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e10600] text-white shadow-md">
              <ClipboardCheck size={16} />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-teko text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
              {kpis.pendingVerifications}
            </div>
            <div className="mt-1 text-[11px] font-medium text-[#ff555a]">
              Tindakan segera diperlukan →
            </div>
          </div>
        </CoachCard>
      </Link>

      {/* 3. Disahkan (Minggu Ini) */}
      <CoachCard className="p-4 sm:p-5 flex flex-col justify-between" hoverable>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#96989f] tracking-wide">
            Disahkan (Minggu Ini)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="mt-3">
          <div className="font-teko text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
            {kpis.verifiedThisWeekRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#4ade80]">
            <span>▲ +{kpis.verifiedThisWeekChange}%</span>
            <span className="text-[#96989f]">kadar semakan</span>
          </div>
        </div>
      </CoachCard>

      {/* 4. Pertandingan Akan Datang */}
      <Link href="/coach/competitions" className="block focus:outline-none">
        <CoachCard className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer" hoverable>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[#96989f] tracking-wide">
              Pertandingan Akan Datang
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30">
              <Trophy size={16} />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-teko text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
              {kpis.upcomingCompetitionsCount}
            </div>
            <div className="mt-1 text-[11px] text-[#96989f]">
              1 Major, 1 Development
            </div>
          </div>
        </CoachCard>
      </Link>
    </div>
  );
}
