"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Trophy,
  Flame,
  CalendarCheck,
  Video,
  Activity,
  Medal,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  MapPin,
  UserCheck,
  FileCheck2,
  Lock,
} from "lucide-react";
import type { Athlete, BadgeItem } from "./types";
import { SILAT_BADGES } from "./data";

interface AthleteDetailModalProps {
  athlete: Athlete | null;
  onClose: () => void;
}

export function AthleteDetailModal({ athlete, onClose }: AthleteDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!athlete) return null;

  const athleteBadges: BadgeItem[] = SILAT_BADGES.filter((b) =>
    athlete.badges.includes(b.slug)
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="athlete-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl my-auto rounded-2xl border border-white/[0.1] bg-[#0c0d12]/80 backdrop-blur-2xl p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.1)] max-h-[90vh] overflow-y-auto text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup perincian atlet"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] text-[#B0B2BC] hover:text-white hover:bg-[#FF3845] hover:border-[#FF3845] transition-all flex items-center justify-center z-20"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 pb-6 border-b border-white/[0.08]">
          {/* Athlete Cutout Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.03] border-2 border-[#FF3845]/40 overflow-hidden shrink-0 shadow-[0_0_20px_rgba(255,56,69,0.25)]">
            <Image
              src={athlete.avatarUrl}
              alt={athlete.fullName}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 80px, 96px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#FF3845] text-[9px] font-bold font-athletic text-white">
              #{athlete.rank}
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-athletic flex items-center gap-1 ${
                  athlete.rank === 1
                    ? "bg-[rgba(240,180,40,0.14)] border border-[rgba(240,180,40,0.45)] text-[#ffd24c] shadow-[0_0_12px_rgba(240,180,40,0.25)]"
                    : athlete.rank === 2
                    ? "bg-white/[0.08] border border-white/[0.22] text-[#e5e5e7]"
                    : athlete.rank === 3
                    ? "bg-[rgba(217,119,6,0.14)] border border-[rgba(217,119,6,0.4)] text-[#f59e0b]"
                    : "bg-white/[0.035] text-[#a5a6ad] border border-white/[0.08]"
                }`}
              >
                <Trophy size={11} /> KEDUDUKAN KEBANGSAAN #{athlete.rank}
              </span>

              {athlete.trend === "UP" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-0.5">
                  <TrendingUp size={12} /> Naik +{athlete.trendValue}
                </span>
              )}
              {athlete.trend === "DOWN" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 flex items-center gap-0.5">
                  <TrendingDown size={12} /> Turun {athlete.trendValue}
                </span>
              )}
              {athlete.trend === "SAME" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 bg-slate-500/10 border border-slate-500/30 flex items-center gap-0.5">
                  <Minus size={12} /> Kekal
                </span>
              )}

              {athlete.under18 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 flex items-center gap-1">
                  <ShieldCheck size={12} /> Bawah 18 (Persetujuan Sah)
                </span>
              )}
            </div>

            <h2
              id="athlete-modal-title"
              className="text-2xl sm:text-3xl font-bold font-athletic uppercase text-white tracking-wide leading-tight truncate"
            >
              {athlete.fullName}
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-[#FF555C] italic mt-0.5">
              &quot;{athlete.alias}&quot;
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#A2A3AA] mt-2">
              <span className="flex items-center gap-1 text-white font-medium">
                <MapPin size={12} className="text-[#FF3845]" />
                {athlete.clubName} ({athlete.association})
              </span>
              <span>·</span>
              <span>Negeri: <strong className="text-[#E5E5E7]">{athlete.state}</strong></span>
              <span>·</span>
              <span>Jurulatih: <strong className="text-[#E5E5E7]">{athlete.leadCoach}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-[#D1D2D8]">
                {athlete.discipline === "TANDING" ? "Silat Olahraga (Tanding)" : "Silat Seni Warisan"}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-[#B5B6BD]">
                {athlete.weightClassOrCategory} · {athlete.ageGroup} ({athlete.age} Tahun)
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[rgba(240,180,40,0.12)] border border-[rgba(240,180,40,0.35)] text-[#ffd24c] flex items-center gap-1">
                <Flame size={12} /> {athlete.streakDays} Hari Streak
              </span>
            </div>
          </div>
        </div>

        {/* Total Score & Primary Pillars */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#868892] tracking-wider block">
                Jumlah Mata Latihan Terverifikasi
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-bold font-athletic text-[#FF3845] tracking-wide">
                  {athlete.points.totalVerifiedPoints.toLocaleString()}
                </span>
                <span className="text-xs text-[#868892] font-semibold">MATA TERKUMPUL (PTS)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <span className="text-[10px] text-[#868892] block">Kadar Kehadiran</span>
                <strong className="text-emerald-400 font-mono text-sm">{athlete.attendanceRate}%</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <span className="text-[10px] text-[#868892] block">Status Pengesahan</span>
                <strong className="text-sky-400 text-xs flex items-center gap-1">
                  <ShieldCheck size={13} /> 100% Sah
                </strong>
              </div>
            </div>
          </div>

          {/* Breakdown 4 Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md">
              <div className="flex items-center justify-between text-[#8E9099] mb-1">
                <span className="text-[10px] uppercase font-bold">Kehadiran</span>
                <CalendarCheck size={13} className="text-[#FF555C]" />
              </div>
              <div className="text-xl font-bold font-athletic text-white">
                {athlete.points.attendancePoints} <small className="text-[10px] text-[#868892]">PTS</small>
              </div>
              <span className="text-[10px] text-[#7A7C85] block mt-0.5">
                {athlete.points.attendanceSessions} Sesi Berjadual
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md">
              <div className="flex items-center justify-between text-[#8E9099] mb-1">
                <span className="text-[10px] uppercase font-bold">Ujian Baseline</span>
                <Activity size={13} className="text-sky-400" />
              </div>
              <div className="text-xl font-bold font-athletic text-white">
                {athlete.points.physicalBaseline.totalBaselineScore} <small className="text-[10px] text-[#868892]">PTS</small>
              </div>
              <span className="text-[10px] text-[#7A7C85] block mt-0.5">
                Larian, Push-Up &amp; Plank
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md">
              <div className="flex items-center justify-between text-[#8E9099] mb-1">
                <span className="text-[10px] uppercase font-bold">Video Drills</span>
                <Video size={13} className="text-[#ffd24c]" />
              </div>
              <div className="text-xl font-bold font-athletic text-white">
                {athlete.points.videoDrillPoints} <small className="text-[10px] text-[#868892]">PTS</small>
              </div>
              <span className="text-[10px] text-[#7A7C85] block mt-0.5">
                {athlete.points.videoDrillsCount} Drill Disemak Jurulatih
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md">
              <div className="flex items-center justify-between text-[#8E9099] mb-1">
                <span className="text-[10px] uppercase font-bold">Kejohanan</span>
                <Medal size={13} className="text-purple-400" />
              </div>
              <div className="text-xl font-bold font-athletic text-white">
                {athlete.points.tournamentMedalPoints} <small className="text-[10px] text-[#868892]">PTS</small>
              </div>
              <span className="text-[10px] text-[#7A7C85] block mt-0.5">
                Podium &amp; Rekod Sirkit
              </span>
            </div>
          </div>
        </div>

        {/* Physical Baseline Telemetry Deep-Dive */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold font-athletic uppercase text-white tracking-wide flex items-center gap-2">
              <Activity size={16} className="text-[#FF3845]" />
              Skor Ujian Kecergasan Fizikal (Standard MSN &amp; FighterX)
            </h3>
            <span className="text-[10px] text-[#7A7C85] font-mono">Disahkan Cap Masa &amp; Sensor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A2A3AA] font-semibold">Larian 6-Minit</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  +{athlete.points.physicalBaseline.runScore} PTS
                </span>
              </div>
              <div className="text-lg font-bold font-athletic text-white mt-1">
                {athlete.points.physicalBaseline.run6MinMeters.toLocaleString()} meter
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500/80 to-teal-400 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (athlete.points.physicalBaseline.run6MinMeters / 1800) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#787A82] block mt-1">
                Est. VO2 Max: ~{(athlete.points.physicalBaseline.run6MinMeters * 0.032).toFixed(1)} ml/kg/min
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A2A3AA] font-semibold">Push-Up (1 Minit)</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  +{athlete.points.physicalBaseline.pushUpScore} PTS
                </span>
              </div>
              <div className="text-lg font-bold font-athletic text-white mt-1">
                {athlete.points.physicalBaseline.pushUps1Min} ulangan
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500/80 to-indigo-400 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (athlete.points.physicalBaseline.pushUps1Min / 70) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#787A82] block mt-1">
                Daya Tahan Kekuatan Bahu &amp; Dada
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A2A3AA] font-semibold">Ujian Plank Teras</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  +{athlete.points.physicalBaseline.plankScore} PTS
                </span>
              </div>
              <div className="text-lg font-bold font-athletic text-white mt-1">
                {Math.floor(athlete.points.physicalBaseline.plankSeconds / 60)}m{" "}
                {athlete.points.physicalBaseline.plankSeconds % 60}s
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500/80 to-rose-400 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (athlete.points.physicalBaseline.plankSeconds / 300) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#787A82] block mt-1">
                Kekuatan Teras Abdomen &amp; Pinggul
              </span>
            </div>
          </div>
        </div>

        {/* Performance Radar Attributes */}
        <div className="mt-6 p-4 rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-xs font-bold font-athletic uppercase text-white tracking-wide block mb-3">
            Atribut Profil Prestasi Atlet (Skala 1 - 100)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Stamina", val: athlete.radarStats.stamina, color: "text-emerald-400" },
              { label: "Kekuatan", val: athlete.radarStats.strength, color: "text-red-400" },
              { label: "Ketangkasan", val: athlete.radarStats.agility, color: "text-[#ffd24c]" },
              { label: "Kelenturan", val: athlete.radarStats.flexibility, color: "text-purple-400" },
              { label: "Pasang Tapak", val: athlete.radarStats.pasangStance, color: "text-sky-400" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-[#868892] block">{stat.label}</span>
                <span className={`text-base font-bold font-athletic ${stat.color} block mt-0.5`}>
                  {stat.val}%
                </span>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#FF3845]"
                    style={{ width: `${stat.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Earned */}
        <div className="mt-6">
          <h3 className="text-base font-bold font-athletic uppercase text-white tracking-wide mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-[#ffd24c]" />
            Lencana Pencapaian Dibuka ({athleteBadges.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {athleteBadges.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a] shrink-0 mt-0.5">
                  <Trophy size={15} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{b.title}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold font-mono bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.25)] text-[#ff4d5a]">
                      +{b.pointsBonus} PTS
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8A8C95] line-clamp-2 mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log / Verification Traceability */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A2A3AA] flex items-center gap-1.5">
              <FileCheck2 size={14} className="text-[#FF3845]" />
              Jejak Audit Aktiviti Terverifikasi Terkini
            </h3>
            <span className="text-[10px] text-[#787A82] flex items-center gap-1">
              <Lock size={10} /> Hash Kriptografi Diuji
            </span>
          </div>

          <div className="space-y-2">
            {athlete.recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-white/[0.06] border border-white/[0.08] text-white">
                      {act.type}
                    </span>
                    <strong className="text-white font-medium text-xs">{act.title}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#7A7C85] mt-1">
                    <span>{act.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#9CA3AF]">
                      <UserCheck size={10} /> Disahkan oleh: {act.verifiedBy}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[9px] font-mono text-[#8A8C95] bg-white/[0.03] px-2 py-1 rounded border border-white/[0.06]">
                    {act.verificationHash}
                  </span>
                  <span className="font-athletic font-bold text-sm text-[#FF3845]">
                    +{act.points} PTS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#E10600] text-white hover:bg-[#FF3845] transition-all shadow-[0_0_20px_rgba(225,6,0,0.35)]"
          >
            Tutup Perincian Atlet
          </button>
        </div>
      </div>
    </div>
  );
}
