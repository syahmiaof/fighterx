"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  ClipboardList,
  CreditCard,
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  Trophy,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useAdminState } from "@/lib/admin/store";
import { AdminBadge } from "@/components/admin/ui/admin-badge";

export function KpiOverviewGrid() {
  const { kpiStats, applications, athletes, coaches, clubs, competitions } =
    useAdminState();

  // Dynamic values bound to reactive store with fallbacks
  const pendingAppsCount =
    applications.filter((a) => a.status === "PENDING").length ||
    kpiStats.pendingApplicationsCount;
  const registeredClubsCount = clubs.length || kpiStats.registeredClubsCount;
  const totalAthletesCount = athletes.length || kpiStats.totalAthletesCount;
  const activeCoachesCount =
    coaches.filter((c) => c.status === "Active").length ||
    kpiStats.activeCoachesCount;
  const upcomingCompsCount =
    competitions.filter((c) => c.status === "Draft" || c.status === "Open")
      .length || kpiStats.upcomingCompetitionsCount;

  // Revenue calculation: active clubs * RM20 / month
  const activeSubscriptionsCount =
    clubs.filter((c) => c.subscriptionStatus === "ACTIVE").length || 7;
  const monthlyRevenue = activeSubscriptionsCount * 20;

  const kpis = [
    {
      id: "registered-clubs",
      title: "Kelab Berdaftar",
      value: registeredClubsCount.toString(),
      subtext: "+2 bulan ini",
      badge: {
        text: "Aktif",
        variant: "success" as const,
      },
      icon: Building2,
      href: "/admin/clubs",
      hasLink: true,
      accentColor: "border-[#FF3845]/30 hover:border-[#FF3845]",
    },
    {
      id: "pending-applications",
      title: "Permohonan Baru",
      value: pendingAppsCount.toString(),
      subtext: "Menunggu semakan admin",
      badge: {
        text: "Perlu Kelulusan",
        variant: "warning" as const,
        pulseDot: true,
      },
      icon: ClipboardList,
      href: "/admin/clubs/applications",
      hasLink: true,
      accentColor: "border-[#F59E0B]/40 hover:border-[#F59E0B]",
      highlight: true,
    },
    {
      id: "active-subscriptions",
      title: "Yuran (Bulan Ini)",
      value: `RM${monthlyRevenue > 0 ? monthlyRevenue : 280}`,
      subtext: "RM20/kelab • +14%",
      badge: {
        text: "+14%",
        variant: "success" as const,
        trend: true,
      },
      icon: CreditCard,
      href: "/admin/subscriptions",
      hasLink: true,
      accentColor: "border-[#22C55E]/30 hover:border-[#22C55E]",
    },
    {
      id: "total-athletes",
      title: "Jumlah Atlet",
      value: totalAthletesCount.toString(),
      subtext: "▲ +4 vs bulan lepas",
      badge: {
        text: "+4 baharu",
        variant: "success" as const,
      },
      icon: Users,
      href: "/admin/athletes",
      hasLink: true,
      accentColor: "border-[#FF3845]/30 hover:border-[#FF3845]",
    },
    {
      id: "active-coaches",
      title: "Jumlah Jurulatih",
      value: activeCoachesCount.toString(),
      subtext: "Berlesen SPKK & Wasit",
      badge: {
        text: "4 Aktif",
        variant: "neutral" as const,
      },
      icon: UserCheck,
      href: "/admin/coaches",
      hasLink: true,
      accentColor: "border-[#38BDF8]/30 hover:border-[#38BDF8]",
    },
    {
      id: "pending-verifications",
      title: "Menunggu Pengesahan",
      value: (kpiStats.pendingVerificationsCount || 14).toString(),
      subtext: "Bukti video latihan atlet",
      badge: {
        text: "Perlu Tindakan",
        variant: "accent" as const,
      },
      icon: Clock,
      href: "/admin/assignments",
      hasLink: true,
      accentColor: "border-[#FF3845]/40 hover:border-[#FF3845]",
    },
    {
      id: "verified-rate",
      title: "Kadar Pengesahan",
      value: `${kpiStats.verifiedSubmissionsCount || 76}%`,
      subtext: "▲ +8% prestasi bulanan",
      badge: {
        text: "+8% trend",
        variant: "success" as const,
        trend: true,
      },
      icon: CheckCircle2,
      href: "/admin/reports",
      hasLink: true,
      accentColor: "border-[#22C55E]/30 hover:border-[#22C55E]",
    },
    {
      id: "upcoming-competitions",
      title: "Pertandingan Terdekat",
      value: upcomingCompsCount.toString(),
      subtext: "SUKMA & Kejohanan Zon",
      badge: {
        text: "2 Acara",
        variant: "info" as const,
      },
      icon: Trophy,
      href: "/admin/competitions",
      hasLink: true,
      accentColor: "border-[#F59E0B]/30 hover:border-[#F59E0B]",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E10600]" />
            Petunjuk Prestasi Utama (KPI Platform)
          </h2>
          <p className="text-xs text-[#96989F]">
            Status masa nyata kelab, atlet, pengesahan latihan dan kewangan sistem
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          const CardInner = (
            <div
              className={`relative overflow-hidden rounded-xl bg-[#17191E] border ${
                kpi.highlight
                  ? "border-[#F59E0B]/50 bg-gradient-to-b from-[#1E1C18] to-[#17191E] shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  : "border-[#27272A]"
              } p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl group flex flex-col justify-between`}
            >
              {/* Subtle top indicator bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 ${
                  kpi.highlight ? "bg-[#F59E0B]" : "bg-[#27272A] group-hover:bg-[#FF3845]"
                } transition-colors`}
              />

              {/* Card Header: Icon & Top Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    kpi.highlight
                      ? "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30"
                      : "bg-[#202126] text-[#FF555A] group-hover:bg-[#E10600]/20 border border-[#27272A] group-hover:border-[#FF3845]/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <AdminBadge
                    variant={kpi.badge.variant}
                    size="sm"
                    dot={kpi.badge.pulseDot}
                    pulseDot={kpi.badge.pulseDot}
                  >
                    {kpi.badge.trend && <TrendingUp className="w-3 h-3 inline mr-1" />}
                    {kpi.badge.text}
                  </AdminBadge>

                  {kpi.hasLink && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#96989F] group-hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              {/* Card Body: Big Value and Title */}
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-1 font-mono">
                  {kpi.value}
                </div>
                <div className="text-xs font-semibold text-[#E5E5E7] tracking-wide">
                  {kpi.title}
                </div>
              </div>

              {/* Card Footer: Subtext */}
              <div className="mt-3 pt-2.5 border-t border-[#27272A]/70 flex items-center justify-between text-[11px] text-[#96989F]">
                <span className="truncate">{kpi.subtext}</span>
              </div>
            </div>
          );

          return (
            <Link
              key={kpi.id}
              href={kpi.href}
              className="block focus:outline-none focus:ring-2 focus:ring-[#FF3845] rounded-xl"
            >
              {CardInner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
