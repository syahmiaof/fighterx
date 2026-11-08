"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  LayoutGrid,
} from "lucide-react";
import { useCoachState } from "@/lib/coach/store";

export function CoachMobileBottomNav() {
  const pathname = usePathname();
  const { kpis } = useCoachState();
  const pendingCount = kpis.pendingVerifications;

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/coach",
      icon: LayoutDashboard,
      isActive: pathname === "/coach",
    },
    {
      id: "verification",
      label: "Verifikasi",
      href: "/coach/verification",
      icon: ClipboardCheck,
      badge: pendingCount,
      isActive: pathname.startsWith("/coach/verification"),
    },
    {
      id: "athletes",
      label: "Atlet",
      href: "/coach/athletes",
      icon: Users,
      isActive: pathname.startsWith("/coach/athletes"),
    },
    {
      id: "more",
      label: "More",
      href: "/coach/more",
      icon: LayoutGrid,
      isActive:
        pathname.startsWith("/coach/more") ||
        pathname.startsWith("/coach/profile") ||
        pathname.startsWith("/coach/assessments") ||
        pathname.startsWith("/coach/competitions"),
    },
  ];

  return (
    <nav className="coach-bottom-nav" aria-label="Navigasi Mudah Alih">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`coach-nav-tab ${tab.isActive ? "is-active" : ""}`}
            aria-current={tab.isActive ? "page" : undefined}
          >
            <div className="relative">
              <Icon size={20} />
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-[#e10600] text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_6px_rgba(225,6,0,0.8)]">
                  {tab.badge}
                </span>
              )}
            </div>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
