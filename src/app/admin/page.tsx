"use client";

import React from "react";
import { DashboardHero } from "@/components/admin/dashboard/dashboard-hero";
import { KpiOverviewGrid } from "@/components/admin/dashboard/kpi-overview-grid";
import { TrainingTrendCard } from "@/components/admin/dashboard/training-trend-card";
import { QuickActionsPanel } from "@/components/admin/dashboard/quick-actions-panel";
import { ActionRequiredCard } from "@/components/admin/dashboard/action-required-card";
import { RecentActivityCard } from "@/components/admin/dashboard/recent-activity-card";
import { UpcomingCompetitionsCard } from "@/components/admin/dashboard/upcoming-competitions-card";

export default function AdminOverviewDashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Banner with Silat Silhouette & Program Switcher */}
      <DashboardHero />

      {/* 2. Primary 8 KPI Cards Grid */}
      <KpiOverviewGrid />

      {/* 3. Operational Grid: Training Statistics & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <TrainingTrendCard />
        </div>
        <div className="xl:col-span-5">
          <QuickActionsPanel />
        </div>
      </div>

      {/* 4. Action Required Queue & Subscription Records */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <ActionRequiredCard />
        </div>
        <div className="xl:col-span-5">
          <RecentActivityCard />
        </div>
      </div>

      {/* 5. Upcoming Schedule & Tournament Preview */}
      <UpcomingCompetitionsCard />
    </div>
  );
}
