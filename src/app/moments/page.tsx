import { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { MomentsHeroHeader } from "@/components/moments/moments-hero-header";
import { MomentsExperience } from "@/components/moments/moments-experience";

export const metadata: Metadata = {
  title: "Moment Atlet Silat Kebangsaan · Galeri Latihan & Aksi Gelanggang · FighterX",
  description:
    "Galeri dan suapan perkongsian detik latihan atlet silat seluruh Malaysia. Saksikan dedikasi, seni, dan keringat pesilat tanah air merentas kelab dan negeri.",
};

interface MomentsPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MomentsPage({ searchParams }: MomentsPageProps) {
  const params = searchParams ? await searchParams : {};
  const isUploadRequested = params.upload === "true" || params.action === "upload";

  return (
    <div className="moments-page-wrap public-page-wrap relative min-h-screen bg-[#08090b] text-white flex flex-col selection:bg-[#E10600] selection:text-white">
      {/* Universal 72% opacity Malaysian flag wallpaper system */}
      <div className="public-page-wallpaper" aria-hidden="true" />
      <div className="public-page-vignette" aria-hidden="true" />
      <div className="public-page-ambient-smoke" aria-hidden="true" />

      {/* Shared Site Header */}
      <SiteHeader currentPage="moments" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {/* Tier 1: Page Hero Branding Header */}
        <MomentsHeroHeader />

        {/* Tier 2: Interactive Spotlight Carousel & Community Moments Experience */}
        <MomentsExperience />
      </main>
    </div>
  );
}
