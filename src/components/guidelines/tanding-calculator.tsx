"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Clock,
  RotateCcw,
  Plus,
  Minus,
  ShieldAlert,
  CheckCircle2,
  Trophy,
  Flame,
} from "lucide-react";
import {
  calculateTandingScore,
  getPenaltyDeduction,
  isDisqualifyingPenalty,
} from "@/lib/guidelines/scoring";
import type { PenaltyType } from "@/lib/guidelines/types";
import { useLanguage } from "@/lib/i18n";

export function TandingCalculator() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [punches, setPunches] = useState<number>(0);
  const [kicks, setKicks] = useState<number>(0);
  const [takedowns, setTakedowns] = useState<number>(0);
  const [activePenalties, setActivePenalties] = useState<PenaltyType[]>([]);

  // 5-second grapple takedown timer simulator state
  const [grappleTimeMs, setGrappleTimeMs] = useState<number>(5000);
  const [isGrappling, setIsGrappling] = useState<boolean>(false);
  const [grappleStatus, setGrappleStatus] = useState<"idle" | "active" | "success" | "expired">("idle");
  const [lastSuccessTime, setLastSuccessTime] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const penaltyOptions: { id: PenaltyType; label: string; deduction: string; tone: "yellow" | "orange" | "red" }[] = [
    { id: "TEGURAN_1", label: isEn ? "Reprimand I" : "Teguran I", deduction: isEn ? "−1 pt" : "−1 mata", tone: "yellow" },
    { id: "TEGURAN_2", label: isEn ? "Reprimand II" : "Teguran II", deduction: isEn ? "−2 pts" : "−2 mata", tone: "yellow" },
    { id: "PERINGATAN_1", label: isEn ? "Warning I" : "Peringatan I", deduction: isEn ? "−5 pts" : "−5 mata", tone: "orange" },
    { id: "PERINGATAN_2", label: isEn ? "Warning II" : "Peringatan II", deduction: isEn ? "−10 pts" : "−10 mata", tone: "orange" },
    { id: "PERINGATAN_3_DQ", label: isEn ? "Warning III" : "Peringatan III", deduction: isEn ? "Direct DQ" : "DQ Terus", tone: "red" },
    { id: "DIRECT_DQ", label: "Direct DQ", deduction: isEn ? "Severe Foul" : "Pelanggaran Berat", tone: "red" },
  ];

  // Compute live score
  const scoreResult = calculateTandingScore(punches, kicks, takedowns, activePenalties);

  // Toggle penalties
  const togglePenalty = (penalty: PenaltyType) => {
    setActivePenalties((prev) => {
      if (prev.includes(penalty)) {
        return prev.filter((p) => p !== penalty);
      } else {
        return [...prev, penalty];
      }
    });
  };

  // Reset calculator
  const handleResetBout = () => {
    setPunches(0);
    setKicks(0);
    setTakedowns(0);
    setActivePenalties([]);
    handleResetGrapple();
  };

  // 5-second grapple simulation handlers
  const handleStartGrapple = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGrappleTimeMs(5000);
    setIsGrappling(true);
    setGrappleStatus("active");
  };

  const handleCompleteTakedownInTime = () => {
    if (!isGrappling || grappleTimeMs <= 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const completedInSec = ((5000 - grappleTimeMs) / 1000).toFixed(1);
    setLastSuccessTime(Number(completedInSec));
    setIsGrappling(false);
    setGrappleStatus("success");
    setTakedowns((prev) => prev + 1);
  };

  const handleResetGrapple = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsGrappling(false);
    setGrappleTimeMs(5000);
    setGrappleStatus("idle");
    setLastSuccessTime(null);
  };

  useEffect(() => {
    if (isGrappling) {
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 5000 - elapsed);
        setGrappleTimeMs(remaining);

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsGrappling(false);
          setGrappleStatus("expired");
        }
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGrappling]);

  const rawStrikePoints = punches * 1 + kicks * 2 + takedowns * 3;
  const totalDeductions = activePenalties.reduce((sum, p) => sum + getPenaltyDeduction(p), 0);

  return (
    <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff4d5a] backdrop-blur-sm">
            <Flame size={13} aria-hidden="true" />
            {isEn ? "PERSILAT 2026 Silat Olahraga Simulator" : "Simulator Silat Olahraga PERSILAT 2026"}
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white font-[var(--font-athletic)] uppercase">
            {isEn ? "Silat Olahraga Match Scorer & Penalties" : "Kalkulator Mata & Penalti Silat Olahraga"}
          </h3>
          <p className="text-xs text-[#a3a4ab] max-w-xl">
            {isEn
              ? "Simulate legal strikes, referee penalty deductions, and track the 5-second grapple takedown limit under official rules."
              : "Kira mata serangan sah, potongan hukuman wasit, dan pantau had masa jatuhan 5 saat mengikut peraturan rasmi terkini."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetBout}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-[#d6d6da] hover:text-white px-3.5 py-2 text-xs font-semibold backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          aria-label={isEn ? "Reset score calculation" : "Set semula pengiraan mata"}
        >
          <RotateCcw size={14} aria-hidden="true" />
          {isEn ? "Reset" : "Set Semula"}
        </button>
      </div>

      {/* Disqualification Banner */}
      {scoreResult.isDisqualified && (
        <aside
          role="alert"
          aria-live="assertive"
          className="mt-5 rounded-xl border border-[rgba(255,56,69,0.5)] bg-[rgba(255,56,69,0.1)] p-4 text-[#ffccd0] backdrop-blur-md shadow-[0_8px_32px_rgba(225,6,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] animate-pulse"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert size={26} className="text-[#ff4d5a] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="block text-sm sm:text-base font-bold text-white tracking-wide uppercase">
                {isEn ? "STATUS: DISQUALIFIED (DQ)" : "STATUS: DISKUALIFIKASI (DQ)"}
              </strong>
              <p className="mt-1 text-xs text-[#ffb3b8] leading-relaxed">
                {isEn
                  ? "Athlete disqualified from bout for reaching Warning III or receiving Direct Disqualification (Severe Foul) from Referee / Technical Delegate. Bout awarded to opponent."
                  : "Pesilat dibatalkan daripada perlawanan akibat mencapai Peringatan III atau dikenakan Direct Disqualification (Pelanggaran Berat) oleh Wasit / Ketua Pertandingan. Kemenangan diberikan kepada pihak lawan."}
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* Main Scoreboard Display (Frosted Glass) */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.04] transition-colors">
          <span className="block text-[11px] font-bold text-[#8d8e95] uppercase tracking-wider">
            {isEn ? "Strike Points" : "Mata Serangan"}
          </span>
          <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-white font-[var(--font-athletic)]">
            {rawStrikePoints}
          </div>
          <span className="text-[10px] text-[#6d6e75]">
            {isEn ? "Punches + Kicks + Takedowns" : "Pukulan + Sepakan + Jatuhan"}
          </span>
        </div>

        <div className="rounded-xl border border-[rgba(240,180,40,0.25)] bg-[rgba(240,180,40,0.04)] backdrop-blur-md p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[rgba(240,180,40,0.07)] transition-colors">
          <span className="block text-[11px] font-bold text-[#ffd24c] uppercase tracking-wider">
            {isEn ? "Penalty Deductions" : "Potongan Hukuman"}
          </span>
          <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#ffd24c] font-[var(--font-athletic)]">
            {totalDeductions > 0 ? `−${totalDeductions}` : "0"}
          </div>
          <span className="text-[10px] text-[#6d6e75]">
            {isEn ? "Reprimands & Warnings" : "Teguran & Peringatan"}
          </span>
        </div>

        <div className="col-span-2 rounded-xl border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.08)] backdrop-blur-md p-4 text-center shadow-[0_8px_32px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="block text-[11px] font-bold text-[#ff4d5a] uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Trophy size={14} aria-hidden="true" />
            {isEn ? "Net Total Score" : "Jumlah Skor Bersih"}
          </span>
          <div
            className={`mt-1 text-4xl sm:text-5xl font-black font-[var(--font-athletic)] ${
              scoreResult.isDisqualified ? "text-[#ff4d5a] line-through decoration-white/40" : "text-white"
            }`}
          >
            {scoreResult.totalScore}
          </div>
          <span className="text-[11px] font-medium text-[#ffd6d9]">
            {scoreResult.isDisqualified
              ? isEn ? "Status: DQ (Disqualified)" : "Status: DQ (Batal)"
              : scoreResult.totalScore > 0
              ? isEn ? "Current Net Score" : "Mata Semasa Mendahului"
              : isEn ? "Current Net Score" : "Mata Bersih Semasa"}
          </span>
        </div>
      </div>

      {/* Strike Incrementers */}
      <div className="mt-7">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">
          {isEn ? "1. Add Legal Strikes" : "1. Tambah Serangan Sah"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Punch */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-md p-4 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block rounded-md bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 text-[10px] font-bold text-white/90 font-mono">
                  {isEn ? "1 POINT PER STRIKE" : "1 MATA SETIAP SERANGAN"}
                </span>
                <h5 className="mt-1.5 text-lg font-bold text-white font-[var(--font-athletic)] uppercase">
                  {isEn ? "Punches" : "Pukulan"}
                </h5>
                <p className="text-[11px] text-[#A6A7AD]">
                  {isEn ? "Straight punch, uppercut, knife-hand to vest." : "Tumbukan lurus, bandul, pedang ke sasaran vest."}
                </p>
              </div>
              <div className="text-3xl font-black text-white font-[var(--font-athletic)] px-2">
                {punches}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPunches((p) => Math.max(0, p - 1))}
                disabled={punches === 0}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 disabled:opacity-30 text-white py-2 text-xs font-bold backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                aria-label={isEn ? "Decrease 1 punch" : "Kurangkan 1 pukulan"}
              >
                <Minus size={14} aria-hidden="true" /> −1
              </button>
              <button
                type="button"
                onClick={() => setPunches((p) => p + 1)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white py-2 text-xs font-bold shadow-[0_0_12px_rgba(225,6,0,0.35)] transition-[filter,background-color] cursor-pointer"
                aria-label={isEn ? "Add 1 punch" : "Tambah 1 pukulan"}
              >
                <Plus size={14} aria-hidden="true" /> +1
              </button>
              <button
                type="button"
                onClick={() => setPunches((p) => p + 5)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-[#e0e0e4] px-2.5 py-2 text-xs font-bold backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                aria-label={isEn ? "Add 5 punches" : "Tambah 5 pukulan"}
              >
                +5
              </button>
            </div>
          </div>

          {/* Kick */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-md p-4 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block rounded-md bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 text-[10px] font-bold text-white/90 font-mono">
                  {isEn ? "2 POINTS PER STRIKE" : "2 MATA SETIAP SERANGAN"}
                </span>
                <h5 className="mt-1.5 text-lg font-bold text-white font-[var(--font-athletic)] uppercase">
                  {isEn ? "Kicks" : "Tendangan"}
                </h5>
                <p className="text-[11px] text-[#A6A7AD]">
                  {isEn ? "Front kick, roundhouse, side, spinning back to vest." : "Tendangan lurus, sabit, T, belakang ke vest."}
                </p>
              </div>
              <div className="text-3xl font-black text-white font-[var(--font-athletic)] px-2">
                {kicks}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setKicks((k) => Math.max(0, k - 1))}
                disabled={kicks === 0}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 disabled:opacity-30 text-white py-2 text-xs font-bold backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                aria-label={isEn ? "Decrease 1 kick" : "Kurangkan 1 tendangan"}
              >
                <Minus size={14} aria-hidden="true" /> −1
              </button>
              <button
                type="button"
                onClick={() => setKicks((k) => k + 1)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white py-2 text-xs font-bold shadow-[0_0_12px_rgba(225,6,0,0.35)] transition-[filter,background-color] cursor-pointer"
                aria-label={isEn ? "Add 1 kick" : "Tambah 1 tendangan"}
              >
                <Plus size={14} aria-hidden="true" /> +1
              </button>
              <button
                type="button"
                onClick={() => setKicks((k) => k + 5)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-[#e0e0e4] px-2.5 py-2 text-xs font-bold backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                aria-label={isEn ? "Add 5 kicks" : "Tambah 5 tendangan"}
              >
                +5
              </button>
            </div>
          </div>

          {/* Takedown */}
          <div className="rounded-xl border border-[rgba(255,56,69,0.25)] bg-[rgba(255,56,69,0.04)] hover:bg-[rgba(255,56,69,0.07)] hover:border-[rgba(255,56,69,0.45)] backdrop-blur-md p-4 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block rounded-md bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.3)] px-2 py-0.5 text-[10px] font-bold text-[#ff4d5a] font-mono">
                  {isEn ? "3 POINTS (5S LIMIT)" : "3 MATA (HAD 5 SAAT)"}
                </span>
                <h5 className="mt-1.5 text-lg font-bold text-white font-[var(--font-athletic)] uppercase">
                  {isEn ? "Takedowns & Throws" : "Jatuhan / Bantingan"}
                </h5>
                <p className="text-[11px] text-[#A6A7AD]">
                  {isEn ? "Sweeps, scissors, legal 5-second catches." : "Sapuan, guntingan, tangkapan sah 5 saat."}
                </p>
              </div>
              <div className="text-3xl font-black text-[#ff4d5a] font-[var(--font-athletic)] px-2">
                {takedowns}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTakedowns((t) => Math.max(0, t - 1))}
                disabled={takedowns === 0}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 disabled:opacity-30 text-white py-2 text-xs font-bold backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                aria-label={isEn ? "Decrease 1 takedown" : "Kurangkan 1 jatuhan"}
              >
                <Minus size={14} aria-hidden="true" /> −1
              </button>
              <button
                type="button"
                onClick={() => setTakedowns((t) => t + 1)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#e10600] border border-[#ff3845] hover:brightness-110 text-white py-2 text-xs font-bold shadow-[0_0_12px_rgba(225,6,0,0.35)] transition-[filter,background-color] cursor-pointer"
                aria-label={isEn ? "Add 1 takedown" : "Tambah 1 jatuhan"}
              >
                <Plus size={14} aria-hidden="true" /> +1
              </button>
              <button
                type="button"
                onClick={() => setTakedowns((t) => t + 5)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-[#e0e0e4] px-2.5 py-2 text-xs font-bold backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                aria-label={isEn ? "Add 5 takedowns" : "Tambah 5 jatuhan"}
              >
                +5
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Second Grapple Takedown Timer Simulator (Frosted Glass) */}
      <div className="mt-7 rounded-xl border border-[rgba(240,180,40,0.25)] bg-[rgba(240,180,40,0.04)] backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ffd24c]">
              <Clock size={15} aria-hidden="true" />
              {isEn ? "5-Second Grapple Takedown Simulator" : "Simulator Had Masa Tangkapan 5 Saat"}
            </div>
            <p className="mt-1 text-xs text-[#C5C6CA] max-w-lg leading-relaxed">
              {isEn
                ? "Under PERSILAT 2026 rules, upon catching an opponent's limb, the athlete must complete a takedown within 5.0 seconds before the referee halts action with 'TI'."
                : "Dalam peraturan PERSILAT 2026, selepas menangkap anggota badan lawan, pesilat mesti menyelesaikan jatuhan dalam tempoh 5 saat sebelum wasit mengarahkan \"TI\"."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[10px] text-[#A6A7AD] uppercase font-bold tracking-wider">
                {isEn ? "Time Remaining" : "Baki Masa"}
              </span>
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-[var(--font-athletic)] tabular-nums ${
                  grappleTimeMs === 0 ? "text-[#ff4d5a]" : grappleTimeMs < 2000 ? "text-[#ffd24c]" : "text-white"
                }`}
              >
                {(grappleTimeMs / 1000).toFixed(1)}s
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden border border-white/10 backdrop-blur-sm">
          <div
            className={`h-full transition-[width,background-color] duration-75 ${
              grappleTimeMs === 0 ? "bg-[#ff4d5a]" : grappleTimeMs < 2000 ? "bg-[#ffd24c]" : "bg-[rgba(60,160,255,0.85)]"
            }`}
            style={{ width: `${(grappleTimeMs / 5000) * 100}%` }}
          />
        </div>

        {/* Interactive Controls & Feedback */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!isGrappling && grappleStatus !== "active" ? (
            <button
              type="button"
              onClick={handleStartGrapple}
              className="inline-flex items-center gap-2 rounded-xl bg-[rgba(60,160,255,0.2)] border border-[rgba(60,160,255,0.45)] hover:bg-[rgba(60,160,255,0.3)] text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer shadow-[0_0_16px_rgba(60,160,255,0.25)]"
            >
              <Clock size={14} aria-hidden="true" />
              {isEn ? "Catch Opponent (Start 5s)" : "Mula Tangkapan (5 Saat)"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteTakedownInTime}
              disabled={!isGrappling || grappleTimeMs <= 0}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/80 border border-emerald-500/50 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer shadow-[0_0_16px_rgba(16,185,129,0.3)] animate-pulse"
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              {isEn ? "Complete Legal Takedown (+3 Points)" : "Sempurnakan Jatuhan Sah (+3 Mata)"}
            </button>
          )}

          {(grappleStatus === "active" || grappleStatus === "expired" || grappleStatus === "success") && (
            <button
              type="button"
              onClick={handleResetGrapple}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-white px-3 py-2 text-xs font-semibold backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors cursor-pointer"
            >
              <RotateCcw size={13} aria-hidden="true" />
              {isEn ? "Reset" : "Semula"}
            </button>
          )}

          {/* Feedback messages */}
          {grappleStatus === "success" && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium bg-emerald-500/12 border border-emerald-500/35 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={14} aria-hidden="true" />
              {isEn
                ? `Legal takedown completed in ${lastSuccessTime}s! +3 points added to scoreboard.`
                : `Jatuhan sah selesai dalam ${lastSuccessTime}s! +3 mata dimasukkan ke papan skor.`}
            </div>
          )}

          {grappleStatus === "expired" && (
            <div className="flex items-center gap-1.5 text-xs text-[#ffccd0] font-medium bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] px-3 py-1.5 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(225,6,0,0.15)]">
              <AlertTriangle size={14} aria-hidden="true" />
              {isEn
                ? '"TI! (Break!)" — 5.0-second limit expired. Takedown voided, 0 points awarded.'
                : '"TI! (Henti)" — Had masa 5 saat tamat. Jatuhan terbatal, 0 mata diberikan.'}
            </div>
          )}
        </div>
      </div>

      {/* Penalties Ladder (Frosted Glass Matrix) */}
      <div className="mt-7">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">
            {isEn ? "2. Referee Penalty & Deduction Ladder" : "2. Tangga Hukuman & Potongan Wasit"}
          </h4>
          <span className="text-[11px] text-[#A6A7AD]">
            {isEn ? "Click to toggle penalties" : "Klik untuk aktif / nyahaktif hukuman"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {penaltyOptions.map((item) => {
            const isSelected = activePenalties.includes(item.id);
            const isDQ = isDisqualifyingPenalty(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => togglePenalty(item.id)}
                className={`relative rounded-xl p-3 text-left transition-[border-color,background-color,box-shadow,color] border backdrop-blur-md cursor-pointer ${
                  isSelected
                    ? isDQ
                      ? "border-[rgba(255,56,69,0.5)] bg-[rgba(255,56,69,0.18)] text-white shadow-[0_0_20px_rgba(225,6,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-[rgba(255,56,69,0.6)]"
                      : "border-[rgba(240,180,40,0.4)] bg-[rgba(240,180,40,0.14)] text-white shadow-[0_0_15px_rgba(240,180,40,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-[rgba(240,180,40,0.4)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] text-[#b0b1b8] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                  {isSelected && (
                    <span
                      className={`w-2 h-2 rounded-full ${isDQ ? "bg-[#ff4d5a] shadow-[0_0_8px_#ff4d5a]" : "bg-[#ffd24c] shadow-[0_0_8px_#ffd24c]"}`}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div
                  className={`mt-2 text-lg font-bold font-[var(--font-athletic)] ${
                    isSelected ? (isDQ ? "text-[#ff4d5a]" : "text-[#ffd24c]") : "text-white/70"
                  }`}
                >
                  {item.deduction}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] text-[#A6A7AD] leading-relaxed">
          {isEn
            ? "* Note: Reprimand I (−1) and Reprimand II (−2) are issued for minor fouls. Warning I (−5) and Warning II (−10) are applied for tactical/moderate fouls. Warning III or Direct DQ results in immediate bout forfeiture."
            : "* Catatan: Hukuman Teguran I (−1) dan Teguran II (−2) dikenakan untuk pelanggaran ringan. Peringatan I (−5) dan Peringatan II (−10) dikenakan untuk pelanggaran taktikal/sederhana. Peringatan III atau Direct DQ menyebabkan penyingkiran serta-merta."}
        </p>
      </div>
    </div>
  );
}
