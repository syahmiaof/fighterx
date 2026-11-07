"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  RotateCcw,
  Check,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Activity,
  MessageSquare,
} from "lucide-react";
import { CoachCard } from "../ui/coach-card";
import { CoachButton } from "../ui/coach-button";
import { CoachBadge } from "../ui/coach-badge";
import { useCoachActions } from "@/lib/coach/store";
import type { TrainingSubmission } from "@/lib/coach/types";

interface SubmissionDetailViewProps {
  submission: TrainingSubmission;
}

export function SubmissionDetailView({ submission }: SubmissionDetailViewProps) {
  const { reviewSubmission } = useCoachActions();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(25);
  const totalDuration = 60; // in seconds
  const [feedback, setFeedback] = useState(submission.coachFeedback || "");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const presetRemarks = [
    "Teknik kemas, kedalaman push-up penuh dan siku rapat.",
    "Bagus, kestabilan teras dikekalkan sepanjang pergerakan.",
    "Sila muat naik rakaman larian penuh beserta data jam pintar.",
    "Punggung terlalu tinggi, tidak memenuhi piawaian plank standard.",
    "Kekalkan kuda-kuda rendah dan kawal pernafasan semasa serangan.",
  ];

  const handleReview = (status: "VERIFIED" | "CORRECTION" | "REJECTED") => {
    const defaultMsg =
      status === "VERIFIED"
        ? "Latihan disahkan dan memenuhi standard jurulatih."
        : status === "CORRECTION"
        ? "Sila perbaiki form latihan dan muat naik semula rakaman."
        : "Penyerahan tidak memenuhi piawaian latihan.";

    const finalFeedback = feedback.trim() || defaultMsg;
    reviewSubmission(submission.id, status, finalFeedback);

    const toastMessage =
      status === "VERIFIED"
        ? "Penghantaran berjaya disahkan!"
        : status === "CORRECTION"
        ? "Permintaan pembetulan dihantar kepada atlet."
        : "Penghantaran latihan ditolak.";

    setSuccessToast(toastMessage);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/coach/verification"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Senarai Verifikasi</span>
        </Link>

        {successToast && (
          <div className="rounded-lg bg-[#22c55e]/20 border border-[#22c55e] px-4 py-2 text-xs font-bold text-[#4ade80] animate-fadeIn">
            ✓ {successToast}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (lg:col-span-7): Video Player & Evidence */}
        <div className="lg:col-span-7 space-y-6">
          <CoachCard className="overflow-hidden p-0">
            {/* Simulated Video Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center group">
              <Image
                src={submission.videoThumbnailUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                alt={submission.exerciseName}
                fill
                className={`object-contain transition-opacity duration-300 ${
                  isPlaying ? "opacity-90" : "opacity-60"
                }`}
              />

              {/* Center Play/Pause Overlay */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-[#e10600]/90 text-white shadow-xl hover:scale-110 transition-transform focus:outline-none"
                aria-label={isPlaying ? "Jeda video" : "Main video"}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>

              {/* Watermark / Category Pill */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-md bg-black/75 px-2.5 py-1 text-[11px] font-bold text-white border border-white/20">
                  {submission.exerciseName}
                </span>
                <span className="rounded-md bg-[#e10600] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  HD 1080P
                </span>
              </div>

              {/* Player Bottom Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col gap-2">
                {/* Timeline Seek Bar */}
                <div
                  className="relative h-1.5 w-full bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    setCurrentTime(Math.round(pct * totalDuration));
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-[#e10600] rounded-full"
                    style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                  />
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-[#ff3845]"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTime(0)}
                      className="hover:text-[#ff3845]"
                      title="Ulang dari awal"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <span className="text-[11px] font-mono text-[#c5c6ca]">
                      {formatTime(currentTime)} / {formatTime(totalDuration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 size={16} className="text-[#96989f]" />
                    <Maximize2 size={16} className="hover:text-[#ff3845] cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics & Reported vs Prescribed */}
            <div className="p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#96989f] flex items-center gap-1.5">
                <Activity size={14} className="text-[#ff3845]" />
                Piawaian Tugasan vs Laporan Atlet
              </h4>

              {submission.metrics && submission.metrics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {submission.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3 text-xs"
                    >
                      <div className="font-semibold text-[#96989f]">{m.label}</div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-[#96989f]">Ditetapkan:</span>
                          <div className="font-medium text-[#c5c6ca]">{m.prescribed}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#4ade80]">Dicapai:</span>
                          <div className="font-bold text-white">{m.reported}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-[#45464b]/40 bg-[#121316] p-3 text-xs text-[#96989f]">
                  Latihan: 3 set mengikut tempo standard ISN.
                </div>
              )}

              {/* Athlete self notes */}
              {submission.notes && (
                <div className="rounded-lg border border-white/[0.08] bg-[#202126]/60 p-3.5">
                  <div className="text-xs font-bold text-white mb-1">
                    Catatan Atlet:
                  </div>
                  <p className="text-xs text-[#c5c6ca] italic">
                    &ldquo;{submission.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </CoachCard>
        </div>

        {/* Right Column (lg:col-span-5): Athlete Summary & Review Decisions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Athlete Mini Profile Card */}
          <CoachCard className="p-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-[#45464b]">
                <Image
                  src={submission.athleteAvatar || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                  alt={submission.athleteName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <Link
                  href={`/coach/athletes/${submission.athleteId}`}
                  className="text-base font-bold text-white hover:text-[#ff555a] transition-colors"
                >
                  {submission.athleteName}
                </Link>
                <div className="flex items-center gap-2 mt-0.5">
                  <CoachBadge variant="red" size="sm">
                    {submission.discipline}
                  </CoachBadge>
                  <span className="text-xs text-[#96989f]">• Aktif</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-[#121316] p-3 border border-[#45464b]/40">
                <span className="text-[10px] text-[#96989f] block">Tarikh Hantar</span>
                <span className="font-bold text-white">{submission.submittedAt}</span>
              </div>
              <div className="rounded-lg bg-[#121316] p-3 border border-[#45464b]/40">
                <span className="text-[10px] text-[#96989f] block">Status Semasa</span>
                <span
                  className={`font-bold ${
                    submission.status === "VERIFIED"
                      ? "text-[#4ade80]"
                      : submission.status === "CORRECTION"
                      ? "text-[#fbbf24]"
                      : submission.status === "REJECTED"
                      ? "text-[#ff555a]"
                      : "text-white"
                  }`}
                >
                  {submission.status}
                </span>
              </div>
            </div>
          </CoachCard>

          {/* Coach Decision Card */}
          <CoachCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-[#ff3845]" />
              Keputusan & Ulasan Jurulatih
            </h3>

            {/* Quick remarks */}
            <div>
              <span className="text-xs text-[#96989f] block mb-2 font-medium">
                Pilih Ulasan Segera:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetRemarks.map((rem, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFeedback(rem)}
                    className="text-[11px] rounded-md border border-[#45464b] bg-[#202126] px-2.5 py-1 text-[#c5c6ca] hover:border-[#ff3845] hover:text-white transition-colors text-left"
                  >
                    {rem}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label htmlFor="detailFeedback" className="text-xs text-[#c5c6ca] font-semibold block mb-1.5">
                Ulasan / Arahan Tambahan:
              </label>
              <textarea
                id="detailFeedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tulis ulasan pembetulan atau galakan teknikal..."
                className="w-full rounded-lg border border-[#45464b] bg-[#121316] p-3 text-xs text-white placeholder-[#96989f] focus:border-[#ff3845] focus:outline-none focus:ring-1 focus:ring-[#ff3845]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <CoachButton
                  variant="danger"
                  size="sm"
                  icon={<XCircle size={14} />}
                  onClick={() => handleReview("REJECTED")}
                  className="flex-1 sm:flex-initial"
                >
                  Tolak
                </CoachButton>

                <CoachButton
                  variant="outline"
                  size="sm"
                  icon={<AlertTriangle size={14} className="text-[#f59e0b]" />}
                  onClick={() => handleReview("CORRECTION")}
                  className="flex-1 sm:flex-initial hover:border-[#f59e0b] hover:text-[#fbbf24]"
                >
                  Minta Pembetulan
                </CoachButton>
              </div>

              <CoachButton
                variant="success"
                size="md"
                icon={<Check size={16} />}
                onClick={() => handleReview("VERIFIED")}
                className="w-full sm:w-auto font-bold"
              >
                Sahkan Latihan
              </CoachButton>
            </div>
          </CoachCard>
        </div>
      </div>
    </div>
  );
}
