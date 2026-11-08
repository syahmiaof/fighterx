"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy, Calendar } from "lucide-react";

interface TopAthletePreview {
  rank: string;
  name: string;
  club: string;
  association: string;
  points: number;
  avatar: string;
}

const topAthletes: TopAthletePreview[] = [
  {
    rank: "01",
    name: "Megat Zulkarnain",
    club: "Gayong Harimau KL",
    association: "PSSGM",
    points: 2850,
    avatar: "/assets/fighterx/hero-silat-olahraga-athlete-lit.png",
  },
  {
    rank: "02",
    name: "Nur Balqis Syazwani",
    club: "Lincah Mahkota Johor",
    association: "PSSLM",
    points: 2790,
    avatar: "/assets/fighterx/hero-silat-seni-athlete-lit.png",
  },
  {
    rank: "03",
    name: "Amirul Haziq",
    club: "Cekak Hanafi Lembah Pantai",
    association: "PSSCM",
    points: 2640,
    avatar: "/assets/fighterx/hero-silat-olahraga-athlete-lit.png",
  },
];

interface TournamentPreview {
  id: string;
  title: string;
  dayRange: string;
  month: string;
  year: string;
  venue: string;
  state: string;
  status: string;
  statusColor: "emerald" | "amber" | "rose";
}

const upcomingTournaments: TournamentPreview[] = [
  {
    id: "sukma-2026",
    title: "Sukan Malaysia (SUKMA) 2026 — Silat",
    dayRange: "14–22",
    month: "OGOS",
    year: "2026",
    venue: "Stadium Tertutup MSN",
    state: "Selangor",
    status: "Pendaftaran Buka",
    statusColor: "emerald",
  },
  {
    id: "sirkit-remaja-keb",
    title: "Sirkit Remaja Kebangsaan Siri 1/2026",
    dayRange: "24–27",
    month: "JUN",
    year: "2026",
    venue: "Komp. Belia & Sukan Panji",
    state: "Kelantan",
    status: "Sedang Berjalan",
    statusColor: "amber",
  },
  {
    id: "terbuka-johor-2026",
    title: "Kejohanan Silat Antarabangsa Johor",
    dayRange: "10–13",
    month: "JUL",
    year: "2026",
    venue: "Arena Larkin",
    state: "Johor",
    status: "Slot Terhad",
    statusColor: "rose",
  },
];

export function LeaderboardCalendarPreview() {
  return (
    <section
      className="relative z-10 pt-12 pb-8 sm:pt-14 sm:pb-10 md:pt-16 md:pb-12 bg-black/25 backdrop-blur-[2px] border-b border-white/[0.08]"
      id="arena-preview"
      aria-label="Papan Kedudukan dan Takwim Kejohanan"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: Top Athletes Leaderboard (Frosted Glass) */}
          <div
            className="rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.08] via-black/40 to-black/75 p-6 sm:p-7 flex flex-col justify-between backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-white/25 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.15)]">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FFB800] block leading-tight font-semibold">
                      PRESTASI MINGGUAN
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-athletic tracking-wide uppercase">
                      Top Atlet Teratas
                    </h3>
                  </div>
                </div>

                <Link
                  href="/leaderboard"
                  className="text-xs font-semibold text-[#C5C6CA] hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-[#FF3845]" />
                </Link>
              </div>

              {/* Athletes List */}
              <div className="space-y-1.5">
                {topAthletes.map((athlete) => (
                  <div
                    key={athlete.rank}
                    className="py-2.5 px-3 rounded-xl flex items-center justify-between border border-transparent hover:border-white/10 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Monospaced Rank */}
                      <span
                        className={`font-mono text-sm font-bold w-6 shrink-0 ${
                          athlete.rank === "01"
                            ? "text-[#FFD700]"
                            : athlete.rank === "02"
                            ? "text-slate-300"
                            : "text-[#C5832B]"
                        }`}
                      >
                        {athlete.rank}
                      </span>

                      {/* Avatar */}
                      <div className="relative w-10 h-10 rounded-full bg-white/[0.06] overflow-hidden border border-white/15 shrink-0 shadow-sm">
                        <Image
                          src={athlete.avatar}
                          alt={athlete.name}
                          fill
                          sizes="40px"
                          className="object-cover object-top"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#FF3845] transition-colors">
                          {athlete.name}
                        </h4>
                        <p className="text-xs text-[#96989F] truncate">
                          {athlete.club} · <span className="text-white/70 font-medium">{athlete.association}</span>
                        </p>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right shrink-0 pl-3">
                      <span className="font-mono font-bold text-sm text-white tabular-nums">
                        {athlete.points.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#8C8E96] font-mono ml-1">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-[#96989F]">
              <span>Kemas kini automatik setiap Ahad 23:59</span>
              <Link href="/leaderboard" className="text-white/80 hover:text-white font-medium inline-flex items-center gap-1 transition-colors">
                <span>Kedudukan Penuh</span>
                <ArrowRight size={12} className="text-[#FF3845]" />
              </Link>
            </div>
          </div>

          {/* Card 2: Tournament Schedule (Frosted Glass) */}
          <div
            className="rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.08] via-black/40 to-black/75 p-6 sm:p-7 flex flex-col justify-between backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-white/25 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-[#FF3845] shadow-[0_0_12px_rgba(225,6,0,0.2)]">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF3845] block leading-tight font-semibold">
                      TAKWIM KEJOHANAN
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-athletic tracking-wide uppercase">
                      Jadual Pertandingan 2026
                    </h3>
                  </div>
                </div>

                <Link
                  href="/competitions"
                  className="text-xs font-semibold text-[#C5C6CA] hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-[#FF3845]" />
                </Link>
              </div>

              {/* Tournament List */}
              <div className="space-y-2">
                {upcomingTournaments.map((tourney) => (
                  <div
                    key={tourney.id}
                    className="py-2.5 px-3 rounded-xl flex items-center justify-between gap-3 border border-transparent hover:border-white/10 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Modern Minimalist Date Block */}
                      <div className="w-12 h-11 shrink-0 rounded-xl bg-white/[0.06] border border-white/15 flex flex-col items-center justify-center group-hover:border-[#FF3845]/50 transition-colors">
                        <span className="font-mono font-bold text-xs text-white leading-none">
                          {tourney.dayRange}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#FF555C] font-semibold mt-0.5 leading-none">
                          {tourney.month}
                        </span>
                      </div>

                      {/* Event Info */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#FF3845] transition-colors">
                          {tourney.title}
                        </h4>
                        <p className="text-xs text-[#96989F] truncate">
                          {tourney.venue}, <span className="text-white/70 font-medium">{tourney.state}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          tourney.statusColor === "emerald"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : tourney.statusColor === "amber"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tourney.statusColor === "emerald"
                              ? "bg-emerald-400"
                              : tourney.statusColor === "amber"
                              ? "bg-amber-400 animate-pulse"
                              : "bg-rose-400"
                          }`}
                        />
                        <span>{tourney.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-[#96989F]">
              <span>Disahkan oleh PESAKA &amp; MSN</span>
              <Link href="/competitions" className="text-white/80 hover:text-white font-medium inline-flex items-center gap-1 transition-colors">
                <span>Semak Takwim Lengkap</span>
                <ArrowRight size={12} className="text-[#FF3845]" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
