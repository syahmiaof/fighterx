import type { Metadata } from "next";
import { PortalHeader } from "@/components/layout/portal-header";

export const metadata: Metadata = {
  title: "FighterX Athlete Portal — Log Latihan & Prestasi Kendiri",
  description:
    "Portal Atlet FighterX untuk pelaksanaan kerangka latihan kebangsaan, penyerahan bukti video/RPE kepada jurulatih kelab, dan pemantauan prestasi.",
};

export default function AthleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#E5E5E7] flex flex-col">
      {/* Universal Top Header with Laman Utama (/) and Tukar Peranan / Log Keluar (/login) */}
      <PortalHeader
        role="ATHLETE"
        userName="Alya Nabilah"
        clubName="Kelab Silat Harimau Berantai"
      />
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
