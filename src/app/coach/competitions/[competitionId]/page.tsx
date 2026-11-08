"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { CompetitionDetailView } from "@/components/coach/competitions/competition-detail-view";
import { CoachCard } from "@/components/coach/ui/coach-card";

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const resolvedParams = use(params);
  const competitionId = resolvedParams.competitionId;
  const { competitions } = useCoachState();

  const competition = competitions.find((c) => c.id === competitionId);

  if (!competition) {
    return (
      <div className="space-y-6">
        <Link
          href="/coach/competitions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Kalendar Pertandingan</span>
        </Link>

        <CoachCard className="p-12 text-center">
          <AlertCircle size={32} className="mx-auto text-[#f59e0b]" />
          <h2 className="mt-4 text-base font-bold text-white">
            Pertandingan tidak dijumpai
          </h2>
          <p className="mt-1 text-xs text-[#96989f]">
            ID kejohanan &apos;{competitionId}&apos; tidak wujud dalam kalendar pertandingan semasa.
          </p>
        </CoachCard>
      </div>
    );
  }

  return <CompetitionDetailView competition={competition} />;
}
