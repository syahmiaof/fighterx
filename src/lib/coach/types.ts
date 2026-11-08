/**
 * Pure TypeScript interface contracts for FighterX Coach Portal V1.
 * Strict isolation: Does not import from or depend on Track A (athlete portal).
 */

export type Discipline = "Silat Olahraga" | "Silat Seni";

export type ConsistencyTier = "KONSISTEN" | "SEDERHANA" | "PERLU_PERHATIAN";

export type AthleteStatus = "Active" | "Injured" | "Resting";

export type SubmissionStatus = "PENDING" | "VERIFIED" | "CORRECTION" | "REJECTED";

export type SubmissionCategory =
  | "Push-up"
  | "Larian 6 Minit"
  | "Plank"
  | "Knee to Wall"
  | "Teknik Seni"
  | "Teknik Olahraga";

export type AssessmentType = "BASELINE_PHYSICAL" | "TECHNICAL_SENI" | "TECHNICAL_OLAHRAGA";

export type AssessmentRating = "CEMERLANG" | "BAIK" | "MEMUASKAN" | "PERLU_BIMBINGAN";

export type CompetitionCategory = "Major" | "Development" | "Exposure";

export type CompetitionStatus = "Pendaftaran Dibuka" | "Persiapan" | "Selesai";

export type WeightStatus = "Ok" | "Over" | "Under";

export interface Coach {
  id: string;
  name: string;
  title: string;
  discipline: Discipline;
  avatarUrl: string;
  club: string;
  phone: string;
  email: string;
  certifications: string[];
  assignedAthleteCount: number;
  experienceYears?: number;
}

export interface Athlete {
  id: string;
  name: string;
  discipline: Discipline;
  category: string;
  weightClass: string;
  avatarUrl: string;
  consistencyTier: ConsistencyTier;
  attendanceRate: number; // percentage e.g. 92
  weeklyCompletionRate: number; // percentage e.g. 76
  status: AthleteStatus;
  currentStreakWeeks: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  readinessScore?: number; // 0 - 100
  phone?: string;
  joinDate?: string;
  age?: number;
}

export interface SubmissionMetric {
  label: string;
  prescribed: string;
  reported: string;
}

export interface TrainingSubmission {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar: string;
  discipline: Discipline;
  exerciseType: string;
  exerciseName: string;
  category: SubmissionCategory;
  submittedAt: string;
  videoThumbnailUrl: string;
  videoUrl: string;
  notes: string;
  status: SubmissionStatus;
  coachFeedback?: string;
  reviewedAt?: string;
  metrics?: SubmissionMetric[];
  videoDuration?: string;
}

export interface Assessment {
  id: string;
  athleteId: string;
  athleteName: string;
  date: string;
  type: AssessmentType;
  metrics: Record<string, number | string>;
  totalScore: number;
  rating: AssessmentRating;
  notes?: string;
  cycle?: "Baseline Q1" | "Mid-Cycle" | "Pra-Kejohanan" | string;
  deltaComparison?: Record<string, number | string>;
}

export interface CompetitionRosterItem {
  athleteId: string;
  readinessScore: number;
  weightStatus: WeightStatus;
  isSelected: boolean;
  athleteName?: string;
  category?: string;
  currentWeightKg?: number;
  targetMaxWeightKg?: number;
}

export interface Competition {
  id: string;
  title: string;
  category: CompetitionCategory;
  dates: string;
  location: string;
  status: CompetitionStatus;
  targetAthletes: string[];
  roster: CompetitionRosterItem[];
  sanctioningBody?: string;
  registrationDeadline?: string;
  bannerImageUrl?: string;
}

export interface ConsistencyBreakdown {
  konsistenCount: number;
  konsistenPercent: number;
  sederhanaCount: number;
  sederhanaPercent: number;
  perluPerhatianCount: number;
  perluPerhatianPercent: number;
}

export interface CoachKPIStats {
  totalAthletes: number;
  totalAthletesChange: number;
  pendingVerifications: number;
  verifiedThisWeekRate: number;
  verifiedThisWeekChange: number;
  upcomingCompetitionsCount: number;
  consistency?: ConsistencyBreakdown;
  weeklyExecutionRate?: number;
}

export interface CoachState {
  coach: Coach;
  athletes: Athlete[];
  submissions: TrainingSubmission[];
  assessments: Assessment[];
  competitions: Competition[];
  kpis: CoachKPIStats;
  isHydrated: boolean;
}

export interface CoachActions {
  reviewSubmission: (
    submissionId: string,
    status: "VERIFIED" | "CORRECTION" | "REJECTED",
    feedback?: string
  ) => void;
  registerAssessment: (assessmentData: Omit<Assessment, "id"> & { id?: string }) => void;
  updateCompetitionRoster: (competitionId: string, athleteId: string, selected: boolean) => void;
  resetDemoState: () => void;
}
