import type { Metadata } from "next";
import { GamificationManager } from "@/components/admin/content/gamification-manager";
import { Trophy, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Kawalan Gamifikasi & Papan Pendahulu — FighterX Admin",
  description:
    "Konfigurasi lencana pencapaian, pengurusan mata pengalaman (XP), dan tadbir urus integriti Papan Pendahulu Mingguan Top 10 atlet silat.",
};

export default function AdminGamificationPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#990000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
              <Trophy className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Gamifikasi & Papan Pendahulu
            </h1>
          </div>
          <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
            Pengurusan lencana pencapaian, kriteria perolehan XP, dan pemantauan keadilan Papan Pendahulu Mingguan Top 10 dengan pengasingan disiplin Silat Seni dan Silat Olahraga.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191E] border border-[#27272A] text-xs text-[#96989F]">
            <Shield className="w-4 h-4 text-[#FF3845]" />
            <span>Audit Anti-Cheat & Privasi Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Content Component */}
      <GamificationManager />
    </div>
  );
}
