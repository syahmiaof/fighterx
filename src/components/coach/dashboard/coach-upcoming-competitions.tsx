"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Calendar, MapPin, ChevronRight, ArrowRight } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { CoachCard } from "../ui/coach-card";
import { CoachBadge } from "../ui/coach-badge";

export function CoachUpcomingCompetitions() {
  const { competitions } = useCoachState();
  const nextComp = competitions[0] || {
    id: "comp-01",
    title: "Kejohanan Silat Peringkat Zon",
    category: "Development",
    dates: "15 - 17 Mac 2027",
    location: "Kompleks Sukan MSN Nilai",
    status: "Pendaftaran Dibuka",
    bannerImageUrl: "/assets/fighterx/bg-silat-mountains.webp",
  };

  return (
    <CoachCard className="p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f59e0b]/20 text-[#fbbf24]">
            <Trophy size={14} />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">
            Pertandingan Akan Datang
          </h3>
        </div>

        <Link
          href="/coach/competitions"
          className="group inline-flex items-center gap-1 text-xs font-semibold text-[#ff555a] hover:text-white transition-colors"
        >
          <span>Lihat Kalendar</span>
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Card Content */}
      <Link
        href={`/coach/competitions`}
        className="group mt-3 block overflow-hidden rounded-xl border border-[#45464b]/60 bg-[#121316] hover:border-[#ff3845]/70 transition-all duration-200"
      >
        {/* Banner with overlay */}
        <div className="relative h-20 w-full overflow-hidden bg-black/60">
          <Image
            src={nextComp.bannerImageUrl || "/assets/fighterx/bg-silat-mountains.webp"}
            alt={nextComp.title}
            fill
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <CoachBadge variant="yellow" size="sm">
              Kategori B - Pembangunan
            </CoachBadge>
          </div>
          <div className="absolute bottom-1 right-2 text-[10px] font-bold text-[#4ade80] bg-black/70 px-2 py-0.5 rounded">
            {nextComp.status}
          </div>
        </div>

        {/* Text Details */}
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-white group-hover:text-[#ff555a] transition-colors truncate">
              {nextComp.title}
            </h4>
            <ChevronRight
              size={14}
              className="text-[#96989f] group-hover:translate-x-1 group-hover:text-white transition-transform flex-shrink-0"
            />
          </div>

          <div className="mt-2 space-y-1 text-[11px] text-[#c5c6ca]">
            <div className="flex items-center gap-1.5 text-[#96989f]">
              <Calendar size={12} className="text-[#ff3845]" />
              <span>{nextComp.dates}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#96989f]">
              <MapPin size={12} className="text-[#3b82f6]" />
              <span className="truncate">{nextComp.location}</span>
            </div>
          </div>
        </div>
      </Link>
    </CoachCard>
  );
}
