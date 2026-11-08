import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { LeaderboardClient } from "@/components/leaderboard/leaderboard-client";

export const metadata: Metadata = {
  title: "Leaderboard & Gamification · Carta Kedudukan Silat Kebangsaan · FighterX",
  description:
    "Carta Weekly Top 10 pesilat kebangsaan, ranking kelab silat seluruh Malaysia, dan galeri lencana pencapaian gelanggang berdasarkan latihan terverifikasi.",
};

export default function LeaderboardPage() {
  return (
    <div className="leaderboard-page-wrap relative min-h-screen bg-[#08090B] text-white overflow-x-hidden">
      {/* Shared Wallpaper System: 72% opacity over #08090B base */}
      <div className="public-page-wallpaper" aria-hidden="true" />
      <div className="public-page-vignette" aria-hidden="true" />
      <div className="public-page-ambient-smoke" aria-hidden="true" />

      {/* Shared Global SiteHeader */}
      <SiteHeader currentPage="leaderboard" />

      {/* Main Interactive Leaderboard Client */}
      <main className="relative z-10">
        <LeaderboardClient />
      </main>
    </div>
  );
}
