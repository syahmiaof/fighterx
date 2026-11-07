"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, HelpCircle } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";

export function CoachHeader() {
  const { coach, kpis } = useCoachState();
  const pendingCount = kpis.pendingVerifications;

  return (
    <header className="coach-header">
      <div className="coach-header-inner">
        {/* Brand Lockup */}
        <Link href="/coach" className="flex items-center gap-2.5 text-white hover:opacity-95 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ed171b] to-[#990005] flex items-center justify-center font-black text-white text-sm tracking-wider shadow-[0_0_12px_rgba(225,6,0,0.4)] border border-[#ff555a]/60">
            FX
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-wider font-mono text-white">
              FIGHTER<span className="text-[#ff3845]">X</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.18em] text-[#96989f] uppercase -mt-0.5">
              SILAT COACH PLATFORM
            </span>
          </div>
        </Link>

        {/* Right Utility Cluster */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Link
            href="/coach/verification"
            className="relative p-2 text-[#c5c6ca] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label={`Verifikasi Tertunda: ${pendingCount}`}
          >
            <Bell size={19} />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff3845] ring-2 ring-[#0e0f12] animate-pulse" />
            )}
          </Link>

          {/* Help Circle */}
          <Link
            href="/coach/more"
            className="p-2 text-[#c5c6ca] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Pusat Bantuan & Garis Panduan"
          >
            <HelpCircle size={19} />
          </Link>

          {/* Coach Avatar Dropdown Link */}
          <Link
            href="/coach/profile"
            className="flex items-center gap-2 pl-2 border-l border-[#45464b]/60 group"
          >
            <div className="relative w-8 h-8 rounded-full ring-2 ring-[#e10600]/80 overflow-hidden bg-[#202126] flex items-center justify-center">
              {coach.avatarUrl ? (
                <Image
                  src={coach.avatarUrl}
                  alt={coach.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs font-bold text-white">CF</span>
              )}
              {/* Online emerald dot */}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22c55e] ring-1 ring-[#17191e]" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-[#ff3845] transition-colors leading-tight">
                {coach.name}
              </span>
              <span className="text-[10px] text-[#96989f] leading-tight">
                {coach.title}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
