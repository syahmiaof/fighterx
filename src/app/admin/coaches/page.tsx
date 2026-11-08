import type { Metadata } from "next";
import { CoachDirectoryTable } from "@/components/admin/people/coach-directory-table";
import { Award, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Direktori & Rekod Jurulatih — FighterX Admin",
  description:
    "Pengurusan jurulatih berlesen kebangsaan, penugasan skuad atlet, dan tadbir urus kejurulatihan silat FighterX tanpa peranan CLUB_ADMIN.",
};

export default function AdminCoachesPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#38BDF8] to-[#0284C7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(56,189,248,0.35)]">
              <Award className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Pengurusan & Direktori Jurulatih
            </h1>
          </div>
          <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
            Pendaftaran jurulatih bertauliah (SPKK Tahap 1-3, PESAKA, Wasit Juri) dan kawalan saiz skuad bimbingan. Integriti peranan: peranan rasmi adalah ADMIN, COACH, ATHLETE tanpa peranan CLUB_ADMIN.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191E] border border-[#27272A] text-xs text-[#96989F]">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>Tadbir Urus Bersijil PESAKA</span>
          </div>
        </div>
      </div>

      {/* Coach Directory Table */}
      <CoachDirectoryTable />
    </div>
  );
}
