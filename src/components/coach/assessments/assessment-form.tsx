"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, Award, Activity, Sparkles } from "lucide-react";
import { useCoachState, useCoachActions } from "@/lib/coach/store";
import type { AssessmentType, AssessmentRating } from "@/lib/coach/types";
import { CoachButton } from "@/components/coach/ui/coach-button";
import { CoachBadge } from "@/components/coach/ui/coach-badge";

export function clampScore(score: number, min = 1, max = 10): number {
  if (isNaN(score)) return min;
  return Math.max(min, Math.min(max, score));
}

export function deriveRating(score: number): AssessmentRating {
  if (score >= 85) return "CEMERLANG";
  if (score >= 70) return "BAIK";
  if (score >= 50) return "MEMUASKAN";
  return "PERLU_BIMBINGAN";
}

interface AssessmentFormProps {
  initialAthleteId?: string;
  initialType?: AssessmentType;
  initialAssessmentId?: string;
  onSuccess?: (assessmentId: string) => void;
  onCancel?: () => void;
}

export function AssessmentForm({
  initialAthleteId,
  initialType = "BASELINE_PHYSICAL",
  initialAssessmentId,
  onSuccess,
  onCancel,
}: AssessmentFormProps) {
  const { athletes, assessments } = useCoachState();
  const { registerAssessment } = useCoachActions();

  // Find existing assessment if editing
  const existingAssessment = initialAssessmentId
    ? assessments.find((a) => a.id === initialAssessmentId)
    : undefined;

  const [athleteId, setAthleteId] = useState<string>(
    existingAssessment?.athleteId || initialAthleteId || (athletes[0]?.id ?? "ath-01")
  );
  const [type, setType] = useState<AssessmentType>(
    existingAssessment?.type || initialType
  );
  const [cycle, setCycle] = useState<string>(
    existingAssessment?.cycle || "Baseline Q1"
  );
  const [date, setDate] = useState<string>(
    existingAssessment?.date ||
      new Date().toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
  );
  const [notes, setNotes] = useState<string>(existingAssessment?.notes || "");

  // Physical Baseline metrics
  const [runMeters, setRunMeters] = useState<number>(
    Number(existingAssessment?.metrics?.larian6MinitM ?? existingAssessment?.metrics?.run6MinMeters ?? 1420)
  );
  const [pushups, setPushups] = useState<number>(
    Number(existingAssessment?.metrics?.pushup1MinitCount ?? existingAssessment?.metrics?.pushups1Min ?? 42)
  );
  const [plankSec, setPlankSec] = useState<number>(
    Number(existingAssessment?.metrics?.plankSec ?? 120)
  );
  const [kneeLeft, setKneeLeft] = useState<number>(
    Number(existingAssessment?.metrics?.kneeToWallLeftCm ?? 11.5)
  );
  const [kneeRight, setKneeRight] = useState<number>(
    Number(existingAssessment?.metrics?.kneeToWallRightCm ?? 11.5)
  );

  // Technical Seni metrics
  const [jurusAcc, setJurusAcc] = useState<number>(
    Number(existingAssessment?.metrics?.jurusAccuracy ?? 8.5)
  );
  const [posture, setPosture] = useState<number>(
    Number(existingAssessment?.metrics?.postureStance ?? 8.5)
  );
  const [stamina, setStamina] = useState<number>(
    Number(existingAssessment?.metrics?.staminaPacing ?? 8.5)
  );
  const [expression, setExpression] = useState<number>(
    Number(existingAssessment?.metrics?.expressionPower ?? 8.5)
  );

  // Technical Olahraga metrics
  const [strikeSpeed, setStrikeSpeed] = useState<number>(
    Number(existingAssessment?.metrics?.strikingSpeed ?? 8.5)
  );
  const [techPrecision, setTechPrecision] = useState<number>(
    Number(existingAssessment?.metrics?.techniquePrecision ?? 8.5)
  );
  const [defense, setDefense] = useState<number>(
    Number(existingAssessment?.metrics?.defenseEvasion ?? 8.5)
  );
  const [takedowns, setTakedowns] = useState<number>(
    Number(existingAssessment?.metrics?.tacticalTakedowns ?? 8.5)
  );

  const [submitted, setSubmitted] = useState(false);

  // Computed automated composite score
  const computedScore = useMemo(() => {
    if (type === "BASELINE_PHYSICAL") {
      // Benchmark: 1600m run = 100, 50 pushups = 100, 180s plank = 100, 12cm mobility = 100
      const runScore = Math.min(100, Math.max(30, (runMeters / 1600) * 100));
      const pushupScore = Math.min(100, Math.max(30, (pushups / 50) * 100));
      const plankScore = Math.min(100, Math.max(30, (plankSec / 180) * 100));
      const kneeAvg = (kneeLeft + kneeRight) / 2;
      const kneeScore = Math.min(100, Math.max(30, (kneeAvg / 12) * 100));

      const weighted = runScore * 0.35 + pushupScore * 0.25 + plankScore * 0.25 + kneeScore * 0.15;
      return Math.round(weighted);
    } else if (type === "TECHNICAL_SENI") {
      const avg =
        (clampScore(jurusAcc) +
          clampScore(posture) +
          clampScore(stamina) +
          clampScore(expression)) /
        4;
      return Math.round(avg * 10);
    } else {
      // TECHNICAL_OLAHRAGA
      const avg =
        (clampScore(strikeSpeed) +
          clampScore(techPrecision) +
          clampScore(defense) +
          clampScore(takedowns)) /
        4;
      return Math.round(avg * 10);
    }
  }, [
    type,
    runMeters,
    pushups,
    plankSec,
    kneeLeft,
    kneeRight,
    jurusAcc,
    posture,
    stamina,
    expression,
    strikeSpeed,
    techPrecision,
    defense,
    takedowns,
  ]);

  const rating = useMemo(() => deriveRating(computedScore), [computedScore]);

  const selectedAthlete = athletes.find((a) => a.id === athleteId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let metricsPayload: Record<string, number | string> = {};

    if (type === "BASELINE_PHYSICAL") {
      metricsPayload = {
        larian6MinitM: runMeters,
        pushup1MinitCount: pushups,
        plankSec,
        kneeToWallLeftCm: kneeLeft,
        kneeToWallRightCm: kneeRight,
        run6MinMeters: runMeters,
        pushups1Min: pushups,
      };
    } else if (type === "TECHNICAL_SENI") {
      metricsPayload = {
        jurusAccuracy: clampScore(jurusAcc),
        postureStance: clampScore(posture),
        staminaPacing: clampScore(stamina),
        expressionPower: clampScore(expression),
      };
    } else {
      metricsPayload = {
        strikingSpeed: clampScore(strikeSpeed),
        techniquePrecision: clampScore(techPrecision),
        defenseEvasion: clampScore(defense),
        tacticalTakedowns: clampScore(takedowns),
      };
    }

    const newId = initialAssessmentId || `asm-${Date.now()}`;
    registerAssessment({
      id: newId,
      athleteId,
      athleteName: selectedAthlete ? selectedAthlete.name : "Atlet FighterX",
      date,
      type,
      cycle,
      metrics: metricsPayload,
      totalScore: computedScore,
      rating,
      notes: notes.trim() || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(newId);
      }
    }, 600);
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted && (
        <div className="rounded-lg border border-[#22c55e]/50 bg-[#22c55e]/15 p-4 flex items-center gap-3 text-sm text-[#4ade80]">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <span>Penilaian berjaya disimpan dan skor kesiagaan atlet telah dikemaskini.</span>
        </div>
      )}

      {/* Basic Setup: Athlete, Type, Cycle, Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#c5c6ca] mb-1.5">
            Pilih Atlet
          </label>
          <select
            value={athleteId}
            onChange={(e) => setAthleteId(e.target.value)}
            className="w-full rounded-lg border border-[#45464b] bg-[#121316] px-3 py-2 text-xs text-white focus:border-[#ff3845] focus:outline-none"
            required
          >
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.discipline} • {a.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#c5c6ca] mb-1.5">
            Jenis Penilaian
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AssessmentType)}
            className="w-full rounded-lg border border-[#45464b] bg-[#121316] px-3 py-2 text-xs text-white focus:border-[#ff3845] focus:outline-none"
            required
          >
            <option value="BASELINE_PHYSICAL">Penilaian Fizikal Baseline</option>
            <option value="TECHNICAL_SENI">Teknikal Silat Seni</option>
            <option value="TECHNICAL_OLAHRAGA">Teknikal Silat Olahraga</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#c5c6ca] mb-1.5">
            Kitaran Ujian (Cycle)
          </label>
          <select
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
            className="w-full rounded-lg border border-[#45464b] bg-[#121316] px-3 py-2 text-xs text-white focus:border-[#ff3845] focus:outline-none"
          >
            <option value="Baseline Q1">Baseline Q1 (Jan - Mac)</option>
            <option value="Mid-Cycle">Mid-Cycle (Apr - Jun)</option>
            <option value="Pra-Kejohanan">Pra-Kejohanan (Jul - Ogo)</option>
            <option value="Pasca-Kejohanan">Pasca-Kejohanan (Sep - Nov)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#c5c6ca] mb-1.5">
            Tarikh Ujian
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-[#45464b] bg-[#121316] px-3 py-2 text-xs text-white focus:border-[#ff3845] focus:outline-none"
            placeholder="cth: 12 Mac 2027"
            required
          />
        </div>
      </div>

      {/* Rubric Inputs Header */}
      <div className="pt-2 border-t border-[#45464b]/40">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#96989f] flex items-center gap-1.5">
            <Activity size={14} className="text-[#ff3845]" />
            Rubrik Penilaian: {type === "BASELINE_PHYSICAL" ? "Fizikal Asas" : type === "TECHNICAL_SENI" ? "Silat Seni" : "Silat Olahraga"}
          </h4>
          <span className="text-[11px] text-[#96989f]">
            {type === "BASELINE_PHYSICAL" ? "Skor ujian berkala piawai ISN" : "Skor rubrik teknik 1 - 10"}
          </span>
        </div>

        {/* Physical Baseline Rubric */}
        {type === "BASELINE_PHYSICAL" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <label className="block text-xs font-semibold text-white mb-1">
                Larian 6 Minit (meter)
              </label>
              <input
                type="number"
                min="500"
                max="2500"
                step="10"
                value={runMeters}
                onChange={(e) => setRunMeters(Number(e.target.value))}
                className="w-full rounded border border-[#45464b] bg-[#1a1c22] px-3 py-1.5 text-xs text-white focus:border-[#ff3845] focus:outline-none"
                required
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Piawaian: &ge; 1400m (Baik)</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <label className="block text-xs font-semibold text-white mb-1">
                Push-up 1 Minit (ulangan)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={pushups}
                onChange={(e) => setPushups(Number(e.target.value))}
                className="w-full rounded border border-[#45464b] bg-[#1a1c22] px-3 py-1.5 text-xs text-white focus:border-[#ff3845] focus:outline-none"
                required
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Piawaian: &ge; 40 reps (Baik)</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <label className="block text-xs font-semibold text-white mb-1">
                Plank (saat)
              </label>
              <input
                type="number"
                min="0"
                max="360"
                value={plankSec}
                onChange={(e) => setPlankSec(Number(e.target.value))}
                className="w-full rounded border border-[#45464b] bg-[#1a1c22] px-3 py-1.5 text-xs text-white focus:border-[#ff3845] focus:outline-none"
                required
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Piawaian: &ge; 120s (Baik)</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <label className="block text-xs font-semibold text-white mb-1">
                Knee-to-Wall Kiri (cm)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                value={kneeLeft}
                onChange={(e) => setKneeLeft(Number(e.target.value))}
                className="w-full rounded border border-[#45464b] bg-[#1a1c22] px-3 py-1.5 text-xs text-white focus:border-[#ff3845] focus:outline-none"
                required
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Piawaian mobiliti: &ge; 10cm</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <label className="block text-xs font-semibold text-white mb-1">
                Knee-to-Wall Kanan (cm)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                value={kneeRight}
                onChange={(e) => setKneeRight(Number(e.target.value))}
                className="w-full rounded border border-[#45464b] bg-[#1a1c22] px-3 py-1.5 text-xs text-white focus:border-[#ff3845] focus:outline-none"
                required
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Piawaian mobiliti: &ge; 10cm</span>
            </div>
          </div>
        )}

        {/* Silat Seni Rubric */}
        {type === "TECHNICAL_SENI" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Ketepatan Jurus (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{jurusAcc.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={jurusAcc}
                onChange={(e) => setJurusAcc(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Kesesuaian gerak jurus tunggal/ganda/regu</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Postur & Kuda-kuda (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{posture.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={posture}
                onChange={(e) => setPosture(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Kestabilan bukaan tapak dan ketegasan pasang</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Stamina & Pacing (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{stamina.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={stamina}
                onChange={(e) => setStamina(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Kawalan masa persembahan 3 minit & ritma gerak</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Ekspresi & Daya Pengaruh (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{expression.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={expression}
                onChange={(e) => setExpression(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Keberanian pandangan, penghayatan & daya letak seni</span>
            </div>
          </div>
        )}

        {/* Silat Olahraga Rubric */}
        {type === "TECHNICAL_OLAHRAGA" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Kelajuan Serangan (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{strikeSpeed.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={strikeSpeed}
                onChange={(e) => setStrikeSpeed(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Kelajuan kombinasi tumbukan dan tendangan sabit</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Ketepatan Teknik (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{techPrecision.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={techPrecision}
                onChange={(e) => setTechPrecision(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Ketepatan sasaran pelindung dada (body protector)</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Pertahanan & Elakan (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{defense.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={defense}
                onChange={(e) => setDefense(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Tangkisan, elakan sisi, dan kawalan jarak selamat</span>
            </div>

            <div className="rounded-lg border border-[#45464b]/60 bg-[#121316] p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-white">Taktikal Bantingan (1 - 10)</label>
                <span className="text-xs font-bold text-[#ff3845]">{takedowns.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={takedowns}
                onChange={(e) => setTakedowns(clampScore(Number(e.target.value)))}
                className="w-full accent-[#ff3845] cursor-pointer"
              />
              <span className="text-[10px] text-[#96989f] mt-1 block">Teknik sapuan, guntingan, tangkapan & jatuhan</span>
            </div>
          </div>
        )}
      </div>

      {/* Automated Score Summary Card */}
      <div className="rounded-xl border border-[#ff3845]/40 bg-[#1a1b22]/90 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-[#e10600]/20 border border-[#e10600]/60 flex items-center justify-center text-[#ff555a]">
            <Award size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#96989f]">
                Skor Komposit Automatik
              </span>
              <CoachBadge variant={ratingBadgeVariant(rating)} size="sm">
                {rating}
              </CoachBadge>
            </div>
            <div className="text-2xl font-black text-white">
              {computedScore} <span className="text-xs font-normal text-[#96989f]">/ 100</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#c5c6ca] max-w-xs text-center sm:text-right">
          <p className="flex items-center justify-center sm:justify-end gap-1.5 text-[#fbbf24]">
            <Sparkles size={14} />
            <span>Kesiagaan atlet dikemaskini terus kepada {computedScore}%</span>
          </p>
        </div>
      </div>

      {/* Notes / Coach Observation */}
      <div>
        <label className="block text-xs font-semibold text-[#c5c6ca] mb-1.5">
          Ulasan & Pelan Tindakan Jurulatih (Pilihan)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="cth: Peningkatan memuaskan pada kekuatan teras. Sedia untuk intensiti kejohanan zon."
          className="w-full rounded-lg border border-[#45464b] bg-[#121316] p-3 text-xs text-white focus:border-[#ff3845] focus:outline-none resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <CoachButton type="button" variant="ghost" onClick={onCancel}>
            Batal
          </CoachButton>
        )}
        <CoachButton type="submit" variant="primary" icon={<CheckCircle2 size={16} />}>
          {initialAssessmentId ? "Kemaskini Rekod Penilaian" : "Simpan Penilaian Atlet"}
        </CoachButton>
      </div>
    </form>
  );
}
