"use client";

import React, { use } from "react";
import Link from "next/link";
import { useAdminState } from "@/lib/admin/store";
import { AthleteProfileView } from "@/components/admin/people/athlete-profile-view";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ArrowLeft, UserX } from "lucide-react";

export default function AthleteDetailPage({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const resolvedParams = use(params);
  const athleteId = resolvedParams.athleteId;
  const { athletes, isHydrated } = useAdminState();

  const athlete = athletes.find((a) => a.id === athleteId);

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF3845] border-t-transparent animate-spin" />
        <p className="text-xs text-[#96989F]">Memuatkan rekod profil atlet...</p>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="p-8 bg-[#17191E] border border-[#27272A] rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <div className="w-14 h-14 rounded-full bg-[#202126] border border-[#37383D] flex items-center justify-center mx-auto text-[#F87171]">
          <UserX className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Atlet Tidak Ditemui</h2>
          <p className="text-xs text-[#96989F]">
            Rekod atlet dengan ID <code className="text-[#FF555A]">{athleteId}</code> tidak wujud atau telah dialihkan.
          </p>
        </div>
        <Link href="/admin/athletes">
          <AdminButton
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali ke Direktori Atlet
          </AdminButton>
        </Link>
      </div>
    );
  }

  return <AthleteProfileView athlete={athlete} />;
}
