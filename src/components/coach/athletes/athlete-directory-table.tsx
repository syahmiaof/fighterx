"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { CoachCard } from "../ui/coach-card";
import { CoachBadge } from "../ui/coach-badge";
import { CoachButton } from "../ui/coach-button";
import type { Athlete, ConsistencyTier } from "@/lib/coach/types";

interface AthleteDirectoryTableProps {
  athletes: Athlete[];
  viewMode?: "table" | "grid";
}

export function AthleteDirectoryTable({
  athletes,
  viewMode = "table",
}: AthleteDirectoryTableProps) {
  const getTierBadge = (tier: ConsistencyTier) => {
    switch (tier) {
      case "KONSISTEN":
        return <CoachBadge variant="green" size="sm">Konsisten</CoachBadge>;
      case "SEDERHANA":
        return <CoachBadge variant="yellow" size="sm">Sederhana</CoachBadge>;
      case "PERLU_PERHATIAN":
        return <CoachBadge variant="red" size="sm">Perlu Perhatian</CoachBadge>;
      default:
        return <CoachBadge variant="gray" size="sm">{tier}</CoachBadge>;
    }
  };

  if (athletes.length === 0) {
    return (
      <div className="rounded-xl border border-[#45464b]/60 bg-[#17191e]/80 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-[#96989f]">
          <Users size={28} />
        </div>
        <h4 className="mt-4 text-base font-bold text-white">
          Tiada atlet dijumpai
        </h4>
        <p className="mt-1 text-xs text-[#96989f] max-w-sm mx-auto">
          Sila cuba kata kunci carian lain atau ubah penapis disiplin dan kategori.
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {athletes.map((athlete) => (
          <Link
            key={athlete.id}
            href={`/coach/athletes/${athlete.id}`}
            className="group block focus:outline-none"
          >
            <CoachCard
              className="p-5 h-full flex flex-col justify-between hover:border-[#ff3845]/70 transition-all"
              hoverable
            >
              <div>
                {/* Header: Avatar, Name, Discipline */}
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-[#45464b] bg-[#202126]">
                    <Image
                      src={athlete.avatarUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                      alt={athlete.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-[#ff555a] transition-colors truncate">
                      {athlete.name}
                    </h3>
                    <div className="text-[11px] text-[#96989f]">
                      {athlete.discipline} • {athlete.weightClass}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {getTierBadge(athlete.consistencyTier)}
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3 text-center">
                  <div className="rounded-md bg-[#121316] p-2 border border-[#45464b]/30">
                    <span className="text-[9px] font-semibold text-[#96989f] uppercase block">
                      Kehadiran
                    </span>
                    <span className="text-xs font-bold text-white">
                      {athlete.attendanceRate}%
                    </span>
                  </div>
                  <div className="rounded-md bg-[#121316] p-2 border border-[#45464b]/30">
                    <span className="text-[9px] font-semibold text-[#96989f] uppercase block">
                      Tugasan
                    </span>
                    <span className="text-xs font-bold text-[#4ade80]">
                      {athlete.weeklyCompletionRate}%
                    </span>
                  </div>
                  <div className="rounded-md bg-[#121316] p-2 border border-[#45464b]/30">
                    <span className="text-[9px] font-semibold text-[#96989f] uppercase block">
                      Readiness
                    </span>
                    <span className="text-xs font-bold text-[#ff555a]">
                      {athlete.readinessScore || 85}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#96989f] pt-2 border-t border-white/[0.04]">
                <span>{athlete.currentStreakWeeks} minggu konsisten</span>
                <span className="text-[#ff555a] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 font-semibold">
                  Lihat Profil <ChevronRight size={13} />
                </span>
              </div>
            </CoachCard>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#45464b]/60 bg-[#17191e]/85 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#45464b]/60 bg-[#121316] text-[11px] font-bold uppercase tracking-wider text-[#96989f]">
            <th className="py-3 px-4">Nama Atlet</th>
            <th className="py-3 px-4">Disiplin / Kategori</th>
            <th className="py-3 px-4">Konsistensi</th>
            <th className="py-3 px-4">Kehadiran</th>
            <th className="py-3 px-4">Siap Mingguan</th>
            <th className="py-3 px-4">Readiness</th>
            <th className="py-3 px-4 text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06] text-xs">
          {athletes.map((athlete) => (
            <tr
              key={athlete.id}
              className="hover:bg-white/[0.03] transition-colors group"
            >
              {/* Athlete Avatar & Name */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-[#45464b] bg-[#202126]">
                    <Image
                      src={athlete.avatarUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                      alt={athlete.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/coach/athletes/${athlete.id}`}
                      className="font-bold text-white group-hover:text-[#ff555a] transition-colors"
                    >
                      {athlete.name}
                    </Link>
                    <div className="text-[10px] text-[#96989f]">
                      {athlete.age ? `${athlete.age} tahun` : "Atlet"} • {athlete.status}
                    </div>
                  </div>
                </div>
              </td>

              {/* Discipline / Category */}
              <td className="py-3 px-4">
                <div className="font-semibold text-white">
                  {athlete.discipline}
                </div>
                <div className="text-[11px] text-[#96989f]">
                  {athlete.weightClass}
                </div>
              </td>

              {/* Consistency Tier */}
              <td className="py-3 px-4 whitespace-nowrap">
                {getTierBadge(athlete.consistencyTier)}
              </td>

              {/* Attendance */}
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 rounded-full bg-[#202126] overflow-hidden">
                    <div
                      className="h-full bg-[#22c55e] rounded-full"
                      style={{ width: `${athlete.attendanceRate}%` }}
                    />
                  </div>
                  <span className="font-semibold text-white">
                    {athlete.attendanceRate}%
                  </span>
                </div>
              </td>

              {/* Weekly Completion Rate */}
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 rounded-full bg-[#202126] overflow-hidden">
                    <div
                      className="h-full bg-[#3b82f6] rounded-full"
                      style={{ width: `${athlete.weeklyCompletionRate}%` }}
                    />
                  </div>
                  <span className="font-semibold text-white">
                    {athlete.weeklyCompletionRate}%
                  </span>
                </div>
              </td>

              {/* Readiness Score */}
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="font-bold text-[#ff555a]">
                  {athlete.readinessScore || 85}%
                </span>
              </td>

              {/* Actions */}
              <td className="py-3 px-4 text-right whitespace-nowrap">
                <Link href={`/coach/athletes/${athlete.id}`}>
                  <CoachButton variant="outline" size="sm">
                    Lihat Profil
                  </CoachButton>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
