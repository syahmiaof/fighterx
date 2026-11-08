"use client";

import { useEffect } from "react";
import {
  X,
  Award,
  Trophy,
  Flame,
  Zap,
  CalendarCheck,
  Sunrise,
  Shield,
  Sparkles,
  Swords,
  Users,
  CheckCircle2,
} from "lucide-react";
import type { BadgeItem, Athlete } from "./types";
import { ALL_REGISTERED_ATHLETES } from "./data";

interface BadgeDetailModalProps {
  badge: BadgeItem | null;
  onClose: () => void;
  onSelectAthlete: (athlete: Athlete) => void;
}

export function BadgeDetailModal({ badge, onClose, onSelectAthlete }: BadgeDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!badge) return null;

  const athletesWithBadge = ALL_REGISTERED_ATHLETES.filter((ath) =>
    ath.badges.includes(badge.slug)
  );

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "CalendarCheck":
        return <CalendarCheck size={26} />;
      case "Sunrise":
        return <Sunrise size={26} />;
      case "Trophy":
        return <Trophy size={26} />;
      case "Shield":
        return <Shield size={26} />;
      case "Flame":
        return <Flame size={26} />;
      case "Zap":
        return <Zap size={26} />;
      case "Sparkles":
        return <Sparkles size={26} />;
      case "Swords":
        return <Swords size={26} />;
      default:
        return <Award size={26} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl my-auto rounded-2xl border border-white/10 bg-[#0E0F14]/95 backdrop-blur-xl p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup perincian lencana"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[#B0B2BC] hover:text-white hover:bg-[#FF3845] hover:border-[#FF3845] transition-all flex items-center justify-center z-20"
        >
          <X size={18} />
        </button>

        {/* Badge Header Banner */}
        <div className="flex items-start gap-4 pb-6 border-b border-white/10">
          <div
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg ${
              badge.tier === "LEGENDA"
                ? "bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                : badge.tier === "EMAS"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : "bg-slate-400/20 border-slate-400/50 text-slate-200"
            }`}
          >
            {getBadgeIcon(badge.iconName)}
          </div>

          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  badge.tier === "LEGENDA"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : badge.tier === "EMAS"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-400/20 text-slate-300 border border-slate-400/40"
                }`}
              >
                {badge.tier} · {badge.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-athletic bg-[#FF3845] text-white">
                +{badge.pointsBonus} PTS BONUS
              </span>
            </div>

            <h2
              id="badge-modal-title"
              className="text-2xl sm:text-3xl font-bold font-athletic uppercase text-white tracking-wide leading-tight truncate"
            >
              {badge.title}
            </h2>

            <p className="text-xs text-[#A2A3AA] mt-1.5 leading-relaxed">
              {badge.description}
            </p>
          </div>
        </div>

        {/* Criteria & How to Earn */}
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <span className="text-xs font-bold font-athletic uppercase text-[#FF555C] tracking-wide block mb-1">
              Syarat Kriteria Pembukaan:
            </span>
            <p className="text-xs text-[#E5E5E7] leading-relaxed">
              {badge.criteria}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <span className="text-xs font-bold font-athletic uppercase text-white tracking-wide flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Langkah Demi Langkah: Cara Membuka Lencana Ini
            </span>
            <p className="text-xs text-[#C5C6CA] leading-relaxed">
              {badge.howToEarn}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between text-xs text-[#8A8C95]">
            <span>Statistik Pengiktirafan Kebangsaan:</span>
            <strong className="text-white font-mono">{badge.unlockedCount} atlet telah membuka</strong>
          </div>
        </div>

        {/* Top Athletes with this badge */}
        <div className="mt-6">
          <h3 className="text-sm font-bold font-athletic uppercase text-white tracking-wide mb-3 flex items-center gap-2">
            <Users size={15} className="text-[#FF3845]" />
            Pesilat Berdaftar Yang Memiliki Lencana Ini ({athletesWithBadge.length})
          </h3>

          {athletesWithBadge.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {athletesWithBadge.map((ath) => (
                <div
                  key={ath.id}
                  onClick={() => {
                    onClose();
                    onSelectAthlete(ath);
                  }}
                  className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3 hover:border-[#FF3845]/50 hover:bg-white/[0.05] cursor-pointer transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FF3845]/20 font-athletic font-bold text-xs text-white flex items-center justify-center shrink-0">
                    #{ath.rank}
                  </div>
                  <div className="min-w-0">
                    <strong className="text-xs font-bold text-white block truncate">
                      {ath.fullName}
                    </strong>
                    <span className="text-[10px] text-[#868892] block truncate">
                      {ath.clubName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A7C85] italic">
              Lencana berprestij tinggi ini sedang dalam sasaran para pesilat minggu ini.
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FF3845] text-white hover:bg-[#FF3845]/90 transition-colors shadow-[0_4px_16px_rgba(255,56,69,0.35)]"
          >
            Tutup Perincian Lencana
          </button>
        </div>
      </div>
    </div>
  );
}
