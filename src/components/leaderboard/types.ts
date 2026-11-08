/**
 * Types for FighterX Leaderboard & Gamification Module
 * Reference: checklistpublic.md §4, survey_design_specs.md, SCOPE.md
 */

export type DisciplineType = "ALL" | "TANDING" | "SENI";

export type AgeCategory = "ALL" | "PRA_REMAJA" | "REMAJA" | "DEWASA";

export type GenderType = "ALL" | "PUTRA" | "PUTRI";

export type MovementTrend = "UP" | "DOWN" | "SAME" | "NEW";

export type ClubTier = "EMAS" | "PERAK" | "GANGSA";

export type BadgeCategory = "ALL" | "DISIPLIN" | "KECERGASAN" | "PRESTASI" | "KEJOHANAN";

export type BadgeRarity = "LEGENDA" | "EMAS" | "PERAK" | "GANGSA";

export type VisibilityMode = "PUBLIC" | "CLUB_ONLY" | "ANONYMOUS";

export type AthleteRankTier = "PODIUM" | "PENDEKAR_UTAMA" | "JAGUH" | "PERINTIS";

export type RosterViewMode = "TOP10" | "ALL";

export interface PhysicalBaselineScore {
  run6MinMeters: number;    // e.g. 1540m
  runScore: number;         // e.g. 280 pts
  pushUps1Min: number;      // e.g. 58 reps
  pushUpScore: number;      // e.g. 220 pts
  plankSeconds: number;     // e.g. 210s
  plankScore: number;       // e.g. 250 pts
  totalBaselineScore: number; // e.g. 750 pts
}

export interface PointsBreakdown {
  attendanceSessions: number;     // e.g. 24 sessions
  attendancePoints: number;       // e.g. 480 pts (20 pts per session)
  physicalBaseline: PhysicalBaselineScore;
  videoDrillsCount: number;       // e.g. 18 verified drills
  videoDrillPoints: number;       // e.g. 540 pts (30 pts per drill)
  tournamentMedalPoints: number;  // e.g. 350 pts
  totalVerifiedPoints: number;    // Sum of all above
}

export interface ActivityAuditEntry {
  id: string;
  date: string;
  type: "KEHADIRAN" | "UJIAN_ASAS" | "VIDEO_DRILL" | "KEJOHANAN";
  title: string;
  points: number;
  verifiedBy: string;
  verificationHash: string;
  notes?: string;
}

export interface Athlete {
  id: string;
  rank: number;
  previousRank: number;
  trend: MovementTrend;
  trendValue: number; // e.g. +2, -1, 0, or 0 for NEW
  fullName: string;
  alias: string; // e.g. "Harimau Berantai"
  avatarUrl: string;
  age: number;
  ageGroup: "PRA_REMAJA" | "REMAJA" | "DEWASA";
  gender: "PUTRA" | "PUTRI";
  discipline: "TANDING" | "SENI";
  weightClassOrCategory: string; // e.g. "Kelas C (55-60kg)" or "Tunggal Baku Putra"
  clubId: string;
  clubName: string;
  clubLogo: string;
  association: string; // e.g. "PSSGM", "PSSLM", "PSSCM", "PSGFM", "PESAKA"
  state: string; // e.g. "Selangor", "Kuala Lumpur", "Johor", "Kedah"
  leadCoach: string;
  trainingCenter: string;
  points: PointsBreakdown;
  streakDays: number;
  attendanceRate: number; // e.g. 96 (%)
  badges: string[]; // Badge slugs
  radarStats: {
    stamina: number;      // 0 - 100
    strength: number;     // 0 - 100
    agility: number;      // 0 - 100
    flexibility: number;  // 0 - 100
    pasangStance: number; // 0 - 100
  };
  under18: boolean;
  parentalConsentVerified: boolean;
  visibilityMode: VisibilityMode;
  recentActivities: ActivityAuditEntry[];
  rankTier?: AthleteRankTier;
  pointsToNextRank?: number;
}

export interface ClubMedals {
  gold: number;
  silver: number;
  bronze: number;
}

export interface ClubRanking {
  id: string;
  rank: number;
  previousRank: number;
  trend: MovementTrend;
  trendValue: number;
  name: string;
  shortCode: string;
  logoUrl: string;
  association: string;
  state: string;
  tier: ClubTier;
  totalVerifiedPoints: number;
  activeAthletes: number;
  weeklyParticipationRate: number; // e.g. 94.5 (%)
  medals: ClubMedals;
  leadCoach: string;
  trainingCenter: string;
  establishedYear: number;
  highlightAthlete: string;
}

export interface BadgeItem {
  id: string;
  slug: string;
  title: string;
  category: "DISIPLIN" | "KECERGASAN" | "PRESTASI" | "KEJOHANAN";
  tier: BadgeRarity;
  pointsBonus: number;
  criteria: string;
  description: string;
  iconName: string;
  unlockedCount: number;
  howToEarn: string;
}

export interface VerificationRule {
  pillar: string;
  icon: string;
  description: string;
  safeguard: string;
  pointsValue: string;
}
