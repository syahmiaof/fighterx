"use client";

import React, { useState } from "react";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ResetDemoModal } from "./reset-demo-modal";
import {
  User,
  Shield,
  Clock,
  Bell,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Save,
  Check,
} from "lucide-react";

export function AdminSettingsForm() {
  const { adminProfile } = useAdminState();
  const { resetDemoState } = useAdminActions();

  // Form State
  const [name, setName] = useState(adminProfile.name);
  const [email, setEmail] = useState(adminProfile.email);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(
    adminProfile.sessionTimeoutMinutes || 60
  );
  const [maintenanceMode, setMaintenanceMode] = useState(
    adminProfile.maintenanceMode || false
  );

  // Notification Preferences State
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifySubscriptions, setNotifySubscriptions] = useState(true);
  const [notifyDisciplineViolations, setNotifyDisciplineViolations] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

  // Modals & Toast
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profil pentadbir dan tetapan sistem berjaya disimpan.");
  };

  const handleConfirmReset = () => {
    resetDemoState();
    showToast("Data demonstrasi berjaya dipulihkan kepada nilai asal.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/40 rounded-xl text-xs text-[#4ADE80] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#96989F] hover:text-white text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Grid: Profile & Session Timeout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Profile Details */}
        <AdminCard glow="subtle" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#E10600]/20 border border-[#FF3845]/40 flex items-center justify-center text-[#FF555A]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Profil Pentadbir Sistem
                </h4>
                <p className="text-xs text-[#96989F]">
                  Maklumat akaun pentadbir dan tahap kebenaran capaian.
                </p>
              </div>
            </div>

            <AdminBadge variant="accent" size="sm">
              SUPER_ADMIN
            </AdminBadge>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
                Nama Penuh Pentadbir
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
                E-mel Rasmi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
                Kebenaran Sistem (Permissions)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {adminProfile.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#17191E] border border-[#27272A] text-[#38BDF8]"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#96989F] flex items-center justify-between">
              <span>Log masuk terakhir:</span>
              <span className="font-mono text-white">
                {new Date(adminProfile.lastLoginAt).toLocaleDateString("ms-MY", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <AdminButton
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Simpan Profil
              </AdminButton>
            </div>
          </form>
        </AdminCard>

        {/* Security Policies & Session Timeout */}
        <AdminCard glow="subtle" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Dasar Sesi & Mod Penyelenggaraan
                </h4>
                <p className="text-xs text-[#96989F]">
                  Kawalan keselamatan sesi portal dan akses pengguna.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Session Timeout */}
            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
                Had Masa Sesi Tidak Aktif (Session Timeout)
              </label>
              <select
                value={sessionTimeoutMinutes}
                onChange={(e) =>
                  setSessionTimeoutMinutes(Number(e.target.value))
                }
                className="w-full px-3.5 py-2.5 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
              >
                <option value={15}>15 Minit (Keselamatan Tinggi)</option>
                <option value={30}>30 Minit (Standard)</option>
                <option value={60}>60 Minit (Lalai Pentadbir)</option>
                <option value={120}>2 Jam</option>
                <option value={240}>4 Jam</option>
              </select>
              <p className="text-[11px] text-[#96989F] mt-1">
                Sesi log masuk akan ditamatkan secara automatik jika tiada aktiviti pengguna.
              </p>
            </div>

            {/* Maintenance Mode */}
            <div className="p-4 bg-[#202126] border border-[#27272A] rounded-xl flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Mod Penyelenggaraan Sistem (Maintenance Mode)
                </span>
                <p className="text-xs text-[#96989F] mt-1 leading-relaxed">
                  Apabila diaktifkan, portal jurulatih dan atlet akan memaparkan notis penyelenggaraan berjadual. Hanya Pentadbir Sistem boleh log masuk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  showToast(
                    !maintenanceMode
                      ? "Mod penyelenggaraan platform telah DIAKTIFKAN."
                      : "Mod penyelenggaraan platform telah DINYAHAKTIFKAN."
                  );
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  maintenanceMode
                    ? "bg-[#EF4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                    : "bg-[#27272A] text-[#96989F] hover:text-white"
                }`}
              >
                {maintenanceMode ? "Aktif (Tutup Akses)" : "Tidak Aktif"}
              </button>
            </div>

            {/* Audit Log Retention */}
            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
                Tempoh Penyimpanan Jurnal Audit (Audit Log Retention)
              </label>
              <div className="p-3 bg-[#121316] border border-[#27272A] rounded-lg text-xs text-[#C5C6CA] flex items-center justify-between">
                <span>Penyimpanan rekod kelulusan & keputusan pertandingan:</span>
                <span className="font-mono font-bold text-white">365 Hari (1 Tahun)</span>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Notification Preferences */}
      <AdminCard glow="subtle" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#FBBF24]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Keutamaan Pemberitahuan & Amaran (Notification Preferences)
              </h4>
              <p className="text-xs text-[#96989F]">
                Konfigurasi makluman e-mel dan sistem bagi aktiviti pentadbiran utama.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-start gap-3 p-3 bg-[#202126] border border-[#27272A] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={notifyApplications}
              onChange={(e) => setNotifyApplications(e.target.checked)}
              className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D] mt-0.5"
            />
            <div>
              <span className="text-xs font-bold text-white">
                Permohonan Kelab Baharu (New Club Applications)
              </span>
              <p className="text-[11px] text-[#96989F] mt-0.5">
                Terima e-mel amaran segera apabila kelab menghantar pendaftaran baharu.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-[#202126] border border-[#27272A] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={notifySubscriptions}
              onChange={(e) => setNotifySubscriptions(e.target.checked)}
              className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D] mt-0.5"
            />
            <div>
              <span className="text-xs font-bold text-white">
                Amaran Tempoh Percubaan & Tunggakan SaaS
              </span>
              <p className="text-[11px] text-[#96989F] mt-0.5">
                Makluman apabila kelab hampir tamat percubaan 30 hari atau lewat bayar yuran RM20/bulan.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-[#202126] border border-[#27272A] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={notifyDisciplineViolations}
              onChange={(e) => setNotifyDisciplineViolations(e.target.checked)}
              className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D] mt-0.5"
            />
            <div>
              <span className="text-xs font-bold text-white">
                Percubaan Pendaftaran Disiplin Berganda
              </span>
              <p className="text-[11px] text-[#96989F] mt-0.5">
                Amaran automatik jika ada percubaan mendaftarkan atlet dalam Seni dan Olahraga serentak.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-[#202126] border border-[#27272A] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={notifyWeeklyDigest}
              onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
              className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D] mt-0.5"
            />
            <div>
              <span className="text-xs font-bold text-white">
                Ringkasan Mingguan Prestasi Latihan (Weekly Digest)
              </span>
              <p className="text-[11px] text-[#96989F] mt-0.5">
                Laporan PDF ringkas tentang kadar kehadiran dan pengesahan latihan setiap hari Isnin.
              </p>
            </div>
          </label>
        </div>
      </AdminCard>

      {/* Platform Security Guardrails Status Card */}
      <AdminCard glow="subtle" className="border-l-4 border-[#4ADE80] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#4ADE80]" />
            Status Pematuhan Dasar Keselamatan & Seni Bina (Architectural Invariants)
          </h4>
          <span className="text-[11px] font-mono text-[#4ADE80]">AKTIF & DIPATUHI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#121316] rounded-lg space-y-1">
            <span className="text-[#96989F]">Penguatkuasaan Disiplin</span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
              Satu Disiplin Sahaja (Seni XOR Olahraga)
            </p>
          </div>

          <div className="p-3 bg-[#121316] rounded-lg space-y-1">
            <span className="text-[#96989F]">Sempadan Peranan (RBAC)</span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
              Tiada CLUB_ADMIN (ADMIN/COACH/ATHLETE)
            </p>
          </div>

          <div className="p-3 bg-[#121316] rounded-lg space-y-1">
            <span className="text-[#96989F]">Pelepasan Perubatan</span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
              Tandatangan Manusia Wajib (Tiada Pelepasan AI)
            </p>
          </div>

          <div className="p-3 bg-[#121316] rounded-lg space-y-1">
            <span className="text-[#96989F]">Kunci Rahsia AI</span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
              Zero-Exposure di Pelayar Klien
            </p>
          </div>
        </div>
      </AdminCard>

      {/* Danger Zone: Demo State Reset */}
      <AdminCard glow="none" className="border border-[#EF4444]/40 bg-[#1A1214] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EF4444]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#F87171]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Zon Bahaya: Tetap Semula Data Demonstrasi
              </h4>
              <p className="text-xs text-[#96989F]">
                Utiliti pengujian untuk memulihkan seluruh pangkalan data tempatan portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[#E5E5E7] leading-relaxed max-w-xl">
            Jika anda telah membuat pelbagai perubahan ujian (seperti meluluskan permohonan, menambah latihan, mengedit artikel kurikulum, atau menala Lekir Bot) dan ingin memulakan semula dengan data benih demonstrasi standard FighterX V1:
          </p>

          <AdminButton
            type="button"
            variant="danger"
            size="md"
            onClick={() => setIsResetModalOpen(true)}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Tetap Semula Data Demo
          </AdminButton>
        </div>
      </AdminCard>

      {/* Reset Demo Modal */}
      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
