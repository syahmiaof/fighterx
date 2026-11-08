"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Check, Eye, Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { CoachButton } from "../ui/coach-button";
import { CoachBadge } from "../ui/coach-badge";
import { useCoachActions } from "@/lib/coach/store";
import { ReviewActionModal } from "./review-action-modal";
import type { TrainingSubmission } from "@/lib/coach/types";

interface VerificationQueueTableProps {
  submissions: TrainingSubmission[];
}

export function VerificationQueueTable({ submissions }: VerificationQueueTableProps) {
  const { reviewSubmission } = useCoachActions();
  const [selectedSub, setSelectedSub] = useState<TrainingSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleQuickVerify = (sub: TrainingSubmission) => {
    setProcessingId(sub.id);
    reviewSubmission(
      sub.id,
      "VERIFIED",
      `Disahkan oleh jurulatih. Pergerakan dan teknik ${sub.exerciseName} memenuhi piawaian.`
    );
    setTimeout(() => {
      setProcessingId(null);
    }, 350);
  };

  const handleOpenReview = (sub: TrainingSubmission) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: TrainingSubmission["status"]) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#4ade80]">
            <CheckCircle2 size={11} />
            Disahkan
          </span>
        );
      case "CORRECTION":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#fbbf24]">
            <AlertTriangle size={11} />
            Pembetulan
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e10600]/15 border border-[#e10600]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#ff555a]">
            <XCircle size={11} />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
            <Clock size={11} className="text-[#ff3845]" />
            Menunggu
          </span>
        );
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-[#45464b]/60 bg-[#17191e]/80 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e]/15 text-[#4ade80]">
          <CheckCircle2 size={28} />
        </div>
        <h4 className="mt-4 text-base font-bold text-white">
          Semua penghantaran telah disahkan
        </h4>
        <p className="mt-1 text-xs text-[#96989f] max-w-sm mx-auto">
          Tiada rekod penghantaran latihan yang sepadan dengan penapis yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-[#45464b]/60 bg-[#17191e]/85 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#45464b]/60 bg-[#121316] text-[11px] font-bold uppercase tracking-wider text-[#96989f]">
              <th className="py-3 px-4">Atlet</th>
              <th className="py-3 px-4">Latihan / Kategori</th>
              <th className="py-3 px-4">Tarikh Hantar</th>
              <th className="py-3 px-4">Bukti Video</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-xs">
            {submissions.map((sub) => {
              const isProcessing = processingId === sub.id;

              return (
                <tr
                  key={sub.id}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  {/* Athlete Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-[#45464b] bg-[#202126]">
                        <Image
                          src={sub.athleteAvatar || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                          alt={sub.athleteName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/coach/athletes/${sub.athleteId}`}
                          className="font-bold text-white hover:text-[#ff555a] transition-colors"
                        >
                          {sub.athleteName}
                        </Link>
                        <div className="text-[10px] text-[#96989f]">
                          {sub.discipline}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Drill & Category */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">
                      {sub.exerciseName}
                    </div>
                    <div className="mt-0.5">
                      <CoachBadge variant="gray" size="sm">
                        {sub.category}
                      </CoachBadge>
                    </div>
                  </td>

                  {/* Submitted Date */}
                  <td className="py-3 px-4 text-[#c5c6ca] whitespace-nowrap">
                    {sub.submittedAt}
                  </td>

                  {/* Video Thumbnail */}
                  <td className="py-3 px-4">
                    <Link
                      href={`/coach/verification/${sub.id}`}
                      className="group/thumb relative inline-flex items-center justify-center h-10 w-16 overflow-hidden rounded-md border border-[#45464b] bg-black/60"
                    >
                      <Image
                        src={sub.videoThumbnailUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                        alt={sub.exerciseName}
                        fill
                        className="object-cover opacity-70 group-hover/thumb:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/thumb:bg-black/10">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e10600] text-white shadow">
                          <Play size={9} className="ml-0.5" />
                        </div>
                      </div>
                      {sub.videoDuration && (
                        <span className="absolute bottom-0.5 right-1 text-[8px] font-bold text-white bg-black/80 px-1 rounded">
                          {sub.videoDuration}
                        </span>
                      )}
                    </Link>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(sub.status)}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {sub.status === "PENDING" && (
                        <CoachButton
                          variant="success"
                          size="sm"
                          icon={<Check size={12} />}
                          disabled={isProcessing}
                          onClick={() => handleQuickVerify(sub)}
                          className="font-bold"
                        >
                          {isProcessing ? "..." : "Sahkan"}
                        </CoachButton>
                      )}

                      <CoachButton
                        variant="outline"
                        size="sm"
                        icon={<Eye size={12} />}
                        onClick={() => handleOpenReview(sub)}
                      >
                        Semak
                      </CoachButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Interactive Review Modal */}
      <ReviewActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSub}
      />
    </>
  );
}
