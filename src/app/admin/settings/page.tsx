import type { Metadata } from "next";
import { AdminSettingsForm } from "@/components/admin/content/admin-settings-form";
import { Settings, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Tetapan Sistem & Profil Pentadbir — FighterX Admin",
  description:
    "Konfigurasi platform FighterX, profil pentadbir, had masa sesi, keutamaan amaran, dan utiliti penetapan semula data demonstrasi.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#990000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Tetapan Sistem & Pentadbir
            </h1>
          </div>
          <p className="text-xs text-[#96989F] mt-1.5 leading-relaxed">
            Pengurusan profil pentadbir, keselamatan sesi log masuk, mod penyelenggaraan, keutamaan pemberitahuan amaran, dan utiliti penetapan semula data demo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17191E] border border-[#27272A] text-xs text-[#4ADE80]">
            <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
            <span>Sistem Beroperasi Penuh</span>
          </div>
        </div>
      </div>

      {/* Main Settings Component */}
      <AdminSettingsForm />
    </div>
  );
}
