"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Scale,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { Competition, CompetitionCategory, CompetitionStatus } from "@/lib/coach/types";
import { CoachCard } from "@/components/coach/ui/coach-card";
import { CoachBadge } from "@/components/coach/ui/coach-badge";
import { RosterSelectionTable } from "@/components/coach/competitions/roster-selection-table";

interface CompetitionDetailViewProps {
  competition: Competition;
}

export function CompetitionDetailView({ competition }: CompetitionDetailViewProps) {
  const selectedAthletes = useMemo(
    () => competition.roster.filter((r) => r.isSelected),
    [competition.roster]
  );

  const weightOkCount = useMemo(
    () => competition.roster.filter((r) => r.weightStatus === "Ok").length,
    [competition.roster]
  );

  const avgReadinessSelected = useMemo(() => {
    if (selectedAthletes.length === 0) return 0;
    const sum = selectedAthletes.reduce((acc, curr) => acc + curr.readinessScore, 0);
    return Math.round(sum / selectedAthletes.length);
  }, [selectedAthletes]);

  const categoryBadgeVariant = (cat: CompetitionCategory) => {
    switch (cat) {
      case "Major":
        return "red";
      case "Development":
        return "yellow";
      case "Exposure":
        return "blue";
    }
  };

  const statusBadgeVariant = (status: CompetitionStatus) => {
    switch (status) {
      case "Pendaftaran Dibuka":
        return "blue";
      case "Persiapan":
        return "yellow";
      case "Selesai":
        return "green";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/coach/competitions"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#96989f] hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Kalendar Pertandingan</span>
      </Link>

      {/* Main Banner */}
      <CoachCard glow className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl bg-[#e10600]/20 border border-[#e10600]/50 flex items-center justify-center text-[#ff555a] flex-shrink-0">
              <Trophy size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {competition.title}
                </h1>
                <CoachBadge variant={categoryBadgeVariant(competition.category)} size="md">
                  {competition.category}
                </CoachBadge>
                <CoachBadge variant={statusBadgeVariant(competition.status)} size="md">
                  {competition.status}
                </CoachBadge>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-[#c5c6ca] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#96989f]" />
                  {competition.dates}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#96989f]" />
                  {competition.location}
                </span>
                {competition.sanctioningBody && (
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#96989f]" />
                    {competition.sanctioningBody}
                  </span>
                )}
                {competition.registrationDeadline && (
                  <span className="flex items-center gap-1.5 text-[#fbbf24]">
                    <Clock size={14} />
                    Tutup Pendaftaran: {competition.registrationDeadline}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CoachCard>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Skuad Terpilih</span>
            <Users size={16} className="text-[#ff555a]" />
          </div>
          <div className="text-2xl font-black text-white">
            {selectedAthletes.length} <span className="text-xs font-normal text-[#96989f]">/ {competition.roster.length}</span>
          </div>
          <span className="text-[10px] text-[#4ade80]">Atlet disahkan bertanding</span>
        </CoachCard>

        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Kesiagaan Terpilih</span>
            <Activity size={16} className="text-[#22c55e]" />
          </div>
          <div className="text-2xl font-black text-white">{avgReadinessSelected}%</div>
          <span className="text-[10px] text-[#4ade80]">Purata skor atlet terpilih</span>
        </CoachCard>

        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Status Timbang Berat</span>
            <Scale size={16} className="text-[#3b82f6]" />
          </div>
          <div className="text-2xl font-black text-white">
            {weightOkCount} <span className="text-xs font-normal text-[#96989f]">/ {competition.roster.length}</span>
          </div>
          <span className="text-[10px] text-[#60a5fa]">Dalam had berat kategori</span>
        </CoachCard>

        <CoachCard className="p-4">
          <div className="flex items-center justify-between text-[#96989f] mb-1">
            <span className="text-xs font-semibold">Had Kuota Skuad</span>
            <CheckCircle2 size={16} className="text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-black text-white">10 <span className="text-xs font-normal text-[#96989f]">Maks</span></div>
          <span className="text-[10px] text-[#fbbf24]">Kategori Seni &amp; Olahraga</span>
        </CoachCard>
      </div>

      {/* Roster Selection Table */}
      <CoachCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Senarai Calon &amp; Pemilihan Skuad Pertandingan
            </h2>
            <p className="text-xs text-[#96989f] mt-0.5">
              Klik &quot;Pilih Skuad&quot; atau &quot;Keluarkan&quot; untuk mengemaskini status penyertaan atlet secara masa nyata.
            </p>
          </div>
        </div>

        <RosterSelectionTable competitionId={competition.id} roster={competition.roster} />
      </CoachCard>
    </div>
  );
}
