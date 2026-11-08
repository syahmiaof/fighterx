"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";
import { CoachCard } from "../ui/coach-card";

export function CoachWeeklyProgress() {
  const executionRate = 76;

  return (
    <CoachCard className="p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e10600]/20 text-[#ff555a]">
            <Dumbbell size={14} />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">
            Program Minggu Ini
          </h3>
        </div>

        <Link
          href="/coach/competitions"
          className="group inline-flex items-center gap-1 text-[11px] font-semibold text-[#c5c6ca] hover:text-white transition-colors"
        >
          <span>Minggu 6 • Blok 1</span>
          <ChevronRight
            size={13}
            className="text-[#96989f] transition-transform group-hover:translate-x-0.5 group-hover:text-white"
          />
        </Link>
      </div>

      {/* Progress Bar & Label */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#c5c6ca]">Kadar Pelaksanaan Keseluruhan</span>
          <span className="text-white font-bold">{executionRate}% Pelaksanaan</span>
        </div>

        {/* Bar */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#202126] border border-[#45464b]/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e10600] to-[#ff3845] transition-all duration-500 shadow-[0_0_8px_rgba(225,6,0,0.5)]"
            style={{ width: `${executionRate}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#96989f]">
          <span>Sasaran: 80% siap sebelum Jumaat</span>
          <span className="text-[#4ade80]">Mengikut jadual</span>
        </div>
      </div>
    </CoachCard>
  );
}
