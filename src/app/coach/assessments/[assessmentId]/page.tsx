"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { AssessmentDetailView } from "@/components/coach/assessments/assessment-detail-view";
import { AssessmentForm } from "@/components/coach/assessments/assessment-form";
import { CoachCard } from "@/components/coach/ui/coach-card";

export default function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const resolvedParams = use(params);
  const assessmentId = resolvedParams.assessmentId;
  const { assessments, athletes } = useCoachState();

  const assessment = assessments.find((a) => a.id === assessmentId);

  // If "new" is passed or assessment not found, check if it matches an athlete ID
  const matchedAthlete = athletes.find((a) => a.id === assessmentId);

  if (!assessment) {
    return (
      <div className="space-y-6">
        <Link
          href="/coach/assessments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Senarai Penilaian</span>
        </Link>

        <CoachCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-[#ff3845]/20 border border-[#ff3845]/40 flex items-center justify-center text-[#ff555a]">
              <PlusCircle size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {matchedAthlete
                  ? `Rekod Penilaian Baharu untuk ${matchedAthlete.name}`
                  : "Rekod Penilaian Baharu"}
              </h2>
              <p className="text-xs text-[#96989f]">
                {matchedAthlete
                  ? `Disiplin: ${matchedAthlete.discipline} • Kategori: ${matchedAthlete.category}`
                  : `ID '${assessmentId}' tidak dijumpai. Anda boleh mengisi penilaian baharu di bawah.`}
              </p>
            </div>
          </div>

          <AssessmentForm initialAthleteId={matchedAthlete?.id} />
        </CoachCard>
      </div>
    );
  }

  return <AssessmentDetailView assessment={assessment} />;
}
