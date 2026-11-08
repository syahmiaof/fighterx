import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { CompetitionsClient } from "@/components/competitions/competitions-client";

export const metadata: Metadata = {
  title: "Competition Calendar · Takwim Kejohanan Silat Malaysia 2026/2027 · FighterX",
  description:
    "Jadual takwim kejohanan Silat seluruh Malaysia: SUKMA, SUKIPT, Kejohanan Kebangsaan, Sirkit Remaja Negeri, dan Terbuka berserta borang penghantaran acara penganjur.",
};

export default function CompetitionsPage() {
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
