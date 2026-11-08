import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { KnowledgeHubClient } from "@/components/knowledge/knowledge-hub-client";
import "@/components/knowledge/knowledge.css";

export const metadata: Metadata = {
  title: "Sport Science (Sains Sukan Silat) · Panduan Latihan & Periodisasi · FighterX",
  description:
    "Pusat sains sukan, kerangka periodisasi tahunan 2027, pemakanan sukan, pengurusan berat badan selamat, dan protokol pemulihan untuk atlet Silat Seni dan Olahraga berdasarkan piawaian ISN, PERSILAT & MSN.",
  keywords: [
    "sport science silat",
    "sains sukan silat",
    "kerangka periodisasi silat 2027",
    "annual training framework silat",
    "nutrisi atlet silat",
    "pengurusan berat badan silat",
    "ujian kadar peluh silat",
    "sains sukan ISN silat",
    "panduan jurulatih silat",
    "panduan ibu bapa silat",
  ],
};

export default function KnowledgePage() {
  return (
    <div className="knowledge-page relative min-h-screen bg-[#08090B] text-white overflow-x-hidden">
      {/* Shared Wallpaper System: 72% opacity over #08090B base */}
      <div className="public-page-wallpaper" aria-hidden="true" />
      <div className="public-page-vignette" aria-hidden="true" />
      <div className="public-page-ambient-smoke" aria-hidden="true" />

      {/* Shared Global SiteHeader */}
      <SiteHeader currentPage="knowledge" />

      {/* Main Interactive Knowledge Hub Client */}
      <main className="relative z-10">
        <KnowledgeHubClient />
      </main>
    </div>
  );
}
