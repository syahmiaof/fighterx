"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { AthleteDetailView } from "@/components/coach/athletes/athlete-detail-view";

export default function AthleteProfilePage({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const resolvedParams = use(params);
  const athleteId = resolvedParams.athleteId;
  const { athletes } = useCoachState();

  const athlete = athletes.find((a) => a.id === athleteId);

  if (!athlete) {
    return (
      <div className="space-y-6">
        <Link
          href="/coach/athletes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Direktori Atlet</span>
        </Link>

        <div className="rounded-xl border border-[#45464b]/60 bg-[#17191e] p-12 text-center">
          <AlertCircle size={32} className="mx-auto text-[#f59e0b]" />
          <h2 className="mt-4 text-base font-bold text-white">
            Atlet tidak dijumpai
          </h2>
          <p className="mt-1 text-xs text-[#96989f]">
            ID atlet &apos;{athleteId}&apos; tidak wujud dalam pangkalan data skuad.
          </p>
        </div>
      </div>
    );
  }

  return <AthleteDetailView athlete={athlete} />;
}
