"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  X,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import { AdminBadge } from "@/components/admin/ui/admin-badge";

export function ActionRequiredCard() {
  const { applications } = useAdminState();
  const { reviewApplication } = useAdminActions();

  const [notification, setNotification] = useState<string | null>(null);

  // Filter pending applications
  const pendingApps = applications.filter((app) => app.status === "PENDING");
  // Show up to 4 latest items
  const displayedApps = pendingApps.slice(0, 4);

  const handleApprove = (appId: string, clubName: string) => {
    const result = reviewApplication(appId, "APPROVED", [
      "Diluluskan melalui tindakan pantas Dashboard Pusat",
    ]);
    if (result.success) {
      setNotification(`✓ Kelab "${clubName}" berjaya diluluskan! Akaun diaktifkan & tempoh percubaan 30 hari bermula.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleReject = (appId: string, clubName: string) => {
    const result = reviewApplication(
      appId,
      "REJECTED",
      ["Ditolak melalui semakan pantas pentadbir"],
      "Dokumen pendaftaran tidak lengkap atau tidak memenuhi kriteria kelayakan."
    );
    if (result.success) {
      setNotification(`✗ Permohonan "${clubName}" telah ditolak.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#F59E0B]/20 text-[#FBBF24]">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Tindakan Diperlukan // Permohonan Kelab (Terkini)
              {pendingApps.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#E10600] text-white">
                  {pendingApps.length}
                </span>
              )}
            </h3>
            <p className="text-xs text-[#96989F]">
              Semakan dan kelulusan serta-merta permohonan keahlian organisasi
            </p>
          </div>
        </div>

        <Link
          href="/admin/clubs/applications"
          className="text-xs font-bold text-[#FF555A] hover:text-[#FF3845] flex items-center gap-1 transition-colors group"
        >
          Lihat Semua
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Temporary Toast Notification */}
      {notification && (
        <div className="mb-3 p-3 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#4ADE80] text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[#4ADE80] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* List of Applications */}
      <div className="space-y-2.5 flex-1">
        {displayedApps.length > 0 ? (
          displayedApps.map((app) => (
            <div
              key={app.id}
              className="p-3 sm:p-3.5 rounded-xl bg-[#202126] border border-[#27272A] hover:border-[#37383D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              {/* Club / PIC Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#17191E] border border-[#37383D] flex items-center justify-center text-[#FF3845] font-bold text-sm flex-shrink-0 shadow-sm">
                  {app.clubName.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {app.clubName}
                  </div>
                  <div className="text-xs text-[#96989F] flex items-center gap-2 mt-0.5">
                    <span>{app.picFullName} ({app.picPosition})</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#96989F]" />
                      {new Date(app.submittedAt).toLocaleDateString("ms-MY", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Inline Quick Decision Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <AdminBadge variant="warning" size="sm" dot pulseDot>
                  Perlu Kelulusan
                </AdminBadge>

                <button
                  type="button"
                  onClick={() => handleApprove(app.id, app.clubName)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#4ADE80] border border-[#22C55E]/40 text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                  title="Luluskan permohonan dan aktifkan percubaan 30 hari"
                >
                  <Check className="w-3.5 h-3.5" />
                  Lulus
                </button>

                <button
                  type="button"
                  onClick={() => handleReject(app.id, app.clubName)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#F87171] border border-[#EF4444]/40 text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
                  title="Tolak permohonan ini"
                >
                  <X className="w-3.5 h-3.5" />
                  Tolak
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center rounded-xl bg-[#202126]/40 border border-[#27272A] border-dashed">
            <CheckCircle2 className="w-8 h-8 text-[#4ADE80] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">
              Semua Permohonan Selesai
            </h4>
            <p className="text-xs text-[#96989F] max-w-xs mx-auto mt-1">
              Tiada permohonan baharu yang menunggu kelulusan pada masa ini.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#96989F]">
        <span>Kelulusan akan memulakan percubaan percuma 30 hari secara automatik.</span>
        <span className="font-mono text-white">Yuran: RM20/Bulan</span>
      </div>
    </div>
  );
}
