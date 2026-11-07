"use client";

import React, { useState } from "react";
import { Check, AlertTriangle, XCircle, MessageSquare } from "lucide-react";
import { CoachModal } from "../ui/coach-modal";
import { CoachButton } from "../ui/coach-button";
import { CoachBadge } from "../ui/coach-badge";
import { useCoachActions } from "@/lib/coach/store";
import type { TrainingSubmission } from "@/lib/coach/types";

interface ReviewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: TrainingSubmission | null;
  onSuccess?: () => void;
}

interface ReviewModalFormProps {
  submission: TrainingSubmission;
  onClose: () => void;
  onSuccess?: () => void;
}

function ReviewModalForm({ submission, onClose, onSuccess }: ReviewModalFormProps) {
  const { reviewSubmission } = useCoachActions();
  const [feedback, setFeedback] = useState(submission.coachFeedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetRemarks = [
    "Teknik kemas, kedalaman push-up penuh dan siku rapat.",
    "Bagus, kestabilan teras dikekalkan sepanjang pergerakan.",
    "Sila muat naik rakaman larian penuh beserta data jam pintar.",
    "Punggung terlalu tinggi, tidak memenuhi piawaian plank standard.",
    "Kekalkan kuda-kuda rendah dan kawal pernafasan semasa serangan.",
  ];

  const handleAction = (status: "VERIFIED" | "CORRECTION" | "REJECTED") => {
    setIsSubmitting(true);

    const finalFeedback =
      feedback.trim() ||
      (status === "VERIFIED"
        ? "Latihan disahkan dan memenuhi standard jurulatih."
        : status === "CORRECTION"
        ? "Sila perbaiki form latihan dan muat naik semula rakaman."
        : "Penyerahan tidak memenuhi piawaian latihan.");

    reviewSubmission(submission.id, status, finalFeedback);
    setIsSubmitting(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-5">
      {/* Submission Context Summary */}
      <div className="flex items-start justify-between rounded-xl border border-[#45464b]/60 bg-[#121316] p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">
              {submission.athleteName}
            </span>
            <span className="text-xs text-[#96989f]">
              • {submission.discipline}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CoachBadge variant="red" size="sm">
              {submission.exerciseName}
            </CoachBadge>
            <span className="text-xs text-[#96989f]">
              Dihantar pada {submission.submittedAt}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
              submission.status === "VERIFIED"
                ? "bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/40"
                : submission.status === "CORRECTION"
                ? "bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/40"
                : submission.status === "REJECTED"
                ? "bg-[#e10600]/15 text-[#ff555a] border border-[#e10600]/40"
                : "bg-white/10 text-white border border-white/20"
            }`}
          >
            {submission.status}
          </span>
        </div>
      </div>

      {/* Athlete Notes */}
      {submission.notes && (
        <div className="rounded-lg bg-[#202126]/60 border border-[#45464b]/40 p-3 text-xs">
          <span className="font-semibold text-[#c5c6ca]">Catatan Atlet: </span>
          <span className="text-[#96989f] italic">
            &ldquo;{submission.notes}&rdquo;
          </span>
        </div>
      )}

      {/* Preset Feedback Chips */}
      <div>
        <label className="text-xs font-semibold text-[#c5c6ca] block mb-2">
          Pilihan Ulasan Pantas (Preset):
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presetRemarks.map((rem, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFeedback(rem)}
              className="text-[11px] rounded-md border border-[#45464b] bg-[#202126] px-2.5 py-1 text-[#c5c6ca] hover:border-[#ff3845] hover:text-white transition-colors text-left"
            >
              {rem}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Textarea */}
      <div className="space-y-1.5">
        <label
          htmlFor="coachFeedback"
          className="text-xs font-semibold text-[#c5c6ca] flex items-center gap-1.5"
        >
          <MessageSquare size={13} className="text-[#ff555a]" />
          Catatan / Maklum Balas Jurulatih:
        </label>
        <textarea
          id="coachFeedback"
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tulis ulasan teknik, pembetulan posisi, atau galakan untuk atlet..."
          className="w-full rounded-lg border border-[#45464b] bg-[#121316] p-3 text-xs text-white placeholder-[#96989f] focus:border-[#ff3845] focus:outline-none focus:ring-1 focus:ring-[#ff3845]"
        />
      </div>

      {/* 3 Review Decision Buttons */}
      <div className="pt-2 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-end gap-2.5">
        {/* Reject */}
        <CoachButton
          type="button"
          variant="danger"
          size="md"
          icon={<XCircle size={15} />}
          disabled={isSubmitting}
          onClick={() => handleAction("REJECTED")}
          className="w-full sm:w-auto"
        >
          Tolak (Reject)
        </CoachButton>

        {/* Request Correction */}
        <CoachButton
          type="button"
          variant="outline"
          size="md"
          icon={<AlertTriangle size={15} className="text-[#f59e0b]" />}
          disabled={isSubmitting}
          onClick={() => handleAction("CORRECTION")}
          className="w-full sm:w-auto hover:border-[#f59e0b] hover:text-[#fbbf24]"
        >
          Minta Pembetulan
        </CoachButton>

        {/* Verify */}
        <CoachButton
          type="button"
          variant="success"
          size="md"
          icon={<Check size={15} />}
          disabled={isSubmitting}
          onClick={() => handleAction("VERIFIED")}
          className="w-full sm:w-auto font-bold"
        >
          Sahkan (Verify)
        </CoachButton>
      </div>
    </div>
  );
}

export function ReviewActionModal({
  isOpen,
  onClose,
  submission,
  onSuccess,
}: ReviewActionModalProps) {
  if (!submission) return null;

  return (
    <CoachModal
      isOpen={isOpen}
      onClose={onClose}
      title="Semakan & Verifikasi Latihan"
      maxWidth="lg"
    >
      <ReviewModalForm
        key={submission.id}
        submission={submission}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </CoachModal>
  );
}
