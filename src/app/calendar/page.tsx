import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { CompetitionsClient } from "@/components/competitions/competitions-client";

export const metadata: Metadata = {
  title: "Takwim Pertandingan · FighterX",
  description: "Takwim rasmi kejohanan Silat seluruh Malaysia.",
};

export default function CalendarPage() {
  return (
    <div className="competitions-page-wrap public-page-wrap relative min-h-screen bg-[#08090b] text-white overflow-x-hidden">
      <div className="public-page-wallpaper" aria-hidden="true" />
      <div className="public-page-vignette" aria-hidden="true" />
      <div className="public-page-ambient-smoke" aria-hidden="true" />
      <SiteHeader currentPage="competitions" />
      <main className="relative z-10">
        <CompetitionsClient />
      </main>
    </div>
  );
}
