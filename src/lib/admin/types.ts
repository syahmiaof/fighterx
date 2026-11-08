/**
 * FighterX Admin Portal - TypeScript Contracts & Data Models
 * Authoritative type definitions for central platform administration.
 */

// ============================================================================
// Core Enums & Primitive Unions
// ============================================================================

export type AdminAppRole = "ADMIN";

/** Strictly enforced single discipline for athletes */
export type AthleteDiscipline = "Silat Seni" | "Silat Olahraga";

/** Multi-discipline allowance for clubs and coaches */
export type MultiDiscipline = "Silat Seni" | "Silat Olahraga" | "Both";

export type OrganizationType = "CLUB" | "ACADEMY" | "ASSOCIATION" | "OTHER";

// ============================================================================
// Club Applications & Organizations (R3, R4)
// ============================================================================

export type ApplicationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "NEEDS_INFORMATION"
  | "APPROVED"
  | "REJECTED";

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface ClubApplication {
  id: string;
  clubName: string;
  clubType: OrganizationType;
  state: string;
  district: string;
  address: string;
  picFullName: string;
  picPosition: string;
  picPhoneNumber: string;
  picEmail: string;
  status: ApplicationStatus;
  auditNotes: string[];
  documents: ApplicationDocument[];
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  rejectionReason?: string;
  createdClubId?: string;
}

export type ClubStatus = "Active" | "Inactive" | "Suspended";

export interface AdminClub {
  id: string;
  name: string;
  registrationNumber: string;
  type: OrganizationType;
  state: string;
  district: string;
  address: string;
  discipline: MultiDiscipline;
  status: ClubStatus;
  memberCount: number;
  coachCount: number;
  seniAthletesCount: number;
  olahragaAthletesCount: number;
  subscriptionId: string;
  subscriptionStatus: SaaSClubSubscriptionStatus;
  contactPerson: string;
  email: string;
  phone: string;
  joinedAt: string;
  createdAt: string;
}

// ============================================================================
// SaaS Club Subscriptions (R4)
// Invariant: RM20/month pricing, 30-day free trial on approval
// ============================================================================

export type SaaSClubSubscriptionStatus =
  | "NOT_STARTED"
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "EXPIRED"
  | "CANCELED";

export interface SubscriptionPaymentRecord {
  id: string;
  invoiceNumber: string;
  amount: number; // Invariant: 20 (RM20)
  paidAt: string;
  paymentMethod: "FPX_ONLINE_BANKING" | "CARD" | "MANUAL_BANK_TRANSFER";
  status: "PAID" | "PENDING" | "FAILED";
  receiptUrl?: string;
}

export interface SaaSClubSubscription {
  id: string;
  clubId: string;
  clubName: string;
  status: SaaSClubSubscriptionStatus;
  trialStartDate: string;
  trialEndDate: string; // Exactly 30 days after trialStartDate
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  planPrice: 20; // Invariant: RM20 / club / month
  coveredClubCount: number;
  nextRenewalDate?: string;
  lastPaymentDate?: string;
  paymentHistory: SubscriptionPaymentRecord[];
}

// ============================================================================
// Master Training Programme 2027 & Exercise Library (R5)
// ============================================================================

export type ProgrammePhase = "Foundational (Jan-Jun)" | "Tactical (Jul-Dec)";

export type ProgrammeMode =
  | "Normal"
  | "Pre-Competition"
  | "Competition Week"
  | "Recovery";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MalayDayOfWeek =
  | "Isnin"
  | "Selasa"
  | "Rabu"
  | "Khamis"
  | "Jumaat"
  | "Sabtu"
  | "Ahad";

export interface WeeklyScheduleDay {
  dayOfWeek: DayOfWeek;
  malayDayName?: MalayDayOfWeek;
  mode: ProgrammeMode;
  isRestDay: boolean; // Enforce: at least 1-2 per 7 days
  sessionCount: number;
  intensity: "Low" | "Medium" | "High" | "Rest";
  targetDiscipline: MultiDiscipline;
  title?: string;
  timeSlot?: string;
  location?: string;
  exerciseIds?: string[];
}

export interface ProgrammeWeeklySchedule {
  id: string;
  programmeId: string;
  weekNumber: number;
  microcycleFocus: string;
  days: WeeklyScheduleDay[];
}

export interface MasterTrainingProgramme {
  id: string;
  year: 2027;
  name: string;
  description: string;
  frameworkVersion: "FighterX 2027";
  currentPhase: ProgrammePhase;
  activeMode: ProgrammeMode;
  discipline: "Silat Seni" | "Silat Olahraga" | "ALL";
  version: number;
  isPublished: boolean;
  totalWeeks: number;
  activeWeek: number;
  weeklySchedules: ProgrammeWeeklySchedule[];
  updatedAt: string;
}

export type ExerciseCategory =
  | "Cardio / Larian"
  | "Kekuatan / Strength"
  | "Teras / Core"
  | "Ketangkasan / Agility"
  | "Teknik Seni"
  | "Teknik Olahraga";

export interface VariableMetricsConfig {
  distance?: boolean;
  duration?: boolean;
  reps?: boolean;
  sets?: boolean;
  pace?: boolean;
  holdTime?: boolean;
}

export interface DefaultMetricValues {
  distanceMeters?: number;
  durationSeconds?: number;
  reps?: number;
  sets?: number;
  paceMinPerKm?: number;
  holdTimeSeconds?: number;
}

export interface EvidenceRequirements {
  videoRequired: boolean;
  minVideoDurationSec?: number;
  photoRequired: boolean;
  noteRequired: boolean;
  gpsRequired?: boolean;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  code: string;
  category: ExerciseCategory;
  discipline: "Silat Seni" | "Silat Olahraga" | "Shared";
  variableMetrics: VariableMetricsConfig;
  defaultMetrics?: DefaultMetricValues;
  evidenceRequirements: EvidenceRequirements;
  instructions: string;
  difficulty: "Asas" | "Pertengahan" | "Tinggi";
  isActive?: boolean;
}

export interface ProgrammeAssignment {
  id: string;
  programmeId: string;
  programmeName: string;
  clubId: string;
  clubName: string;
  discipline: "Silat Seni" | "Silat Olahraga" | "Both";
  coachId: string;
  coachName: string;
  targetCohort: "ALL" | "SENIOR" | "REMAJA" | "ELITE";
  startDate: string;
  endDate: string;
  status: "DRAFT" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
}

// ============================================================================
// Athlete & Coach Management (R6)
// Invariant: Athlete strictly single discipline ("Silat Seni" | "Silat Olahraga")
// Invariant: No CLUB_ADMIN role exists
// ============================================================================

export type AthleteStatus = "Active" | "Injured" | "Resting" | "Suspended";

export interface AthleteProfile {
  id: string;
  name: string;
  icNumber: string;
  discipline: AthleteDiscipline; // ENFORCED: Single discipline only
  clubId: string;
  clubName: string;
  assignedCoachId: string;
  assignedCoachName: string;
  category: string; // e.g. "Kelas C (55-60kg)" or "Tunggal Baku Putra"
  attendanceRate: number; // e.g. 76 (%)
  completionRate: number; // e.g. 82 (%)
  streakWeeks: number;
  consistencyTier: "KONSISTEN" | "SEDERHANA" | "PERLU_PERHATIAN";
  status: AthleteStatus;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  registeredAt: string;
}

export interface CoachProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  clubId: string;
  clubName: string;
  discipline: MultiDiscipline;
  certifications: string[]; // e.g. ["SPKK Tahap 1", "Lesen Kejurulatihan Kebangsaan"]
  assignedAthleteIds: string[];
  status: "Active" | "Inactive";
  avatarUrl?: string;
  registeredAt: string;
}

export interface CoachAthleteAssignment {
  id: string;
  coachId: string;
  athleteId: string;
  assignedAt: string;
  notes?: string;
}

// ============================================================================
// Assessments & Platform Analytics (R7)
// ============================================================================

export type RubricType =
  | "BASELINE_PHYSICAL"
  | "TECHNICAL_SENI"
  | "TECHNICAL_OLAHRAGA";

export interface RubricBenchmarkValues {
  cemerlang: number | string;
  baik: number | string;
  memuaskan: number | string;
  perluBimbingan: number | string;
}

export interface AssessmentCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  unit?: string;
  benchmarkValues?: RubricBenchmarkValues;
}

export interface AssessmentRubric {
  id: string;
  title: string;
  type: RubricType;
  description: string;
  criteria: AssessmentCriterion[];
}

export interface AssessmentRecord {
  id: string;
  athleteId: string;
  athleteName: string;
  clubName: string;
  discipline: AthleteDiscipline;
  rubricId: string;
  rubricTitle: string;
  date: string;
  score: number;
  ratingTier: "Cemerlang" | "Baik" | "Memuaskan" | "Perlu Bimbingan";
  coachNotes?: string;
}

export interface PlatformKPIStats {
  registeredClubsCount: number;
  pendingApplicationsCount: number;
  activeSubscriptionsCount: number;
  totalAthletesCount: number;
  activeCoachesCount: number;
  pendingVerificationsCount: number;
  verifiedSubmissionsCount: number; // e.g. 76 (%)
  upcomingCompetitionsCount: number;
  monthlyRevenueRm: number; // e.g. 140 (RM)
}

export interface MonthlyAttendanceRecord {
  monthLabel: string; // "M1", "M2", ..., "M6"
  attendanceRate: number; // percentage
  submissionsCount: number;
  verifiedCount: number;
}

// ============================================================================
// Competition Management (R7)
// Invariant: Medical clearance requires human sign-off; NO automated clearance
// ============================================================================

export type CompetitionClassification = "Major" | "Development" | "Exposure";
export type CompetitionStatus =
  | "Draft"
  | "Open"
  | "Active"
  | "Completed";

export interface AthleteReadinessReview {
  athleteId: string;
  athleteName: string;
  clubName: string;
  discipline: AthleteDiscipline;
  category: string;
  readinessScore: number; // 0-100
  weightStatus: "OK" | "Over" | "Under";
  medicalClearanceRequired: boolean;
  isCleared: boolean; // MUST be manually cleared by human if medicalClearanceRequired is true
  clearedBy?: string;
  clearedAt?: string;
  clearanceNotes?: string;
}

export interface CompetitionEvent {
  id: string;
  title: string;
  classification: CompetitionClassification;
  levelBadge?: "Kategori A" | "Kategori B" | "Kategori C";
  dates: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  participatingClubIds: string[];
  status: CompetitionStatus;
  readinessReview: AthleteReadinessReview[];
  rulesDocumentUrl?: string;
}

// ============================================================================
// Gamification, Knowledge Hub & Lekir Bot CMS (R8)
// Invariant: ZERO private API keys in client types or client state
// ============================================================================

export interface GamificationBadge {
  id: string;
  title: string;
  category: "Attendance" | "Streak" | "Technical" | "Competition";
  criteria: string;
  icon: string;
  xp: number;
  isSystemDefault: boolean;
  isActive: boolean;
}

export interface WeeklyTop10Entry {
  rank: number;
  athleteId: string;
  athleteName: string;
  clubName: string;
  discipline: AthleteDiscipline;
  xp: number;
  verifiedSubmissions: number;
  isDisqualified: boolean;
  disqualificationReason?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category:
    | "Peraturan Pertandingan"
    | "Sains Sukan & Pemakanan"
    | "Panduan Teknikal"
    | "Etika & Adab";
  governingSource: string; // e.g. "PESAKA Malaysia / PERSILAT"
  version: string; // e.g. "Peraturan 2027 v2.1"
  effectiveDate: string; // e.g. "1 Januari 2027"
  summary: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
  author: string;
  documentUrl?: string;
}

export interface LekirBotConfig {
  systemPrompt: string;
  safetyThresholds: {
    blockMedicalClearancePrescription: boolean;
    blockUnsafeTrainingLoads: boolean;
    blockUnauthorizedDataExposure: boolean;
  };
  allowedSources: string[];
  autoReviewEnabled: boolean;
  temperature: number;
  maxTokens: number;
  isBotActive: boolean;
  modelIdentifier: string; // e.g. "Lekir-V1-Core"
  lastUpdated: string;
  // NOTE: STRICTLY ZERO API KEYS in client contracts!
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: "LOW" | "NORMAL" | "URGENT";
  targetAudience: "ALL" | "COACHES" | "ATHLETES";
  targetClubId?: string;
  publishedAt: string;
  isPinned: boolean;
  isActive: boolean;
  authorName: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  role: "ADMIN";
  email: string;
  avatarUrl: string;
  permissions: string[];
  sessionTimeoutMinutes: number;
  maintenanceMode: boolean;
  lastLoginAt: string;
}

// ============================================================================
// Overall Admin Store State Model
// ============================================================================

export interface AdminState {
  stats: PlatformKPIStats; // Layout component alias
  kpiStats: PlatformKPIStats;
  applications: ClubApplication[];
  clubs: AdminClub[];
  subscriptions: SaaSClubSubscription[];
  programmes: MasterTrainingProgramme[];
  activeProgrammeId: string;
  exercises: ExerciseDefinition[];
  assignments: ProgrammeAssignment[];
  athletes: AthleteProfile[];
  coaches: CoachProfile[];
  rubrics: AssessmentRubric[];
  assessments: AssessmentRecord[];
  monthlyAttendance: MonthlyAttendanceRecord[];
  competitions: CompetitionEvent[];
  badges: GamificationBadge[];
  weeklyLeaderboard: WeeklyTop10Entry[];
  knowledgeArticles: KnowledgeArticle[];
  lekirBotConfig: LekirBotConfig;
  announcements: PlatformAnnouncement[];
  adminProfile: AdminProfile;
  isHydrated: boolean;
}
