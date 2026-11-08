"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { SubmissionDetailView } from "@/components/coach/verification/submission-detail-view";

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const resolvedParams = use(params);
  const submissionId = resolvedParams.submissionId;
  const { submissions } = useCoachState();

  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) {
    return (
      <div className="space-y-6">
        <Link
          href="/coach/verification"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Senarai Verifikasi</span>
        </Link>

        <div className="rounded-xl border border-[#45464b]/60 bg-[#17191e] p-12 text-center">
          <AlertCircle size={32} className="mx-auto text-[#f59e0b]" />
          <h2 className="mt-4 text-base font-bold text-white">
            Penyerahan latihan tidak dijumpai
          </h2>
          <p className="mt-1 text-xs text-[#96989f]">
            ID penyerahan &apos;{submissionId}&apos; tidak wujud dalam pangkalan data.
          </p>
        </div>
      </div>
    );
  }

  return <SubmissionDetailView submission={submission} />;
}
