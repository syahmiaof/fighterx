"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ArrowRight,
  Play,
  Check,
  CheckCircle2,
} from "lucide-react";
import { useCoachState, useCoachActions } from "@/lib/coach/store";
import { CoachCard } from "../ui/coach-card";
import { CoachButton } from "../ui/coach-button";
import { CoachBadge } from "../ui/coach-badge";
import type { TrainingSubmission } from "@/lib/coach/types";

export function CoachPendingPreview() {
  const { submissions } = useCoachState();
  const { reviewSubmission } = useCoachActions();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const pendingSubmissions = submissions.filter((s) => s.status === "PENDING");
  const displayItems = pendingSubmissions.slice(0, 4);

  const handleQuickVerify = (submission: TrainingSubmission) => {
    setVerifyingId(submission.id);
    reviewSubmission(
      submission.id,
      "VERIFIED",
      `Disahkan oleh Cikgu Farid. Form & kestabilan teknik ${submission.exerciseName} memenuhi standard.`
    );
    setTimeout(() => {
      setVerifyingId(null);
    }, 400);
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "Push-up":
        return "red";
      case "Larian 6 Minit":
        return "yellow";
      case "Plank":
        return "blue";
      case "Knee to Wall":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <CoachCard className="p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e10600]/20 text-[#ff555a]">
            <Clock size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Menunggu Verifikasi
              <span className="rounded-full bg-[#e10600] px-2 py-0.5 text-[11px] font-bold text-white">
                {pendingSubmissions.length}
              </span>
            </h3>
            <p className="text-[11px] text-[#96989f]">
              Rakaman latihan atlet memerlukan semakan jurulatih
            </p>
          </div>
        </div>

        <Link
          href="/coach/verification"
          className="group inline-flex items-center gap-1 text-xs font-semibold text-[#ff555a] hover:text-white transition-colors"
        >
          <span>Lihat Semua</span>
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Content list or Empty state */}
      <div className="mt-4 divide-y divide-white/[0.06]">
        {displayItems.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e]/15 text-[#4ade80]">
              <CheckCircle2 size={24} />
            </div>
            <p className="mt-3 text-sm font-bold text-white">
              Semua penghantaran telah disahkan
            </p>
            <p className="mt-1 text-xs text-[#96989f]">
              Tiada latihan baharu yang menunggu semakan pada masa ini.
            </p>
          </div>
        ) : (
          displayItems.map((sub) => {
            const isProcessing = verifyingId === sub.id;

            return (
              <div
                key={sub.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors"
              >
                {/* Left: Athlete Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[#45464b] bg-[#202126]">
                    <Image
                      src={sub.athleteAvatar || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                      alt={sub.athleteName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs font-bold text-white group-hover:text-[#ff555a] transition-colors">
                        {sub.athleteName}
                      </span>
                      <span className="text-[10px] text-[#96989f] hidden xs:inline">
                        • {sub.discipline}
                      </span>
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <CoachBadge
                        variant={getCategoryBadgeVariant(sub.category)}
                        size="sm"
                      >
                        {sub.exerciseName}
                      </CoachBadge>
                      <span className="text-[11px] text-[#96989f]">
                        {sub.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Video Thumbnail Preview & Action Buttons */}
                <div className="flex items-center gap-2.5 justify-end flex-shrink-0">
                  {/* Thumbnail with play icon */}
                  <Link
                    href={`/coach/verification/${sub.id}`}
                    className="relative h-11 w-16 flex-shrink-0 overflow-hidden rounded-md border border-[#45464b] bg-black/60 group/thumb"
                  >
                    <Image
                      src={sub.videoThumbnailUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                      alt={sub.exerciseName}
                      fill
                      className="object-cover opacity-75 group-hover/thumb:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover/thumb:bg-black/20 transition-colors">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e10600] text-white shadow">
                        <Play size={10} className="ml-0.5" />
                      </div>
                    </div>
                  </Link>

                  {/* Sahkan button */}
                  <CoachButton
                    variant="success"
                    size="sm"
                    icon={<Check size={13} />}
                    onClick={() => handleQuickVerify(sub)}
                    disabled={isProcessing}
                    className="font-bold whitespace-nowrap"
                  >
                    {isProcessing ? "Menyahkan..." : "Sahkan"}
                  </CoachButton>

                  {/* Semak button */}
                  <Link href={`/coach/verification/${sub.id}`}>
                    <CoachButton variant="outline" size="sm" className="whitespace-nowrap">
                      Semak
                    </CoachButton>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </CoachCard>
  );
}
