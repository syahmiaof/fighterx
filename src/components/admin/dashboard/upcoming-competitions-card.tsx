"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useAdminState } from "@/lib/admin/store";
import { AdminBadge } from "@/components/admin/ui/admin-badge";

export function UpcomingCompetitionsCard() {
  const { competitions } = useAdminState();

  // Get primary upcoming competition
  const nextComp = competitions[0] || {
    id: "comp-1",
    title: "Kejuaraan Silat SUKMA 2027",
    classification: "Major",
    levelBadge: "Kategori A",
    dates: "14 - 20 Ogos 2027",
    location: "Kompleks Sukan Negeri Terengganu, Gong Badak",
    organizer: "MSN & PESAKA Malaysia",
    status: "Open",
    readinessReview: [],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Upcoming Training Schedule Card (Jadual Latihan Akan Datang) */}
      <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E10600]/20 text-[#FF555A]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Jadual Latihan Akan Datang
              </h3>
              <p className="text-xs text-[#96989F]">Sesi latihan induk kebangsaan</p>
            </div>
          </div>

          <Link
            href="/admin/schedules"
            className="text-xs font-bold text-[#FF555A] hover:text-[#FF3845] flex items-center gap-1 transition-colors group"
          >
            Lihat Kalendar
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Schedule Preview Box matching mockup */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 p-4 rounded-xl bg-[#202126] border border-[#27272A]">
          {/* Big Date Box */}
          <div className="w-full sm:w-24 bg-gradient-to-b from-[#E10600] to-[#990400] text-white rounded-lg p-3 text-center flex flex-col justify-center items-center shadow-lg flex-shrink-0">
            <span className="text-xs uppercase font-bold tracking-wider opacity-90">
              Rabu
            </span>
            <span className="text-3xl font-black font-mono leading-none my-1">
              12
            </span>
            <span className="text-xs font-semibold opacity-90">Mac 2027</span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AdminBadge variant="accent" size="sm">
                  Latihan Rutin Atlet
                </AdminBadge>
                <span className="text-xs text-[#96989F]">Blok 1 Fasa 1</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate">
                Latihan Kondisi Fizikal & Pemantapan Jurus
              </h4>
            </div>

            <div className="space-y-1.5 text-xs text-[#C5C6CA] mt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF3845] flex-shrink-0" />
                <span>9:00 malam – 11:00 malam (2 Jam)</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#FF3845] flex-shrink-0" />
                <span className="truncate">Dewan Silat TVETMARA Besut</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#96989F]">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                Semua Atlet (Seni & Olahraga)
              </span>
              <span className="text-[#4ADE80] font-semibold">Kehadiran Wajib</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Upcoming Competition Preview Card */}
      <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#F59E0B]/20 text-[#FBBF24]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Pertandingan Silat Terdekat
              </h3>
              <p className="text-xs text-[#96989F]">
                Status kesediaan kontinjen & jadual kejohanan
              </p>
            </div>
          </div>

          <Link
            href="/admin/competitions"
            className="text-xs font-bold text-[#FF555A] hover:text-[#FF3845] flex items-center gap-1 transition-colors group"
          >
            Semua Acara
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Competition Details Box */}
        <div className="p-4 rounded-xl bg-[#202126] border border-[#27272A] flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <AdminBadge variant="danger" size="sm">
                  {nextComp.levelBadge || "Kategori A"}
                </AdminBadge>
                <span className="text-xs font-semibold text-[#FBBF24]">
                  {nextComp.classification}
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#4ADE80] border border-[#22C55E]/30 font-bold">
                {nextComp.status === "Open" ? "Pendaftaran Dibuka" : nextComp.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-2 leading-tight">
              {nextComp.title}
            </h4>

            <div className="space-y-1.5 text-xs text-[#C5C6CA]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#FF3845] flex-shrink-0" />
                <span>{nextComp.dates}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#FF3845] flex-shrink-0" />
                <span className="truncate">{nextComp.location}</span>
              </div>
            </div>
          </div>

          {/* Readiness Summary Note */}
          <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#C5C6CA]">
              <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
              <span>
                Atlet Dicalonkan: <strong>{nextComp.readinessReview.length} Orang</strong>
              </span>
            </div>

            <Link
              href="/admin/competitions"
              className="text-xs font-bold text-[#FF555A] hover:underline"
            >
              Semak Kesediaan →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
