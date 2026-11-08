import type { Metadata } from "next";
import { AthleteDirectoryTable } from "@/components/admin/people/athlete-directory-table";
import { Users, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Direktori & Pengurusan Atlet — FighterX Admin",
  description:
    "Pantau atlet silat kebangsaan, penguatkuasaan disiplin tunggal (Silat Seni XOR Silat Olahraga), rekod kehadiran dan penugasan jurulatih.",
};

export default function AdminAthletesPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#990000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Pengurusan & Direktori Atlet
            </h1>
          </div>
          <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
            Pangkalan data 28 atlet berdaftar merentasi 8 kelab persilatan. Penguatkuasaan ketat satu disiplin sahaja (Silat Seni XOR Silat Olahraga) tanpa pendaftaran berganda.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191E] border border-[#27272A] text-xs text-[#96989F]">
            <Shield className="w-4 h-4 text-[#FF3845]" />
            <span>Pematuhan Kuota SUKMA 2027</span>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <AthleteDirectoryTable />
    </div>
  );
}
