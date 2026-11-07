"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Scale,
  Flame,
  Award,
  Plus,
  Play,
} from "lucide-react";
import { CoachCard } from "../ui/coach-card";
import { CoachButton } from "../ui/coach-button";
import { CoachBadge } from "../ui/coach-badge";
import { CoachTabs, type CoachTabItem } from "../ui/coach-tabs";
import { CoachModal } from "../ui/coach-modal";
import { useCoachState, useCoachActions } from "@/lib/coach/store";
import type { Athlete, AssessmentRating } from "@/lib/coach/types";

interface AthleteDetailViewProps {
  athlete: Athlete;
}

export function AthleteDetailView({ athlete }: AthleteDetailViewProps) {
  const { submissions, assessments } = useCoachState();
  const { registerAssessment } = useCoachActions();
  const [activeTab, setActiveTab] = useState<string>("weekly");

  // Assessment modal state
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [runDistance, setRunDistance] = useState(1450);
  const [pushupCount, setPushupCount] = useState(45);
  const [plankSec, setPlankSec] = useState(120);
  const [kneeLeft, setKneeLeft] = useState(11.0);
  const [kneeRight, setKneeRight] = useState(11.5);
  const [techScore, setTechScore] = useState(8.5);
  const [notes, setNotes] = useState("");

  // Submissions for this athlete
  const athleteSubmissions = submissions.filter(
    (s) => s.athleteId === athlete.id
  );

  // Assessments for this athlete
  const athleteAssessments = assessments.filter(
    (a) => a.athleteId === athlete.id
  );

  const tabs: CoachTabItem[] = [
    {
      id: "weekly",
      label: "Sejarah Mingguan",
      icon: <Calendar size={14} />,
    },
    {
      id: "submissions",
      label: "Log Penyerahan",
      count: athleteSubmissions.length,
      icon: <Dumbbell size={14} />,
    },
    {
      id: "assessments",
      label: "Rekod Penilaian & Baseline",
      count: athleteAssessments.length,
      icon: <Award size={14} />,
    },
  ];

  // 7-day schedule mockup for active week
  const days = [
    { day: "Isn", date: "8 Mac", completed: true, title: "Latihan Kardio & Teras" },
    { day: "Sel", date: "9 Mac", completed: true, title: "Teknik Kuda-Kuda & Tendangan" },
    { day: "Rab", date: "10 Mac", completed: true, title: "Ujian Push-up & Plank" },
    { day: "Kha", date: "11 Mac", completed: true, title: "Mobiliti & Fleksibiliti" },
    { day: "Jum", date: "12 Mac", completed: false, isRest: true, title: "Rehat Aktif" },
    { day: "Sab", date: "13 Mac", completed: false, title: "Sparring / Silibus Jurus" },
    { day: "Ahd", date: "14 Mac", completed: false, isRest: true, title: "Hari Pemulihan" },
  ];

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = Math.round(
      Math.min(100, Math.max(10, techScore * 6 + (pushupCount / 50) * 20 + (runDistance / 1600) * 20))
    );

    let rating: AssessmentRating = "BAIK";
    if (calculatedTotal >= 85) rating = "CEMERLANG";
    else if (calculatedTotal >= 70) rating = "BAIK";
    else if (calculatedTotal >= 50) rating = "MEMUASKAN";
    else rating = "PERLU_BIMBINGAN";

    registerAssessment({
      athleteId: athlete.id,
      athleteName: athlete.name,
      date: new Date().toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      type: "BASELINE_PHYSICAL",
      cycle: "Mid-Cycle Reassessment",
      metrics: {
        run6MinDistanceMeters: runDistance,
        pushupsCount1Min: pushupCount,
        plankDurationSeconds: plankSec,
        kneeToWallCmLeft: kneeLeft,
        kneeToWallCmRight: kneeRight,
        technicalScore: techScore,
      },
      totalScore: calculatedTotal,
      rating,
      notes: notes || "Penilaian berkala fizikal dan teknikal oleh jurulatih.",
    });

    setIsAssessmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/coach/athletes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Direktori Atlet</span>
        </Link>
      </div>

      {/* Hero Profile Banner */}
      <CoachCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Primary Details */}
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#e10600] bg-[#202126] shadow-[0_0_16px_rgba(225,6,0,0.3)]">
              <Image
                src={athlete.avatarUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                alt={athlete.name}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {athlete.name}
                </h1>
                <CoachBadge variant="red" size="sm">
                  {athlete.discipline}
                </CoachBadge>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#96989f]">
                <span>{athlete.category}</span>
                <span>•</span>
                <span>{athlete.weightClass}</span>
                {athlete.age && (
                  <>
                    <span>•</span>
                    <span>{athlete.age} Tahun</span>
                  </>
                )}
                <span>•</span>
                <span className="text-[#4ade80] font-semibold">{athlete.status}</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff3845] bg-[#e10600]/15 px-2.5 py-1 rounded-md border border-[#e10600]/30">
                  <Flame size={14} />
                  <span>{athlete.currentStreakWeeks} Minggu Streak</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c5c6ca] bg-[#202126] px-2.5 py-1 rounded-md border border-[#45464b]/40">
                  <Scale size={14} className="text-[#3b82f6]" />
                  <span>{athlete.currentWeightKg || 54} kg</span>
                  <span className="text-[10px] text-[#96989f]">
                    (Sasaran: {athlete.targetWeightKg || 54}kg)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Score Ring */}
          <div className="flex items-center gap-4 bg-[#121316] p-4 rounded-xl border border-[#45464b]/60 md:self-stretch justify-around min-w-[200px]">
            <div className="text-center">
              <span className="text-[10px] font-bold text-[#96989f] uppercase tracking-wider block">
                Skor Readiness
              </span>
              <span className="font-teko text-4xl font-bold text-white leading-none">
                {athlete.readinessScore || 85}%
              </span>
              <span className="text-[10px] text-[#4ade80] font-semibold block mt-0.5">
                Kondisi Optimum
              </span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-[#96989f] uppercase tracking-wider block">
                Kehadiran
              </span>
              <span className="font-teko text-4xl font-bold text-[#3b82f6] leading-none">
                {athlete.attendanceRate}%
              </span>
              <span className="text-[10px] text-[#c5c6ca] font-medium block mt-0.5">
                Latihan Lengkap
              </span>
            </div>
          </div>
        </div>
      </CoachCard>

      {/* 3 Tab Navigation */}
      <CoachTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Tab 1: Weekly History */}
      {activeTab === "weekly" && (
        <div className="space-y-6">
          <CoachCard className="p-5">
            <h3 className="text-sm font-bold text-white mb-1">
              Jadual & Kehadiran Mingguan (Minggu 6)
            </h3>
            <p className="text-xs text-[#96989f] mb-4">
              Prestasi pelaksanaan sesi latihan sepanjang minggu semasa
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {days.map((d, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 flex flex-col justify-between min-h-[100px] text-center ${
                    d.completed
                      ? "border-[#22c55e]/40 bg-[#22c55e]/10 text-white"
                      : d.isRest
                      ? "border-[#45464b]/40 bg-[#121316] text-[#96989f]"
                      : "border-white/10 bg-[#17191e] text-[#c5c6ca]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{d.day}</span>
                    <span className="text-[10px] text-[#96989f]">{d.date}</span>
                  </div>

                  <div className="my-2">
                    {d.completed ? (
                      <CheckCircle2 size={20} className="mx-auto text-[#4ade80]" />
                    ) : d.isRest ? (
                      <span className="text-[10px] font-semibold text-[#96989f]">
                        REHAT
                      </span>
                    ) : (
                      <Clock size={20} className="mx-auto text-[#96989f]" />
                    )}
                  </div>

                  <div className="text-[10px] font-medium leading-tight truncate">
                    {d.title}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[#4ade80]">
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                  4 Sesi Disempurnakan
                </span>
                <span className="flex items-center gap-1.5 text-[#96989f]">
                  <span className="h-2 w-2 rounded-full bg-gray-500" />
                  1 Sesi Menunggu
                </span>
              </div>
              <div className="text-[#c5c6ca] font-semibold">
                Kadar Penyelesaian: {athlete.weeklyCompletionRate}%
              </div>
            </div>
          </CoachCard>
        </div>
      )}

      {/* Tab 2: Submissions Log */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          {athleteSubmissions.length === 0 ? (
            <CoachCard className="p-10 text-center">
              <Dumbbell size={28} className="mx-auto text-[#96989f]" />
              <h4 className="mt-3 text-sm font-bold text-white">
                Tiada Log Penyerahan
              </h4>
              <p className="mt-1 text-xs text-[#96989f]">
                Atlet belum menghantar rakaman latihan untuk kitaran ini.
              </p>
            </CoachCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {athleteSubmissions.map((sub) => (
                <CoachCard key={sub.id} className="p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {sub.exerciseName}
                        </h4>
                        <span className="text-xs text-[#96989f]">
                          {sub.submittedAt}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          sub.status === "VERIFIED"
                            ? "bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/40"
                            : sub.status === "CORRECTION"
                            ? "bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/40"
                            : sub.status === "REJECTED"
                            ? "bg-[#e10600]/15 text-[#ff555a] border border-[#e10600]/40"
                            : "bg-white/10 text-white border border-white/20"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    {/* Video thumbnail and duration */}
                    <div className="mt-3 relative h-28 w-full overflow-hidden rounded-lg bg-black/60 border border-[#45464b]/40">
                      <Image
                        src={sub.videoThumbnailUrl || "/assets/fighterx/hero-silat-olahraga-athlete.png"}
                        alt={sub.exerciseName}
                        fill
                        className="object-cover opacity-75"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e10600] text-white shadow">
                          <Play size={14} className="ml-0.5" />
                        </div>
                      </div>
                      {sub.videoDuration && (
                        <span className="absolute bottom-1.5 right-2 text-[10px] font-mono text-white bg-black/80 px-1.5 py-0.5 rounded">
                          {sub.videoDuration}
                        </span>
                      )}
                    </div>

                    {/* Athlete notes */}
                    {sub.notes && (
                      <p className="mt-2 text-xs text-[#96989f] italic">
                        &ldquo;{sub.notes}&rdquo;
                      </p>
                    )}

                    {/* Coach feedback */}
                    {sub.coachFeedback && (
                      <div className="mt-2 rounded-md bg-[#202126] border border-[#45464b]/40 p-2 text-xs">
                        <span className="font-bold text-[#ff555a]">Maklum Balas Jurulatih: </span>
                        <span className="text-[#c5c6ca]">{sub.coachFeedback}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2 border-t border-white/[0.06] text-right">
                    <Link href={`/coach/verification/${sub.id}`}>
                      <CoachButton variant="outline" size="sm">
                        Semak Butiran Latihan
                      </CoachButton>
                    </Link>
                  </div>
                </CoachCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Baseline Assessment Records */}
      {activeTab === "assessments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Sejarah Ujian Fizikal & Rubrik Teknikal
            </h3>
            <CoachButton
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsAssessmentModalOpen(true)}
            >
              Rekod Penilaian Baharu
            </CoachButton>
          </div>

          {athleteAssessments.length === 0 ? (
            <CoachCard className="p-10 text-center">
              <Award size={28} className="mx-auto text-[#96989f]" />
              <h4 className="mt-3 text-sm font-bold text-white">
                Tiada Rekod Penilaian
              </h4>
              <p className="mt-1 text-xs text-[#96989f]">
                Klik butang di atas untuk merekodkan ujian baseline atlet.
              </p>
            </CoachCard>
          ) : (
            <div className="space-y-4">
              {athleteAssessments.map((asm) => (
                <CoachCard key={asm.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {asm.cycle || "Penilaian Fizikal & Teknikal"}
                        </span>
                        <CoachBadge variant="green" size="sm">
                          {asm.rating}
                        </CoachBadge>
                      </div>
                      <span className="text-xs text-[#96989f]">
                        Tarikh: {asm.date}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-[#96989f] uppercase block">
                        Skor Komposit
                      </span>
                      <span className="font-teko text-3xl font-bold text-white leading-none">
                        {asm.totalScore} / 100
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {asm.metrics.run6MinMeters || asm.metrics.run6MinDistanceMeters ? (
                      <div className="rounded-lg bg-[#121316] p-3 border border-[#45464b]/30">
                        <span className="text-[10px] text-[#96989f] block">Larian 6 Minit</span>
                        <span className="font-bold text-white text-sm">
                          {String(asm.metrics.run6MinMeters || asm.metrics.run6MinDistanceMeters)} m
                        </span>
                      </div>
                    ) : null}

                    {asm.metrics.pushups1Min || asm.metrics.pushupsCount1Min ? (
                      <div className="rounded-lg bg-[#121316] p-3 border border-[#45464b]/30">
                        <span className="text-[10px] text-[#96989f] block">Push-up 1 Minit</span>
                        <span className="font-bold text-white text-sm">
                          {String(asm.metrics.pushups1Min || asm.metrics.pushupsCount1Min)} reps
                        </span>
                      </div>
                    ) : null}

                    {asm.metrics.plankSec || asm.metrics.plankDurationSeconds ? (
                      <div className="rounded-lg bg-[#121316] p-3 border border-[#45464b]/30">
                        <span className="text-[10px] text-[#96989f] block">Plank Endurance</span>
                        <span className="font-bold text-white text-sm">
                          {String(asm.metrics.plankSec || asm.metrics.plankDurationSeconds)} saat
                        </span>
                      </div>
                    ) : null}

                    {asm.metrics.technicalScore ? (
                      <div className="rounded-lg bg-[#121316] p-3 border border-[#45464b]/30">
                        <span className="text-[10px] text-[#96989f] block">Skor Teknik</span>
                        <span className="font-bold text-[#4ade80] text-sm">
                          {String(asm.metrics.technicalScore)} / 10
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {asm.notes && (
                    <div className="mt-3 text-xs text-[#c5c6ca] bg-[#202126]/60 p-3 rounded-lg border border-[#45464b]/30">
                      <span className="font-bold text-white">Catatan Jurulatih: </span>
                      {asm.notes}
                    </div>
                  )}
                </CoachCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Record Assessment Modal */}
      <CoachModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        title={`Rekod Penilaian: ${athlete.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssessment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[#c5c6ca] font-semibold block mb-1">
                Larian 6 Minit (meter)
              </label>
              <input
                type="number"
                value={runDistance}
                onChange={(e) => setRunDistance(Number(e.target.value))}
                className="w-full rounded-md border border-[#45464b] bg-[#121316] p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[#c5c6ca] font-semibold block mb-1">
                Push-Up 1 Minit (ulangan)
              </label>
              <input
                type="number"
                value={pushupCount}
                onChange={(e) => setPushupCount(Number(e.target.value))}
                className="w-full rounded-md border border-[#45464b] bg-[#121316] p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[#c5c6ca] font-semibold block mb-1">
                Plank Endurance (saat)
              </label>
              <input
                type="number"
                value={plankSec}
                onChange={(e) => setPlankSec(Number(e.target.value))}
                className="w-full rounded-md border border-[#45464b] bg-[#121316] p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[#c5c6ca] font-semibold block mb-1">
                Skor Rubrik Teknikal (1 - 10)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="10"
                value={techScore}
                onChange={(e) => setTechScore(Number(e.target.value))}
                className="w-full rounded-md border border-[#45464b] bg-[#121316] p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[#c5c6ca] font-semibold block mb-1">
                Knee to Wall Kiri (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={kneeLeft}
                onChange={(e) => setKneeLeft(Number(e.target.value))}
                className="w-full rounded-md border border-[#45464b] bg-[#121316] p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[#c5c6ca] font-semibold block mb-1">
                Knee to Wall Kanan (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={kneeRight}
                onChange={(e) => setKneeRight(Number(e.target.value))}
                className="w-full rounded-md border border-[#45464b] bg-[#121316] p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#c5c6ca] font-semibold block mb-1">
              Catatan / Fokus Prestasi Jurulatih
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan kemajuan stamina, kedalaman kuda-kuda, ketangkasan..."
              className="w-full rounded-md border border-[#45464b] bg-[#121316] p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
            <CoachButton
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAssessmentModalOpen(false)}
            >
              Batal
            </CoachButton>
            <CoachButton type="submit" variant="primary" size="md">
              Simpan Penilaian
            </CoachButton>
          </div>
        </form>
      </CoachModal>
    </div>
  );
}
