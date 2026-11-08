"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  CheckSquare,
  CalendarPlus,
  CreditCard,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { useAdminState } from "@/lib/admin/store";

export function QuickActionsPanel() {
  const { applications } = useAdminState();
  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  const actions = [
    {
      title: "Luluskan Permohonan",
      subtitle: `${pendingCount} kelab menunggu`,
      href: "/admin/clubs/applications",
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : null,
      accent: "from-[#E10600]/20 to-[#E10600]/5 border-[#FF3845]/40 text-[#FF555A]",
      iconBg: "bg-[#E10600]/25 text-[#FF555A]",
    },
    {
      title: "Tambah Program",
      subtitle: "Fasa 2027 & Mikrokitaran",
      href: "/admin/programmes",
      icon: CalendarPlus,
      badge: null,
      accent: "from-[#38BDF8]/15 to-transparent border-[#38BDF8]/30 text-[#60A5FA]",
      iconBg: "bg-[#38BDF8]/20 text-[#60A5FA]",
    },
    {
      title: "Rekod Bayaran / Langganan",
      subtitle: "RM20/kelab • 30 Hari Percuma",
      href: "/admin/subscriptions",
      icon: CreditCard,
      badge: null,
      accent: "from-[#22C55E]/15 to-transparent border-[#22C55E]/30 text-[#4ADE80]",
      iconBg: "bg-[#22C55E]/20 text-[#4ADE80]",
    },
    {
      title: "Buat Pengumuman",
      subtitle: "Hebahan seluruh kelab & jurulatih",
      href: "/admin/announcements",
      icon: Megaphone,
      badge: null,
      accent: "from-[#F59E0B]/15 to-transparent border-[#F59E0B]/30 text-[#FBBF24]",
      iconBg: "bg-[#F59E0B]/20 text-[#FBBF24]",
    },
  ];

  return (
    <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#E10600]/15 text-[#FF3845]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide">
            Tindakan Pantas
          </h3>
        </div>
        <span className="text-[11px] text-[#96989F] font-mono">Pintasan Pantas</span>
      </div>

      {/* 2x2 Grid of Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className={`relative group flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-br ${act.accent} border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF3845]`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${act.iconBg} transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors truncate">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-[#96989F] truncate">
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-2">
                {act.badge !== null && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#E10600] text-white shadow-[0_0_8px_rgba(225,6,0,0.6)]">
                    {act.badge}
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-[#96989F] group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
