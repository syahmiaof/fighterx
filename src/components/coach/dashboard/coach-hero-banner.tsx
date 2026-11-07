"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";

export function CoachHeroBanner() {
  const { coach } = useCoachState();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#45464b]/60 bg-gradient-to-r from-[#17191e] via-[#1c1e24] to-[#17191e] p-6 lg:p-8 shadow-xl">
      {/* Background ambient red glow & overlay */}
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#e10600]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-[#ff3845]/10 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: Greeting & Tagline */}
        <div className="max-w-2xl space-y-3">
          <div className="text-sm font-medium italic text-[#c5c6ca] tracking-wide">
            Selamat Datang,
          </div>

          <h1 className="font-teko text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-none">
            {coach.name || "Cikgu Farid"}{" "}
            <span className="text-[#e10600] tracking-normal font-extrabold">{"//"}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#96989f] leading-relaxed">
            Pantau perkembangan atlet, sahkan latihan dan pastikan program berjalan mengikut perancangan.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="rounded-full bg-[#e10600]/20 px-3 py-1 font-semibold text-[#ff555a] border border-[#e10600]/40">
              {coach.discipline}
            </span>
            <span className="text-[#96989f]">•</span>
            <span className="text-[#c5c6ca] font-medium">{coach.club}</span>
          </div>
        </div>

        {/* Center / Right Visual: Coach Silhouette Graphic + Program 2027 Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6">
          {/* Coach graphic cutout */}
          <div className="relative hidden md:flex items-center justify-center h-28 w-28 lg:h-32 lg:w-32 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#e10600]/30 to-transparent blur-md" />
            <Image
              src="/assets/fighterx/silhouette-silat-stance-transparent.png"
              alt="Coach Silat Silhouette"
              width={110}
              height={110}
              className="relative z-10 object-contain drop-shadow-[0_8px_16px_rgba(225,6,0,0.4)]"
            />
          </div>

          {/* Program 2027 Card */}
          <Link
            href="/coach/competitions"
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#e10600]/40 bg-gradient-to-br from-[#2a1214]/90 to-[#17191e]/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ff3845] hover:shadow-[0_8px_20px_rgba(225,6,0,0.25)] min-w-[220px]"
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#ff555a]">
                <Calendar size={13} className="text-[#ff3845]" />
                Program 2027
              </span>
              <ChevronRight
                size={14}
                className="text-[#96989f] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"
              />
            </div>

            <div className="mt-2 space-y-0.5">
              <div className="text-xs font-semibold text-white">
                Blok 1: Pembentukan Asas
              </div>
              <div className="text-[11px] text-[#96989f]">
                Januari - Jun 2027
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[#c5c6ca]">
              <span>Minggu 6 • 76% Siap</span>
              <span className="text-[#4ade80]">Aktif</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
