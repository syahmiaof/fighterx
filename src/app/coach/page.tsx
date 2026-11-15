"use client";

import React, { useState } from "react";
import { CoachHeroBanner } from "@/components/coach/dashboard/coach-hero-banner";
import { CoachKPIGrid } from "@/components/coach/dashboard/coach-kpi-grid";
import { CoachPendingPreview } from "@/components/coach/dashboard/coach-pending-preview";
import { CoachDonutChart } from "@/components/coach/dashboard/coach-donut-chart";
import { CoachWeeklyProgress } from "@/components/coach/dashboard/coach-weekly-progress";
import { CoachUpcomingCompetitions } from "@/components/coach/dashboard/coach-upcoming-competitions";
import { CoachQuickActions } from "@/components/coach/dashboard/coach-quick-actions";
import { CreateChallengeModal } from "@/components/coach/training/create-challenge-modal";
import { Zap, PlusCircle } from "lucide-react";

export default function CoachDashboardPage() {
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Hero Welcome Banner */}
      <CoachHeroBanner />

      {/* Action Strip: Create Home Training Challenge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#ff3845]">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-athletic)" }}>
              Cabaran Latihan Kendiri Di Rumah
            </h3>
            <p className="text-xs text-neutral-400">
              Tugaskan latihan harian atau mingguan khusus untuk skuad kelab anda.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setChallengeModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#e10600] hover:bg-[#ff1f27] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(225,6,0,0.35)] transition-all cursor-pointer"
        >
          <PlusCircle size={15} />
          <span>+ Cipta Cabaran Baharu</span>
        </button>
      </div>

      {/* 2. Top KPI Cards (Row of 4) */}
      <CoachKPIGrid />

      {/* 3. Core Modules Split: Pending Verification & Athlete Consistency */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (~60% on desktop): Pending Verification Queue */}
        <div className="lg:col-span-7 space-y-6">
          <CoachPendingPreview />
        </div>

        {/* Right Column (~40% on desktop): Donut Chart & Side Panels */}
        <div className="lg:col-span-5 space-y-6">
          <CoachDonutChart />
          <CoachWeeklyProgress />
          <CoachUpcomingCompetitions />
        </div>
      </div>

      {/* 4. Quick Actions Grid */}
      <CoachQuickActions />

      {/* Modal: Create Challenge */}
      <CreateChallengeModal
        isOpen={challengeModalOpen}
        onClose={() => setChallengeModalOpen(false)}
        clubId="club-harimau"
        coachName="Cikgu Farid"
      />
    </div>
  );
}
