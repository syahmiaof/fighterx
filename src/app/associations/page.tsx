import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { AssociationsDirectory } from "@/components/associations/associations-directory";
import "@/components/associations/associations.css";

export const metadata: Metadata = {
  title: "Direktori Badan & Perguruan Silat · FighterX",
  description:
    "Direktori interaktif 26 lambang rasmi PESAKA, empat anggota pengasas teras, perguruan silat utama Malaysia, dan badan antarabangsa PERSILAT.",
  keywords: [
    "Silat Malaysia",
    "PESAKA",
    "PSSGM",
    "PSSLM",
    "PSSCM",
    "PSGFM",
    "PERSILAT",
    "IPSI",
    "PSHT",
    "Silat Cekak Hanafi",
    "Silat Sendeng",
    "Perguruan Silat",
    "Direktori Silat",
  ],
  openGraph: {
    title: "Direktori Badan & Perguruan Silat · FighterX",
    description:
      "Koleksi rasmi 26 lambang dan profil persatuan, perguruan pengasas teras, dan badan induk persilatan kebangsaan & antarabangsa.",
    type: "website",
  },
};

export default function AssociationsPage() {
  return (
    <div className="associations-page-wrap">
      {/* Shared Wallpaper System: 72% opacity over #08090B base */}
      <div className="associations-wallpaper" aria-hidden="true" />
      <div className="associations-vignette" aria-hidden="true" />
      <div className="associations-ambient-smoke" aria-hidden="true" />

      {/* Shared Global SiteHeader */}
      <SiteHeader currentPage="associations" />

      {/* Interactive Associations Directory */}
      <AssociationsDirectory />
    </div>
  );
}
