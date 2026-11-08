"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdminState } from "@/lib/admin/store";
import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  ClipboardList,
  Clock,
  Users,
  UserCheck,
  Award,
  TrendingUp,
  FileText,
  Shield,
  FileCheck,
  CreditCard,
  Trophy,
  BookOpen,
  Sparkles,
  Bot,
  Megaphone,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "warning" | "accent" | "neutral";
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    title: "1. OVERVIEW",
    items: [
      {
        href: "/admin",
        label: "Papan Pemuka",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "training",
    title: "2. PROGRAM LATIHAN",
    items: [
      {
        href: "/admin/programmes",
        label: "Master Programme 2027",
        icon: Calendar,
      },
      {
        href: "/admin/exercises",
        label: "Pustaka Senaman",
        icon: Dumbbell,
      },
      {
        href: "/admin/assignments",
        label: "Tugasan Jurulatih",
        icon: ClipboardList,
      },
      {
        href: "/admin/schedules",
        label: "Jadual Mingguan",
        icon: Clock,
      },
    ],
  },
  {
    id: "people",
    title: "3. ATLET & JURULATIH",
    items: [
      {
        href: "/admin/athletes",
        label: "Direktori Atlet",
        icon: Users,
      },
      {
        href: "/admin/coaches",
        label: "Direktori Jurulatih",
        icon: UserCheck,
      },
    ],
  },
  {
    id: "analytics",
    title: "4. PENILAIAN & ANALITIK",
    items: [
      {
        href: "/admin/assessments",
        label: "Rubrik Penilaian",
        icon: Award,
      },
      {
        href: "/admin/analytics",
        label: "Analitik Prestasi",
        icon: TrendingUp,
      },
      {
        href: "/admin/reports",
        label: "Laporan Sistem",
        icon: FileText,
      },
      {
        href: "/admin/competitions",
        label: "Kalendar Pertandingan",
        icon: Trophy,
      },
    ],
  },
  {
    id: "management",
    title: "5. PENGURUSAN & SISTEM",
    items: [
      {
        href: "/admin/clubs",
        label: "Direktori Kelab",
        icon: Shield,
      },
      {
        href: "/admin/clubs/applications",
        label: "Permohonan Kelab",
        icon: FileCheck,
        badge: 12,
        badgeVariant: "warning",
      },
      {
        href: "/admin/subscriptions",
        label: "Langganan SaaS",
        icon: CreditCard,
      },
      {
        href: "/admin/knowledge",
        label: "Knowledge Hub CMS",
        icon: BookOpen,
      },
      {
        href: "/admin/gamification",
        label: "Gamifikasi & Lencana",
        icon: Sparkles,
      },
      {
        href: "/admin/lekir-bot",
        label: "Lekir Bot AI",
        icon: Bot,
      },
      {
        href: "/admin/announcements",
        label: "Pengumuman",
        icon: Megaphone,
      },
      {
        href: "/admin/settings",
        label: "Tetapan Sistem",
        icon: Settings,
      },
    ],
  },
];

export interface AdminSidebarProps {
  applicationsBadgeCount?: number;
  className?: string;
}

export function AdminSidebar({
  applicationsBadgeCount: propBadgeCount,
  className = "",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const state = useAdminState();

  const applicationsBadgeCount =
    propBadgeCount !== undefined
      ? propBadgeCount
      : state.stats.pendingApplicationsCount;

  return (
    <aside
      className={`hidden lg:flex flex-col w-[250px] flex-shrink-0 bg-[#0F1015] border-r border-[#27272A] sticky top-16 h-[calc(100vh-64px)] select-none z-20 ${className}`}
    >
      {/* Scrollable Navigation Menu (5 Groups / 19 Routes) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 admin-scrollbar">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.id} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-[#87898F] uppercase tracking-[0.16em]">
              {group.title}
            </h3>

            <div className="space-y-0.5 mt-1.5">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                // Override badge count if dynamic count passed for applications
                const badgeValue =
                  item.href === "/admin/clubs/applications"
                    ? applicationsBadgeCount
                    : item.badge;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 group ${
                      isActive
                        ? "bg-[#1E2028] text-white shadow-[inset_0_1px_rgba(255,255,255,0.06)]"
                        : "text-[#C5C6CA] hover:text-white hover:bg-[#17191E]"
                    }`}
                  >
                    {/* Active Crimson Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#E10600] shadow-[0_0_8px_#FF3845]" />
                    )}

                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive
                            ? "text-[#FF3845]"
                            : "text-[#96989F] group-hover:text-white"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Badge Count (e.g. 12 on applications) */}
                    {badgeValue !== undefined && badgeValue !== 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.badgeVariant === "warning"
                            ? "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40"
                            : item.badgeVariant === "accent"
                            ? "bg-[#E10600]/25 text-[#FF555A] border border-[#FF3845]/40"
                            : "bg-[#202126] text-[#96989F]"
                        }`}
                      >
                        {badgeValue}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer with Silat Silhouette and Tagline */}
      <div className="p-3 border-t border-[#27272A] bg-[#0B0C0F] text-center space-y-1.5">
        <div className="relative w-full h-10 flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity">
          <Image
            src="/assets/fighterx/silhouette-silat-stance-transparent.png"
            alt="Silat Stance"
            width={70}
            height={40}
            className="object-contain filter invert"
          />
        </div>
        <p
          className="text-[10px] font-bold tracking-[0.18em] text-[#96989F] uppercase"
          style={{ fontFamily: "var(--font-athletic), Teko, sans-serif" }}
        >
          TRAIN SMARTER. FIGHT STRONGER.
        </p>
      </div>
    </aside>
  );
}
