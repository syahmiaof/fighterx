"use client";

import React from "react";
import { CoachHeroBanner } from "@/components/coach/dashboard/coach-hero-banner";
import { CoachKPIGrid } from "@/components/coach/dashboard/coach-kpi-grid";
import { CoachPendingPreview } from "@/components/coach/dashboard/coach-pending-preview";
import { CoachDonutChart } from "@/components/coach/dashboard/coach-donut-chart";
import { CoachWeeklyProgress } from "@/components/coach/dashboard/coach-weekly-progress";
import { CoachUpcomingCompetitions } from "@/components/coach/dashboard/coach-upcoming-competitions";
import { CoachQuickActions } from "@/components/coach/dashboard/coach-quick-actions";

export default function CoachDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Hero Welcome Banner */}
      <CoachHeroBanner />

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
    </div>
  );
}
