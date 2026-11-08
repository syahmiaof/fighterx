"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Award,
  Activity,
  Edit3,
  TrendingUp,
  User,
} from "lucide-react";
import type { Assessment, AssessmentRating, AssessmentType } from "@/lib/coach/types";
import { CoachCard } from "@/components/coach/ui/coach-card";
import { CoachBadge } from "@/components/coach/ui/coach-badge";
import { CoachButton } from "@/components/coach/ui/coach-button";
import { AssessmentForm } from "@/components/coach/assessments/assessment-form";

interface AssessmentDetailViewProps {
  assessment: Assessment;
}

export function AssessmentDetailView({ assessment }: AssessmentDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const ratingBadgeVariant = (r: AssessmentRating) => {
    switch (r) {
      case "CEMERLANG":
        return "green";
      case "BAIK":
        return "blue";
      case "MEMUASKAN":
        return "yellow";
      case "PERLU_BIMBINGAN":
        return "red";
    }
  };

  const getTypeName = (t: AssessmentType) => {
    switch (t) {
      case "BASELINE_PHYSICAL":
        return "Penilaian Fizikal Baseline (ISN)";
      case "TECHNICAL_SENI":
        return "Penilaian Teknikal Silat Seni";
      case "TECHNICAL_OLAHRAGA":
        return "Penilaian Teknikal Silat Olahraga";
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/coach/assessments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Senarai Penilaian</span>
        </Link>

        <CoachButton
          variant={isEditing ? "outline" : "primary"}
          size="sm"
          icon={<Edit3 size={14} />}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Tutup Editor" : "Kemaskini Rekod"}
        </CoachButton>
      </div>

      {isEditing ? (
        <CoachCard className="p-6">
          <h2 className="text-base font-bold text-white mb-4">
            Kemaskini Penilaian: {assessment.athleteName}
          </h2>
          <AssessmentForm
            initialAssessmentId={assessment.id}
            initialAthleteId={assessment.athleteId}
            initialType={assessment.type}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </CoachCard>
      ) : (
        <>
          {/* Header Banner */}
          <CoachCard glow className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-[#e10600]/20 border border-[#e10600]/50 flex items-center justify-center text-[#ff555a] flex-shrink-0">
                  <Award size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white">
                      {assessment.athleteName}
                    </h1>
                    <CoachBadge variant={ratingBadgeVariant(assessment.rating)} size="md">
                      {assessment.rating}
                    </CoachBadge>
                  </div>

                  <p className="mt-1 text-xs text-[#96989f]">
                    {getTypeName(assessment.type)} • {assessment.cycle || "Baseline Q1"}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-[#c5c6ca] flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#96989f]" />
                      {assessment.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-[#96989f]" />
                      <Link
                        href={`/coach/athletes/${assessment.athleteId}`}
                        className="text-[#ff555a] hover:underline"
                      >
                        Buka Profil Atlet
                      </Link>
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Score Display */}
              <div className="flex flex-col items-center justify-center bg-[#121316] border border-[#45464b]/60 rounded-xl px-6 py-4 text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#96989f] font-semibold">
                  Skor Komposit
                </span>
                <div className="text-4xl font-black text-white mt-1">
                  {assessment.totalScore}
                  <span className="text-xs font-normal text-[#96989f]"> / 100</span>
                </div>
                <div className="mt-2 w-32 bg-[#202126] rounded-full h-2 overflow-hidden border border-[#45464b]/50">
                  <div
                    className="h-full bg-gradient-to-r from-[#ed171b] to-[#22c55e] rounded-full"
                    style={{ width: `${assessment.totalScore}%` }}
                  />
                </div>
              </div>
            </div>
          </CoachCard>

          {/* Metrics Rubric Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CoachCard className="p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[#ff3845]" />
                Perincian Rubrik &amp; Metrik Ujian
              </h3>

              <div className="space-y-3">
                {Object.entries(assessment.metrics).map(([key, val]) => {
                  let formattedKey = key;
                  let unit = "";
                  if (key === "larian6MinitM" || key === "run6MinMeters") {
                    formattedKey = "Larian 6 Minit";
                    unit = "meter";
                  } else if (key === "pushup1MinitCount" || key === "pushups1Min") {
                    formattedKey = "Push-up 1 Minit";
                    unit = "reps";
                  } else if (key === "plankSec") {
                    formattedKey = "Plank Daya Tahan";
                    unit = "saat";
                  } else if (key === "kneeToWallLeftCm") {
                    formattedKey = "Mobiliti Knee-to-Wall Kiri";
                    unit = "cm";
                  } else if (key === "kneeToWallRightCm") {
                    formattedKey = "Mobiliti Knee-to-Wall Kanan";
                    unit = "cm";
                  } else if (key === "jurusAccuracy") {
                    formattedKey = "Ketepatan Jurus";
                    unit = "/ 10";
                  } else if (key === "postureStance") {
                    formattedKey = "Postur & Kuda-kuda";
                    unit = "/ 10";
                  } else if (key === "staminaPacing") {
                    formattedKey = "Stamina & Pacing";
                    unit = "/ 10";
                  } else if (key === "expressionPower") {
                    formattedKey = "Ekspresi & Daya Pengaruh";
                    unit = "/ 10";
                  } else if (key === "strikingSpeed") {
                    formattedKey = "Kelajuan Serangan";
                    unit = "/ 10";
                  } else if (key === "techniquePrecision") {
                    formattedKey = "Ketepatan Teknik";
                    unit = "/ 10";
                  } else if (key === "defenseEvasion") {
                    formattedKey = "Pertahanan & Elakan";
                    unit = "/ 10";
                  } else if (key === "tacticalTakedowns") {
                    formattedKey = "Taktikal Bantingan";
                    unit = "/ 10";
                  }

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#121316] border border-[#45464b]/40 text-xs"
                    >
                      <span className="text-[#c5c6ca] font-medium">{formattedKey}</span>
                      <span className="text-white font-bold text-sm">
                        {val} <span className="text-[10px] text-[#96989f] font-normal">{unit}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </CoachCard>

            {/* Delta Comparison & Notes */}
            <div className="space-y-4">
              {assessment.deltaComparison && Object.keys(assessment.deltaComparison).length > 0 && (
                <CoachCard className="p-5">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#22c55e]" />
                    Perbandingan Delta (vs Kitaran Lepas)
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.entries(assessment.deltaComparison).map(([dKey, dVal]) => {
                      const isPositive = String(dVal).startsWith("+");
                      return (
                        <div
                          key={dKey}
                          className="p-3 rounded-lg bg-[#121316] border border-[#45464b]/40 text-xs"
                        >
                          <span className="text-[10px] text-[#96989f] uppercase block mb-0.5">
                            {dKey.replace("Delta", "")}
                          </span>
                          <span
                            className={`font-bold text-sm ${
                              isPositive ? "text-[#4ade80]" : "text-[#ff555a]"
                            }`}
                          >
                            {dVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CoachCard>
              )}

              {/* Coach Observations */}
              <CoachCard className="p-5">
                <h3 className="text-sm font-bold text-white mb-2">
                  Ulasan &amp; Pelan Tindakan Jurulatih
                </h3>
                <p className="text-xs text-[#c5c6ca] leading-relaxed bg-[#121316] p-3 rounded-lg border border-[#45464b]/40">
                  {assessment.notes ||
                    "Prestasi direkodkan mengikut piawaian. Teruskan program latihan fasa berikutnya."}
                </p>
              </CoachCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
