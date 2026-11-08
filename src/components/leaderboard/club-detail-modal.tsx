"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Users,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
} from "lucide-react";
import type { ClubRanking, Athlete } from "./types";
import { ALL_REGISTERED_ATHLETES } from "./data";

interface ClubDetailModalProps {
  club: ClubRanking | null;
  onClose: () => void;
  onSelectAthlete: (athlete: Athlete) => void;
}

export function ClubDetailModal({ club, onClose, onSelectAthlete }: ClubDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!club) return null;

  const clubAthletes = ALL_REGISTERED_ATHLETES.filter(
    (ath) => ath.clubId === club.id || ath.clubName.toLowerCase() === club.name.toLowerCase()
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="club-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl my-auto rounded-2xl border border-white/10 bg-[#0E0F14]/95 backdrop-blur-xl p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup perincian kelab"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[#B0B2BC] hover:text-white hover:bg-[#FF3845] hover:border-[#FF3845] transition-all flex items-center justify-center z-20"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 pb-6 border-b border-white/10">
          {/* Club Logo */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shrink-0">
            <Image
              src={club.logoUrl}
              alt={club.name}
              width={76}
              height={76}
              className="object-contain max-h-full"
            />
            <div className="absolute -top-2 -left-2 w-7 h-7 rounded-lg bg-[#FF3845] font-athletic font-bold text-sm text-white flex items-center justify-center shadow-md">
              #{club.rank}
            </div>
          </div>

          {/* Club Info */}
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-athletic ${
                  club.tier === "EMAS"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : club.tier === "PERAK"
                    ? "bg-slate-300/20 text-slate-200 border border-slate-300/40"
                    : "bg-amber-800/20 text-amber-400 border border-amber-800/40"
                }`}
              >
                ZON {club.tier} · TIER {club.tier === "EMAS" ? "1 (ELIT)" : club.tier === "PERAK" ? "2 (PRESTASI)" : "3 (MEMBANGUN)"}
              </span>

              {club.trend === "UP" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-0.5">
                  <TrendingUp size={12} /> Naik +{club.trendValue}
                </span>
              )}
              {club.trend === "DOWN" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 flex items-center gap-0.5">
                  <TrendingDown size={12} /> Turun {club.trendValue}
                </span>
              )}
              {club.trend === "SAME" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 bg-slate-500/10 border border-slate-500/30 flex items-center gap-0.5">
                  <Minus size={12} /> Kekal
                </span>
              )}
            </div>

            <h2
              id="club-modal-title"
              className="text-2xl sm:text-3xl font-bold font-athletic uppercase text-white tracking-wide leading-tight truncate"
            >
              {club.name}
            </h2>

            <p className="text-xs sm:text-sm text-[#FF555C] font-semibold mt-0.5">
              {club.association} · Kod: {club.shortCode}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#A2A3AA] mt-2">
              <span className="flex items-center gap-1 text-white font-medium">
                <MapPin size={12} className="text-[#FF3845]" />
                {club.state}
              </span>
              <span>·</span>
              <span>Ketua Jurulatih: <strong className="text-[#E5E5E7]">{club.leadCoach}</strong></span>
              <span>·</span>
              <span>Ditubuhkan: <strong className="text-[#E5E5E7]">{club.establishedYear}</strong></span>
            </div>
          </div>
        </div>

        {/* Club Cumulative Performance Stats */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#868892] tracking-wider block">
                Jumlah Mata Terkumpul Kelab
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-bold font-athletic text-[#FF3845] tracking-wide">
                  {club.totalVerifiedPoints.toLocaleString()}
                </span>
                <span className="text-xs text-[#868892] font-semibold">PTS KEBANGSAAN</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] text-[#868892] block">Kadar Penglibatan</span>
                <strong className="text-emerald-400 font-mono text-sm">{club.weeklyParticipationRate}%</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] text-[#868892] block">Atlet Berdaftar</span>
                <strong className="text-white font-mono text-sm">{club.activeAthletes} Orang</strong>
              </div>
            </div>
          </div>

          {/* Medals Tally & Training Base */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">🥇 Pingat Emas</span>
              <div className="text-2xl font-bold font-athletic text-white mt-0.5">{club.medals.gold}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 font-bold uppercase block">🥈 Pingat Perak</span>
              <div className="text-2xl font-bold font-athletic text-white mt-0.5">{club.medals.silver}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-[10px] text-amber-600 font-bold uppercase block">🥉 Pingat Gangsa</span>
              <div className="text-2xl font-bold font-athletic text-white mt-0.5">{club.medals.bronze}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-[10px] text-sky-400 font-bold uppercase block">Total Pingat</span>
              <div className="text-2xl font-bold font-athletic text-white mt-0.5">
                {club.medals.gold + club.medals.silver + club.medals.bronze}
              </div>
            </div>
          </div>
        </div>

        {/* Center & Star Exponent */}
        <div className="mt-5 p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#868892]">Pusat / Gelanggang Latihan:</span>
            <strong className="text-white text-right">{club.trainingCenter}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#868892]">Sorotan Atlet Bintang:</span>
            <strong className="text-[#FF555C] text-right font-semibold">{club.highlightAthlete}</strong>
          </div>
        </div>

        {/* Top Athletes Representing this club */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold font-athletic uppercase text-white tracking-wide flex items-center gap-2">
              <Users size={16} className="text-[#FF3845]" />
              Wakil Atlet di Carta Kebangsaan ({clubAthletes.length})
            </h3>
            <span className="text-[10px] text-[#7A7C85]">Klik atlet untuk melihat kad penuh</span>
          </div>

          {clubAthletes.length > 0 ? (
            <div className="space-y-2">
              {clubAthletes.map((ath) => (
                <div
                  key={ath.id}
                  onClick={() => {
                    onClose();
                    onSelectAthlete(ath);
                  }}
                  className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 hover:border-[#FF3845]/50 hover:bg-white/[0.05] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FF3845]/20 font-athletic font-bold text-white flex items-center justify-center shrink-0">
                      #{ath.rank}
                    </div>
                    <div>
                      <strong className="text-sm font-bold text-white block leading-tight">
                        {ath.fullName}
                      </strong>
                      <span className="text-[11px] text-[#868892]">
                        {ath.discipline === "TANDING" ? "Silat Olahraga" : "Silat Seni"} · {ath.weightClassOrCategory}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-athletic font-bold text-base text-[#FF3845] block">
                      {ath.points.totalVerifiedPoints.toLocaleString()} PTS
                    </span>
                    <span className="text-[9px] text-emerald-400">Kehadiran {ath.attendanceRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-[#868892]">
              Kelab ini mempunyai atlet aktif dalam divisyen kelab dan daerah yang sedang mengumpul mata kelayakan kebangsaan.
            </div>
          )}
        </div>

        {/* Safe Sport & Verification Certification */}
        <div className="mt-6 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3 text-xs text-[#9DA0AA]">
          <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
          <div>
            <strong className="text-white block font-semibold">Pengiktirafan Kelab Bersekutu FighterX</strong>
            <p className="text-[11px] text-[#7E808A] mt-0.5">
              Kelab ini disahkan aktif, mematuhi Garis Panduan Sukan Selamat (Safe Sport Code), dan berdaftar di bawah badan perguruan rasmi.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#E10600] text-white hover:bg-[#FF3845] transition-colors shadow-[0_4px_16px_rgba(225,6,0,0.35)]"
          >
            Tutup Perincian Kelab
          </button>
        </div>
      </div>
    </div>
  );
}
