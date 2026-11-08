import type { Metadata } from "next";
import { AnnouncementsFeed } from "@/components/admin/content/announcements-feed";
import { Megaphone, Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Pusat Pengumuman & Siaran — FighterX Admin",
  description:
    "Urus siaran rasmi, notis segera kejohanan, makluman yuran langganan kelab, dan arahan latihan terus kepada jurulatih dan atlet silat.",
};

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#990000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Pengumuman & Siaran Platform
            </h1>
          </div>
          <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
            Pengurusan siaran mesej rasmi, penetapan keutamaan (Low, Normal, Urgent), penyasaran audiens (Kelab, Jurulatih, Atlet), dan ciri sematan di atas (Pin to Top).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191E] border border-[#27272A] text-xs text-[#FBBF24]">
            <Radio className="w-4 h-4 text-[#FBBF24]" />
            <span>Siaran Langsung Seluruh Malaysia</span>
          </div>
        </div>
      </div>

      {/* Main Component */}
      <AnnouncementsFeed />
    </div>
  );
}
