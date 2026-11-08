"use client";

import React from "react";
import Link from "next/link";
import { ClubDirectoryTable } from "@/components/admin/clubs/club-directory-table";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { useAdminState } from "@/lib/admin/store";
import { Shield, FileCheck, ChevronRight } from "lucide-react";

export default function ClubsDirectoryPage() {
  const { applications } = useAdminState();
  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#96989F]">
            <Link href="/admin" className="hover:text-white transition-colors">
              Papan Pemuka
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E5E5E7] font-medium">Pengurusan Kelab</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E5E5E7] font-medium">Direktori Organisasi</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#E10600]/15 text-[#FF3845] border border-[#FF3845]/30">
              <Shield className="w-6 h-6" />
            </span>
            <span>Direktori Kelab & Organisasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] max-w-2xl leading-relaxed">
            Senarai lengkap kelab, akademi, dan persatuan silat berdaftar di bawah platform FighterX.
            Pantau taburan pesilat, enrolmen disiplin (Silat Seni & Silat Olahraga), dan status langganan SaaS.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/admin/clubs/applications">
            <AdminButton
              variant="primary"
              size="sm"
              leftIcon={<FileCheck className="w-4 h-4" />}
            >
              Permohonan Baharu {pendingCount > 0 ? `(${pendingCount})` : ""}
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Main Directory Table */}
      <ClubDirectoryTable />
    </div>
  );
}
