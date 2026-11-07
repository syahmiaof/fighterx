"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  ClipboardList,
  Dumbbell,
  Trophy,
  BookOpen,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { useCoachState } from "@/lib/coach/store";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badgeCount?: number;
  hasChevron?: boolean;
}

export function CoachSidebar() {
  const pathname = usePathname();
  const { coach, kpis } = useCoachState();
  const pendingCount = kpis.pendingVerifications;

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/coach",
      icon: LayoutDashboard,
    },
    {
      id: "verification",
      label: "Verifikasi",
      href: "/coach/verification",
      icon: ClipboardCheck,
      badgeCount: pendingCount,
    },
    {
      id: "athletes",
      label: "Atlet",
      href: "/coach/athletes",
      icon: Users,
    },
    {
      id: "assessments",
      label: "Penilaian",
      href: "/coach/assessments",
      icon: ClipboardList,
    },
    {
      id: "programs",
      label: "Program Latihan",
      href: "/coach/more",
      icon: Dumbbell,
    },
    {
      id: "competitions",
      label: "Pertandingan",
      href: "/coach/competitions",
      icon: Trophy,
    },
    {
      id: "knowledge",
      label: "Knowledge Hub",
      href: "/coach/more",
      icon: BookOpen,
    },
    {
      id: "more",
      label: "More",
      href: "/coach/more",
      icon: LayoutGrid,
      hasChevron: true,
    },
  ];

  return (
    <aside className="coach-sidebar" aria-label="Navigasi Jurulatih">
      {/* Coach Profile Card */}
      <div className="p-3 mb-4 rounded-xl bg-[#1b1d22]/90 border border-[#45464b]/60 flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#e10600] shrink-0 bg-[#252830]">
          <Image
            src={coach.avatarUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
            alt={coach.name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate leading-tight">
            {coach.name}
          </span>
          <span className="text-xs text-[#96989f] leading-tight mb-1">
            {coach.title}
          </span>
          <span className="inline-block text-[10px] font-semibold text-[#ff3845] bg-[#2a1214] px-2 py-0.5 rounded-full border border-[#e10600]/30 w-fit">
            {coach.discipline}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1" aria-label="Menu Jurulatih">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/coach"
              ? pathname === "/coach"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-180 ${
                isActive
                  ? "bg-gradient-to-r from-[#ed171b] to-[#bb080c] text-white shadow-[0_4px_12px_rgba(225,6,0,0.3)] border border-[#ff555a]/60"
                  : "text-[#c5c6ca] hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon size={18} className={isActive ? "text-white" : "text-[#96989f]"} />
                <span className="truncate">{item.label}</span>
              </div>

              {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full min-w-[20px] text-center ${
                    isActive
                      ? "bg-white text-[#e10600]"
                      : "bg-[#e10600] text-white shadow-[0_0_8px_rgba(225,6,0,0.6)]"
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}

              {item.hasChevron && (
                <ChevronRight size={14} className="text-[#96989f]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Artwork & Slogan */}
      <div className="pt-4 mt-4 border-t border-[#45464b]/40 flex flex-col items-center text-center">
        <div className="relative w-36 h-24 mb-2 pointer-events-none opacity-85">
          <Image
            src="/assets/fighterx/silhouette-silat-stance-transparent.png"
            alt="Silat Stance"
            fill
            className="object-contain"
          />
        </div>
        <div className="font-extrabold tracking-wider leading-tight text-xs font-mono">
          <div className="text-white">TRAIN SMARTER.</div>
          <div className="text-[#ff3845]">FIGHT STRONGER.</div>
        </div>
      </div>
    </aside>
  );
}
