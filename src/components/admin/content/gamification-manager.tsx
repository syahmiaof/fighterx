"use client";

import React, { useState, useMemo } from "react";
import { useAdminState, useAdminActions } from "@/lib/admin/store";
import type { GamificationBadge, WeeklyTop10Entry, AthleteDiscipline } from "@/lib/admin/types";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminTable, type Column } from "@/components/admin/ui/admin-table";
import { BadgeModal } from "./badge-modal";
import { LeaderboardDisqualifyModal } from "./leaderboard-disqualify-modal";
import {
  Trophy,
  Award,
  ShieldCheck,
  Flame,
  Zap,
  Target,
  Swords,
  Crown,
  Heart,
  Star,
  Plus,
  Eye,
  EyeOff,
  UserX,
  Sparkles,
  Search,
  CheckCircle2,
  Filter,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Flame,
  Award,
  Trophy,
  Zap,
  Target,
  Swords,
  Crown,
  Heart,
  Star,
};

export function GamificationManager() {
  const { badges: storeBadges, weeklyLeaderboard } = useAdminState();
  const { disqualifyLeaderboardAthlete } = useAdminActions();

  // Local state for badges (initialized once from storeBadges)
  const [localBadges, setLocalBadges] = useState<GamificationBadge[]>(() => storeBadges || []);

  // Active View Tab: 'badges' | 'leaderboard'
  const [activeTab, setActiveTab] = useState<"badges" | "leaderboard">("badges");

  // Badge Filters
  const [badgeCategory, setBadgeCategory] = useState<string>("ALL");
  const [badgeSearch, setBadgeSearch] = useState<string>("");

  // Leaderboard Filters & Safeguards
  const [leaderboardDiscipline, setLeaderboardDiscipline] = useState<string>("ALL");
  const [anonymizeMinors, setAnonymizeMinors] = useState<boolean>(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState<string>("");

  // Modals
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [badgeToEdit, setBadgeToEdit] = useState<GamificationBadge | null>(null);
  const [disqualifyEntry, setDisqualifyEntry] = useState<WeeklyTop10Entry | null>(null);

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Badge CRUD Handlers
  const handleSaveBadge = (badge: GamificationBadge) => {
    setLocalBadges((prev) => {
      const exists = prev.some((b) => b.id === badge.id);
      if (exists) {
        return prev.map((b) => (b.id === badge.id ? badge : b));
      }
      return [badge, ...prev];
    });
    showToast(
      badgeToEdit
        ? `Lencana "${badge.title}" berjaya dikemaskini.`
        : `Lencana baharu "${badge.title}" berjaya dicipta.`
    );
  };

  const handleToggleBadgeActive = (badgeId: string) => {
    setLocalBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, isActive: !b.isActive } : b))
    );
  };

  // Leaderboard Disqualification Handler
  const handleDisqualify = (athleteId: string, reason: string) => {
    try {
      disqualifyLeaderboardAthlete(athleteId, reason);
      showToast("Penyertaan atlet berjaya dibatalkan dengan rekod audit.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message);
      }
    }
  };

  // Filtered Badges
  const filteredBadges = useMemo(() => {
    return localBadges.filter((b) => {
      if (badgeCategory !== "ALL" && b.category !== badgeCategory) return false;
      if (badgeSearch.trim()) {
        const q = badgeSearch.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.criteria.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [localBadges, badgeCategory, badgeSearch]);

  // Filtered Leaderboard (with discipline isolation)
  const filteredLeaderboard = useMemo(() => {
    return weeklyLeaderboard.filter((entry) => {
      if (
        leaderboardDiscipline !== "ALL" &&
        entry.discipline !== leaderboardDiscipline
      ) {
        return false;
      }
      if (leaderboardSearch.trim()) {
        const q = leaderboardSearch.toLowerCase();
        return (
          entry.athleteName.toLowerCase().includes(q) ||
          entry.clubName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [weeklyLeaderboard, leaderboardDiscipline, leaderboardSearch]);

  // Metrics
  const stats = useMemo(() => {
    const totalBadges = localBadges.length;
    const activeBadges = localBadges.filter((b) => b.isActive).length;
    const totalXP = localBadges.reduce((acc, b) => acc + (b.isActive ? b.xp : 0), 0);
    const disqualifiedCount = weeklyLeaderboard.filter((e) => e.isDisqualified).length;
    return { totalBadges, activeBadges, totalXP, disqualifiedCount };
  }, [localBadges, weeklyLeaderboard]);

  // Table Columns for Leaderboard
  const leaderboardColumns: Column<WeeklyTop10Entry>[] = [
    {
      key: "rank",
      header: "Kedudukan",
      className: "w-24 text-center",
      headerClassName: "text-center",
      cell: (entry) => {
        let badgeStyle = "bg-[#27272A] text-[#96989F]";
        if (entry.rank === 1) badgeStyle = "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40";
        if (entry.rank === 2) badgeStyle = "bg-[#E5E5E7]/20 text-white border border-[#E5E5E7]/40";
        if (entry.rank === 3) badgeStyle = "bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/40";

        return (
          <div className="flex items-center justify-center">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${badgeStyle}`}
            >
              #{entry.rank}
            </span>
          </div>
        );
      },
    },
    {
      key: "athlete",
      header: "Atlet & Kelab",
      cell: (entry) => {
        const displayName = anonymizeMinors
          ? `Pesilat Dirahsiakan (ID: ${entry.athleteId.slice(0, 7)})`
          : entry.athleteName;

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {displayName}
              </span>
              {entry.isDisqualified && (
                <AdminBadge variant="danger" size="sm">
                  Dibatalkan
                </AdminBadge>
              )}
            </div>
            <p className="text-xs text-[#96989F]">{entry.clubName}</p>
            {entry.isDisqualified && entry.disqualificationReason && (
              <p className="text-[11px] text-[#F87171] italic mt-1">
                Audit: {entry.disqualificationReason}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "discipline",
      header: "Disiplin",
      className: "w-36",
      cell: (entry) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            entry.discipline === "Silat Seni"
              ? "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30"
              : "bg-[#E10600]/15 text-[#FF555A] border border-[#FF3845]/30"
          }`}
        >
          {entry.discipline}
        </span>
      ),
    },
    {
      key: "verifiedSubmissions",
      header: "Penyerahan Disahkan",
      className: "w-40 text-center",
      headerClassName: "text-center",
      cell: (entry) => (
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#E5E5E7]">
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
          <span className="font-semibold">{entry.verifiedSubmissions} video</span>
        </div>
      ),
    },
    {
      key: "xp",
      header: "Jumlah XP",
      className: "w-36 text-right",
      headerClassName: "text-right",
      cell: (entry) => (
        <div className="text-right">
          <span className="font-black text-white text-base tracking-wide text-[#FBBF24]">
            {entry.xp.toLocaleString()} XP
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Tindakan Integriti",
      className: "w-32 text-right",
      headerClassName: "text-right",
      cell: (entry) => {
        if (entry.isDisqualified) {
          return (
            <span className="text-xs text-[#96989F] italic">Tidak Layak</span>
          );
        }
        return (
          <AdminButton
            variant="danger"
            size="xs"
            onClick={() => setDisqualifyEntry(entry)}
            leftIcon={<UserX className="w-3.5 h-3.5" />}
          >
            Batalkan
          </AdminButton>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/40 rounded-xl text-xs text-[#4ADE80] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#96989F] hover:text-white text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Jumlah Lencana</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {stats.totalBadges}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#E10600]/15 flex items-center justify-center text-[#FF555A]">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#4ADE80] flex items-center gap-1">
            <span>{stats.activeBadges} lencana aktif</span>
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Potensi Mata XP</p>
              <h3 className="text-2xl font-black text-[#FBBF24] mt-1">
                {stats.totalXP.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center text-[#FBBF24]">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            Ganjaran aktiviti atlet
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Papan Pendahulu</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {weeklyLeaderboard.length} Atlet
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8]">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            Kedudukan Mingguan Top 10
          </div>
        </AdminCard>

        <AdminCard glow="subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#96989F] font-medium">Tindakan Integriti</p>
              <h3 className="text-2xl font-black text-[#F87171] mt-1">
                {stats.disqualifiedCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/15 flex items-center justify-center text-[#F87171]">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#96989F]">
            Penyertaan dibatalkan (audit)
          </div>
        </AdminCard>
      </div>

      {/* Main Tab Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "badges"
                ? "bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]"
                : "bg-[#17191E] text-[#96989F] hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Katalog & Kriteria Lencana ({localBadges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "leaderboard"
                ? "bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]"
                : "bg-[#17191E] text-[#96989F] hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Papan Pendahulu Mingguan Top 10</span>
          </button>
        </div>

        {activeTab === "badges" && (
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => {
              setBadgeToEdit(null);
              setIsBadgeModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Cipta Lencana Baharu
          </AdminButton>
        )}
      </div>

      {/* VIEW 1: BADGES MANAGEMENT */}
      {activeTab === "badges" && (
        <div className="space-y-4">
          {/* Badge Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96989F]" />
              <input
                type="text"
                placeholder="Cari lencana mengikut nama, kriteria atau kategori..."
                value={badgeSearch}
                onChange={(e) => setBadgeSearch(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 bg-[#202126] border border-[#27272A] rounded-lg text-sm text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto admin-scrollbar pb-1 md:pb-0">
              <span className="text-xs text-[#96989F] whitespace-nowrap">Kategori:</span>
              {["ALL", "Attendance", "Streak", "Technical", "Competition"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBadgeCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    badgeCategory === cat
                      ? "bg-[#E10600] text-white"
                      : "bg-[#202126] text-[#96989F] hover:text-white"
                  }`}
                >
                  {cat === "ALL" ? "Semua" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => {
              const IconComp = ICON_MAP[badge.icon] || Award;

              return (
                <AdminCard
                  key={badge.id}
                  variant="interactive"
                  glow={badge.isActive ? "none" : "none"}
                  className={`relative flex flex-col justify-between ${
                    !badge.isActive ? "opacity-60 bg-[#121316]" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E10600]/30 to-[#990000]/20 border border-[#FF3845]/40 flex items-center justify-center text-[#FF555A] shadow-[0_0_15px_rgba(225,6,0,0.2)]">
                        <IconComp className="w-6 h-6" />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30">
                          +{badge.xp} XP
                        </span>
                        {badge.isSystemDefault && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#27272A] text-[#C5C6CA]">
                            System Default
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-1">
                      <h4 className="text-base font-bold text-white leading-snug">
                        {badge.title}
                      </h4>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#202126] text-[#38BDF8]">
                        {badge.category}
                      </span>
                      <p className="text-xs text-[#96989F] mt-2 leading-relaxed">
                        {badge.criteria}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[#27272A] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleBadgeActive(badge.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-[#96989F] hover:text-white"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          badge.isActive ? "bg-[#4ADE80]" : "bg-[#EF4444]"
                        }`}
                      />
                      <span>{badge.isActive ? "Aktif" : "Dinyahaktif"}</span>
                    </button>

                    <AdminButton
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setBadgeToEdit(badge);
                        setIsBadgeModalOpen(true);
                      }}
                    >
                      Sunting
                    </AdminButton>
                  </div>
                </AdminCard>
              );
            })}
          </div>

          {filteredBadges.length === 0 && (
            <div className="p-12 text-center bg-[#17191E] border border-[#27272A] rounded-xl space-y-2">
              <Award className="w-10 h-10 text-[#96989F] mx-auto" />
              <h4 className="text-sm font-bold text-white">Tiada Lencana Ditemui</h4>
              <p className="text-xs text-[#96989F]">
                Cuba ubah kata kunci carian atau tetapkan semula penapis kategori.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: WEEKLY TOP 10 LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          {/* Safeguard & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-[#17191E] border border-[#27272A] rounded-xl">
            {/* Discipline Isolation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto admin-scrollbar pb-1 lg:pb-0">
              <span className="text-xs text-[#96989F] mr-1.5 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Disiplin:
              </span>
              {(["ALL", "Silat Seni", "Silat Olahraga"] as (string | AthleteDiscipline)[]).map(
                (disc) => (
                  <button
                    key={disc}
                    onClick={() => setLeaderboardDiscipline(disc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      leaderboardDiscipline === disc
                        ? "bg-[#E10600] text-white shadow-[0_0_10px_rgba(225,6,0,0.3)]"
                        : "bg-[#202126] text-[#96989F] hover:text-white"
                    }`}
                  >
                    {disc === "ALL" ? "Semua Disiplin" : disc}
                  </button>
                )
              )}
            </div>

            {/* Privacy Anonymization Toggle & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#202126] border border-[#27272A] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={anonymizeMinors}
                  onChange={(e) => setAnonymizeMinors(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E10600] bg-[#17191E] border-[#37383D]"
                />
                <div className="flex items-center gap-1.5 text-xs">
                  {anonymizeMinors ? (
                    <EyeOff className="w-3.5 h-3.5 text-[#FBBF24]" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-[#96989F]" />
                  )}
                  <span className="text-[#C5C6CA] font-medium">
                    Rahsiakan Nama Atlet Bawah Umur (Privasi)
                  </span>
                </div>
              </label>

              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#96989F]" />
                <input
                  type="text"
                  placeholder="Cari atlet..."
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#202126] border border-[#27272A] rounded-lg text-xs text-white placeholder-[#96989F] focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Anti-Cheat Notice */}
          <div className="p-3 bg-[#17191E] border-l-4 border-[#38BDF8] rounded-r-xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <p className="text-xs text-[#C5C6CA] leading-relaxed">
              <strong className="text-white">Kawalan Keadilan & Pengasingan Disiplin:</strong> Papan pendahulu ini mengasingkan markah secara bebas bagi memastikan persaingan adil antara atlet Silat Seni (pemarkahan jurus & ketepatan) dan Silat Olahraga (kemenangan mata tempur & kehadiran). Tindakan pembatalan kelayakan direkodkan ke dalam jurnal audit integriti.
            </p>
          </div>

          {/* Table */}
          <AdminTable
            columns={leaderboardColumns}
            data={filteredLeaderboard}
            keyExtractor={(item) => item.athleteId}
            emptyTitle="Tiada Atlet Papan Pendahulu"
            emptyDescription="Tiada rekod sepadan dengan penapis disiplin atau carian yang dipilih."
          />
        </div>
      )}

      {/* Badge Modal */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => {
          setIsBadgeModalOpen(false);
          setBadgeToEdit(null);
        }}
        onSave={handleSaveBadge}
        badgeToEdit={badgeToEdit}
      />

      {/* Disqualify Modal */}
      <LeaderboardDisqualifyModal
        isOpen={!!disqualifyEntry}
        onClose={() => setDisqualifyEntry(null)}
        athleteEntry={disqualifyEntry}
        onConfirm={handleDisqualify}
      />
    </div>
  );
}
