"use client";

import React from "react";
import Link from "next/link";
import { SubscriptionPlanCard } from "@/components/admin/subscriptions/subscription-plan-card";
import { SubscriptionsTable } from "@/components/admin/subscriptions/subscriptions-table";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { CreditCard, Shield, ChevronRight, ArrowRight } from "lucide-react";

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#96989F]">
            <Link href="/admin" className="hover:text-white transition-colors">
              Papan Pemuka
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E5E5E7] font-medium">Pengurusan & Sistem</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E5E5E7] font-medium">Langganan SaaS</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#E10600]/15 text-[#FF3845] border border-[#FF3845]/30">
              <CreditCard className="w-6 h-6" />
            </span>
            <span>Pemantauan Langganan SaaS Kelab</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] max-w-2xl leading-relaxed">
            Pantau status langganan kelab silat di bawah model yuran tetap RM20 / kelab / bulan.
            Jejak baki tempoh percubaan percuma 30 hari, pembaharuan automatik, dan rekod invois bulanan.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/admin/clubs">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Shield className="w-4 h-4 text-[#FF3845]" />}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Direktori Kelab
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Financial KPI Summary & Plan Overview */}
      <SubscriptionPlanCard />

      {/* Main Subscriptions Table & Filter */}
      <SubscriptionsTable />
    </div>
  );
}
