"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ChevronRight, AlertCircle } from "lucide-react";
import { ALL_REGISTERED_ATHLETES } from "./data";
import type { Athlete, DisciplineType } from "./types";
import { AthleteDetailModal } from "./athlete-detail-modal";

export function LeaderboardClient() {
  const [athleteSearch, setAthleteSearch] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState<DisciplineType>("ALL");
  const [visibleCount, setVisibleCount] = useState(25);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  // Filtered Athletes
  const filteredAthletes = useMemo(() => {
    return ALL_REGISTERED_ATHLETES.filter((ath) => {
      if (athleteSearch.trim()) {
        const q = athleteSearch.toLowerCase();
        const matches =
          ath.fullName.toLowerCase().includes(q) ||
          ath.clubName.toLowerCase().includes(q) ||
          ath.alias.toLowerCase().includes(q) ||
          ath.state.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (disciplineFilter !== "ALL" && ath.discipline !== disciplineFilter) {
        return false;
      }
      return true;
    });
  }, [athleteSearch, disciplineFilter]);

  const paginatedAthletes = useMemo(() => {
    return filteredAthletes.slice(0, visibleCount);
  }, [filteredAthletes, visibleCount]);

  return (
    <div className="relative min-h-screen text-white pb-24 overflow-hidden">
      <div className="relative z-10">
        {/* Header Hero Banner (Homepage Typography) */}
        <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
            {/* Sub-tajuk kecil atas (Tiru .hero-overline homepage) */}
            <div className="hero-overline mb-3">
              <span />
              — CARTA KEDUDUKAN KEBANGSAAN —
              <span />
            </div>

            {/* Tajuk Utama (Exact Homepage Athletic 3D Typography) */}
            <h1
              className="text-center uppercase select-none"
              style={{
                font: "italic 700 clamp(44px, 6vw, 76px)/0.86 var(--font-athletic)",
                letterSpacing: "-0.012em",
              }}
            >
              <span
                className="block text-white"
                style={{
                  textShadow:
                    "0 2px 0 #aaaab0, 0 5px 0 #66676d, 0 9px 14px rgba(0,0,0,0.7)",
                }}
              >
                LEADERBOARD.
              </span>
              <em
                className="block"
                style={{
                  fontStyle: "italic",
                  color: "#f51c25",
                  textShadow:
                    "0 2px 0 #a10a11, 0 5px 0 #65050a, 0 9px 14px rgba(0,0,0,0.7)",
                  filter: "drop-shadow(0 4px 8px rgba(225,6,0,0.35))",
                }}
              >
                RANKINGS.
              </em>
            </h1>

            {/* Sub-penerangan minimalis */}
            <p className="text-xs sm:text-sm text-[#A8ABB5] max-w-md mx-auto mt-3">
              Kedudukan rasmi atlet silat berdaftar seluruh Malaysia berpandukan mata latihan terverifikasi.
            </p>
          </div>
        </section>

        {/* Minimalist Search & Filter Strip */}
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 mb-6">
          <div className="p-2 sm:p-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8E97]"
              />
              <input
                type="text"
                value={athleteSearch}
                onChange={(e) => {
                  setAthleteSearch(e.target.value);
                  setVisibleCount(25);
                }}
                placeholder="Cari nama, kelab, atau gelaran..."
                className="w-full pl-10 pr-8 py-2 rounded-xl bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-[#71737E] focus:outline-none focus:border-[#FF3845] focus:bg-white/[0.05] focus:shadow-[0_0_16px_rgba(225,6,0,0.2)] transition-all"
              />
              {athleteSearch && (
                <button
                  type="button"
                  onClick={() => setAthleteSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C8E97] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Discipline Filter */}
            <div className="flex items-center gap-1 w-full sm:w-auto bg-white/[0.03] backdrop-blur-[12px] p-1 rounded-xl border border-white/[0.1] text-xs">
              {(["ALL", "TANDING", "SENI"] as DisciplineType[]).map((disp) => (
                <button
                  key={disp}
                  type="button"
                  onClick={() => {
                    setDisciplineFilter(disp);
                    setVisibleCount(25);
                  }}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    disciplineFilter === disp
                      ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_14px_rgba(225,6,0,0.4)]"
                      : "border border-transparent text-[#8C8E97] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {disp === "ALL" ? "Semua" : disp === "TANDING" ? "Silat Olahraga" : "Silat Seni"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Minimalist Ranking List */}
        <section className="max-w-[1100px] mx-auto px-4 sm:px-6">
          {paginatedAthletes.length > 0 ? (
            <div className="space-y-2">
              {paginatedAthletes.map((ath) => (
                <div
                  key={ath.id}
                  onClick={() => setSelectedAthlete(ath)}
                  className="group p-3 sm:p-4 rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#ff3845]/45 hover:bg-white/[0.045] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] flex items-center justify-between gap-3 sm:gap-4 transition-all cursor-pointer"
                >
                  {/* Left: Rank, Avatar, Nama, Kelab, Jenis Kategori, Gelaran */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Rank */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-athletic font-bold text-sm sm:text-base shrink-0 transition-all ${
                        ath.rank === 1
                          ? "bg-[rgba(240,180,40,0.14)] border border-[rgba(240,180,40,0.45)] text-[#ffd24c] shadow-[0_0_12px_rgba(240,180,40,0.25)]"
                          : ath.rank === 2
                          ? "bg-white/[0.08] border border-white/[0.22] text-[#e5e5e7]"
                          : ath.rank === 3
                          ? "bg-[rgba(217,119,6,0.14)] border border-[rgba(217,119,6,0.4)] text-[#f59e0b]"
                          : "bg-white/[0.035] text-[#a5a6ad] border border-white/[0.08]"
                      }`}
                    >
                      #{ath.rank}
                    </div>

                    {/* Avatar */}
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.03] border border-white/[0.08] overflow-hidden shrink-0 shadow-inner">
                      <Image
                        src={ath.avatarUrl}
                        alt={ath.fullName}
                        fill
                        className="object-cover object-top"
                        sizes="44px"
                      />
                    </div>

                    {/* Nama, Gelaran, Kelab, Jenis Kategori */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white truncate leading-tight group-hover:text-[#ff4d5a] transition-colors">
                          {ath.fullName}
                        </h3>
                        <span className="text-xs text-[#ff555c] font-semibold italic shrink-0">
                          &quot;{ath.alias}&quot;
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#9DA0AA] mt-0.5">
                        <span className="text-white font-medium truncate">{ath.clubName}</span>
                        <span>·</span>
                        <span className="text-[#C5C6CA]">
                          {ath.discipline === "TANDING" ? "Silat Olahraga" : "Silat Seni"} ({ath.weightClassOrCategory})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Point */}
                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-bold font-athletic text-[#FF3845] group-hover:text-[#ff4d5a] block leading-none transition-colors">
                      {ath.points.totalVerifiedPoints.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#8C8E97] font-semibold uppercase tracking-wider">
                      PTS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] text-center shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <AlertCircle size={28} className="text-[#8C8E97] mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Tiada pesilat dijumpai.</p>
              <button
                type="button"
                onClick={() => {
                  setAthleteSearch("");
                  setDisciplineFilter("ALL");
                }}
                className="mt-3 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs font-bold text-white hover:bg-[#FF3845] hover:border-[#FF3845] transition-all"
              >
                Set Semula
              </button>
            </div>
          )}

          {/* Load More Pagination for Unlimited Ranking */}
          {filteredAthletes.length > visibleCount && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 25)}
                className="px-6 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.035] backdrop-blur-md hover:border-[#FF3845]/50 hover:bg-[#FF3845]/15 text-xs font-bold text-white transition-all shadow-[0_4px_16px_rgba(0,0,0,0.25)] inline-flex items-center gap-2"
              >
                <span>Papar 25 Lagi (Baki {filteredAthletes.length - visibleCount})</span>
                <ChevronRight size={14} className="text-[#FF3845]" />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Athlete Detail Modal */}
      <AthleteDetailModal
        athlete={selectedAthlete}
        onClose={() => setSelectedAthlete(null)}
      />
    </div>
  );
}
