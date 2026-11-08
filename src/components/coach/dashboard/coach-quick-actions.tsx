"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, FilePlus, BarChart2, ClipboardList } from "lucide-react";
import { CoachCard } from "../ui/coach-card";

export function CoachQuickActions() {
  const actions = [
    {
      title: "Daftar Atlet",
      subtitle: "Tambah atlet baharu",
      icon: <UserPlus size={18} className="text-[#ff555a]" />,
      href: "/coach/athletes?add=true",
      bgGradient: "from-[#e10600]/10 to-transparent",
    },
    {
      title: "Beri Tugasan",
      subtitle: "Tetapkan latihan mingguan",
      icon: <FilePlus size={18} className="text-[#4ade80]" />,
      href: "/coach/verification",
      bgGradient: "from-[#22c55e]/10 to-transparent",
    },
    {
      title: "Lihat Progress",
      subtitle: "Analisis perkembangan atlet",
      icon: <BarChart2 size={18} className="text-[#60a5fa]" />,
      href: "/coach/athletes",
      bgGradient: "from-[#3b82f6]/10 to-transparent",
    },
    {
      title: "Rekod Penilaian",
      subtitle: "Baseline & Rubrik Teknikal",
      icon: <ClipboardList size={18} className="text-[#fbbf24]" />,
      href: "/coach/athletes",
      bgGradient: "from-[#f59e0b]/10 to-transparent",
    },
  ];

  return (
    <CoachCard className="p-5">
      <div className="pb-3 border-b border-white/[0.08]">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
          <span>⚡</span>
          <span>Tindakan Pantas</span>
        </h3>
        <p className="text-[11px] text-[#96989f]">
          Pintasan terus ke fungsi utama pengurusan jurulatih
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((act) => (
          <Link
            key={act.title}
            href={act.href}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#45464b]/60 bg-[#17191e] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ff3845]/70 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]`}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#202126] border border-[#45464b]/40 group-hover:scale-105 transition-transform">
                {act.icon}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs font-bold text-white group-hover:text-[#ff555a] transition-colors">
                {act.title}
              </div>
              <div className="text-[10px] text-[#96989f] truncate">
                {act.subtitle}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </CoachCard>
  );
}
