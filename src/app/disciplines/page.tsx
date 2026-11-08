import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { DisciplinesPageView } from "@/components/disciplines/disciplines-page-view";

export const metadata: Metadata = {
  title: "Silat Disciplines · Silat Seni & Silat Olahraga · FighterX",
  description:
    "Eksplorasi mendalam dua cabang sukan silat moden: Silat Seni (Tunggal 100 jurus baku, Ganda, Regu, Solo Bebas) dan Silat Olahraga (Taktikal, Zon Mata, Had Tangkapan 5 Saat, Divisyen Berat) mengikut peraturan rasmi PERSILAT 2026.",
};

export default function DisciplinesPage() {
  return (
    <div className="disciplines-page-wrap relative min-h-screen bg-[#08090b] text-white overflow-x-hidden">
      {/* Shared Wallpaper System: 72% opacity over #08090B base */}
      <div className="public-page-wallpaper" aria-hidden="true" />
      <div className="public-page-vignette" aria-hidden="true" />
      <div className="public-page-ambient-smoke" aria-hidden="true" />

      {/* Shared Global SiteHeader */}
      <SiteHeader currentPage="disciplines" />

      {/* Main Content View */}
      <main className="relative z-10">
        <DisciplinesPageView />
      </main>
    </div>
  );
}
