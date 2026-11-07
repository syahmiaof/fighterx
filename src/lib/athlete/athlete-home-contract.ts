import type { Discipline } from "@/types/platform";

export type AthleteHomeTaskStatus =
  | "UPCOMING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "NEEDS_CORRECTION"
  | "MISSED"
  | "RECOVERY_DAY"
  | "REST_DAY"
  | "APPROVED_EXEMPTION";

export type AthleteWeekDay = {
  date: string;
  dayLabel: string;
  dateLabel: string;
  status: AthleteHomeTaskStatus;
  title?: string;
};

export type AthleteTrainingRequirement = {
  label: string;
  target: string;
};

export type AthleteEvidenceRequirement = {
  required: boolean;
  accepted: Array<"IMAGE" | "VIDEO" | "ACTIVITY_SCREENSHOT">;
  note?: string;
};

export type AthleteTodayTraining = {
  id: string;
  title: string;
  category: string;
  status: AthleteHomeTaskStatus;
  durationMinutes: number;
  dueLabel?: string;
  instructions: string;
  requirements: AthleteTrainingRequirement[];
  evidence: AthleteEvidenceRequirement;
};

export type AthleteSubmissionSummary = {
  id: string;
  title: string;
  submittedAt: string;
  status: Extract<AthleteHomeTaskStatus, "PENDING_VERIFICATION" | "VERIFIED" | "NEEDS_CORRECTION">;
  coachFeedback?: string;
};

export type AthleteAssessmentSnapshot = {
  title: string;
  assessedAt: string;
  result: string;
  coachNote?: string;
} | null;

export type AthleteCompetitionSummary = {
  name: string;
  date: string;
  venue?: string;
  discipline: Discipline;
  participationStatus?: string;
} | null;

export type AthleteAnnouncementSummary = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
}[];

export type AthleteHomeDashboardData = {
  mode: "DEMO";
  asOf: string;
  athlete: {
    displayName: string;
    initials: string;
    clubName: string;
    discipline: Discipline;
  };
  today: AthleteTodayTraining | null;
  week: {
    scheduledSessions: number;
    verified: number;
    pendingVerification: number;
    missed: number;
    recoveryDays: number;
    restDays: number;
    days: AthleteWeekDay[];
  };
  latestAssessment: AthleteAssessmentSnapshot;
  recentSubmissions: AthleteSubmissionSummary[];
  upcomingCompetition: AthleteCompetitionSummary;
  announcements: AthleteAnnouncementSummary;
};

export type AthleteHomeLoadResult =
  | { status: "demo"; data: AthleteHomeDashboardData }
  | { status: "empty"; message: string }
  | { status: "error"; message: string }
  | { status: "access-denied"; message: string }
  | { status: "inactive-membership"; message: string };

export interface AthleteHomeService {
  loadHome(): Promise<AthleteHomeLoadResult>;
}
