"use client";

import React, { useMemo } from "react";
import { useAdminState } from "@/lib/admin/store";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import {
  CreditCard,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export function SubscriptionPlanCard() {
  const { subscriptions } = useAdminState();

  const metrics = useMemo(() => {
    let activeCount = 0;
    let trialingCount = 0;
    let pastDueCount = 0;
    let totalPaidRevenue = 0;

    subscriptions.forEach((sub) => {
      if (sub.status === "ACTIVE") {
        activeCount++;
      } else if (sub.status === "TRIALING") {
        trialingCount++;
      } else if (sub.status === "PAST_DUE") {
        pastDueCount++;
      }

      // Calculate total collected revenue from paid invoices
      sub.paymentHistory.forEach((inv) => {
        if (inv.status === "PAID") {
          totalPaidRevenue += inv.amount;
        }
      });
    });

    // Invariant: RM20 per club per month
    const mrr = activeCount * 20;

    return {
      activeCount,
      trialingCount,
      pastDueCount,
      mrr,
      totalPaidRevenue,
      totalSubscriptions: subscriptions.length,
    };
  }, [subscriptions]);

  return (
    <div className="space-y-6">
      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <AdminCard glow="red" className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#96989F] uppercase tracking-wider">
                MRR Bulanan (RM20/Kelab)
              </span>
              <p className="text-3xl font-extrabold text-white tracking-tight">
                RM {metrics.mrr}
              </p>
              <p className="text-[11px] text-[#4ADE80] font-medium flex items-center gap-1">
                <span>{metrics.activeCount} kelab aktif berbayar</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#E10600]/15 text-[#FF3845] border border-[#FF3845]/30">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#E10600]/10 rounded-full blur-2xl pointer-events-none" />
        </AdminCard>

        {/* Active Subscriptions Card */}
        <AdminCard className="border-[#22C55E]/30">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#96989F] uppercase tracking-wider">
                Langganan Aktif
              </span>
              <p className="text-3xl font-extrabold text-[#4ADE80]">
                {metrics.activeCount}
              </p>
              <p className="text-[11px] text-[#96989F]">
                Kadar RM20 / bulan konsisten
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#22C55E]/15 text-[#4ADE80] border border-[#22C55E]/30">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </AdminCard>

        {/* Trialing Subscriptions Card */}
        <AdminCard className="border-[#F59E0B]/30">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#96989F] uppercase tracking-wider">
                Percubaan Percuma 30 Hari
              </span>
              <p className="text-3xl font-extrabold text-[#FBBF24]">
                {metrics.trialingCount}
              </p>
              <p className="text-[11px] text-[#C5C6CA]">
                Kelab baharu diluluskan
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </AdminCard>

        {/* Past Due Subscriptions Card */}
        <AdminCard className="border-[#EF4444]/30">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#96989F] uppercase tracking-wider">
                Bayaran Tertunggak
              </span>
              <p className="text-3xl font-extrabold text-[#F87171]">
                {metrics.pastDueCount}
              </p>
              <p className="text-[11px] text-[#F87171]">
                Perlu tindakan peringatan
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Plan Invariant Explanatory Banner */}
      <div className="p-4 bg-[#141519] border border-[#27272A] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-[#E10600]/15 text-[#FF3845] border border-[#FF3845]/30 flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                Struktur Harga SaaS FighterX: RM20 / Kelab / Bulan
              </h4>
              <AdminBadge variant="accent" size="sm">
                Kadar Tetap
              </AdminBadge>
            </div>
            <p className="text-xs text-[#96989F] mt-0.5">
              Setiap kelab yang diluluskan menikmati 30 hari percubaan percuma secara automatik sebelum kitaran pengebilan RM20/bulan bermula.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#C5C6CA]">
          <span className="px-2.5 py-1 rounded-md bg-[#202126] border border-[#37383D]">
            Percubaan 30 Hari: RM0
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#202126] border border-[#37383D]">
            Langganan Bulanan: RM20.00
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#202126] border border-[#37383D]">
            Jumlah Terkumpul: RM {metrics.totalPaidRevenue}
          </span>
        </div>
      </div>
    </div>
  );
}
