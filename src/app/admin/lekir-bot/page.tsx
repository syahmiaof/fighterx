import type { Metadata } from "next";
import { LekirBotSettings } from "@/components/admin/content/lekir-bot-settings";
import { Bot, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Konfigurasi Lekir Bot AI — FighterX Admin",
  description:
    "Tadbir urus pembantu kecerdasan buatan Lekir Bot, kawalan keselamatan sukan, had beban latihan, dan perlindungan kunci rahsia.",
};

export default function AdminLekirBotPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#990000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Konfigurasi Lekir Bot AI
            </h1>
          </div>
          <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
            Pusat kawalan pembantu pintar silat FighterX. Pengurusan arahan sistem, sekatan keselamatan perubatan, sumber kurikulum berdaftar, dan pematuhan privasi sifar pendedahan API key.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191E] border border-[#27272A] text-xs text-[#38BDF8]">
            <Lock className="w-4 h-4 text-[#38BDF8]" />
            <span>Kunci Rahsia Dilindungi Pelayan Sahaja</span>
          </div>
        </div>
      </div>

      {/* Main Settings Component */}
      <LekirBotSettings />
    </div>
  );
}
