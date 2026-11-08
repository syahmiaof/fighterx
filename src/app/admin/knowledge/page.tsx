import type { Metadata } from "next";
import { KnowledgeHubCMS } from "@/components/admin/content/knowledge-hub-cms";
import { BookOpen, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Knowledge Hub CMS — FighterX Admin",
  description:
    "Pusat pengurusan kurikulum, peraturan rasmi PESAKA/PERSILAT 2027, protokol sains sukan ISN, dan bahan rujukan atlet silat.",
};

export default function AdminKnowledgePage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#990000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Knowledge Hub CMS
            </h1>
          </div>
          <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
            Pusat penerbitan artikel kurikulum, peraturan rasmi sukan silat (PESAKA/PERSILAT), sains sukan & pemakanan (ISN), dan garis panduan teknikal atlet.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191E] border border-[#27272A] text-xs text-[#96989F]">
            <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
            <span>Pematuhan Kurikulum 2027 Disahkan</span>
          </div>
        </div>
      </div>

      {/* Main CMS Component */}
      <KnowledgeHubCMS />
    </div>
  );
}
