"use client";

import React from "react";
import Link from "next/link";
import { ApplicationsTable } from "@/components/admin/clubs/applications-table";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { FileCheck, Shield, ArrowRight, ChevronRight } from "lucide-react";

export default function ClubApplicationsPage() {
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
            <Link href="/admin/clubs" className="hover:text-white transition-colors">
              Pengurusan Kelab
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E5E5E7] font-medium">Permohonan</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#E10600]/15 text-[#FF3845] border border-[#FF3845]/30">
              <FileCheck className="w-6 h-6" />
            </span>
            <span>Pengurusan Permohonan Kelab</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] max-w-2xl leading-relaxed">
            Semak, sahkan, atau tolak permohonan pendaftaran kelab dan persatuan silat baharu.
            Kelulusan secara automatik memasukkan kelab ke direktori serta mengaktifkan percubaan percuma 30 hari.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/admin/clubs">
            <AdminButton
              variant="secondary"
              size="sm"
              leftIcon={<Shield className="w-4 h-4 text-[#FF3845]" />}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Direktori Kelab
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Main Interactive Table & Review Flow */}
      <ApplicationsTable />
    </div>
  );
}
