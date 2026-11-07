"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Trophy,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { CoachCard } from "@/components/coach/ui/coach-card";
import { CoachBadge } from "@/components/coach/ui/coach-badge";

export function CoachProfileView() {
  const { coach, athletes } = useCoachState();

  const consistencyBadgeVariant = (tier: string) => {
    switch (tier) {
      case "KONSISTEN":
        return "green";
      case "SEDERHANA":
        return "yellow";
      case "PERLU_PERHATIAN":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back to More */}
      <Link
        href="/coach/more"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Pusat Kawalan Jurulatih</span>
      </Link>

      {/* Main Profile Header Banner */}
      <CoachCard glow className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-[#ff3845] bg-[#121316] flex-shrink-0 shadow-[0_0_20px_rgba(225,6,0,0.3)]">
              <Image
                src={coach.avatarUrl}
                alt={coach.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {coach.name}
                </h1>
                <CoachBadge variant="red" size="md">
                  {coach.discipline}
                </CoachBadge>
              </div>

              <p className="mt-1 text-sm font-semibold text-[#c5c6ca]">{coach.title}</p>
              <p className="text-xs text-[#96989f] mt-0.5">{coach.club}</p>

              <div className="mt-3 flex items-center gap-4 text-xs text-[#c5c6ca] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#ff555a]" />
                  {coach.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-[#ff555a]" />
                  {coach.email}
                </span>
                <span className="flex items-center gap-1.5 text-[#fbbf24]">
                  <Trophy size={13} />
                  {coach.experienceYears || 12} Tahun Pengalaman
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex sm:flex-col items-center justify-around sm:justify-center gap-2 bg-[#121316] p-4 rounded-xl border border-[#45464b]/60 min-w-[140px] text-center">
            <span className="text-[10px] uppercase font-bold text-[#96989f] tracking-wider">
              Atlet Bimbingan
            </span>
            <span className="text-3xl font-black text-white">
              {athletes.length}
            </span>
            <span className="text-[10px] text-[#4ade80] font-semibold">
              Aktif Bimbingan
            </span>
          </div>
        </div>
      </CoachCard>

      {/* Certifications & Specialties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Certifications Card */}
        <CoachCard className="p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#22c55e]" />
            Pensijilan &amp; Kelayakan Rasmi
          </h3>

          <div className="space-y-3">
            {coach.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#121316] border border-[#45464b]/40 text-xs"
              >
                <CheckCircle2 size={16} className="text-[#4ade80] flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </CoachCard>

        {/* Coaching Philosophy & Focus */}
        <CoachCard className="p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Award size={18} className="text-[#ff3845]" />
            Falsafah &amp; Pengkhususan Kejurulatihan
          </h3>

          <div className="space-y-3 text-xs text-[#c5c6ca] leading-relaxed">
            <div className="p-3 rounded-lg bg-[#121316] border border-[#45464b]/40">
              <span className="font-bold text-white block mb-1">
                Taktikal Silat Olahraga Moden
              </span>
              Fokus kepada kelajuan serangan sabit, ketepatan sasaran pelindung dada, dan teknik bantingan jatuhan bersih tanpa pelanggaran mata.
            </div>

            <div className="p-3 rounded-lg bg-[#121316] border border-[#45464b]/40">
              <span className="font-bold text-white block mb-1">
                Kondisi &amp; Pemotongan Berat Badan Saintifik
              </span>
              Pendekatan berperingkat fasa pemakanan dan kardio untuk mengekalkan kuasa maksimum dalam had berat kategori tanding.
            </div>

            <div className="p-3 rounded-lg bg-[#121316] border border-[#45464b]/40">
              <span className="font-bold text-white block mb-1">
                Disiplin Mental &amp; Adab Pendekar
              </span>
              Penerapan nilai jati diri seni silat Melayu seiring prestasi sukan kompetitif di peringkat kebangsaan.
            </div>
          </div>
        </CoachCard>
      </div>

      {/* Assigned Athletes Roster */}
      <CoachCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              Senarai Atlet di Bawah Bimbingan ({athletes.length})
            </h3>
            <p className="text-xs text-[#96989f]">
              Klik pada mana-mana atlet untuk meneliti garis masa latihan, verifikasi dan rekod rubrik mereka.
            </p>
          </div>
          <Link href="/coach/athletes">
            <span className="text-xs font-semibold text-[#ff555a] hover:underline flex items-center gap-1">
              Direktori Penuh <ChevronRight size={13} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {athletes.map((ath) => (
            <Link
              key={ath.id}
              href={`/coach/athletes/${ath.id}`}
              className="p-3 rounded-lg bg-[#121316] border border-[#45464b]/50 hover:border-[#ff3845]/50 transition-all block group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#ff3845] transition-colors truncate">
                  {ath.name}
                </span>
                <CoachBadge variant={consistencyBadgeVariant(ath.consistencyTier)} size="sm">
                  {ath.consistencyTier === "KONSISTEN" ? "Konsisten" : ath.consistencyTier === "SEDERHANA" ? "Sederhana" : "Perhatian"}
                </CoachBadge>
              </div>

              <div className="text-[11px] text-[#96989f]">
                {ath.discipline} • {ath.weightClass}
              </div>

              <div className="mt-2 pt-2 border-t border-[#45464b]/30 flex items-center justify-between text-[10px] text-[#c5c6ca]">
                <span>Kesiagaan: {ath.readinessScore ?? 80}%</span>
                <span>Streak: {ath.currentStreakWeeks} mggu</span>
              </div>
            </Link>
          ))}
        </div>
      </CoachCard>
    </div>
  );
}
