import type { Metadata } from "next";
import { CoachProvider } from "@/lib/coach/store";
import { CoachHeader } from "@/components/coach/layout/coach-header";
import { CoachSidebar } from "@/components/coach/layout/coach-sidebar";
import { CoachMobileBottomNav } from "@/components/coach/layout/coach-mobile-bottom-nav";
import "./coach.css";

export const metadata: Metadata = {
  title: "FighterX Coach Portal — Pengurusan & Prestasi Atlet Silat",
  description:
    "Portal Jurulatih FighterX untuk pemantauan perkembangan atlet, verifikasi latihan video, penilaian fizikal dan pengurusan kejohanan Silat.",
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CoachProvider>
      <div className="coach-root-layout">
        {/* Layered Wallpaper & Atmospheric Overlays */}
        <div className="coach-backdrop" aria-hidden="true" />
        <div className="coach-smoke-overlay" aria-hidden="true" />

        {/* Global Coach Header */}
        <CoachHeader />

        {/* Main Viewport Container */}
        <div className="coach-main-wrapper">
          <CoachSidebar />
          <main className="coach-content-panel">{children}</main>
        </div>

        {/* Mobile 4-Tab Bottom Navigation (<=760px) */}
        <CoachMobileBottomNav />
      </div>
    </CoachProvider>
  );
}
